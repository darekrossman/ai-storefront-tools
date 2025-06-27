import { Stack } from '@/styled-system/jsx'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductCatalogAction } from '@/actions/product-catalogs'
import { getProductsByCatalog } from '@/actions/products'
import { getCategoriesAction } from '@/actions/categories'
import CatalogDetailTabs from '@/components/catalogs/catalog-detail-tabs'
import CategoriesTab from '@/components/catalogs/categories-tab'
import ProductsTab from '@/components/catalogs/products-tab'
import { button } from '@/components/ui/button'
import { getBrandBySlugAction } from '@/actions/brands'
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from '@/components/brands/page-header'
import { ContentContainer } from '@/components/brands/content-container'

interface CatalogDetailsPageProps {
  params: Promise<{
    brandSlug: string
    catalogId: string
  }>
}

export default async function CatalogDetailsPage({ params }: CatalogDetailsPageProps) {
  const { brandSlug, catalogId } = await params
  const brand = await getBrandBySlugAction(brandSlug)

  if (!brand) {
    notFound()
  }

  const catalog = await getProductCatalogAction(catalogId)

  if (!catalog) {
    notFound()
  }

  const products = await getProductsByCatalog(catalogId)
  const categories = await getCategoriesAction(catalogId)

  return (
    <Stack gap={8}>
      <PageHeader>
        <PageHeaderTitle>{catalog.name}</PageHeaderTitle>
        <PageHeaderSubtitle>{catalog.description}</PageHeaderSubtitle>
        <PageHeaderActions>
          <Link
            href={`/brands/${brand.slug}/catalogs/${catalog.slug}/settings`}
            className={button({ variant: 'secondary', size: 'xs' })}
          >
            Settings
          </Link>
        </PageHeaderActions>
      </PageHeader>

      <ContentContainer>
        <CatalogDetailTabs
          productsCount={products.length}
          categoriesTab={<CategoriesTab catalogId={catalogId} categories={categories} />}
          productsTab={<ProductsTab catalogId={catalogId} brand={brand} />}
        />
      </ContentContainer>
    </Stack>
  )
}
