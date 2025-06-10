import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectAction } from '@/actions/projects'
import { getBrandsAction } from '@/actions/brands'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import type { ProductCatalog } from '@/lib/supabase/database-types'
import { button } from '@/components/ui/button'

interface ProjectCatalogsPageProps {
  params: Promise<{
    id: string
  }>
}

// Extended type to include brand information
interface CatalogWithBrand extends ProductCatalog {
  brand?: {
    id: number
    name: string
  }
}

export default async function ProjectCatalogsPage({ params }: ProjectCatalogsPageProps) {
  const { id } = await params
  const projectId = parseInt(id)

  if (isNaN(projectId)) {
    notFound()
  }

  let project = null
  let catalogsWithBrands: CatalogWithBrand[] = []
  let error: string | null = null

  try {
    // Get project details
    project = await getProjectAction(projectId)
    if (!project) {
      notFound()
    }

    // Get all brands for this project
    const brands = await getBrandsAction(projectId)

    // Get catalogs for each brand
    const allCatalogs: CatalogWithBrand[] = []
    for (const brand of brands) {
      try {
        const brandCatalogs = await getProductCatalogsAction(brand.id)
        const catalogsWithBrandInfo = brandCatalogs.map((catalog) => ({
          ...catalog,
          brand: {
            id: brand.id,
            name: brand.name,
          },
        }))
        allCatalogs.push(...catalogsWithBrandInfo)
      } catch (err) {
        console.error(`Error fetching catalogs for brand ${brand.id}:`, err)
      }
    }

    catalogsWithBrands = allCatalogs.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load catalogs'
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

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }}>
      {/* Header */}
      <Flex justify="space-between" align="start" gap={4} mb={8}>
        <Stack gap={2} flex={1}>
          <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
            Product Catalogs
          </styled.h1>
          <styled.p fontSize="sm" color="gray.600">
            All product catalogs across brands in {project?.name}
          </styled.p>
        </Stack>

        <Link href={`/dashboard/projects/${projectId}/catalogs/new`} className={button()}>
          Create Catalog
        </Link>
      </Flex>

      {/* Empty State */}
      {catalogsWithBrands.length === 0 ? (
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
                📂
              </styled.div>
            </Box>

            <Stack gap={2} textAlign="center">
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                No product catalogs yet
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                Create a brand first, then add product catalogs to organize your products
                by collections, seasons, or categories.
              </styled.p>
            </Stack>

            <Link href={`/dashboard/projects/${projectId}/brands`}>
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
                Manage Brands
              </styled.button>
            </Link>
          </Stack>
        </Box>
      ) : (
        /* Catalogs List */
        <Box
          display="grid"
          gridTemplateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={6}
        >
          {catalogsWithBrands.map((catalog) => (
            <CatalogCard key={catalog.id} catalog={catalog} projectId={projectId} />
          ))}
        </Box>
      )}
    </Box>
  )
}

// Catalog Card Component with brand info
interface CatalogCardProps {
  catalog: CatalogWithBrand
  projectId: number
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

function CatalogCard({ catalog, projectId }: CatalogCardProps) {
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
            <Flex gap={2} align="center">
              <styled.span
                fontSize="xs"
                fontWeight="medium"
                px={2}
                py={0.5}
                borderRadius="sm"
                bg={statusColor.bg}
                color={statusColor.color}
              >
                {catalog.status}
              </styled.span>
              {catalog.brand && (
                <styled.span
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  bg="blue.50"
                  color="blue.700"
                  borderRadius="sm"
                >
                  {catalog.brand.name}
                </styled.span>
              )}
            </Flex>
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
