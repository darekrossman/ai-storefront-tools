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

interface CatalogDetailsPageProps {
  params: Promise<{
    id: string
    catalogId: string
  }>
}

export default async function CatalogDetailsPage({ params }: CatalogDetailsPageProps) {
  const { id, catalogId } = await params
  const brandId = parseInt(id)

  if (isNaN(brandId)) {
    notFound()
  }

  let catalog: ProductCatalog | null = null
  let products: ProductWithRelations[] = []
  let categories: Category[] = []
  let error: string | null = null

  try {
    catalog = await getProductCatalogAction(catalogId)
    if (!catalog) {
      notFound()
    }

    products = await getProductsByCatalog(catalogId)
    categories = await getCategoriesAction(catalogId)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load catalog'
  }

  if (error) {
    return (
      <Box
        bg="red.50"
        border="1px solid"
        borderColor="red.200"
        borderRadius="lg"
        p={6}
        textAlign="center"
      >
        <Stack gap={2} align="center">
          <styled.h3 fontSize="lg" fontWeight="medium" color="red.900">
            Error Loading Catalog
          </styled.h3>
          <styled.p fontSize="sm" color="red.700">
            {error}
          </styled.p>
        </Stack>
      </Box>
    )
  }

  if (!catalog) {
    notFound()
  }

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
    <Container py={8}>
      <Stack gap={8}>
        {/* Header */}
        <Stack gap={4}>
          <Flex justify="space-between" align="start" gap={4}>
            <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
              {catalog.name}
            </styled.h1>

            <Flex gap={2}>
              <Link
                href={`/dashboard/brands/${brandId}/catalogs/${catalogId}/settings`}
                className={button({ variant: 'secondary', size: 'xs' })}
              >
                Settings
              </Link>
            </Flex>
          </Flex>

          {/* <Flex gap={2} align="center">
            <Badge variant={getStatusVariant(catalog.status)}>{catalog.status}</Badge>
          </Flex> */}

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
          productsTab={<ProductsTab catalogId={catalogId} />}
        />
      </Stack>
    </Container>
  )
}
