import { Box, Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductCatalogAction } from '@/actions/product-catalogs'
import { getProductsByCatalog } from '@/actions/products'
import { getCategoriesAction } from '@/actions/categories'
import type { ProductCatalog, Category } from '@/lib/supabase/database-types'
import type { ProductWithRelations } from '@/actions/products'
import CatalogDetailTabs from '@/components/catalogs/catalog-detail-tabs'
import CategoriesTab from '@/components/catalogs/categories-tab'
import ProductsTab from '@/components/catalogs/products-tab'
import { button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getBrandBySlugAction } from '@/actions/brands'

interface CatalogDetailsPageProps {
  params: Promise<{
    brandSlug: string
    catalogId: string
  }>
}

export default async function CatalogDetailsPage({ params }: CatalogDetailsPageProps) {
  const { brandSlug, catalogId } = await params
  const brand = await getBrandBySlugAction(brandSlug)

  if (!brand) {
    notFound()
  }

  const catalog = await getProductCatalogAction(catalogId)

  if (!catalog) {
    notFound()
  }

  const products = await getProductsByCatalog(catalogId)
  const categories = await getCategoriesAction(catalogId)

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'active'
      case 'draft':
        return 'draft'
      case 'archived':
        return 'archived'
      default:
        return 'neutral'
    }
  }

  return (
    <Stack gap={8}>
      {/* Header */}
      <Stack gap={4}>
        <Flex justify="space-between" align="start" gap={4}>
          <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
            {catalog.name}
          </styled.h1>

          <Flex gap={2}>
            <Link
              href={`/brands/${brand.slug}/catalogs/${catalog.slug}/settings`}
              className={button({ variant: 'secondary', size: 'xs' })}
            >
              Settings
            </Link>
          </Flex>
        </Flex>

        {/* Description */}
        {catalog.description && (
          <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
            {catalog.description}
          </styled.p>
        )}
      </Stack>

      {/* Tabbed Content */}
      <CatalogDetailTabs
        productsCount={products.length}
        categoriesTab={<CategoriesTab catalogId={catalogId} categories={categories} />}
        productsTab={<ProductsTab catalogId={catalogId} brand={brand} />}
      />
    </Stack>
  )
}
