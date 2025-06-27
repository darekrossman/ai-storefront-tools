import { notFound } from 'next/navigation'
import { getProductById } from '@/actions/products'
import ProductDetails from '@/components/products/product-details'
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from '@/components/brands/page-header'
import { PageContainer } from '@/components/ui/page-container'
import { ContentContainer } from '@/components/brands/content-container'
import Link from 'next/link'
import { button } from '@/components/ui/button'

interface ProductDetailsPageProps {
  params: Promise<{
    brandSlug: string
    productId: string
  }>
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { brandSlug, productId } = await params

  const product = await getProductById(parseInt(productId))

  if (!product) {
    notFound()
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderTitle>{product.name}</PageHeaderTitle>
        <PageHeaderSubtitle>{product.short_description}</PageHeaderSubtitle>
        <PageHeaderActions>
          <Link
            href={`/brands/${brandSlug}/products/${product.id}/edit`}
            className={button({ variant: 'secondary', size: 'sm' })}
          >
            Edit Product
          </Link>
        </PageHeaderActions>
      </PageHeader>

      <ContentContainer>
        <ProductDetails product={product} />
      </ContentContainer>
    </PageContainer>
  )
}
