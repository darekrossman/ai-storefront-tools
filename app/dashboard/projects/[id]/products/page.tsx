import { Box, Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectAction } from '@/actions/projects'
import { getBrandsAction } from '@/actions/brands'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import { getProductsByCatalog } from '@/actions/products'
import type { ProductWithRelations } from '@/actions/products'

interface ProjectProductsPageProps {
  params: Promise<{
    id: string
  }>
}

// Extended type to include catalog and brand information
interface ProductWithContext extends ProductWithRelations {
  catalog?: {
    id: number
    name: string
  }
  brand?: {
    id: number
    name: string
  }
}

export default async function ProjectProductsPage({ params }: ProjectProductsPageProps) {
  const { id } = await params
  const projectId = parseInt(id)

  if (isNaN(projectId)) {
    notFound()
  }

  let project = null
  let productsWithContext: ProductWithContext[] = []
  let error: string | null = null

  try {
    // Get project details
    project = await getProjectAction(projectId)
    if (!project) {
      notFound()
    }

    // Get all brands for this project
    const brands = await getBrandsAction(projectId)

    // Get all products from all catalogs
    const allProducts: ProductWithContext[] = []
    for (const brand of brands) {
      try {
        const brandCatalogs = await getProductCatalogsAction(brand.id)
        for (const catalog of brandCatalogs) {
          try {
            const catalogProducts = await getProductsByCatalog(catalog.id)
            const productsWithBrandCatalogInfo = catalogProducts.map((product) => ({
              ...product,
              catalog: {
                id: catalog.id,
                name: catalog.name,
              },
              brand: {
                id: brand.id,
                name: brand.name,
              },
            }))
            allProducts.push(...productsWithBrandCatalogInfo)
          } catch (err) {
            console.error(`Error fetching products for catalog ${catalog.id}:`, err)
          }
        }
      } catch (err) {
        console.error(`Error fetching catalogs for brand ${brand.id}:`, err)
      }
    }

    productsWithContext = allProducts.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products'
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
            Error Loading Products
          </styled.h3>
          <styled.p fontSize="sm" color="red.700">
            {error}
          </styled.p>
        </Stack>
      </Box>
    )
  }

  return (
    <Container py={8}>
      {/* Header */}
      <Stack gap={2} mb={8}>
        <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
          All Products
        </styled.h1>
        <styled.p fontSize="sm" color="gray.600">
          {productsWithContext.length} products across all catalogs in {project?.name}
        </styled.p>
      </Stack>

      {/* Empty State */}
      {productsWithContext.length === 0 ? (
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
              <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                Create brands and product catalogs first, then add products to start
                building your inventory.
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
                Manage Brands & Catalogs
              </styled.button>
            </Link>
          </Stack>
        </Box>
      ) : (
        /* Products Grid */
        <Box
          display="grid"
          gridTemplateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)',
          }}
          gap={6}
        >
          {productsWithContext.map((product) => (
            <ProductCard key={product.id} product={product} projectId={projectId} />
          ))}
        </Box>
      )}
    </Container>
  )
}

// Product Card Component with catalog and brand context
interface ProductCardProps {
  product: ProductWithContext
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

function ProductCard({ product, projectId }: ProductCardProps) {
  const statusColor = getStatusColor(product.status)
  const variantCount = product.product_variants?.length || 0
  const imageCount = product.product_images?.length || 0

  // Get the hero image if available
  const heroImage = product.product_images?.find((img) => img.type === 'hero')

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
      {/* Product Image */}
      <Box h={48} bg="gray.100" position="relative" overflow="hidden">
        {heroImage ? (
          <styled.img
            src={heroImage.url}
            alt={heroImage.alt_text || product.name}
            w="full"
            h="full"
            objectFit="cover"
          />
        ) : (
          <Flex w="full" h="full" align="center" justify="center" bg="gray.100">
            <styled.div fontSize="3xl" color="gray.400">
              📦
            </styled.div>
          </Flex>
        )}

        {/* Status Badge */}
        <Box position="absolute" top={2} right={2}>
          <styled.span
            fontSize="xs"
            fontWeight="medium"
            px={2}
            py={1}
            borderRadius="sm"
            bg={statusColor.bg}
            color={statusColor.color}
          >
            {product.status}
          </styled.span>
        </Box>
      </Box>

      {/* Header with Brand/Catalog Info */}
      <Box p={4} borderBottom="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="start" gap={3}>
          <Stack gap={1} flex={1} minW={0}>
            <styled.h3
              fontSize="md"
              fontWeight="semibold"
              color="gray.900"
              truncate
              title={product.name}
            >
              {product.name}
            </styled.h3>
            <Flex gap={2} align="center" wrap="wrap">
              {product.brand && (
                <styled.span
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  bg="purple.50"
                  color="purple.700"
                  borderRadius="sm"
                  title={`Brand: ${product.brand.name}`}
                >
                  {product.brand.name}
                </styled.span>
              )}
              {product.catalog && (
                <styled.span
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  bg="blue.50"
                  color="blue.700"
                  borderRadius="sm"
                  title={`Catalog: ${product.catalog.name}`}
                >
                  {product.catalog.name}
                </styled.span>
              )}
              {product.categories && (
                <styled.span
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  bg="green.50"
                  color="green.700"
                  borderRadius="sm"
                  title={`Category: ${product.categories.name}`}
                >
                  {product.categories.name}
                </styled.span>
              )}
            </Flex>
          </Stack>
        </Flex>
      </Box>

      {/* Product Content */}
      <Link href={`/dashboard/projects/${projectId}/products/${product.id}`}>
        <Box p={4} cursor="pointer">
          <Stack gap={3}>
            {/* Description */}
            {product.description && (
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
                {product.description}
              </styled.p>
            )}

            {/* Stats */}
            <Flex gap={4} fontSize="xs" color="gray.500">
              <span>{variantCount} variants</span>
              <span>{imageCount} images</span>
            </Flex>

            {/* Price Range */}
            {product.min_price !== null && (
              <styled.div fontSize="md" fontWeight="semibold" color="gray.900">
                {product.min_price === product.max_price
                  ? `$${product.min_price}`
                  : `$${product.min_price} - $${product.max_price}`}
              </styled.div>
            )}
          </Stack>
        </Box>
      </Link>

      {/* Footer */}
      <Box px={4} py={2} bg="gray.50" borderTop="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="center">
          <styled.div fontSize="xs" color="gray.500">
            Created {new Date(product.created_at).toLocaleDateString()}
          </styled.div>

          <Flex gap={1}>
            <Link href={`/dashboard/projects/${projectId}/products/${product.id}/edit`}>
              <styled.button
                px={2}
                py={1}
                fontSize="xs"
                color="gray.600"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="sm"
                cursor="pointer"
                _hover={{
                  bg: 'gray.50',
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
    </Box>
  )
}

export async function generateMetadata({ params }: ProjectProductsPageProps) {
  const { id } = await params
  const projectId = parseInt(id)

  if (isNaN(projectId)) {
    return {
      title: 'Products - Storefront Tools',
    }
  }

  const project = await getProjectAction(projectId)

  return {
    title: project
      ? `Products - ${project.name} - Storefront Tools`
      : 'Products - Storefront Tools',
    description: project
      ? `Manage all products in ${project.name}`
      : 'Manage your project products',
  }
}
