import { Box, Container, Stack, styled } from '@/styled-system/jsx'
import { notFound } from 'next/navigation'
import { getProductById } from '@/actions/products'
import ProductDetails from '@/components/products/product-details'

interface ProductDetailsPageProps {
  params: Promise<{
    brandSlug: string
    productId: string
  }>
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { productId } = await params

  const product = await getProductById(parseInt(productId))

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />
}
