import { Box, Container, Stack, styled } from '@/styled-system/jsx'
import { notFound } from 'next/navigation'
import { getProductCatalogAction } from '@/actions/product-catalogs'
import { getCategoriesAction } from '@/actions/categories'
import CreateProductForm from '@/components/products/create-product-form'
import ProductsGeneration from '@/components/products/products-generation'

interface NewProductPageProps {
  params: Promise<{
    id: string
    catalogId: string
  }>
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const { id, catalogId } = await params
  const projectId = parseInt(id)

  if (isNaN(projectId)) {
    notFound()
  }

  let catalog = null
  let categories: Array<{ category_id: string; name: string }> = []
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
      categories = catalogCategories.map(
        (cat: { category_id: string; name: string }) => ({
          category_id: cat.category_id,
          name: cat.name,
        }),
      )
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
    <Container py={8}>
      {/* Breadcrumb */}
      <Stack gap={2} mb={6}>
        <styled.p fontSize="sm" color="gray.600">
          Creating product in:{' '}
          <styled.span fontWeight="medium">{catalog?.name}</styled.span>
        </styled.p>
      </Stack>

      {/* Create Product Form */}
      {/* <CreateProductForm
        projectId={projectId}
        catalogId={catalogId}
        categories={categories}
      /> */}
      <ProductsGeneration catalogId={catalogId} projectId={projectId} />
    </Container>
  )
}
