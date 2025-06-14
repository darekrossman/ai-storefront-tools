import { notFound, redirect } from 'next/navigation'
import { Box, Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { button } from '@/components/ui/button'
import { getBrandBySlugAction } from '@/actions/brands'
import { getProductCatalogsAction, getProductsByBrand } from '@/actions'

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
        <Stack gap={2}>
          <styled.h1
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="bold"
            color="gray.900"
          >
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
            className={button({ variant: 'secondary' })}
          >
            Settings
          </Link>
        </Flex>
      </Flex>

      {/* Quick Stats Cards */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }}
        gap={4}
      >
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
            <Stack gap={2}>
              <styled.div fontSize="2xl" fontWeight="bold" color="green.600">
                {stats.catalogsCount}
              </styled.div>
              <styled.div fontSize="sm" fontWeight="medium" color="gray.900">
                Product Catalogs
              </styled.div>
              <styled.div fontSize="xs" color="gray.600">
                Product collections
              </styled.div>
            </Stack>
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
            <Stack gap={2}>
              <styled.div fontSize="2xl" fontWeight="bold" color="purple.600">
                {stats.productsCount}
              </styled.div>
              <styled.div fontSize="sm" fontWeight="medium" color="gray.900">
                Products
              </styled.div>
              <styled.div fontSize="xs" color="gray.600">
                Total products
              </styled.div>
            </Stack>
          </Box>
        </Link>
      </Box>

      {/* Brand Details */}
      <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
        <Stack gap={6}>
          <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
            Brand Details
          </styled.h2>

          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={6}
          >
            {/* Brand Details */}
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}
