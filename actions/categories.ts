'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/generated-types'

type Category = Tables<'categories'>
type CategoryInsert = TablesInsert<'categories'>
type CategoryUpdate = TablesUpdate<'categories'>

// Create and update data types
export type CreateCategoryData = Omit<CategoryInsert, 'id' | 'created_at' | 'updated_at'>
export type UpdateCategoryData = Omit<CategoryUpdate, 'id' | 'created_at' | 'updated_at'>

// Category tree type for combined category and subcategories data
export type CategoryTree = Category & {
  categories: Category[]
}

// Get all categories for a specific catalog (with hierarchical structure)
export const getCategoriesAction = async (catalogId: string): Promise<Category[]> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the catalog through brand ownership
  const { data: catalog } = await supabase
    .from('product_catalogs')
    .select(`
      catalog_id,
      brand:brands!inner(user_id)
    `)
    .eq('catalog_id', catalogId)
    .eq('brand.user_id', user.id)
    .single()

  if (!catalog) {
    throw new Error('Product catalog not found or access denied')
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('catalog_id', catalogId)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }

  return data || []
}

// Get top-level categories (no parent) for a catalog
export const getTopLevelCategoriesAction = async (
  catalogId: string,
): Promise<Category[]> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the catalog through brand ownership
  const { data: catalog } = await supabase
    .from('product_catalogs')
    .select(`
      catalog_id,
      brand:brands!inner(user_id)
    `)
    .eq('catalog_id', catalogId)
    .eq('brand.user_id', user.id)
    .single()

  if (!catalog) {
    throw new Error('Product catalog not found or access denied')
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('catalog_id', catalogId)
    .is('parent_category_id', null)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching top-level categories:', error)
    throw error
  }

  return data || []
}

// Get subcategories for a specific parent category
export const getSubcategoriesAction = async (
  parentCategoryId: string,
): Promise<Category[]> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the parent category through brand ownership
  const { data: parentCategory } = await supabase
    .from('categories')
    .select(`
      category_id,
      catalog:product_catalogs!inner(
        brand:brands!inner(user_id)
      )
    `)
    .eq('category_id', parentCategoryId)
    .eq('catalog.brand.user_id', user.id)
    .single()

  if (!parentCategory) {
    throw new Error('Parent category not found or access denied')
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_category_id', parentCategoryId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching subcategories:', error)
    throw error
  }

  return data || []
}

// Get a single category by ID
export const getCategoryAction = async (categoryId: string): Promise<Category | null> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      catalog:product_catalogs!inner(
        brand:brands!inner(user_id)
      )
    `)
    .eq('category_id', categoryId)
    .eq('catalog.brand.user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Category not found
    }
    console.error('Error fetching category:', error)
    throw error
  }

  // Remove the nested catalog data from response
  const { catalog, ...category } = data
  return category
}

// Get category tree (category + subcategories)
export const getCategoryTree = async (
  categoryId: string,
): Promise<CategoryTree | null> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Get the main category with ownership verification
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select(`
      *,
      catalog:product_catalogs!inner(
        brand:brands!inner(user_id)
      )
    `)
    .eq('category_id', categoryId)
    .eq('catalog.brand.user_id', user.id)
    .single()

  if (categoryError) {
    if (categoryError.code === 'PGRST116') {
      return null // Category not found
    }
    console.error('Error fetching category:', categoryError)
    throw categoryError
  }

  // Remove the nested catalog data from response
  const { catalog, ...category } = categoryData

  // Get subcategories for this category
  const { data: subcategories, error: subcategoriesError } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_category_id', categoryId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (subcategoriesError) {
    console.error('Error fetching subcategories:', subcategoriesError)
    throw subcategoriesError
  }

  return {
    ...category,
    categories: subcategories || [],
  }
}

// Create a new category
export const createCategoryAction = async (
  categoryData: CreateCategoryData,
): Promise<Category> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the catalog through brand ownership
  const { data: catalog } = await supabase
    .from('product_catalogs')
    .select(`
      catalog_id,
      brand:brands!inner(user_id)
    `)
    .eq('catalog_id', categoryData.catalog_id)
    .eq('brand.user_id', user.id)
    .single()

  if (!catalog) {
    throw new Error('Product catalog not found or access denied')
  }

  // If parent_category_id is provided, verify it belongs to the same catalog
  if (categoryData.parent_category_id) {
    const { data: parentCategory } = await supabase
      .from('categories')
      .select('category_id')
      .eq('category_id', categoryData.parent_category_id)
      .eq('catalog_id', categoryData.catalog_id)
      .single()

    if (!parentCategory) {
      throw new Error('Parent category not found or does not belong to the same catalog')
    }
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({
      category_id: categoryData.category_id,
      catalog_id: categoryData.catalog_id,
      name: categoryData.name,
      description: categoryData.description,
      slug: categoryData.slug,
      parent_category_id: categoryData.parent_category_id,
      sort_order: categoryData.sort_order || 0,
      metadata: categoryData.metadata || {},
      is_active: categoryData.is_active !== false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating category:', error)
    throw error
  }

  revalidatePath(`/catalogs/${categoryData.catalog_id}/categories`)
  return data
}

// Update an existing category
export const updateCategoryAction = async (
  categoryId: string,
  categoryData: UpdateCategoryData,
): Promise<Category> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the category through brand ownership
  const { data: categoryCheck } = await supabase
    .from('categories')
    .select(`
      catalog_id,
      catalog:product_catalogs!inner(
        brand:brands!inner(user_id)
      )
    `)
    .eq('category_id', categoryId)
    .eq('catalog.brand.user_id', user.id)
    .single()

  if (!categoryCheck) {
    throw new Error('Category not found or access denied')
  }

  // If updating parent_category_id, verify it belongs to the same catalog and isn't circular
  if (categoryData.parent_category_id !== undefined) {
    if (categoryData.parent_category_id === categoryId) {
      throw new Error('Category cannot be its own parent')
    }

    if (categoryData.parent_category_id) {
      const { data: parentCategory } = await supabase
        .from('categories')
        .select('category_id')
        .eq('category_id', categoryData.parent_category_id)
        .eq('catalog_id', categoryCheck.catalog_id)
        .single()

      if (!parentCategory) {
        throw new Error(
          'Parent category not found or does not belong to the same catalog',
        )
      }
    }
  }

  const { data, error } = await supabase
    .from('categories')
    .update({
      ...categoryData,
      updated_at: new Date().toISOString(),
    })
    .eq('category_id', categoryId)
    .select()
    .single()

  if (error) {
    console.error('Error updating category:', error)
    throw error
  }

  revalidatePath(`/catalogs/${data.catalog_id}/categories`)
  revalidatePath(`/categories/${categoryId}`)
  return data
}

// Delete a category
export const deleteCategoryAction = async (categoryId: string): Promise<void> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Get category details before deletion for revalidation
  const { data: category } = await supabase
    .from('categories')
    .select(`
      catalog_id,
      catalog:product_catalogs!inner(
        brand:brands!inner(user_id)
      )
    `)
    .eq('category_id', categoryId)
    .eq('catalog.brand.user_id', user.id)
    .single()

  if (!category) {
    throw new Error('Category not found or access denied')
  }

  // Check if category has subcategories
  const { data: subcategories } = await supabase
    .from('categories')
    .select('category_id')
    .eq('parent_category_id', categoryId)
    .limit(1)

  if (subcategories && subcategories.length > 0) {
    throw new Error(
      'Cannot delete category that has subcategories. Delete subcategories first.',
    )
  }

  // Check if category is used by products
  const { data: products } = await supabase
    .from('products')
    .select('id')
    .eq('parent_category_id', categoryId)
    .limit(1)

  if (products && products.length > 0) {
    throw new Error(
      'Cannot delete category that is assigned to products. Reassign products first.',
    )
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('category_id', categoryId)

  if (error) {
    console.error('Error deleting category:', error)
    throw error
  }

  revalidatePath(`/catalogs/${category.catalog_id}/categories`)
}
