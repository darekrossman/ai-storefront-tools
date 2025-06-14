import { notFound, redirect } from 'next/navigation'
import { Box, Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { button } from '@/components/ui/button'
import { getBrandBySlugAction } from '@/actions/brands'
import { getProductCatalogsAction, getProductsByBrand } from '@/actions'
import BrandDetails from '@/components/brands/brand-details'

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
    <Stack gap={8}>
      {/* Brand Header */}
      <Flex justify="space-between" align="start" gap={4}>
        <Stack gap={4}>
          <styled.h1 fontSize="3xl" fontWeight="bold" color="gray.900">
            {brand.name}
          </styled.h1>
          {brand.tagline && (
            <styled.p fontSize="lg" color="gray.600" lineHeight="relaxed">
              {brand.tagline}
            </styled.p>
          )}
        </Stack>

        <Flex gap={2}>
          <Link
            href={`/brands/${brand.slug}/settings`}
            className={button({ variant: 'secondary', size: 'sm' })}
          >
            Settings
          </Link>
        </Flex>
      </Flex>

      {/* Main Content Grid */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }}
        gap={8}
        alignItems="start"
      >
        {/* Brand Details */}
        <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
          <BrandDetails brand={brand} />
        </Box>

        {/* Quick Stats Cards */}
        <Stack gap={4}>
          <Link href={`/brands/${brand.slug}/catalogs`}>
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                borderColor: 'green.300',
                shadow: 'sm',
              }}
            >
              <Flex gap={4} align="center">
                <styled.div fontSize="lg" fontWeight="bold" color="blue.600">
                  {stats.catalogsCount}
                </styled.div>

                <styled.div fontSize="md" fontWeight="medium" color="gray.900">
                  Catalogs
                </styled.div>
              </Flex>
            </Box>
          </Link>

          <Link href={`/brands/${brand.slug}/products`}>
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                borderColor: 'purple.300',
                shadow: 'sm',
              }}
            >
              <Flex gap={4} align="center">
                <styled.div fontSize="lg" fontWeight="bold" color="green.600">
                  {stats.productsCount}
                </styled.div>

                <styled.div fontSize="md" fontWeight="medium" color="gray.900">
                  Products
                </styled.div>
              </Flex>
            </Box>
          </Link>
        </Stack>
      </Box>
    </Stack>
  )
}
