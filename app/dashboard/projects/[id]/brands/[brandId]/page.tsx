import { notFound } from 'next/navigation'
import { Box, Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { button } from '@/components/ui/button'
import { getBrandAction } from '@/actions/brands'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import type { Brand, ProductCatalog } from '@/lib/supabase/database-types'
import { BrandIdentityCard } from '@/components/brands/brand-identity-card'

interface BrandDetailsPageProps {
  params: Promise<{
    id: string
    brandId: string
  }>
}

function getLogoUrl(brand: Brand): string | null {
  // No logo field in new schema; always return null
  return null
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

function formatPrice(pricePoint: string) {
  return pricePoint.charAt(0).toUpperCase() + pricePoint.slice(1)
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
              {/* Always show placeholder since logo is not in schema */}
              <styled.div fontSize="lg" color="gray.500" textAlign="center">
                🏷️
              </styled.div>
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
            <Link
              href={`/dashboard/projects/${projectId}/brands/${brand.id}/edit`}
              className={button({ variant: 'secondary' })}
            >
              Edit Brand
            </Link>

            <Link
              href={`/dashboard/projects/${projectId}/catalogs/new?brandId=${brand.id}`}
              className={button()}
            >
              Create Catalog
            </Link>
          </Flex>
        </Flex>

        {/* Content */}
        <Box display="grid" gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Main Content */}
          <Stack gap={6}>
            <BrandIdentityCard brand={brand} projectId={projectId} />

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
                    className={button({ size: 'sm' })}
                  >
                    Add Catalog
                  </Link>
                </Flex>

                {catalogs.length > 0 ? (
                  <Stack gap={3}>
                    {catalogs.map((catalog) => (
                      <Link
                        key={catalog.catalog_id}
                        href={`/dashboard/projects/${projectId}/catalogs/${catalog.catalog_id}`}
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
                        className={button()}
                      >
                        Create First Catalog
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
                  <Link
                    href={`/dashboard/projects/${projectId}/brands/${brand.id}/edit`}
                    className={button({ variant: 'secondary', size: 'sm' })}
                  >
                    Edit Brand Details
                  </Link>

                  <Link
                    href={`/dashboard/projects/${projectId}/catalogs/new?brandId=${brand.id}`}
                    className={button({ variant: 'secondary', size: 'sm' })}
                  >
                    Create Product Catalog
                  </Link>

                  <Link
                    href={`/dashboard/projects/${projectId}/brands`}
                    className={button({ variant: 'secondary', size: 'sm' })}
                  >
                    Back to Brands
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
