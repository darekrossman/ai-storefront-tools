import { redirect } from 'next/navigation'
import { Container, Stack, styled } from '@/styled-system/jsx'
import { getProductCatalogAction } from '@/actions/product-catalogs'
import CatalogSettingsForm from './catalog-settings-form'

interface CatalogSettingsPageProps {
  params: {
    id: string
    catalogId: string
  }
}

export default async function CatalogSettingsPage({ params }: CatalogSettingsPageProps) {
  const brandId = parseInt(params.id)
  const catalogId = params.catalogId

  if (isNaN(brandId)) {
    redirect('/dashboard')
  }

  // Fetch catalog data
  const catalog = await getProductCatalogAction(catalogId)

  if (!catalog) {
    redirect(`/dashboard/brands/${brandId}/catalogs`)
  }

  return (
    <Container py={8}>
      <Stack gap={8}>
        {/* Header */}
        <Stack gap={2}>
          <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
            Catalog Settings
          </styled.h1>
          <styled.p fontSize="sm" color="gray.600">
            Manage your catalog configuration and details
          </styled.p>
        </Stack>

        {/* Settings Form */}
        <CatalogSettingsForm catalog={catalog} brandId={brandId} />
      </Stack>
    </Container>
  )
}
