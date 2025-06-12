import { notFound, redirect } from 'next/navigation'
import { Container } from '@/styled-system/jsx'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import CatalogGeneration from '@/components/catalogs/catalog-generation'

interface CreateCatalogPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CreateCatalogPage({ params }: CreateCatalogPageProps) {
  const { id } = await params
  const brandId = parseInt(id)

  if (isNaN(brandId)) {
    notFound()
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Get brand data and verify ownership
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('*')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single()

  if (brandError || !brand) {
    notFound()
  }

  return (
    <Container py={8}>
      <CatalogGeneration />
    </Container>
  )
}

export async function generateMetadata({
  params,
}: CreateCatalogPageProps): Promise<Metadata> {
  const { id } = await params
  const brandId = parseInt(id)

  if (isNaN(brandId)) {
    return {
      title: 'Create Catalog',
    }
  }

  const supabase = await createClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('name')
    .eq('id', brandId)
    .single()

  return {
    title: brand ? `Create Catalog - ${brand.name}` : 'Create Catalog',
    description: brand
      ? `Create a new product catalog for ${brand.name}`
      : 'Create a new product catalog',
  }
}
