import type { CategoryInsert, ProductCatalogInsert } from '@/lib/supabase/database-types'
import { catalogStructuredOutputSchemas } from './schemas'
import { z } from 'zod'

export function convertToDBFormat(
  structuredOutput: z.infer<typeof catalogStructuredOutputSchemas>,
  brandId: number,
): {
  catalog: ProductCatalogInsert
  categories: CategoryInsert[]
} {
  const data = structuredOutput

  if (!data) {
    throw new Error('Catalog is not complete. Cannot convert to database format.')
  }

  const catalogId = data.slug

  const catalog: ProductCatalogInsert = {
    brand_id: brandId,
    name: data.name,
    description: data.description,
    catalog_id: catalogId,
    slug: data.slug,
    total_products: 0,
    settings: {},
    status: 'active',
  }

  const categories: CategoryInsert[] = []

  // Process top-level categories
  data.categories.forEach((category, index) => {
    const categoryId = category.slug

    categories.push({
      catalog_id: catalogId,
      name: category.name,
      description: category.description,
      category_id: categoryId,
      slug: category.slug,
      parent_category_id: null,
      sort_order: index,
      metadata: {},
      is_active: true,
    })

    // Process subcategories
    category.subcategories.forEach((subcategory, subIndex) => {
      const subcategoryId = subcategory.slug

      categories.push({
        catalog_id: catalogId,
        name: subcategory.name,
        description: subcategory.description,
        category_id: subcategoryId,
        slug: subcategory.slug,
        parent_category_id: category.slug,
        sort_order: subIndex,
        is_active: true,
      })
    })
  })

  return {
    catalog,
    categories,
  }
}
