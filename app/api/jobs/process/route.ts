import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Job, JobResult } from '@/lib/supabase/database-types'

// Job processor worker endpoint
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get next job from priority queue using the stored function
    const { data: jobs, error: queueError } = await supabase.rpc('get_next_job')

    if (queueError) {
      console.error('Queue error:', queueError)
      return NextResponse.json({ error: 'Failed to get next job' }, { status: 500 })
    }

    // If no jobs available, return
    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ message: 'No jobs available' })
    }

    const jobData = jobs[0]
    const job: Partial<Job> = {
      id: jobData.job_id,
      job_type: jobData.job_type,
      input_data: jobData.input_data,
      user_id: jobData.user_id,
      catalog_id: jobData.catalog_id,
    }

    try {
      // Process the job based on its type
      let result = null
      let error = null

      switch (job.job_type) {
        case 'product_generation':
          result = await processProductGeneration(job)
          break
        case 'image_generation':
          result = await processImageGeneration(job)
          break
        case 'catalog_export':
          result = await processCatalogExport(job)
          break
        case 'batch_processing':
          result = await processBatchOperations(job)
          break
        default:
          error = { message: `Unknown job type: ${job.job_type}` }
      }

      // Update job status based on result
      if (error) {
        await completeJob(supabase, job.id!, 'failed', null, error)
      } else {
        await completeJob(supabase, job.id!, 'completed', result, null)
      }

      return NextResponse.json({
        message: 'Job processed successfully',
        job_id: job.id,
        job_type: job.job_type,
        status: error ? 'failed' : 'completed',
        result,
        error,
      })
    } catch (processingError) {
      console.error('Job processing error:', processingError)

      // Mark job as failed
      await completeJob(supabase, job.id!, 'failed', null, {
        message:
          processingError instanceof Error ? processingError.message : 'Unknown error',
        stack: processingError instanceof Error ? processingError.stack : undefined,
      })

      return NextResponse.json({
        message: 'Job processing failed',
        job_id: job.id,
        error:
          processingError instanceof Error ? processingError.message : 'Unknown error',
      })
    }
  } catch (error) {
    console.error('Worker error:', error)
    return NextResponse.json({ error: 'Worker error' }, { status: 500 })
  }
}

// Process product generation job
async function processProductGeneration(job: Partial<Job>) {
  const { catalogId, categoryIds, count } = job.input_data as any

  // Call the existing product generation API
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/agents/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ catalogId, categoryIds, count }),
  })

  if (!response.ok) {
    throw new Error(`Product generation failed: ${response.statusText}`)
  }

  // For streaming responses, we need to handle the stream
  const reader = response.body?.getReader()
  let result = ''

  if (reader) {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      result += new TextDecoder().decode(value)
    }
  }

  return {
    type: 'product_generation',
    products_generated: count * categoryIds.length,
    catalog_id: catalogId,
    data: result,
  }
}

// Process image generation job
async function processImageGeneration(job: Partial<Job>) {
  const { productIds, imageType } = job.input_data as any
  const results = []

  // Generate images for each product
  for (const productId of productIds) {
    try {
      // Get product data first (would need actual product fetch)
      const imageResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/agents/images`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: { productId, imageType },
            image_url: null,
          }),
        },
      )

      if (imageResponse.ok) {
        const imageResult = await imageResponse.json()
        results.push({ productId, success: true, data: imageResult })
      } else {
        results.push({ productId, success: false, error: imageResponse.statusText })
      }
    } catch (error) {
      results.push({
        productId,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return {
    type: 'image_generation',
    images_processed: productIds.length,
    results,
  }
}

// Process catalog export job
async function processCatalogExport(job: Partial<Job>) {
  const { catalogId, format, includeImages } = job.input_data as any

  // Call the existing export API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/catalogs/${catalogId}/export-shopify-csv`,
  )

  if (!response.ok) {
    throw new Error(`Export failed: ${response.statusText}`)
  }

  const csvContent = await response.text()

  return {
    type: 'catalog_export',
    catalog_id: catalogId,
    format,
    size: csvContent.length,
    export_url: `/api/catalogs/${catalogId}/export-shopify-csv`, // Client can re-fetch if needed
  }
}

// Process batch operations
async function processBatchOperations(job: Partial<Job>) {
  const { operations } = job.input_data as any
  const results = []

  for (const operation of operations) {
    try {
      let result = null

      switch (operation.type) {
        case 'product_generation':
          result = await processProductGeneration({ ...job, input_data: operation.data })
          break
        case 'image_generation':
          result = await processImageGeneration({ ...job, input_data: operation.data })
          break
        default:
          throw new Error(`Unknown batch operation type: ${operation.type}`)
      }

      results.push({ operation: operation.type, success: true, result })
    } catch (error) {
      results.push({
        operation: operation.type,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return {
    type: 'batch_processing',
    operations_processed: operations.length,
    results,
  }
}

// Complete a job using the stored function
async function completeJob(
  supabase: any,
  jobId: string,
  status: 'completed' | 'failed',
  outputData?: any,
  errorData?: any,
) {
  const { error } = await supabase.rpc('complete_job', {
    p_job_id: jobId,
    p_status: status,
    p_output_data: outputData,
    p_error_data: errorData,
  })

  if (error) {
    console.error('Failed to complete job:', error)
  }
}
