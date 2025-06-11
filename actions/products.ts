'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/lib/supabase/generated-types'
import { convertToDBFormat, linkProductRelations } from '@/lib/products/helpers'
import type { fullProductSchema } from '@/lib/products/schemas'
import type { z } from 'zod'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']
type ProductVariant = Database['public']['Tables']['product_variants']['Row']
type ProductAttributeSchema =
  Database['public']['Tables']['product_attribute_schemas']['Row']
type ProductImage = Database['public']['Tables']['product_images']['Row']
type BrandStatus = Database['public']['Enums']['brand_status']

// Types for product operations based on generated database types
export type CreateProductData = Omit<
  ProductInsert,
  | 'created_at'
  | 'updated_at'
  | 'min_price'
  | 'max_price'
  | 'variant_count'
  | 'active_variant_count'
>

export type CreateMultipleProductsData = z.infer<typeof fullProductSchema>

export type UpdateProductData = {
  id: number
} & Partial<
  Omit<
    ProductUpdate,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'min_price'
    | 'max_price'
    | 'variant_count'
    | 'active_variant_count'
  >
>

export interface ProductWithRelations extends Product {
  product_catalogs?: {
    catalog_id: string
    name: string
    brands?: {
      id: number
      name: string
      projects?: {
        id: number
        name: string
        user_id: string
      }
    }
  }
  categories?: {
    category_id: string
    name: string
  } | null
  product_variants?: Array<{
    id: number
    sku: string
    barcode?: string | null
    price: number
    is_active: boolean
    attributes: any
    status: BrandStatus
    sort_order?: number
  }>
  product_attribute_schemas?: Array<{
    id: number
    attribute_key: string
    attribute_label: string
    options: any
    is_required: boolean
    sort_order: number
  }>
  product_images?: Array<{
    id: number
    url: string
    alt_text?: string | null
    type: string
    color_id?: string | null
    attribute_filters?: any
    sort_order: number
  }>
}

/**
 * Create a new master product
 */
export async function createProduct(data: CreateProductData) {
  const supabase = await createClient()

  try {
    // Validate user access to catalog
    const { data: catalog } = await supabase
      .from('product_catalogs')
      .select(`
        catalog_id,
        brands (
          id,
          projects (
            id,
            user_id
          )
        )
      `)
      .eq('catalog_id', data.catalog_id)
      .single()

    if (!catalog?.brands?.projects?.user_id) {
      throw new Error('Catalog not found or access denied')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || catalog.brands.projects.user_id !== user.id) {
      throw new Error('Unauthorized')
    }

    // Create the master product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        catalog_id: data.catalog_id,
        parent_category_id: data.parent_category_id,
        name: data.name,
        description: data.description,
        short_description: data.short_description,
        specifications: data.specifications || {},
        base_attributes: data.base_attributes || {},
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        tags: data.tags || [],
        status: data.status || 'draft',
        sort_order: data.sort_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return { success: true, data: product }
  } catch (error) {
    console.error('Error in createProduct:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Create multiple products with their variants and attributes in a single transaction
 */
export async function createMultipleProducts(
  catalogId: string,
  productsData: CreateMultipleProductsData,
) {
  const supabase = await createClient()

  try {
    // Validate user access to catalog
    const { data: catalog } = await supabase
      .from('product_catalogs')
      .select(`
        catalog_id,
        brands (
          id,
          projects (
            id,
            user_id
          )
        )
      `)
      .eq('catalog_id', catalogId)
      .single()

    if (!catalog?.brands?.projects?.user_id) {
      throw new Error('Catalog not found or access denied')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || catalog.brands.projects.user_id !== user.id) {
      throw new Error('Unauthorized')
    }

    // Convert the schema data to database format
    const convertedData = convertToDBFormat(productsData, catalogId)

    // Start a transaction to create all products and related data
    const { data: insertedProducts, error: productsError } = await supabase
      .from('products')
      .insert(convertedData.products)
      .select('id')

    if (productsError) {
      console.error('Error creating products:', productsError)
      throw new Error(productsError.message)
    }

    if (!insertedProducts || insertedProducts.length === 0) {
      throw new Error('No products were created')
    }

    // Map inserted products to their original index for linking
    const productMappings = insertedProducts.map((product, index) => ({
      id: product.id,
      index,
    }))

    // Link the attribute schemas and variants to their products
    const { attributeSchemas, variants } = linkProductRelations(
      convertedData,
      productMappings,
    )

    // Insert attribute schemas if any exist
    if (attributeSchemas.length > 0) {
      const { error: attributesError } = await supabase
        .from('product_attribute_schemas')
        .insert(attributeSchemas)

      if (attributesError) {
        console.error('Error creating attribute schemas:', attributesError)
        // Note: In a real transaction, we'd want to rollback the products
        throw new Error(attributesError.message)
      }
    }

    // Insert variants if any exist
    if (variants.length > 0) {
      const { error: variantsError } = await supabase
        .from('product_variants')
        .insert(variants)

      if (variantsError) {
        console.error('Error creating variants:', variantsError)
        // Note: In a real transaction, we'd want to rollback the products and attributes
        throw new Error(variantsError.message)
      }
    }

    revalidatePath('/')
    return {
      success: true,
      data: {
        products: insertedProducts,
        message: `Successfully created ${insertedProducts.length} products`,
      },
    }
  } catch (error) {
    console.error('Error in createMultipleProducts:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Update an existing master product
 */
export async function updateProduct(data: UpdateProductData) {
  const supabase = await createClient()

  try {
    // Validate user access
    const { data: product } = await supabase
      .from('products')
      .select(`
        id,
        product_catalogs (
          catalog_id,
          brands (
            id,
            projects (
              id,
              user_id
            )
          )
        )
      `)
      .eq('id', data.id)
      .single()

    if (!product?.product_catalogs?.brands?.projects?.user_id) {
      throw new Error('Product not found or access denied')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || product.product_catalogs.brands.projects.user_id !== user.id) {
      throw new Error('Unauthorized')
    }

    // Update the product
    const { id, ...updateData } = data

    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', data.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return { success: true, data: updatedProduct }
  } catch (error) {
    console.error('Error in updateProduct:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Delete a master product (and all its variants)
 */
export async function deleteProduct(productId: number) {
  const supabase = await createClient()

  try {
    // Validate user access
    const { data: product } = await supabase
      .from('products')
      .select(`
        id,
        product_catalogs (
          catalog_id,
          brands (
            id,
            projects (
              id,
              user_id
            )
          )
        )
      `)
      .eq('id', productId)
      .single()

    if (!product?.product_catalogs?.brands?.projects?.user_id) {
      throw new Error('Product not found or access denied')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || product.product_catalogs.brands.projects.user_id !== user.id) {
      throw new Error('Unauthorized')
    }

    // Delete the product (cascades to variants, attributes, images)
    const { error } = await supabase.from('products').delete().eq('id', productId)

    if (error) {
      console.error('Error deleting product:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteProduct:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Get products for a catalog with variants and related data
 */
export async function getProductsByCatalog(
  catalogId: string,
): Promise<ProductWithRelations[]> {
  const supabase = await createClient()

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        product_catalogs (
          catalog_id,
          name,
          brands (
            id,
            name,
            projects (
              id,
              name,
              user_id
            )
          )
        ),
        categories (
          category_id,
          name
        ),
        product_variants (
          id,
          sku,
          price,
          is_active,
          attributes,
          status
        ),
        product_attribute_schemas (
          id,
          attribute_key,
          attribute_label,
          options,
          is_required,
          sort_order
        ),
        product_images (
          id,
          url,
          alt_text,
          type,
          color_id,
          attribute_filters,
          sort_order
        )
      `)
      .eq('catalog_id', catalogId)
      .order('sort_order')
      .order('created_at')

    if (error) {
      console.error('Error fetching products:', error)
      throw new Error(error.message)
    }

    return products || []
  } catch (error) {
    console.error('Error in getProductsByCatalog:', error)
    return []
  }
}

/**
 * Get a single product with all related data
 */
export async function getProductById(
  productId: number,
): Promise<ProductWithRelations | null> {
  const supabase = await createClient()

  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_catalogs (
          catalog_id,
          name,
          brands (
            id,
            name,
            projects (
              id,
              name,
              user_id
            )
          )
        ),
        categories (
          category_id,
          name
        ),
        product_variants (
          id,
          sku,
          barcode,
          price,
          is_active,
          attributes,
          status,
          sort_order
        ),
        product_attribute_schemas (
          id,
          attribute_key,
          attribute_label,
          options,
          is_required,
          sort_order
        ),
        product_images (
          id,
          url,
          alt_text,
          type,
          color_id,
          attribute_filters,
          sort_order
        )
      `)
      .eq('id', productId)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return product
  } catch (error) {
    console.error('Error in getProductById:', error)
    return null
  }
}

/**
 * Duplicate a product with all its variants and attributes
 */
export async function duplicateProduct(productId: number, newName: string) {
  const supabase = await createClient()

  try {
    // Get the original product with all related data
    const originalProduct = await getProductById(productId)
    if (!originalProduct) {
      throw new Error('Product not found')
    }

    // Validate user access
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (
      !user ||
      originalProduct.product_catalogs?.brands?.projects?.user_id !== user.id
    ) {
      throw new Error('Unauthorized')
    }

    // Create the new product
    const createResult = await createProduct({
      catalog_id: originalProduct.catalog_id,
      parent_category_id: originalProduct.parent_category_id,
      name: newName,
      description: originalProduct.description,
      short_description: originalProduct.short_description,
      specifications: originalProduct.specifications,
      base_attributes: originalProduct.base_attributes,
      meta_title: originalProduct.meta_title,
      meta_description: originalProduct.meta_description,
      tags: originalProduct.tags,
      status: 'draft', // Always create duplicates as draft
      sort_order: originalProduct.sort_order,
    })

    if (!createResult.success || !createResult.data) {
      throw new Error('Failed to create duplicate product')
    }

    const newProductId = createResult.data.id

    // Duplicate attributes
    if (
      originalProduct.product_attribute_schemas &&
      originalProduct.product_attribute_schemas.length > 0
    ) {
      const attributesData = originalProduct.product_attribute_schemas.map((attr) => ({
        product_id: newProductId,
        attribute_key: attr.attribute_key,
        attribute_label: attr.attribute_label,
        attribute_type: 'select', // Default type, adjust as needed
        options: attr.options,
        is_required: attr.is_required,
        sort_order: attr.sort_order,
      }))

      await supabase.from('product_attribute_schemas').insert(attributesData)
    }

    // Duplicate variants
    if (originalProduct.product_variants && originalProduct.product_variants.length > 0) {
      const variantsData = originalProduct.product_variants.map((variant, index) => ({
        product_id: newProductId,
        sku: `${variant.sku}-copy-${Date.now()}-${index}`, // Make SKU unique
        price: variant.price,
        is_active: variant.is_active,
        attributes: variant.attributes,
        status: 'draft' as BrandStatus, // Always create duplicates as draft
        sort_order: variant.sort_order,
      }))

      await supabase.from('product_variants').insert(variantsData)
    }

    revalidatePath('/')
    return { success: true, data: { id: newProductId } }
  } catch (error) {
    console.error('Error in duplicateProduct:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Get all products for a catalog with basic info only
 */
export async function getProducts(catalogId: string): Promise<Product[]> {
  const supabase = await createClient()

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('catalog_id', catalogId)
      .order('sort_order')
      .order('name')

    if (error) {
      console.error('Error fetching products:', error)
      throw new Error(error.message)
    }

    return products || []
  } catch (error) {
    console.error('Error in getProducts:', error)
    return []
  }
}

/**
 * Update product status
 */
export async function updateProductStatus(productId: number, status: BrandStatus) {
  const supabase = await createClient()

  try {
    // Validate user access
    const { data: product } = await supabase
      .from('products')
      .select(`
        id,
        product_catalogs (
          catalog_id,
          brands (
            id,
            projects (
              id,
              user_id
            )
          )
        )
      `)
      .eq('id', productId)
      .single()

    if (!product?.product_catalogs?.brands?.projects?.user_id) {
      throw new Error('Product not found or access denied')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || product.product_catalogs.brands.projects.user_id !== user.id) {
      throw new Error('Unauthorized')
    }

    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update({ status })
      .eq('id', productId)
      .select()
      .single()

    if (error) {
      console.error('Error updating product status:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return { success: true, data: updatedProduct }
  } catch (error) {
    console.error('Error in updateProductStatus:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
