import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import type { ProductCatalog } from '@/lib/supabase/database-types'

interface CatalogListProps {
  projectId: number
  brandId: number
}

export default async function CatalogList({ projectId, brandId }: CatalogListProps) {
  let catalogs: ProductCatalog[] = []
  let error: string | null = null

  try {
    catalogs = await getProductCatalogsAction(brandId)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load catalogs'
    catalogs = []
  }

  if (error) {
    return (
      <Box
        bg="red.50"
        border="1px solid"
        borderColor="red.200"
        borderRadius="lg"
        p={6}
        textAlign="center"
      >
        <Stack gap={2} align="center">
          <styled.h3 fontSize="lg" fontWeight="medium" color="red.900">
            Error Loading Catalogs
          </styled.h3>
          <styled.p fontSize="sm" color="red.700">
            {error}
          </styled.p>
        </Stack>
      </Box>
    )
  }

  // Empty State
  if (catalogs.length === 0) {
    return (
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
            Product Catalogs
          </styled.h2>
          <Link href={`/dashboard/projects/${projectId}/brands/${brandId}/catalogs/new`}>
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

        <Box
          bg="white"
          border="2px dashed"
          borderColor="gray.200"
          borderRadius="lg"
          p={12}
          textAlign="center"
        >
          <Stack gap={4} align="center" maxW="md" mx="auto">
            {/* Icon placeholder */}
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
                📂
              </styled.div>
            </Box>

            <Stack gap={2} textAlign="center">
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                No product catalogs yet
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                Create your first product catalog to start organizing your products by
                collections, seasons, or categories. Each catalog can contain multiple
                products and categories.
              </styled.p>
            </Stack>

            <Link
              href={`/dashboard/projects/${projectId}/brands/${brandId}/catalogs/new`}
            >
              <styled.button
                px={6}
                py={3}
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
                Create Your First Catalog
              </styled.button>
            </Link>
          </Stack>
        </Box>
      </Box>
    )
  }

  // Catalogs Grid
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Stack gap={1}>
          <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
            Product Catalogs
          </styled.h2>
          <styled.p fontSize="sm" color="gray.600">
            {catalogs.length} {catalogs.length === 1 ? 'catalog' : 'catalogs'} in this
            brand
          </styled.p>
        </Stack>

        <Link href={`/dashboard/projects/${projectId}/brands/${brandId}/catalogs/new`}>
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
            Add Catalog
          </styled.button>
        </Link>
      </Flex>

      <Box
        display="grid"
        gridTemplateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={6}
      >
        {catalogs.map((catalog) => (
          <CatalogCard
            key={catalog.id}
            catalog={catalog}
            projectId={projectId}
            brandId={brandId}
          />
        ))}
      </Box>
    </Box>
  )
}

// Catalog Card Component
interface CatalogCardProps {
  catalog: ProductCatalog
  projectId: number
  brandId: number
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

function CatalogCard({ catalog, projectId, brandId }: CatalogCardProps) {
  const statusColor = getStatusColor(catalog.status)

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
      {/* Header */}
      <Box p={4} borderBottom="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="start" gap={3}>
          <Stack gap={1} flex={1} minW={0}>
            <styled.h3
              fontSize="md"
              fontWeight="semibold"
              color="gray.900"
              truncate
              title={catalog.name}
            >
              {catalog.name}
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
              {catalog.status}
            </styled.span>
          </Stack>

          {/* Actions */}
          <Flex gap={1} flexShrink={0}>
            <Link href={`/dashboard/projects/${projectId}/catalogs/${catalog.id}/edit`}>
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
          </Flex>
        </Flex>
      </Box>

      {/* Content */}
      <Link href={`/dashboard/projects/${projectId}/catalogs/${catalog.id}`}>
        <Box p={4} cursor="pointer">
          <Stack gap={3}>
            {/* Description */}
            {catalog.description && (
              <styled.p
                fontSize="sm"
                color="gray.600"
                lineHeight="relaxed"
                overflow="hidden"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {catalog.description}
              </styled.p>
            )}

            {/* Stats */}
            <Flex gap={4}>
              <Stack gap={0} align="center">
                <styled.span fontSize="lg" fontWeight="semibold" color="gray.900">
                  {catalog.total_products || 0}
                </styled.span>
                <styled.span fontSize="xs" color="gray.500">
                  Products
                </styled.span>
              </Stack>
            </Flex>

            {/* Empty State */}
            {!catalog.description && (
              <styled.p fontSize="sm" color="gray.500" fontStyle="italic">
                No description yet. Click to add catalog details.
              </styled.p>
            )}
          </Stack>
        </Box>
      </Link>

      {/* Footer */}
      <Box px={4} py={2} bg="gray.50" borderTop="1px solid" borderColor="gray.100">
        <styled.div fontSize="xs" color="gray.500">
          Created {new Date(catalog.created_at).toLocaleDateString()}
        </styled.div>
      </Box>
    </Box>
  )
}
