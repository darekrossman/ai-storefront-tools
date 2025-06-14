import { notFound } from 'next/navigation'
import { Container, Stack, styled } from '@/styled-system/jsx'
import { getBrandBySlugAction } from '@/actions/brands'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import ExportForm from './export-form'

interface ExportPageProps {
  params: Promise<{
    brandSlug: string
  }>
}

export default async function ExportPage({ params }: ExportPageProps) {
  const { brandSlug } = await params
  const brand = await getBrandBySlugAction(brandSlug)

  if (!brand) {
    notFound()
  }

  const catalogs = await getProductCatalogsAction(brand.id)

  return (
    <Stack gap={8}>
      {/* Header */}
      <Stack gap={2}>
        <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
          Export Products
        </styled.h1>
        <styled.p fontSize="sm" color="gray.600">
          Export products from {brand.name} catalogs to Shopify CSV format
        </styled.p>
      </Stack>

      {/* Export Form */}
      <ExportForm catalogs={catalogs} />
    </Stack>
  )
}
