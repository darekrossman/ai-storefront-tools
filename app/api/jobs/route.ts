import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { JobInsert, Job, CreateJobRequest } from '@/lib/supabase/database-types'

// Create a new job
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateJobRequest = await request.json()
    const {
      job_type,
      input_data,
      priority = 5,
      catalog_id,
      estimated_duration_seconds,
    } = body

    // Validate required fields
    if (!job_type || !input_data) {
      return NextResponse.json(
        { error: 'job_type and input_data are required' },
        { status: 400 },
      )
    }

    // Create job insert data
    const jobData: JobInsert = {
      user_id: user.id,
      job_type,
      input_data: input_data as any,
      priority,
      catalog_id,
      estimated_duration_seconds,
    }

    // Insert job into queue
    const { data, error } = await supabase
      .from('job_queue')
      .insert(jobData)
      .select('id')
      .single()

    if (error) {
      console.error('Job creation error:', error)
      return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
    }

    return NextResponse.json({ job_id: data.id })
  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get user's jobs
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    let query = supabase
      .from('job_queue')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Jobs fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
    }

    return NextResponse.json({ jobs: data || [] })
  } catch (error) {
    console.error('Jobs fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
