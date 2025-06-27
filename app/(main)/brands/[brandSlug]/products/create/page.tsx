import { getBrandBySlugAction } from '@/actions/brands'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import { ContentContainer } from '@/components/brands/content-container'
import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from '@/components/brands/page-header'
import ProductsGeneration from '@/components/products/products-generation'
import { PageContainer } from '@/components/ui/page-container'
import { notFound } from 'next/navigation'

interface CreateProductsPageProps {
  params: Promise<{
    brandSlug: string
  }>
}

export default async function CreateProductsPage({ params }: CreateProductsPageProps) {
  const { brandSlug } = await params
  const brand = await getBrandBySlugAction(brandSlug)

  if (!brand) {
    notFound()
  }

  const catalogs = await getProductCatalogsAction(brand.id)

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderTitle>Generate Products</PageHeaderTitle>
        <PageHeaderSubtitle>
          Use AI to automatically create products for your catalog
        </PageHeaderSubtitle>
      </PageHeader>

      <ContentContainer>
        <ProductsGeneration catalogs={catalogs} />
      </ContentContainer>
    </PageContainer>
  )
}
