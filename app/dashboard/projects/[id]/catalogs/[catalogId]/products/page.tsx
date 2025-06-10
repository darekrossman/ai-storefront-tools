import { Box, Stack, styled } from '@/styled-system/jsx'
import { notFound } from 'next/navigation'
import { getProductCatalogAction } from '@/actions/product-catalogs'
import ProductList from '@/components/products/product-list'

interface CatalogProductsPageProps {
  params: {
    id: string
    catalogId: string
  }
}

export default async function CatalogProductsPage({ params }: CatalogProductsPageProps) {
  const projectId = parseInt(params.id)
  const catalogId = params.catalogId

  if (isNaN(projectId)) {
    notFound()
  }

  let catalog = null
  let error: string | null = null

  try {
    catalog = await getProductCatalogAction(catalogId)
    if (!catalog) {
      notFound()
    }
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

  return (
    <Box>
      {/* Page Header */}
      <Stack gap={2} mb={8}>
        <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
          {catalog?.name} - Products
        </styled.h1>
        <styled.p fontSize="sm" color="gray.600">
          Manage all products in this catalog
        </styled.p>
      </Stack>

      {/* Products List */}
      <ProductList catalogId={catalogId} projectId={projectId} />
    </Box>
  )
}
