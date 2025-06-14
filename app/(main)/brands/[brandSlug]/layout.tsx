import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Box, Grid } from '@/styled-system/jsx'
import { BrandContextProvider } from '@/components/brand-context'
import { PropsWithChildren } from 'react'
import { getBrandBySlugAction } from '@/actions/brands'
import { BrandNavigation } from '@/components/brands/brand-navigation'
import { PageContainer } from '@/components/ui/page-container'

interface BrandLayoutProps {
  params: Promise<{
    brandSlug: string
  }>
}

export default async function BrandLayout({
  children,
  params,
}: PropsWithChildren<BrandLayoutProps>) {
  const { brandSlug } = await params
  const brand = await getBrandBySlugAction(brandSlug)

  if (!brand) {
    notFound()
  }

  return (
    <BrandContextProvider brand={brand}>
      <Grid gridTemplateColumns="140px 1fr" gap="0" flex="1">
        <Box borderRight="1px solid" borderColor="gray.200">
          <Box position="sticky" top="var(--header-height)">
            <BrandNavigation />
          </Box>
        </Box>
        <PageContainer py="8" px="8">
          {children}
        </PageContainer>
      </Grid>
    </BrandContextProvider>
  )
}
