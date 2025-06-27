import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import type { ProductCatalog } from '@/lib/supabase/database-types'
import { button } from '@/components/ui/button'
import { getBrandBySlugAction } from '@/actions/brands'
import { PageContainer } from '@/components/ui/page-container'
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from '@/components/brands/page-header'
import { Suspense } from 'react'
import { CreateCatalogButton } from '@/components/catalogs/client-components'
import { ContentContainer } from '@/components/brands/content-container'
import CatalogList from '@/components/catalogs/catalog-list'

interface BrandCatalogsPageProps {
  params: Promise<{
    brandSlug: string
  }>
}

export default async function BrandCatalogsPage({ params }: BrandCatalogsPageProps) {
  const { brandSlug } = await params

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderTitle>Product Catalogs</PageHeaderTitle>
        <PageHeaderSubtitle>
          Manage your brand's categories and collections
        </PageHeaderSubtitle>
        <PageHeaderActions>
          <Suspense>
            <CreateCatalogButton>Create Catalog</CreateCatalogButton>
          </Suspense>
        </PageHeaderActions>
      </PageHeader>

      <ContentContainer>
        <Suspense>
          <CatalogList brandSlug={brandSlug} />
        </Suspense>
      </ContentContainer>
    </PageContainer>
  )
}
