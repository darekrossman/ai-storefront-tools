'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Brand, BrandInsert, BrandUpdate } from '@/lib/supabase/database-types'

// Create and update data types
export type CreateBrandData = Omit<BrandInsert, 'id' | 'created_at' | 'updated_at'>
export type UpdateBrandData = Omit<BrandUpdate, 'id' | 'created_at' | 'updated_at'>

// Get all brands for a specific project
export const getBrandsAction = async (projectId: number): Promise<Brand[]> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the project
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) {
    throw new Error('Project not found or access denied')
  }

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching brands:', error)
    throw error
  }

  return data || []
}

// Get a single brand by ID
export const getBrandAction = async (brandId: number): Promise<Brand | null> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('brands')
    .select(`
      *,
      project:projects!inner(user_id)
    `)
    .eq('id', brandId)
    .eq('project.user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Brand not found
    }
    console.error('Error fetching brand:', error)
    throw error
  }

  // Remove the nested project data from response
  const { project, ...brand } = data
  return brand
}

// Create a new brand
export const createBrandAction = async (brandData: CreateBrandData): Promise<Brand> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the project
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', brandData.project_id)
    .eq('user_id', user.id)
    .single()

  if (!project) {
    throw new Error('Project not found or access denied')
  }

  const { data, error } = await supabase
    .from('brands')
    .insert({
      project_id: brandData.project_id,
      name: brandData.name,
      tagline: brandData.tagline,
      mission: brandData.mission,
      vision: brandData.vision,
      values: brandData.values || [],
      target_market: brandData.target_market || {},
      brand_personality: brandData.brand_personality || {},
      positioning: brandData.positioning || {},
      visual_identity: brandData.visual_identity || {},
      status: brandData.status || 'draft',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating brand:', error)
    throw error
  }

  revalidatePath(`/projects/${brandData.project_id}/brands`)
  return data
}

// Update an existing brand
export const updateBrandAction = async (
  brandId: number,
  brandData: UpdateBrandData,
): Promise<Brand> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the brand
  const { data: brandCheck } = await supabase
    .from('brands')
    .select(`
      project_id,
      project:projects!inner(user_id)
    `)
    .eq('id', brandId)
    .eq('project.user_id', user.id)
    .single()

  if (!brandCheck) {
    throw new Error('Brand not found or access denied')
  }

  const { data, error } = await supabase
    .from('brands')
    .update({
      ...brandData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', brandId)
    .select()
    .single()

  if (error) {
    console.error('Error updating brand:', error)
    throw error
  }

  revalidatePath(`/projects/${data.project_id}/brands`)
  revalidatePath(`/brands/${brandId}`)
  return data
}

// Delete a brand
export const deleteBrandAction = async (brandId: number): Promise<void> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Get project_id before deletion for revalidation
  const { data: brand } = await supabase
    .from('brands')
    .select(`
      project_id,
      project:projects!inner(user_id)
    `)
    .eq('id', brandId)
    .eq('project.user_id', user.id)
    .single()

  if (!brand) {
    throw new Error('Brand not found or access denied')
  }

  const { error } = await supabase.from('brands').delete().eq('id', brandId)

  if (error) {
    console.error('Error deleting brand:', error)
    throw error
  }

  revalidatePath(`/projects/${brand.project_id}/brands`)
}
