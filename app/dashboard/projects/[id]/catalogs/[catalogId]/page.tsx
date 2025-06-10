import { Box, Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductCatalogAction } from '@/actions/product-catalogs'
import { getProductsByCatalog } from '@/actions/products'
import type { ProductCatalog } from '@/lib/supabase/database-types'
import type { ProductWithRelations } from '@/actions/products'
import CatalogDetailTabs from '@/components/product-catalogs/catalog-detail-tabs'
import CategoriesTab from '@/components/product-catalogs/categories-tab'
import ProductsTab from '@/components/product-catalogs/products-tab'

interface CatalogDetailsPageProps {
  params: {
    id: string
    catalogId: string
  }
}

export default async function CatalogDetailsPage({ params }: CatalogDetailsPageProps) {
  const projectId = parseInt(params.id)
  const catalogId = parseInt(params.catalogId)

  if (isNaN(projectId) || isNaN(catalogId)) {
    notFound()
  }

  let catalog: ProductCatalog | null = null
  let products: ProductWithRelations[] = []
  let error: string | null = null

  try {
    catalog = await getProductCatalogAction(catalogId)
    if (!catalog) {
      notFound()
    }

    products = await getProductsByCatalog(catalogId)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'green.100', color: 'green.700' }
      case 'draft':
        return { bg: 'yellow.100', color: 'yellow.700' }
      case 'archived':
        return { bg: 'gray.100', color: 'gray.700' }
      default:
        return { bg: 'gray.100', color: 'gray.700' }
    }
  }

  const statusColor = getStatusColor(catalog.status)

  return (
    <Container py={8}>
      {/* Header */}
      <Stack gap={4} mb={8}>
        <Flex justify="space-between" align="start" gap={4}>
          <Stack gap={2} flex={1}>
            <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
              {catalog.name}
            </styled.h1>
            <Flex gap={2} align="center">
              <styled.span
                fontSize="sm"
                fontWeight="medium"
                px={3}
                py={1}
                borderRadius="md"
                bg={statusColor.bg}
                color={statusColor.color}
              >
                {catalog.status}
              </styled.span>
              <styled.span fontSize="sm" color="gray.500">
                •
              </styled.span>
              <styled.span fontSize="sm" color="gray.600">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </styled.span>
            </Flex>
          </Stack>

          <Flex gap={2}>
            <Link
              href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/products/new`}
            >
              <styled.button
                px={4}
                py={2}
                bg="blue.600"
                color="white"
                borderRadius="lg"
                fontSize="sm"
                fontWeight="medium"
                cursor="pointer"
                _hover={{
                  bg: 'blue.700',
                }}
                transition="all 0.2s"
              >
                Add Product
              </styled.button>
            </Link>
            <Link href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/edit`}>
              <styled.button
                px={4}
                py={2}
                border="1px solid"
                borderColor="gray.300"
                bg="white"
                color="gray.700"
                borderRadius="lg"
                fontSize="sm"
                fontWeight="medium"
                cursor="pointer"
                _hover={{
                  bg: 'gray.50',
                  borderColor: 'gray.400',
                }}
                transition="all 0.2s"
              >
                Edit Catalog
              </styled.button>
            </Link>
          </Flex>
        </Flex>

        {/* Description */}
        {catalog.description && (
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={4}
          >
            <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
              {catalog.description}
            </styled.p>
          </Box>
        )}
      </Stack>

      {/* Tabbed Content */}
      <CatalogDetailTabs
        productsCount={products.length}
        categoriesTab={<CategoriesTab catalogId={catalogId} projectId={projectId} />}
        productsTab={<ProductsTab catalogId={catalogId} projectId={projectId} />}
      />
    </Container>
  )
}
