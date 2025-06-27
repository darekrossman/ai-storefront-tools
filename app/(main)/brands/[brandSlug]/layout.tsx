import { notFound } from 'next/navigation'
import { BrandContextProvider } from '@/components/brand-context'
import { PropsWithChildren } from 'react'
import { getBrandBySlugAction } from '@/actions/brands'
import { BrandNavigation } from '@/components/brands/brand-navigation'
import { PageContainer } from '@/components/ui/page-container'
import { HeaderBar } from '@/components/layout/header-bar'

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
      <HeaderBar>
        <BrandNavigation />
      </HeaderBar>
      <PageContainer>{children}</PageContainer>
    </BrandContextProvider>
  )
}
