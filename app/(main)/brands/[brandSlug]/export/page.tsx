import { notFound } from 'next/navigation'
import { Container, Stack, styled } from '@/styled-system/jsx'
import { getBrandBySlugAction } from '@/actions/brands'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import { getProductsByBrand } from '@/actions/products'
import ExportForm from './export-form'
import ImageExportForm from './image-export-form'

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
  const products = await getProductsByBrand(brand.id)

  return (
    <Stack gap={12}>
      {/* Header */}
      <Stack gap={2}>
        <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
          Export Data
        </styled.h1>
        <styled.p fontSize="sm" color="gray.600">
          Export products and images from {brand.name}
        </styled.p>
      </Stack>

      {/* Export Sections */}
      <Stack gap={8}>
        {/* Shopify CSV Export Section */}
        <Stack gap={4}>
          <Stack gap={2}>
            <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
              Export Products to Shopify CSV
            </styled.h2>
            <styled.p fontSize="sm" color="gray.600">
              Export products from selected catalogs in Shopify CSV format for easy import
              into your store.
            </styled.p>
          </Stack>
          <ExportForm catalogs={catalogs} />
        </Stack>

        {/* Image Export Section */}
        <Stack gap={4}>
          <Stack gap={2}>
            <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
              Export Product Images
            </styled.h2>
            <styled.p fontSize="sm" color="gray.600">
              Download all product images from {brand.name} as a ZIP file.
            </styled.p>
          </Stack>
          <ImageExportForm brand={brand} products={products} />
        </Stack>
      </Stack>
    </Stack>
  )
}
