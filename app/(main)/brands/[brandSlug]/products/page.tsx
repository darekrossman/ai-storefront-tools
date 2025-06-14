import { Box, Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import { getProductsByBrand, getProductsByCatalog } from '@/actions/products'
import type { ProductWithRelations } from '@/actions/products'
import { button } from '@/components/ui/button'
import { getBrandBySlugAction } from '@/actions/brands'
import { PageContainer } from '@/components/ui/page-container'
import ProductsTab from '@/components/catalogs/products-tab'

interface BrandProductsPageProps {
  params: Promise<{
    brandSlug: string
  }>
}

// Extended type to include catalog information
interface ProductWithContext extends ProductWithRelations {
  catalog?: {
    catalog_id: string
    name: string
  }
}

export default async function BrandProductsPage({ params }: BrandProductsPageProps) {
  const { brandSlug } = await params
  const brand = await getBrandBySlugAction(brandSlug)

  if (!brand) {
    notFound()
  }

  const catalogs = await getProductCatalogsAction(brand.id)
  const products = await getProductsByBrand(brand.id)

  const hasCatalogs = catalogs.length > 0

  return (
    <PageContainer>
      <Flex justify="space-between" align="flex-start">
        <Stack gap={2} mb={8}>
          <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
            All Products
          </styled.h1>
          <styled.p fontSize="sm" color="gray.600">
            {products.length} products across all catalogs for {brand.name}
          </styled.p>
        </Stack>
        <Link
          href={`/brands/${brand.slug}/products/create`}
          className={button({ variant: 'secondary', size: 'xs' })}
        >
          Create Products
        </Link>
      </Flex>

      {/* Empty State */}
      {products.length === 0 ? (
        <Box
          bg="white"
          border="2px dashed"
          borderColor="gray.200"
          borderRadius="lg"
          p={12}
          textAlign="center"
        >
          <Stack gap={4} align="center" maxW="md" mx="auto">
            <Box
              w={16}
              h={16}
              bg="gray.100"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <styled.div fontSize="2xl" color="gray.400">
                📦
              </styled.div>
            </Box>

            <Stack gap={2} textAlign="center">
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                No products yet
              </styled.h3>

              {!hasCatalogs && (
                <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                  Create a product catalog first, then generate products to start building
                  your inventory.
                </styled.p>
              )}

              {hasCatalogs && (
                <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                  Generate products to start building your inventory.
                </styled.p>
              )}
            </Stack>

            {!hasCatalogs && (
              <Link href={`/brands/${brand.slug}/catalogs/create`} className={button()}>
                Create a catalog
              </Link>
            )}

            {hasCatalogs && (
              <Link href={`/brands/${brand.slug}/products/create`} className={button()}>
                Generate Products
              </Link>
            )}
          </Stack>
        </Box>
      ) : (
        <ProductsTab brand={brand} />
      )}
    </PageContainer>
  )
}
