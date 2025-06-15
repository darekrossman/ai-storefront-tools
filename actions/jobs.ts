'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  Job,
  JobStatus,
  JobQueueStats,
  JobWithProgress,
  CreateJobRequest,
  DatabaseResponse,
} from '@/lib/supabase/database-types'

/**
 * Get all jobs for the current user
 */
export async function getJobsAction(): Promise<DatabaseResponse<Job[]>> {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Fetch jobs ordered by created_at (newest first)
    const { data: jobs, error } = await supabase
      .from('job_queue')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50) // Limit to most recent 50 jobs

    if (error) {
      console.error('Error fetching jobs:', error)
      return { success: false, error: 'Failed to fetch jobs' }
    }

    return { success: true, data: jobs || [] }
  } catch (error) {
    console.error('Unexpected error in getJobsAction:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Get job queue statistics for the current user
 */
export async function getJobStatsAction(): Promise<DatabaseResponse<JobQueueStats>> {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get job counts by status
    const { data: jobs, error } = await supabase
      .from('job_queue')
      .select('status')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching job stats:', error)
      return { success: false, error: 'Failed to fetch job statistics' }
    }

    // Calculate statistics
    const stats: JobQueueStats = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      total: jobs?.length || 0,
    }

    jobs?.forEach((job) => {
      if (job.status in stats) {
        stats[job.status as keyof Omit<JobQueueStats, 'total'>]++
      }
    })

    return { success: true, data: stats }
  } catch (error) {
    console.error('Unexpected error in getJobStatsAction:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Cancel a job
 */
export async function cancelJobAction(jobId: string): Promise<DatabaseResponse<Job>> {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Update job status to cancelled
    const { data: job, error } = await supabase
      .from('job_queue')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .eq('user_id', user.id) // Ensure user owns this job
      .select()
      .single()

    if (error) {
      console.error('Error cancelling job:', error)
      return { success: false, error: 'Failed to cancel job' }
    }

    // Revalidate the jobs page
    revalidatePath('/dashboard/jobs')

    return { success: true, data: job }
  } catch (error) {
    console.error('Unexpected error in cancelJobAction:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Retry a failed job
 */
export async function retryJobAction(jobId: string): Promise<DatabaseResponse<Job>> {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Reset job to pending status
    const { data: job, error } = await supabase
      .from('job_queue')
      .update({
        status: 'pending',
        progress_percent: 0,
        progress_message: null,
        error_data: null,
        started_at: null,
        completed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .eq('user_id', user.id) // Ensure user owns this job
      .select()
      .single()

    if (error) {
      console.error('Error retrying job:', error)
      return { success: false, error: 'Failed to retry job' }
    }

    // Revalidate the jobs page
    revalidatePath('/dashboard/jobs')

    return { success: true, data: job }
  } catch (error) {
    console.error('Unexpected error in retryJobAction:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Create a new job
 */
export async function createJobAction(
  jobRequest: CreateJobRequest,
): Promise<DatabaseResponse<Job>> {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Create the job
    const { data: job, error } = await supabase
      .from('job_queue')
      .insert({
        user_id: user.id,
        job_type: jobRequest.job_type,
        status: 'pending',
        priority: jobRequest.priority || 5,
        input_data: jobRequest.input_data as any, // Cast to Json type
        catalog_id: jobRequest.catalog_id,
        estimated_duration_seconds: jobRequest.estimated_duration_seconds,
        progress_percent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating job:', error)
      return { success: false, error: 'Failed to create job' }
    }

    // Revalidate the jobs page
    revalidatePath('/dashboard/jobs')

    return { success: true, data: job }
  } catch (error) {
    console.error('Unexpected error in createJobAction:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Delete completed/failed jobs (bulk cleanup)
 */
export async function cleanupJobsAction(): Promise<
  DatabaseResponse<{ deleted: number }>
> {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Delete completed and failed jobs older than 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data, error } = await supabase
      .from('job_queue')
      .delete()
      .eq('user_id', user.id)
      .in('status', ['completed', 'failed', 'cancelled'])
      .lt('completed_at', sevenDaysAgo.toISOString())
      .select('id')

    if (error) {
      console.error('Error cleaning up jobs:', error)
      return { success: false, error: 'Failed to cleanup jobs' }
    }

    // Revalidate the jobs page
    revalidatePath('/dashboard/jobs')

    return { success: true, data: { deleted: data?.length || 0 } }
  } catch (error) {
    console.error('Unexpected error in cleanupJobsAction:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}
