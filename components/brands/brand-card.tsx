import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import type { Brand } from '@/lib/supabase/database-types'
import { deleteBrandAction } from '@/actions/brands'
import { deleteBrandLogoAction } from '@/actions/storage'

interface BrandCardProps {
  brand: Brand
  projectId: number
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

async function handleDeleteBrand(brandId: number, projectId: number) {
  'use server'
  try {
    // Delete logo first if it exists
    await deleteBrandLogoAction(projectId, brandId)
    // Then delete the brand
    await deleteBrandAction(brandId)
  } catch (error) {
    console.error('Error deleting brand:', error)
    throw error
  }
}

export default function BrandCard({ brand, projectId }: BrandCardProps) {
  const logoUrl = getLogoUrl(brand)
  const statusColor = getStatusColor(brand.status)

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        borderColor: 'gray.300',
        shadow: 'md',
      }}
    >
      {/* Header with Logo and Actions */}
      <Box p={4} borderBottom="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="start" gap={3}>
          <Flex align="center" gap={3} flex={1}>
            {/* Logo */}
            <Box
              w={12}
              h={12}
              borderRadius="md"
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
                <styled.div fontSize="xs" color="gray.500" textAlign="center">
                  No Logo
                </styled.div>
              )}
            </Box>

            {/* Brand Name and Status */}
            <Stack gap={1} flex={1} minW={0}>
              <styled.h3
                fontSize="md"
                fontWeight="semibold"
                color="gray.900"
                truncate
                title={brand.name}
              >
                {brand.name}
              </styled.h3>
              <styled.span
                fontSize="xs"
                fontWeight="medium"
                px={2}
                py={0.5}
                borderRadius="sm"
                bg={statusColor.bg}
                color={statusColor.color}
                w="fit-content"
              >
                {brand.status}
              </styled.span>
            </Stack>
          </Flex>

          {/* Actions */}
          <Flex gap={1} flexShrink={0}>
            <Link href={`/dashboard/projects/${projectId}/brands/${brand.id}/edit`}>
              <styled.button
                px={2}
                py={1}
                fontSize="xs"
                color="gray.600"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="sm"
                cursor="pointer"
                _hover={{
                  bg: 'gray.100',
                  borderColor: 'gray.300',
                }}
                transition="all 0.2s"
              >
                Edit
              </styled.button>
            </Link>

            <form action={handleDeleteBrand.bind(null, brand.id, projectId)}>
              <styled.button
                type="submit"
                px={2}
                py={1}
                fontSize="xs"
                color="red.600"
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
                borderRadius="sm"
                cursor="pointer"
                _hover={{
                  bg: 'red.100',
                  borderColor: 'red.300',
                }}
                transition="all 0.2s"
                onClick={(e) => {
                  if (
                    !confirm(
                      'Are you sure you want to delete this brand? This action cannot be undone.',
                    )
                  ) {
                    e.preventDefault()
                  }
                }}
              >
                Delete
              </styled.button>
            </form>
          </Flex>
        </Flex>
      </Box>

      {/* Content */}
      <Link href={`/dashboard/projects/${projectId}/brands/${brand.id}`}>
        <Box p={4} cursor="pointer">
          <Stack gap={3}>
            {/* Tagline */}
            {brand.tagline && (
              <styled.p
                fontSize="sm"
                color="gray.600"
                fontStyle="italic"
                lineHeight="relaxed"
              >
                "{brand.tagline}"
              </styled.p>
            )}

            {/* Mission Preview */}
            {brand.mission && (
              <Stack gap={1}>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.700">
                  Mission
                </styled.label>
                <styled.p
                  fontSize="sm"
                  color="gray.600"
                  lineHeight="relaxed"
                  overflow="hidden"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {brand.mission}
                </styled.p>
              </Stack>
            )}

            {/* Values Preview */}
            {brand.values && brand.values.length > 0 && (
              <Stack gap={1}>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.700">
                  Values
                </styled.label>
                <Flex gap={1} wrap="wrap">
                  {brand.values.slice(0, 3).map((value, index) => (
                    <styled.span
                      key={index}
                      fontSize="xs"
                      px={2}
                      py={0.5}
                      bg="blue.50"
                      color="blue.700"
                      borderRadius="sm"
                    >
                      {value}
                    </styled.span>
                  ))}
                  {brand.values.length > 3 && (
                    <styled.span fontSize="xs" color="gray.500">
                      +{brand.values.length - 3} more
                    </styled.span>
                  )}
                </Flex>
              </Stack>
            )}

            {/* Empty State */}
            {!brand.tagline &&
              !brand.mission &&
              (!brand.values || brand.values.length === 0) && (
                <styled.p fontSize="sm" color="gray.500" fontStyle="italic">
                  No brand details yet. Click to add brand information.
                </styled.p>
              )}
          </Stack>
        </Box>
      </Link>

      {/* Footer */}
      <Box px={4} py={2} bg="gray.50" borderTop="1px solid" borderColor="gray.100">
        <styled.div fontSize="xs" color="gray.500">
          Created {new Date(brand.created_at).toLocaleDateString()}
        </styled.div>
      </Box>
    </Box>
  )
}
