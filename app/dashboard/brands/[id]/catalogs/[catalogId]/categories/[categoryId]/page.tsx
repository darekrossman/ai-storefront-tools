import { Box, Container, Stack, styled } from '@/styled-system/jsx'
import { notFound } from 'next/navigation'
import { getCategoryAction } from '@/actions/categories'
import { getProductsByCategory } from '@/actions/products'
import CategoryDetails from '@/components/categories/category-details'
import type { Category } from '@/lib/supabase/database-types'
import type { ProductWithRelations } from '@/actions/products'

interface CategoryDetailsPageProps {
  params: Promise<{
    id: string
    catalogId: string
    categoryId: string
  }>
}

export default async function CategoryDetailsPage({ params }: CategoryDetailsPageProps) {
  const { id, catalogId, categoryId } = await params
  const brandId = parseInt(id)
  console.log(id, catalogId, categoryId)
  if (isNaN(brandId)) {
    notFound()
  }

  let category: Category | null = null
  let products: ProductWithRelations[] = []
  let error: string | null = null

  try {
    category = await getCategoryAction(categoryId)
    if (!category) {
      notFound()
    }

    // Verify category belongs to the requested catalog
    if (category.catalog_id !== catalogId) {
      notFound()
    }

    products = await getProductsByCategory(categoryId)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load category'
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
            Error Loading Category
          </styled.h3>
          <styled.p fontSize="sm" color="red.700">
            {error}
          </styled.p>
        </Stack>
      </Box>
    )
  }

  if (!category) {
    notFound()
  }

  return (
    <Container py={8}>
      <CategoryDetails category={category} products={products} catalogId={catalogId} />
    </Container>
  )
}
