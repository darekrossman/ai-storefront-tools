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
            {/* Basic Information */}
            <Stack gap={4}>
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                Basic Information
              </styled.h3>

              <Stack gap={3}>
                <Box>
                  <styled.label
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    display="block"
                    mb={1}
                  >
                    Brand Name
                  </styled.label>
                  <styled.p fontSize="sm" color="gray.900">
                    {brand.name}
                  </styled.p>
                </Box>

                {brand.category && (
                  <Box>
                    <styled.label
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.700"
                      display="block"
                      mb={1}
                    >
                      Category
                    </styled.label>
                    <styled.p fontSize="sm" color="gray.900">
                      {brand.category}
                    </styled.p>
                  </Box>
                )}

                <Box>
                  <styled.label
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    display="block"
                    mb={1}
                  >
                    Status
                  </styled.label>
                  <styled.span
                    fontSize="sm"
                    fontWeight="medium"
                    px={2}
                    py={1}
                    bg={
                      brand.status === 'active'
                        ? 'green.100'
                        : brand.status === 'draft'
                          ? 'yellow.100'
                          : 'gray.100'
                    }
                    color={
                      brand.status === 'active'
                        ? 'green.700'
                        : brand.status === 'draft'
                          ? 'yellow.700'
                          : 'gray.700'
                    }
                    borderRadius="md"
                  >
                    {brand.status}
                  </styled.span>
                </Box>

                {brand.mission && (
                  <Box>
                    <styled.label
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.700"
                      display="block"
                      mb={1}
                    >
                      Mission
                    </styled.label>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {brand.mission}
                    </styled.p>
                  </Box>
                )}
              </Stack>
            </Stack>

            {/* Metadata */}
            <Stack gap={4}>
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                Metadata
              </styled.h3>

              <Stack gap={3}>
                <Box>
                  <styled.label
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    display="block"
                    mb={1}
                  >
                    Created
                  </styled.label>
                  <styled.p fontSize="sm" color="gray.900">
                    {new Date(brand.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </styled.p>
                </Box>

                <Box>
                  <styled.label
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    display="block"
                    mb={1}
                  >
                    Last Updated
                  </styled.label>
                  <styled.p fontSize="sm" color="gray.900">
                    {new Date(brand.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </styled.p>
                </Box>

                <Box>
                  <styled.label
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    display="block"
                    mb={1}
                  >
                    Brand ID
                  </styled.label>
                  <styled.p fontSize="sm" color="gray.500">
                    {brand.id}
                  </styled.p>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Quick Actions */}
      <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
        <Stack gap={6}>
          <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
            Quick Actions
          </styled.h3>

          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={4}
          >
            <Link href={`/brands/${brand.slug}/catalogs/create`}>
              <Box
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  borderColor: 'green.300',
                  bg: 'green.50',
                }}
              >
                <Stack gap={2}>
                  <styled.div fontSize="sm" fontWeight="medium" color="gray.900">
                    Create Product Catalog
                  </styled.div>
                  <styled.div fontSize="xs" color="gray.600">
                    Start organizing your products
                  </styled.div>
                </Stack>
              </Box>
            </Link>

            <Link href={`/brands/${brand.slug}/products/new`}>
              <Box
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  borderColor: 'purple.300',
                  bg: 'purple.50',
                }}
              >
                <Stack gap={2}>
                  <styled.div fontSize="sm" fontWeight="medium" color="gray.900">
                    Add Product
                  </styled.div>
                  <styled.div fontSize="xs" color="gray.600">
                    Add a product to this brand
                  </styled.div>
                </Stack>
              </Box>
            </Link>
          </Box>

          {stats.catalogsCount === 0 && (
            <Box
              bg="blue.50"
              border="1px solid"
              borderColor="blue.200"
              borderRadius="md"
              p={4}
            >
              <Stack gap={2}>
                <styled.div fontSize="sm" fontWeight="medium" color="blue.900">
                  Get Started
                </styled.div>
                <styled.div fontSize="xs" color="blue.700">
                  Create your first product catalog to begin organizing products for this
                  brand.
                </styled.div>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </Stack>
  )
}
