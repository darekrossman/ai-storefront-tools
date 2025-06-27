import { redirect } from 'next/navigation'
import { Container, Stack, styled } from '@/styled-system/jsx'
import { getProductCatalogAction } from '@/actions/product-catalogs'
import CatalogSettingsForm from './catalog-settings-form'
import { ContentContainer } from '@/components/brands/content-container'
import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from '@/components/brands/page-header'
import { PageContainer } from '@/components/ui/page-container'

interface CatalogSettingsPageProps {
  params: Promise<{
    brandSlug: string
    catalogId: string
  }>
}

export default async function CatalogSettingsPage({ params }: CatalogSettingsPageProps) {
  const { brandSlug, catalogId } = await params

  // Fetch catalog data
  const catalog = await getProductCatalogAction(catalogId)

  if (!catalog) {
    redirect(`/dashboard/brands/${brandSlug}/catalogs`)
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderTitle>Catalog Settings</PageHeaderTitle>
        <PageHeaderSubtitle>
          Manage your catalog configuration and details
        </PageHeaderSubtitle>
      </PageHeader>

      <ContentContainer>
        <CatalogSettingsForm catalog={catalog} />
      </ContentContainer>
    </PageContainer>
  )
}
