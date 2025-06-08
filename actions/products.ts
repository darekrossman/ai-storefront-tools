'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

import type { Product, ProductInsert, ProductUpdate } from '@/lib/supabase/database-types'

// Create and update data types
export type CreateProductData = Omit<ProductInsert, 'id' | 'created_at' | 'updated_at'>
export type UpdateProductData = Omit<ProductUpdate, 'id' | 'created_at' | 'updated_at'>

// Get all products for a specific catalog
export const getProductsAction = async (catalogId: number): Promise<Product[]> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the catalog
  const { data: catalog } = await supabase
    .from('product_catalogs')
    .select(`
      id,
      brand:brands!inner(
        project:projects!inner(user_id)
      )
    `)
    .eq('id', catalogId)
    .eq('brand.project.user_id', user.id)
    .single()

  if (!catalog) {
    throw new Error('Product catalog not found or access denied')
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('catalog_id', catalogId)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    throw error
  }

  return data || []
}

// Get products by category
export const getProductsByCategoryAction = async (
  catalogId: number,
  categoryId: number,
): Promise<Product[]> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the catalog
  const { data: catalog } = await supabase
    .from('product_catalogs')
    .select(`
      id,
      brand:brands!inner(
        project:projects!inner(user_id)
      )
    `)
    .eq('id', catalogId)
    .eq('brand.project.user_id', user.id)
    .single()

  if (!catalog) {
    throw new Error('Product catalog not found or access denied')
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('catalog_id', catalogId)
    .or(`primary_category_id.eq.${categoryId},subcategory_id.eq.${categoryId}`)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching products by category:', error)
    throw error
  }

  return data || []
}

// Get featured products for a catalog
export const getFeaturedProductsAction = async (
  catalogId: number,
): Promise<Product[]> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the catalog
  const { data: catalog } = await supabase
    .from('product_catalogs')
    .select(`
      id,
      brand:brands!inner(
        project:projects!inner(user_id)
      )
    `)
    .eq('id', catalogId)
    .eq('brand.project.user_id', user.id)
    .single()

  if (!catalog) {
    throw new Error('Product catalog not found or access denied')
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('catalog_id', catalogId)
    .eq('is_featured', true)
    .eq('status', 'active')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching featured products:', error)
    throw error
  }

  return data || []
}

// Get a single product by ID
export const getProductAction = async (productId: number): Promise<Product | null> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      catalog:product_catalogs!inner(
        brand:brands!inner(
          project:projects!inner(user_id)
        )
      )
    `)
    .eq('id', productId)
    .eq('catalog.brand.project.user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Product not found
    }
    console.error('Error fetching product:', error)
    throw error
  }

  // Remove the nested catalog data from response
  const { catalog, ...product } = data
  return product
}

// Create a new product
export const createProductAction = async (
  productData: CreateProductData,
): Promise<Product> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the catalog
  const { data: catalog } = await supabase
    .from('product_catalogs')
    .select(`
      id,
      brand_id,
      brand:brands!inner(
        project:projects!inner(user_id)
      )
    `)
    .eq('id', productData.catalog_id)
    .eq('brand.project.user_id', user.id)
    .single()

  if (!catalog) {
    throw new Error('Product catalog not found or access denied')
  }

  // Verify categories belong to the same brand
  const { data: primaryCategory } = await supabase
    .from('categories')
    .select('id')
    .eq('id', productData.primary_category_id)
    .eq('brand_id', catalog.brand_id)
    .single()

  if (!primaryCategory) {
    throw new Error('Primary category not found or does not belong to the same brand')
  }

  if (productData.subcategory_id) {
    const { data: subcategory } = await supabase
      .from('categories')
      .select('id')
      .eq('id', productData.subcategory_id)
      .eq('brand_id', catalog.brand_id)
      .single()

    if (!subcategory) {
      throw new Error('Subcategory not found or does not belong to the same brand')
    }
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      catalog_id: productData.catalog_id,
      primary_category_id: productData.primary_category_id,
      subcategory_id: productData.subcategory_id,
      name: productData.name,
      description: productData.description,
      short_description: productData.short_description,
      tags: productData.tags || [],
      specifications: productData.specifications || {},
      pricing: productData.pricing || {},
      inventory: productData.inventory || {},
      marketing: productData.marketing || {},
      relations: productData.relations || {},
      status: productData.status || 'draft',
      sort_order: productData.sort_order || 0,
      is_featured: productData.is_featured || false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    throw error
  }

  revalidatePath(`/catalogs/${productData.catalog_id}/products`)
  return data
}

// Update an existing product
export const updateProductAction = async (
  productId: number,
  productData: UpdateProductData,
): Promise<Product> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the product
  const { data: productCheck } = await supabase
    .from('products')
    .select(`
      catalog_id,
      catalog:product_catalogs!inner(
        brand:brands!inner(
          project:projects!inner(user_id)
        )
      )
    `)
    .eq('id', productId)
    .eq('catalog.brand.project.user_id', user.id)
    .single()

  if (!productCheck) {
    throw new Error('Product not found or access denied')
  }

  // Get the brand_id from the catalog
  const { data: catalogInfo } = await supabase
    .from('product_catalogs')
    .select('brand_id')
    .eq('id', productCheck.catalog_id)
    .single()

  if (!catalogInfo) {
    throw new Error('Catalog not found')
  }

  const brandId = catalogInfo.brand_id

  // If updating categories, verify they belong to the same brand
  if (productData.primary_category_id) {
    const { data: primaryCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('id', productData.primary_category_id)
      .eq('brand_id', brandId)
      .single()

    if (!primaryCategory) {
      throw new Error('Primary category not found or does not belong to the same brand')
    }
  }

  if (productData.subcategory_id) {
    const { data: subcategory } = await supabase
      .from('categories')
      .select('id')
      .eq('id', productData.subcategory_id)
      .eq('brand_id', brandId)
      .single()

    if (!subcategory) {
      throw new Error('Subcategory not found or does not belong to the same brand')
    }
  }

  const { data, error } = await supabase
    .from('products')
    .update({
      ...productData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    throw error
  }

  revalidatePath(`/catalogs/${data.catalog_id}/products`)
  revalidatePath(`/products/${productId}`)
  return data
}

// Delete a product
export const deleteProductAction = async (productId: number): Promise<void> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Get product details before deletion for revalidation
  const { data: product } = await supabase
    .from('products')
    .select(`
      catalog_id,
      catalog:product_catalogs!inner(
        brand:brands!inner(
          project:projects!inner(user_id)
        )
      )
    `)
    .eq('id', productId)
    .eq('catalog.brand.project.user_id', user.id)
    .single()

  if (!product) {
    throw new Error('Product not found or access denied')
  }

  const { error } = await supabase.from('products').delete().eq('id', productId)

  if (error) {
    console.error('Error deleting product:', error)
    throw error
  }

  revalidatePath(`/catalogs/${product.catalog_id}/products`)
}

// Bulk operations for products
export const bulkUpdateProductStatusAction = async (
  productIds: number[],
  status: 'draft' | 'active' | 'archived',
): Promise<void> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns all products
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      catalog_id,
      catalog:product_catalogs!inner(
        brand:brands!inner(
          project:projects!inner(user_id)
        )
      )
    `)
    .in('id', productIds)
    .eq('catalog.brand.project.user_id', user.id)

  if (!products || products.length !== productIds.length) {
    throw new Error('Some products not found or access denied')
  }

  const { error } = await supabase
    .from('products')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .in('id', productIds)

  if (error) {
    console.error('Error bulk updating product status:', error)
    throw error
  }

  // Revalidate affected catalogs
  const catalogIds = [...new Set(products.map((p) => p.catalog_id))]
  catalogIds.forEach((catalogId) => {
    revalidatePath(`/catalogs/${catalogId}/products`)
  })
}
