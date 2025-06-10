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

  // Parse JSONB fields
  const targetMarket = brand.target_market as any
  const brandPersonality = brand.brand_personality as any
  const positioning = brand.positioning as any
  const visualIdentity = brand.visual_identity as any

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

            {/* Target Market */}
            {targetMarket && Object.keys(targetMarket).length > 0 && (
              <Box
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                p={6}
              >
                <Stack gap={6}>
                  <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
                    Target Market
                  </styled.h2>

                  <Stack gap={4}>
                    {/* Demographics */}
                    {targetMarket.demographics && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Demographics
                        </styled.h3>
                        <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                          {targetMarket.demographics}
                        </styled.p>
                      </Stack>
                    )}

                    {/* Psychographics */}
                    {targetMarket.psychographics && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Psychographics
                        </styled.h3>
                        <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                          {targetMarket.psychographics}
                        </styled.p>
                      </Stack>
                    )}

                    {/* Pain Points */}
                    {targetMarket.pain_points && targetMarket.pain_points.length > 0 && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Pain Points
                        </styled.h3>
                        <Stack gap={1}>
                          {targetMarket.pain_points.map(
                            (point: string, index: number) => (
                              <styled.div
                                key={index}
                                fontSize="sm"
                                color="gray.900"
                                display="flex"
                                alignItems="start"
                                gap={2}
                              >
                                <styled.span color="red.500" mt="1px">
                                  •
                                </styled.span>
                                <styled.span>{point}</styled.span>
                              </styled.div>
                            ),
                          )}
                        </Stack>
                      </Stack>
                    )}

                    {/* Needs */}
                    {targetMarket.needs && targetMarket.needs.length > 0 && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Customer Needs
                        </styled.h3>
                        <Stack gap={1}>
                          {targetMarket.needs.map((need: string, index: number) => (
                            <styled.div
                              key={index}
                              fontSize="sm"
                              color="gray.900"
                              display="flex"
                              alignItems="start"
                              gap={2}
                            >
                              <styled.span color="green.500" mt="1px">
                                •
                              </styled.span>
                              <styled.span>{need}</styled.span>
                            </styled.div>
                          ))}
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Box>
            )}

            {/* Brand Personality */}
            {brandPersonality && Object.keys(brandPersonality).length > 0 && (
              <Box
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                p={6}
              >
                <Stack gap={6}>
                  <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
                    Brand Personality
                  </styled.h2>

                  <Stack gap={4}>
                    {/* Voice */}
                    {brandPersonality.voice && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Brand Voice
                        </styled.h3>
                        <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                          {brandPersonality.voice}
                        </styled.p>
                      </Stack>
                    )}

                    {/* Tone */}
                    {brandPersonality.tone && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Brand Tone
                        </styled.h3>
                        <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                          {brandPersonality.tone}
                        </styled.p>
                      </Stack>
                    )}

                    {/* Personality Traits */}
                    {brandPersonality.personality &&
                      brandPersonality.personality.length > 0 && (
                        <Stack gap={2}>
                          <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                            Personality Traits
                          </styled.h3>
                          <Flex gap={2} wrap="wrap">
                            {brandPersonality.personality.map(
                              (trait: string, index: number) => (
                                <styled.span
                                  key={index}
                                  fontSize="sm"
                                  px={3}
                                  py={1}
                                  bg="purple.50"
                                  color="purple.700"
                                  borderRadius="md"
                                  fontWeight="medium"
                                >
                                  {trait}
                                </styled.span>
                              ),
                            )}
                          </Flex>
                        </Stack>
                      )}

                    {/* Communication Style */}
                    {brandPersonality.communication_style && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Communication Style
                        </styled.h3>
                        <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                          {brandPersonality.communication_style}
                        </styled.p>
                      </Stack>
                    )}

                    {/* Brand Archetype */}
                    {brandPersonality.brand_archetype && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Brand Archetype
                        </styled.h3>
                        <styled.span
                          fontSize="sm"
                          fontWeight="medium"
                          px={3}
                          py={1}
                          bg="indigo.50"
                          color="indigo.700"
                          borderRadius="md"
                          display="inline-block"
                        >
                          {brandPersonality.brand_archetype}
                        </styled.span>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Box>
            )}

            {/* Market Positioning */}
            {positioning && Object.keys(positioning).length > 0 && (
              <Box
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                p={6}
              >
                <Stack gap={6}>
                  <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
                    Market Positioning
                  </styled.h2>

                  <Stack gap={4}>
                    {/* Category */}
                    {positioning.category && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Market Category
                        </styled.h3>
                        <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                          {positioning.category}
                        </styled.p>
                      </Stack>
                    )}

                    {/* Differentiation */}
                    {positioning.differentiation && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Key Differentiation
                        </styled.h3>
                        <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                          {positioning.differentiation}
                        </styled.p>
                      </Stack>
                    )}

                    {/* Competitive Advantages */}
                    {positioning.competitive_advantages &&
                      positioning.competitive_advantages.length > 0 && (
                        <Stack gap={2}>
                          <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                            Competitive Advantages
                          </styled.h3>
                          <Stack gap={1}>
                            {positioning.competitive_advantages.map(
                              (advantage: string, index: number) => (
                                <styled.div
                                  key={index}
                                  fontSize="sm"
                                  color="gray.900"
                                  display="flex"
                                  alignItems="start"
                                  gap={2}
                                >
                                  <styled.span color="blue.500" mt="1px">
                                    ✓
                                  </styled.span>
                                  <styled.span>{advantage}</styled.span>
                                </styled.div>
                              ),
                            )}
                          </Stack>
                        </Stack>
                      )}

                    {/* Price Point & Market Position */}
                    <Flex gap={6}>
                      {positioning.price_point && (
                        <Stack gap={2}>
                          <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                            Price Point
                          </styled.h3>
                          <styled.span
                            fontSize="sm"
                            fontWeight="medium"
                            px={3}
                            py={1}
                            bg="green.50"
                            color="green.700"
                            borderRadius="md"
                          >
                            {formatPrice(positioning.price_point)}
                          </styled.span>
                        </Stack>
                      )}

                      {positioning.market_position && (
                        <Stack gap={2} flex={1}>
                          <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                            Market Position
                          </styled.h3>
                          <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                            {positioning.market_position}
                          </styled.p>
                        </Stack>
                      )}
                    </Flex>
                  </Stack>
                </Stack>
              </Box>
            )}

            {/* Visual Identity */}
            {visualIdentity && Object.keys(visualIdentity).length > 0 && (
              <Box
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                p={6}
              >
                <Stack gap={6}>
                  <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
                    Visual Identity
                  </styled.h2>

                  <Stack gap={4}>
                    {/* Logo Description */}
                    {visualIdentity.logo_description && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Logo Description
                        </styled.h3>
                        <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                          {visualIdentity.logo_description}
                        </styled.p>
                      </Stack>
                    )}

                    {/* Color Scheme */}
                    {visualIdentity.color_scheme &&
                      visualIdentity.color_scheme.length > 0 && (
                        <Stack gap={2}>
                          <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                            Color Palette
                          </styled.h3>
                          <Flex gap={2} wrap="wrap">
                            {visualIdentity.color_scheme.map(
                              (color: string, index: number) => (
                                <styled.span
                                  key={index}
                                  fontSize="sm"
                                  px={3}
                                  py={1}
                                  bg="orange.50"
                                  color="orange.700"
                                  borderRadius="md"
                                  fontWeight="medium"
                                >
                                  {color}
                                </styled.span>
                              ),
                            )}
                          </Flex>
                        </Stack>
                      )}

                    {/* Typography */}
                    {visualIdentity.typography && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Typography
                        </styled.h3>
                        <Stack gap={2}>
                          {visualIdentity.typography.primary && (
                            <styled.div fontSize="sm" color="gray.900">
                              <styled.span fontWeight="medium">Primary: </styled.span>
                              {visualIdentity.typography.primary}
                            </styled.div>
                          )}
                          {visualIdentity.typography.secondary && (
                            <styled.div fontSize="sm" color="gray.900">
                              <styled.span fontWeight="medium">Secondary: </styled.span>
                              {visualIdentity.typography.secondary}
                            </styled.div>
                          )}
                        </Stack>
                      </Stack>
                    )}

                    {/* Imagery Guidelines */}
                    {visualIdentity.imagery && (
                      <Stack gap={2}>
                        <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                          Imagery Style
                        </styled.h3>
                        <Stack gap={2}>
                          {visualIdentity.imagery.style && (
                            <styled.div fontSize="sm" color="gray.900">
                              <styled.span fontWeight="medium">Style: </styled.span>
                              {visualIdentity.imagery.style}
                            </styled.div>
                          )}
                          {visualIdentity.imagery.mood && (
                            <styled.div fontSize="sm" color="gray.900">
                              <styled.span fontWeight="medium">Mood: </styled.span>
                              {visualIdentity.imagery.mood}
                            </styled.div>
                          )}
                          {visualIdentity.imagery.guidelines &&
                            visualIdentity.imagery.guidelines.length > 0 && (
                              <Stack gap={1}>
                                <styled.span
                                  fontSize="sm"
                                  fontWeight="medium"
                                  color="gray.700"
                                >
                                  Guidelines:
                                </styled.span>
                                {visualIdentity.imagery.guidelines.map(
                                  (guideline: string, index: number) => (
                                    <styled.div
                                      key={index}
                                      fontSize="sm"
                                      color="gray.900"
                                      display="flex"
                                      alignItems="start"
                                      gap={2}
                                    >
                                      <styled.span color="purple.500" mt="1px">
                                        •
                                      </styled.span>
                                      <styled.span>{guideline}</styled.span>
                                    </styled.div>
                                  ),
                                )}
                              </Stack>
                            )}
                        </Stack>
                      </Stack>
                    )}

                    {/* Design Principles */}
                    {visualIdentity.design_principles &&
                      visualIdentity.design_principles.length > 0 && (
                        <Stack gap={2}>
                          <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                            Design Principles
                          </styled.h3>
                          <Stack gap={1}>
                            {visualIdentity.design_principles.map(
                              (principle: string, index: number) => (
                                <styled.div
                                  key={index}
                                  fontSize="sm"
                                  color="gray.900"
                                  display="flex"
                                  alignItems="start"
                                  gap={2}
                                >
                                  <styled.span color="indigo.500" mt="1px">
                                    ✦
                                  </styled.span>
                                  <styled.span>{principle}</styled.span>
                                </styled.div>
                              ),
                            )}
                          </Stack>
                        </Stack>
                      )}
                  </Stack>
                </Stack>
              </Box>
            )}

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
