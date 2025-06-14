import { getBrandBySlugAction } from '@/actions/brands'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import ProductsGeneration from '@/components/products/products-generation'
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

  return <ProductsGeneration catalogs={catalogs} />
}
