import { notFound } from 'next/navigation'
import { Box, Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { getBrandAction } from '@/actions/brands'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import type { Brand, ProductCatalog } from '@/lib/supabase/database-types'

interface BrandDetailsPageProps {
  params: Promise<{
    id: string
    brandId: string
  }>
}

function getLogoUrl(brand: Brand): string | null {
  const visualIdentity = brand.visual_identity as any
  return visualIdentity?.logo_public_url || null
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return { bg: 'green.100', color: 'green.700' }
    case 'draft':
      return { bg: 'yellow.100', color: 'yellow.700' }
    case 'archived':
      return { bg: 'gray.100', color: 'gray.700' }
    default:
      return { bg: 'gray.100', color: 'gray.700' }
  }
}

export default async function BrandDetailsPage({ params }: BrandDetailsPageProps) {
  const { id, brandId } = await params
  const projectId = parseInt(id)
  const brandIdNum = parseInt(brandId)

  if (isNaN(projectId) || isNaN(brandIdNum)) {
    notFound()
  }

  // Get brand details
  const brand = await getBrandAction(brandIdNum)

  if (!brand) {
    notFound()
  }

  // Get associated product catalogs
  let catalogs: ProductCatalog[] = []
  try {
    catalogs = await getProductCatalogsAction(brandIdNum)
  } catch (error) {
    console.error('Error loading catalogs:', error)
    // Continue without catalogs rather than failing
  }

  const logoUrl = getLogoUrl(brand)
  const statusColor = getStatusColor(brand.status)

  return (
    <Container py={8}>
      <Stack gap={8}>
        {/* Header */}
        <Flex justify="space-between" align="start" gap={4}>
          <Flex align="center" gap={4}>
            {/* Logo */}
            <Box
              w={16}
              h={16}
              borderRadius="lg"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              flexShrink={0}
            >
              {logoUrl ? (
                <styled.img
                  src={logoUrl}
                  alt={`${brand.name} logo`}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              ) : (
                <styled.div fontSize="lg" color="gray.500" textAlign="center">
                  🏷️
                </styled.div>
              )}
            </Box>

            {/* Brand Info */}
            <Stack gap={2}>
              <styled.h1
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="bold"
                color="gray.900"
              >
                {brand.name}
              </styled.h1>

              <Flex align="center" gap={3}>
                <styled.span
                  fontSize="sm"
                  fontWeight="medium"
                  px={3}
                  py={1}
                  borderRadius="md"
                  bg={statusColor.bg}
                  color={statusColor.color}
                >
                  {brand.status}
                </styled.span>

                {brand.tagline && (
                  <styled.p fontSize="md" color="gray.600" fontStyle="italic">
                    "{brand.tagline}"
                  </styled.p>
                )}
              </Flex>
            </Stack>
          </Flex>

          {/* Actions */}
          <Flex gap={2}>
            <Link href={`/dashboard/projects/${projectId}/brands/${brand.id}/edit`}>
              <styled.button
                px={4}
                py={2}
                bg="white"
                color="gray.700"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="lg"
                fontSize="sm"
                fontWeight="medium"
                cursor="pointer"
                _hover={{
                  bg: 'gray.50',
                  borderColor: 'gray.400',
                }}
                transition="all 0.2s"
              >
                Edit Brand
              </styled.button>
            </Link>

            <Link
              href={`/dashboard/projects/${projectId}/catalogs/new?brandId=${brand.id}`}
            >
              <styled.button
                px={4}
                py={2}
                bg="blue.600"
                color="white"
                borderRadius="lg"
                fontSize="sm"
                fontWeight="medium"
                cursor="pointer"
                _hover={{
                  bg: 'blue.700',
                }}
                transition="all 0.2s"
              >
                Create Catalog
              </styled.button>
            </Link>
          </Flex>
        </Flex>

        {/* Content */}
        <Box display="grid" gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Main Content */}
          <Stack gap={6}>
            {/* Brand Guidelines */}
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
            >
              <Stack gap={6}>
                <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
                  Brand Guidelines
                </styled.h2>

                <Stack gap={4}>
                  {/* Mission */}
                  {brand.mission && (
                    <Stack gap={2}>
                      <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                        Mission Statement
                      </styled.h3>
                      <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                        {brand.mission}
                      </styled.p>
                    </Stack>
                  )}

                  {/* Vision */}
                  {brand.vision && (
                    <Stack gap={2}>
                      <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                        Vision Statement
                      </styled.h3>
                      <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                        {brand.vision}
                      </styled.p>
                    </Stack>
                  )}

                  {/* Values */}
                  {brand.values && brand.values.length > 0 && (
                    <Stack gap={2}>
                      <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                        Brand Values
                      </styled.h3>
                      <Flex gap={2} wrap="wrap">
                        {brand.values.map((value: string, index: number) => (
                          <styled.span
                            key={index}
                            fontSize="sm"
                            px={3}
                            py={1}
                            bg="blue.50"
                            color="blue.700"
                            borderRadius="md"
                            fontWeight="medium"
                          >
                            {value}
                          </styled.span>
                        ))}
                      </Flex>
                    </Stack>
                  )}

                  {/* Empty State */}
                  {!brand.mission &&
                    !brand.vision &&
                    (!brand.values || brand.values.length === 0) && (
                      <Box textAlign="center" py={8}>
                        <Stack gap={2} align="center">
                          <styled.h3 fontSize="md" fontWeight="medium" color="gray.900">
                            No Brand Guidelines Yet
                          </styled.h3>
                          <styled.p fontSize="sm" color="gray.600">
                            Add mission, vision, and values to define your brand identity.
                          </styled.p>
                          <Link
                            href={`/dashboard/projects/${projectId}/brands/${brand.id}/edit`}
                          >
                            <styled.button
                              px={4}
                              py={2}
                              bg="blue.600"
                              color="white"
                              borderRadius="lg"
                              fontSize="sm"
                              fontWeight="medium"
                              cursor="pointer"
                              _hover={{
                                bg: 'blue.700',
                              }}
                              transition="all 0.2s"
                              mt={2}
                            >
                              Add Guidelines
                            </styled.button>
                          </Link>
                        </Stack>
                      </Box>
                    )}
                </Stack>
              </Stack>
            </Box>

            {/* Product Catalogs */}
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
            >
              <Stack gap={6}>
                <Flex justify="space-between" align="center">
                  <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
                    Product Catalogs
                  </styled.h2>
                  <Link
                    href={`/dashboard/projects/${projectId}/catalogs/new?brandId=${brand.id}`}
                  >
                    <styled.button
                      px={3}
                      py={1}
                      bg="blue.600"
                      color="white"
                      borderRadius="md"
                      fontSize="sm"
                      fontWeight="medium"
                      cursor="pointer"
                      _hover={{
                        bg: 'blue.700',
                      }}
                      transition="all 0.2s"
                    >
                      Add Catalog
                    </styled.button>
                  </Link>
                </Flex>

                {catalogs.length > 0 ? (
                  <Stack gap={3}>
                    {catalogs.map((catalog) => (
                      <Link
                        key={catalog.id}
                        href={`/dashboard/projects/${projectId}/catalogs/${catalog.id}`}
                      >
                        <Box
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="md"
                          p={4}
                          cursor="pointer"
                          transition="all 0.2s"
                          _hover={{
                            borderColor: 'blue.300',
                            bg: 'blue.50',
                          }}
                        >
                          <Flex justify="space-between" align="start" gap={3}>
                            <Stack gap={1}>
                              <styled.h3
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.900"
                              >
                                {catalog.name}
                              </styled.h3>
                              {catalog.description && (
                                <styled.p fontSize="xs" color="gray.600">
                                  {catalog.description}
                                </styled.p>
                              )}
                            </Stack>
                            <styled.span fontSize="xs" color="gray.500" flexShrink={0}>
                              {catalog.total_products || 0} products
                            </styled.span>
                          </Flex>
                        </Box>
                      </Link>
                    ))}
                  </Stack>
                ) : (
                  <Box textAlign="center" py={8}>
                    <Stack gap={2} align="center">
                      <styled.h3 fontSize="md" fontWeight="medium" color="gray.900">
                        No Product Catalogs Yet
                      </styled.h3>
                      <styled.p fontSize="sm" color="gray.600">
                        Create your first product catalog to start organizing products.
                      </styled.p>
                      <Link
                        href={`/dashboard/projects/${projectId}/catalogs/new?brandId=${brand.id}`}
                      >
                        <styled.button
                          px={4}
                          py={2}
                          bg="blue.600"
                          color="white"
                          borderRadius="lg"
                          fontSize="sm"
                          fontWeight="medium"
                          cursor="pointer"
                          _hover={{
                            bg: 'blue.700',
                          }}
                          transition="all 0.2s"
                          mt={2}
                        >
                          Create First Catalog
                        </styled.button>
                      </Link>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>

          {/* Sidebar */}
          <Stack gap={6}>
            {/* Brand Info */}
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
            >
              <Stack gap={4}>
                <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                  Brand Information
                </styled.h3>

                <Stack gap={3}>
                  <Box>
                    <styled.label
                      fontSize="xs"
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
                      borderRadius="sm"
                      bg={statusColor.bg}
                      color={statusColor.color}
                    >
                      {brand.status}
                    </styled.span>
                  </Box>

                  <Box>
                    <styled.label
                      fontSize="xs"
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
                      })}
                    </styled.p>
                  </Box>

                  <Box>
                    <styled.label
                      fontSize="xs"
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
                      })}
                    </styled.p>
                  </Box>

                  <Box>
                    <styled.label
                      fontSize="xs"
                      fontWeight="medium"
                      color="gray.700"
                      display="block"
                      mb={1}
                    >
                      Catalogs
                    </styled.label>
                    <styled.p fontSize="sm" color="gray.900">
                      {catalogs.length} {catalogs.length === 1 ? 'catalog' : 'catalogs'}
                    </styled.p>
                  </Box>
                </Stack>
              </Stack>
            </Box>

            {/* Quick Actions */}
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
            >
              <Stack gap={4}>
                <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                  Quick Actions
                </styled.h3>

                <Stack gap={2}>
                  <Link href={`/dashboard/projects/${projectId}/brands/${brand.id}/edit`}>
                    <styled.button
                      w="full"
                      px={3}
                      py={2}
                      bg="gray.50"
                      color="gray.700"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      fontSize="sm"
                      fontWeight="medium"
                      cursor="pointer"
                      _hover={{
                        bg: 'gray.100',
                      }}
                      transition="all 0.2s"
                    >
                      Edit Brand Details
                    </styled.button>
                  </Link>

                  <Link
                    href={`/dashboard/projects/${projectId}/catalogs/new?brandId=${brand.id}`}
                  >
                    <styled.button
                      w="full"
                      px={3}
                      py={2}
                      bg="blue.50"
                      color="blue.700"
                      border="1px solid"
                      borderColor="blue.200"
                      borderRadius="md"
                      fontSize="sm"
                      fontWeight="medium"
                      cursor="pointer"
                      _hover={{
                        bg: 'blue.100',
                      }}
                      transition="all 0.2s"
                    >
                      Create Product Catalog
                    </styled.button>
                  </Link>

                  <Link href={`/dashboard/projects/${projectId}/brands`}>
                    <styled.button
                      w="full"
                      px={3}
                      py={2}
                      bg="white"
                      color="gray.600"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      fontSize="sm"
                      fontWeight="medium"
                      cursor="pointer"
                      _hover={{
                        bg: 'gray.50',
                      }}
                      transition="all 0.2s"
                    >
                      Back to Brands
                    </styled.button>
                  </Link>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Container>
  )
}

export async function generateMetadata({ params }: BrandDetailsPageProps) {
  const { brandId } = await params
  const brandIdNum = parseInt(brandId)

  if (isNaN(brandIdNum)) {
    return {
      title: 'Brand Details - Storefront Tools',
    }
  }

  const brand = await getBrandAction(brandIdNum)

  return {
    title: brand
      ? `${brand.name} - Brand Details - Storefront Tools`
      : 'Brand Details - Storefront Tools',
    description: brand
      ? `View and manage ${brand.name} brand details and product catalogs`
      : 'View brand details and product catalogs',
  }
}
