import { Box, Stack, styled } from '@/styled-system/jsx'
import { notFound } from 'next/navigation'
import { getProductCatalogAction } from '@/actions/product-catalogs'
import { getCategoriesAction } from '@/actions/categories'
import CreateProductForm from '@/components/products/create-product-form'

interface NewProductPageProps {
  params: {
    id: string
    catalogId: string
  }
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const projectId = parseInt(params.id)
  const catalogId = parseInt(params.catalogId)

  if (isNaN(projectId) || isNaN(catalogId)) {
    notFound()
  }

  let catalog = null
  let categories: Array<{ id: number; name: string }> = []
  let error: string | null = null

  try {
    // Get catalog details
    catalog = await getProductCatalogAction(catalogId)
    if (!catalog) {
      notFound()
    }

    // Get categories for this catalog
    try {
      const catalogCategories = await getCategoriesAction(catalogId)
      categories = catalogCategories.map((cat: { id: number; name: string }) => ({
        id: cat.id,
        name: cat.name,
      }))
    } catch (err) {
      // Categories are optional, so we can continue without them
      console.warn('Could not load categories:', err)
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
      {/* Breadcrumb */}
      <Stack gap={2} mb={6}>
        <styled.p fontSize="sm" color="gray.600">
          Creating product in:{' '}
          <styled.span fontWeight="medium">{catalog?.name}</styled.span>
        </styled.p>
      </Stack>

      {/* Create Product Form */}
      <CreateProductForm
        projectId={projectId}
        catalogId={catalogId}
        categories={categories}
      />
    </Box>
  )
}
