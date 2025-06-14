import { Box, Container, Stack, styled } from '@/styled-system/jsx'
import { notFound } from 'next/navigation'
import {
  getCategoryAction,
  getCategoryTree,
  getSubcategoriesAction,
} from '@/actions/categories'
import { getProductsByCategory } from '@/actions/products'
import CategoryDetails from '@/components/categories/category-details'
import type { Category } from '@/lib/supabase/database-types'
import type { ProductWithRelations } from '@/actions/products'
import { getBrandBySlugAction } from '@/actions/brands'

interface CategoryDetailsPageProps {
  params: Promise<{
    brandSlug: string
    catalogId: string
    categoryId: string
  }>
}

export default async function CategoryDetailsPage({ params }: CategoryDetailsPageProps) {
  const { brandSlug, catalogId, categoryId } = await params
  const brand = await getBrandBySlugAction(brandSlug)

  if (!brand) {
    notFound()
  }

  const category = await getCategoryTree(categoryId)

  if (!category) {
    notFound()
  }

  const products = await getProductsByCategory(categoryId)

  return <CategoryDetails category={category} products={products} catalogId={catalogId} />
}
