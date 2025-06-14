import { notFound } from 'next/navigation'
import { Container } from '@/styled-system/jsx'
import CatalogGeneration from '@/components/catalogs/catalog-generation'
import { getBrandBySlugAction } from '@/actions/brands'

interface CreateCatalogPageProps {
  params: Promise<{
    brandSlug: string
  }>
}

export default async function CreateCatalogPage({ params }: CreateCatalogPageProps) {
  const { brandSlug } = await params
  const brand = await getBrandBySlugAction(brandSlug)

  if (!brand) {
    notFound()
  }

  return (
    <Container py={8}>
      <CatalogGeneration />
    </Container>
  )
}
