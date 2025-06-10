'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/generated-types'

type ProductCatalog = Tables<'product_catalogs'>
type ProductCatalogInsert = TablesInsert<'product_catalogs'>
type ProductCatalogUpdate = TablesUpdate<'product_catalogs'>

// Create and update data types
export type CreateProductCatalogData = Omit<
  ProductCatalogInsert,
  'id' | 'created_at' | 'updated_at' | 'total_products'
>
export type UpdateProductCatalogData = Omit<
  ProductCatalogUpdate,
  'id' | 'created_at' | 'updated_at' | 'total_products'
>

// Get all product catalogs for a specific brand
export const getProductCatalogsAction = async (
  brandId: number,
): Promise<ProductCatalog[]> => {
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
    .select(`
      id,
      project:projects!inner(user_id)
    `)
    .eq('id', brandId)
    .eq('project.user_id', user.id)
    .single()

  if (!brand) {
    throw new Error('Brand not found or access denied')
  }

  const { data, error } = await supabase.from('product_catalogs').select('*')

  if (error) {
    console.error('Error fetching product catalogs:', error)
    throw error
  }

  return data || []
}

// Get a single product catalog by ID
export const getProductCatalogAction = async (
  catalogId: string,
): Promise<ProductCatalog | null> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('product_catalogs')
    .select(`
      *,
      brand:brands!inner(
        project:projects!inner(user_id)
      )
    `)
    .eq('catalog_id', catalogId)
    .eq('brand.project.user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Catalog not found
    }
    console.error('Error fetching product catalog:', error)
    throw error
  }

  // Remove the nested brand data from response
  const { brand, ...catalog } = data
  return catalog
}

// Create a new product catalog
export const createProductCatalogAction = async (
  catalogData: CreateProductCatalogData,
): Promise<ProductCatalog> => {
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
    .select(`
      id,
      project:projects!inner(user_id)
    `)
    .eq('id', catalogData.brand_id)
    .eq('project.user_id', user.id)
    .single()

  if (!brand) {
    throw new Error('Brand not found or access denied')
  }

  const { data, error } = await supabase
    .from('product_catalogs')
    .insert({
      brand_id: catalogData.brand_id,
      catalog_id: catalogData.catalog_id,
      name: catalogData.name,
      description: catalogData.description,
      slug: catalogData.slug,
      settings: catalogData.settings || {},
      status: catalogData.status || 'draft',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating product catalog:', error)
    throw error
  }

  revalidatePath(`/brands/${catalogData.brand_id}/catalogs`)
  return data
}

// Update an existing product catalog
export const updateProductCatalogAction = async (
  catalogId: string,
  catalogData: UpdateProductCatalogData,
): Promise<ProductCatalog> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the catalog
  const { data: catalogCheck } = await supabase
    .from('product_catalogs')
    .select(`
      brand_id,
      brand:brands!inner(
        project:projects!inner(user_id)
      )
    `)
    .eq('catalog_id', catalogId)
    .eq('brand.project.user_id', user.id)
    .single()

  if (!catalogCheck) {
    throw new Error('Product catalog not found or access denied')
  }

  const { data, error } = await supabase
    .from('product_catalogs')
    .update({
      ...catalogData,
      updated_at: new Date().toISOString(),
    })
    .eq('catalog_id', catalogId)
    .select()
    .single()

  if (error) {
    console.error('Error updating product catalog:', error)
    throw error
  }

  revalidatePath(`/brands/${data.brand_id}/catalogs`)
  revalidatePath(`/catalogs/${catalogId}`)
  return data
}

// Delete a product catalog
export const deleteProductCatalogAction = async (catalogId: string): Promise<void> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Get brand_id before deletion for revalidation
  const { data: catalog } = await supabase
    .from('product_catalogs')
    .select(`
      brand_id,
      brand:brands!inner(
        project:projects!inner(user_id)
      )
    `)
    .eq('catalog_id', catalogId)
    .eq('brand.project.user_id', user.id)
    .single()

  if (!catalog) {
    throw new Error('Product catalog not found or access denied')
  }

  const { error } = await supabase
    .from('product_catalogs')
    .delete()
    .eq('catalog_id', catalogId)

  if (error) {
    console.error('Error deleting product catalog:', error)
    throw error
  }

  revalidatePath(`/brands/${catalog.brand_id}/catalogs`)
}
