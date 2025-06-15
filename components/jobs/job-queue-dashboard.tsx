'use client'

import { useState, useEffect, useTransition } from 'react'
import { styled } from 'styled-system/jsx'
import { Button } from '@/components/ui/button'
import {
  getJobsAction,
  getJobStatsAction,
  cancelJobAction,
  retryJobAction,
  cleanupJobsAction,
} from '@/actions/jobs'
import type {
  Job,
  JobStatus,
  JobType,
  JobQueueStats,
} from '@/lib/supabase/database-types'
import { createBrowserClient } from '@supabase/ssr'

export function JobQueueDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [stats, setStats] = useState<JobQueueStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [filter, setFilter] = useState<JobStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isPending, startTransition] = useTransition()

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  // Set up real-time subscription
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const channel = supabase
      .channel('job_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_queue',
        },
        (payload: any) => {
          console.log('Job update received:', payload)
          // Reload data when changes occur
          loadData()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadData = async () => {
    try {
      const [jobsResult, statsResult] = await Promise.all([
        getJobsAction(),
        getJobStatsAction(),
      ])

      if (jobsResult.success && jobsResult.data) {
        setJobs(jobsResult.data)
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data)
      }
    } catch (error) {
      console.error('Error loading job data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelJob = async (jobId: string) => {
    startTransition(async () => {
      const result = await cancelJobAction(jobId)
      if (result.success) {
        await loadData() // Reload data
      } else {
        console.error('Failed to cancel job:', result.error)
      }
    })
  }

  const handleRetryJob = async (jobId: string) => {
    startTransition(async () => {
      const result = await retryJobAction(jobId)
      if (result.success) {
        await loadData() // Reload data
      } else {
        console.error('Failed to retry job:', result.error)
      }
    })
  }

  const handleCleanupJobs = async () => {
    startTransition(async () => {
      const result = await cleanupJobsAction()
      if (result.success) {
        await loadData() // Reload data
        console.log(`Cleaned up ${result.data?.deleted || 0} jobs`)
      } else {
        console.error('Failed to cleanup jobs:', result.error)
      }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green.500'
      case 'processing':
        return 'blue.500'
      case 'pending':
        return 'yellow.500'
      case 'failed':
        return 'red.500'
      case 'cancelled':
        return 'gray.500'
      default:
        return 'gray.400'
    }
  }

  const getJobTypeLabel = (jobType: string) => {
    switch (jobType) {
      case 'product_generation':
        return 'Product Generation'
      case 'image_generation':
        return 'Image Generation'
      case 'catalog_export':
        return 'Catalog Export'
      case 'batch_processing':
        return 'Batch Processing'
      default:
        return jobType
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  // Filter and search jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesFilter = filter === 'all' || job.status === filter
    const matchesSearch =
      searchTerm === '' ||
      getJobTypeLabel(job.job_type).toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.progress_message?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <styled.div p={6} textAlign="center">
        <styled.div>Loading jobs...</styled.div>
      </styled.div>
    )
  }

  return (
    <styled.div maxW="6xl" mx="auto" p={6}>
      <styled.div mb={8}>
        <styled.h1 fontSize="2xl" fontWeight="bold" mb={2}>
          Job Queue Dashboard
        </styled.h1>
        <styled.p color="gray.600">
          Monitor and manage background processing jobs
        </styled.p>
      </styled.div>

      {/* Job Statistics */}
      {stats && (
        <styled.div
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gap={4}
          mb={8}
        >
          {[
            { label: 'Total Jobs', value: stats.total, color: 'blue.500' },
            { label: 'Completed', value: stats.completed, color: 'green.500' },
            { label: 'Processing', value: stats.processing, color: 'blue.500' },
            { label: 'Failed', value: stats.failed, color: 'red.500' },
          ].map((stat) => (
            <styled.div
              key={stat.label}
              bg="white"
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <styled.div fontSize="2xl" fontWeight="bold" color={stat.color}>
                {stat.value}
              </styled.div>
              <styled.div fontSize="sm" color="gray.600">
                {stat.label}
              </styled.div>
            </styled.div>
          ))}
        </styled.div>
      )}

      {/* Filters and Search */}
      <styled.div display="flex" gap={4} mb={6} flexWrap="wrap" alignItems="center">
        <styled.input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          px={3}
          py={2}
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          fontSize="sm"
          width="250px"
        />

        <styled.select
          value={filter}
          onChange={(e) => setFilter(e.target.value as JobStatus | 'all')}
          px={3}
          py={2}
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          fontSize="sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </styled.select>

        <Button variant="secondary" onClick={handleCleanupJobs} disabled={isPending}>
          Cleanup Old Jobs
        </Button>
      </styled.div>

      {/* Jobs List */}
      <styled.div
        bg="white"
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
        overflow="hidden"
      >
        <styled.div p={4} borderBottom="1px solid" borderColor="gray.200">
          <styled.h2 fontSize="lg" fontWeight="semibold">
            Jobs ({filteredJobs.length})
          </styled.h2>
        </styled.div>

        {filteredJobs.length === 0 ? (
          <styled.div p={8} textAlign="center" color="gray.500">
            No jobs found matching your criteria.
          </styled.div>
        ) : (
          <styled.div>
            {filteredJobs.map((job) => (
              <styled.div
                key={job.id}
                p={4}
                borderBottom="1px solid"
                borderColor="gray.100"
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
                onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
              >
                <styled.div
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <styled.div display="flex" alignItems="center" gap={3}>
                    <styled.div
                      w="3"
                      h="3"
                      borderRadius="full"
                      bg={getStatusColor(job.status)}
                    />
                    <styled.div>
                      <styled.div fontWeight="medium">
                        {getJobTypeLabel(job.job_type)}
                      </styled.div>
                      <styled.div fontSize="sm" color="gray.500">
                        {formatTimeAgo(job.created_at)}
                      </styled.div>
                    </styled.div>
                  </styled.div>

                  <styled.div display="flex" alignItems="center" gap={3}>
                    <styled.div fontSize="sm" color="gray.600">
                      {job.progress_percent || 0}%
                    </styled.div>
                    <styled.div
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="medium"
                      bg={`${getStatusColor(job.status)}`}
                      color="white"
                      textTransform="capitalize"
                    >
                      {job.status}
                    </styled.div>
                  </styled.div>
                </styled.div>

                {/* Progress Bar */}
                <styled.div bg="gray.200" h="2" borderRadius="full" mb={2}>
                  <styled.div
                    bg={getStatusColor(job.status)}
                    h="full"
                    borderRadius="full"
                    transition="width 0.3s ease"
                    w={`${job.progress_percent || 0}%`}
                  />
                </styled.div>

                {job.progress_message && (
                  <styled.div fontSize="sm" color="gray.600">
                    {job.progress_message}
                  </styled.div>
                )}

                {/* Expanded Details */}
                {selectedJob?.id === job.id && (
                  <styled.div mt={4} p={4} bg="gray.50" borderRadius="md">
                    <styled.div
                      display="grid"
                      gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                      gap={4}
                    >
                      <styled.div>
                        <styled.div fontSize="sm" fontWeight="medium" mb={1}>
                          Input Data
                        </styled.div>
                        <styled.pre fontSize="xs" color="gray.600" overflow="auto">
                          {JSON.stringify(job.input_data, null, 2)}
                        </styled.pre>
                      </styled.div>

                      {job.output_data && (
                        <styled.div>
                          <styled.div fontSize="sm" fontWeight="medium" mb={1}>
                            Output Data
                          </styled.div>
                          <styled.pre fontSize="xs" color="gray.600" overflow="auto">
                            {JSON.stringify(job.output_data, null, 2)}
                          </styled.pre>
                        </styled.div>
                      )}

                      {job.error_data && (
                        <styled.div>
                          <styled.div
                            fontSize="sm"
                            fontWeight="medium"
                            mb={1}
                            color="red.600"
                          >
                            Error Data
                          </styled.div>
                          <styled.pre fontSize="xs" color="red.600" overflow="auto">
                            {JSON.stringify(job.error_data, null, 2)}
                          </styled.pre>
                        </styled.div>
                      )}
                    </styled.div>

                    <styled.div display="flex" gap={2} mt={4}>
                      {job.status === 'processing' && (
                        <Button
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCancelJob(job.id)
                          }}
                          disabled={isPending}
                        >
                          Cancel Job
                        </Button>
                      )}
                      {job.status === 'failed' && (
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRetryJob(job.id)
                          }}
                          disabled={isPending}
                        >
                          Retry Job
                        </Button>
                      )}
                    </styled.div>
                  </styled.div>
                )}
              </styled.div>
            ))}
          </styled.div>
        )}
      </styled.div>
    </styled.div>
  )
}
