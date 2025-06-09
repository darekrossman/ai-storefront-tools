import { Box, Stack, styled } from '@/styled-system/jsx'
import { notFound } from 'next/navigation'
import { getProductById } from '@/actions/products'
import ProductDetails from '@/components/products/product-details'

interface ProductDetailsPageProps {
  params: Promise<{
    id: string
    productId: string
  }>
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id, productId } = await params
  const projectIdNum = parseInt(id)
  const productIdNum = parseInt(productId)

  if (isNaN(projectIdNum) || isNaN(productIdNum)) {
    notFound()
  }

  let product = null
  let error: string | null = null

  try {
    product = await getProductById(productIdNum)
    if (!product) {
      notFound()
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load product'
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
            Error Loading Product
          </styled.h3>
          <styled.p fontSize="sm" color="red.700">
            {error}
          </styled.p>
        </Stack>
      </Box>
    )
  }

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} projectId={projectIdNum} />
}
