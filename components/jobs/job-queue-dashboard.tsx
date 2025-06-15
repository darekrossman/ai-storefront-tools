'use client'

import { useState, useEffect } from 'react'
import { styled } from 'styled-system/jsx'
import { Button } from '@/components/ui/button'
import type { Job, JobStatus, JobType } from '@/lib/supabase/database-types'

export function JobQueueDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        user_id: 'user_123',
        job_type: 'product_generation',
        status: 'completed',
        priority: 5,
        progress_percent: 100,
        progress_message: 'Generated 24 products successfully',
        input_data: {
          catalogId: 'cat_123',
          categoryIds: ['subcat_1', 'subcat_2'],
          count: 12,
        },
        output_data: { products_generated: 24 },
        error_data: null,
        catalog_id: 'cat_123',
        estimated_duration_seconds: 120,
        actual_duration_seconds: 95,
        created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        started_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        user_id: 'user_123',
        job_type: 'image_generation',
        status: 'processing',
        priority: 3,
        progress_percent: 65,
        progress_message: 'Generating product images (13/20)',
        input_data: { productIds: ['prod_1', 'prod_2'], imageType: 'main' },
        output_data: null,
        error_data: null,
        catalog_id: null,
        estimated_duration_seconds: 600,
        actual_duration_seconds: null,
        created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        started_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        completed_at: null,
        updated_at: new Date(Date.now() - 30 * 1000).toISOString(),
      },
      {
        id: '3',
        user_id: 'user_123',
        job_type: 'catalog_export',
        status: 'pending',
        priority: 7,
        progress_percent: 0,
        progress_message: null,
        input_data: { catalogId: 'cat_123', format: 'shopify_csv' },
        output_data: null,
        error_data: null,
        catalog_id: 'cat_123',
        estimated_duration_seconds: 60,
        actual_duration_seconds: null,
        created_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        started_at: null,
        completed_at: null,
        updated_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        user_id: 'user_123',
        job_type: 'product_generation',
        status: 'failed',
        priority: 5,
        progress_percent: 30,
        progress_message: 'Failed to generate products',
        input_data: { catalogId: 'cat_456', categoryIds: ['subcat_3'], count: 10 },
        output_data: null,
        error_data: { message: 'API rate limit exceeded' },
        catalog_id: 'cat_456',
        estimated_duration_seconds: 100,
        actual_duration_seconds: null,
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        started_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 13 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 13 * 60 * 1000).toISOString(),
      },
    ]

    setJobs(mockJobs)
    setLoading(false)
  }, [])

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
      <styled.div
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={4}
        mb={8}
      >
        {[
          { label: 'Total Jobs', value: jobs.length, color: 'blue.500' },
          {
            label: 'Completed',
            value: jobs.filter((j) => j.status === 'completed').length,
            color: 'green.500',
          },
          {
            label: 'Processing',
            value: jobs.filter((j) => j.status === 'processing').length,
            color: 'blue.500',
          },
          {
            label: 'Failed',
            value: jobs.filter((j) => j.status === 'failed').length,
            color: 'red.500',
          },
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
            Recent Jobs
          </styled.h2>
        </styled.div>

        <styled.div>
          {jobs.map((job) => (
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
                        onClick={() => console.log('Cancel job', job.id)}
                      >
                        Cancel Job
                      </Button>
                    )}
                    {job.status === 'failed' && (
                      <Button
                        variant="primary"
                        onClick={() => console.log('Retry job', job.id)}
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
      </styled.div>

      {/* Action Buttons */}
      <styled.div display="flex" gap={3} mt={6}>
        <Button
          variant="primary"
          onClick={() => console.log('Create product generation job')}
        >
          Generate Products
        </Button>
        <Button
          variant="secondary"
          onClick={() => console.log('Create image generation job')}
        >
          Generate Images
        </Button>
        <Button variant="secondary" onClick={() => console.log('Create export job')}>
          Export Catalog
        </Button>
      </styled.div>
    </styled.div>
  )
}
