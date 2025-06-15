import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Job, JobUpdate, JobProgress } from '@/lib/supabase/database-types'

// Get job details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('job_queue')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', user.id)
      .single()

    if (jobError) {
      if (jobError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 })
    }

    // Get job progress
    const { data: progress, error: progressError } = await supabase
      .from('job_progress')
      .select('*')
      .eq('job_id', jobId)
      .order('step_order', { ascending: true })

    if (progressError) {
      console.error('Progress fetch error:', progressError)
      // Still return job even if progress fetch fails
    }

    return NextResponse.json({
      job,
      progress: progress || [],
    })
  } catch (error) {
    console.error('Job fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update job status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, output_data, error_data, progress_percent, progress_message } = body

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update job
    const updateData: JobUpdate = { updated_at: new Date().toISOString() }
    if (status) updateData.status = status
    if (output_data) updateData.output_data = output_data as any
    if (error_data) updateData.error_data = error_data as any
    if (progress_percent !== undefined) updateData.progress_percent = progress_percent
    if (progress_message) updateData.progress_message = progress_message

    // Set completion timestamp if job is completed
    if (status === 'completed' || status === 'failed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('job_queue')
      .update(updateData)
      .eq('id', jobId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Job update error:', error)
      return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
    }

    return NextResponse.json({ job: data })
  } catch (error) {
    console.error('Job update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Cancel job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Cancel job
    const { data, error } = await supabase
      .from('job_queue')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Job cancellation error:', error)
      return NextResponse.json({ error: 'Failed to cancel job' }, { status: 500 })
    }

    return NextResponse.json({ job: data })
  } catch (error) {
    console.error('Job cancellation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
