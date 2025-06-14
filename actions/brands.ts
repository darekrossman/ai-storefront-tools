'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/generated-types'

type Brand = Tables<'brands'>
type BrandInsert = TablesInsert<'brands'>
type BrandUpdate = TablesUpdate<'brands'>

// Create and update data types
export type CreateBrandData = Omit<BrandInsert, 'id' | 'created_at' | 'updated_at'>
export type UpdateBrandData = Omit<BrandUpdate, 'id' | 'created_at' | 'updated_at'>

// Get all brands for the authenticated user
export const getBrandsAction = async (): Promise<Brand[]> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
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
    .select('*')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Brand not found
    }
    console.error('Error fetching brand:', error)
    throw error
  }

  return data
}

// Get a single brand by slug
export const getBrandBySlugAction = async (slug: string): Promise<Brand | null> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Brand not found
    }
    console.error('Error fetching brand by slug:', error)
    throw error
  }

  return data
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

  const { data, error } = await supabase
    .from('brands')
    .insert({
      ...brandData,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating brand:', error)
    throw error
  }

  revalidatePath('/dashboard/brands')
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
    .select('id')
    .eq('id', brandId)
    .eq('user_id', user.id)
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

  revalidatePath('/dashboard/brands')
  revalidatePath(`/dashboard/brands/${brandId}`)
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

  // First verify user owns the brand
  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single()

  if (!brand) {
    throw new Error('Brand not found or access denied')
  }

  const { error } = await supabase.from('brands').delete().eq('id', brandId)

  if (error) {
    console.error('Error deleting brand:', error)
    throw error
  }

  revalidatePath('/dashboard/brands')
}

// Get brandId by catalogId
export const getBrandIdByCatalog = async (catalogId: string): Promise<number> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product_catalogs')
    .select('brand_id')
    .eq('catalog_id', catalogId)
    .single()

  if (error || !data) {
    throw new Error('Brand not found for catalog')
  }

  return data.brand_id
}
