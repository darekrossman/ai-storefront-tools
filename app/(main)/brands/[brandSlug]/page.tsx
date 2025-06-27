import { notFound } from 'next/navigation'
import { Box, Flex, Grid, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { button } from '@/components/ui/button'
import { getBrandBySlugAction } from '@/actions/brands'
import { getProductCatalogsAction, getProductsByBrand } from '@/actions'
import BrandDetails from '@/components/brands/brand-details'
import { PageContainer } from '@/components/ui/page-container'
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from '@/components/brands/page-header'
import { ContentContainer } from '@/components/brands/content-container'

interface BrandPageProps {
  params: Promise<{
    brandSlug: string
  }>
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brandSlug } = await params
  const brand = await getBrandBySlugAction(brandSlug)

  if (!brand) {
    notFound()
  }

  const catalogs = await getProductCatalogsAction(brand.id)
  const products = await getProductsByBrand(brand.id)

  const stats = {
    catalogsCount: catalogs?.length || 0,
    productsCount: products?.length || 0,
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderTitle>{brand.name}</PageHeaderTitle>
        <PageHeaderSubtitle>{brand.tagline}</PageHeaderSubtitle>
        <PageHeaderActions>
          <Link
            href={`/brands/${brand.slug}/settings`}
            className={button({ variant: 'secondary', size: 'sm' })}
          >
            Settings
          </Link>
        </PageHeaderActions>
      </PageHeader>

      <ContentContainer>
        <Grid
          gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }}
          gap={8}
          alignItems="start"
        >
          {/* Brand Details */}
          <Box bg="white" boxShadow="xs" p={6}>
            <BrandDetails brand={brand} />
          </Box>

          <Box bg="white" boxShadow="xs" p={6}>
            <Stack gap={4}>
              <styled.h3 fontSize="md" fontWeight="semibold" color="fg">
                Brand Metadata
              </styled.h3>
              <Grid gridTemplateColumns="max-content 1fr" gap={4}>
                <styled.p fontSize="xs" fontWeight="semibold" color="fg.muted">
                  ID:
                </styled.p>

                <styled.p fontSize="xs">{brand.id}</styled.p>
                <styled.p fontSize="xs" fontWeight="semibold" color="fg.muted">
                  Slug:
                </styled.p>
                <styled.p fontSize="xs">{brand.slug}</styled.p>

                <styled.p fontSize="xs" fontWeight="semibold" color="fg.muted">
                  Created:
                </styled.p>
                <styled.p fontSize="xs">
                  {new Date(brand.created_at).toLocaleString()}
                </styled.p>

                <styled.p fontSize="xs" fontWeight="semibold" color="fg.muted">
                  Updated:
                </styled.p>
                <styled.p fontSize="xs">
                  {new Date(brand.updated_at).toLocaleString()}
                </styled.p>

                <styled.p fontSize="xs" fontWeight="semibold" color="fg.muted">
                  Status:
                </styled.p>
                <styled.p fontSize="xs">{brand.status}</styled.p>

                <styled.div fontSize="xs" fontWeight="semibold" color="fg.muted">
                  Catalogs:
                </styled.div>
                <styled.p fontSize="xs">{stats.catalogsCount}</styled.p>

                <styled.div fontSize="xs" fontWeight="semibold" color="fg.muted">
                  Products:
                </styled.div>
                <styled.p fontSize="xs">{stats.productsCount}</styled.p>
              </Grid>
            </Stack>
          </Box>
        </Grid>
      </ContentContainer>
    </PageContainer>
  )
}
