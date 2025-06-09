import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { getProductsByCatalog } from '@/actions/products'
import type { ProductWithRelations } from '@/actions/products'

interface ProductListProps {
  catalogId: number
  projectId: number
}

export default async function ProductList({ catalogId, projectId }: ProductListProps) {
  let products: ProductWithRelations[] = []
  let error: string | null = null

  try {
    products = await getProductsByCatalog(catalogId)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products'
    products = []
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

  // Empty State
  if (products.length === 0) {
    return (
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
            Products
          </styled.h2>
          <Link
            href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/products/new`}
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
              Add Product
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
                📦
              </styled.div>
            </Box>

            <Stack gap={2} textAlign="center">
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                No products yet
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                Start building your catalog by adding products. Each product can have
                multiple variants, attributes, and images for comprehensive product
                management.
              </styled.p>
            </Stack>

            <Link
              href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/products/new`}
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
                Add Your First Product
              </styled.button>
            </Link>
          </Stack>
        </Box>
      </Box>
    )
  }

  // Group products by category for better organization
  const productsByCategory = products.reduce(
    (acc, product) => {
      const categoryName = product.categories?.name || 'Uncategorized'
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(product)
      return acc
    },
    {} as Record<string, ProductWithRelations[]>,
  )

  const categories = Object.keys(productsByCategory).sort()

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Stack gap={1}>
          <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
            Products
          </styled.h2>
          <styled.p fontSize="sm" color="gray.600">
            {products.length} {products.length === 1 ? 'product' : 'products'} in this
            catalog
          </styled.p>
        </Stack>

        <Link
          href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/products/new`}
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
            Add Product
          </styled.button>
        </Link>
      </Flex>

      {/* Products organized by category */}
      <Stack gap={8}>
        {categories.map((categoryName) => (
          <Stack key={categoryName} gap={4}>
            <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
              {categoryName}
            </styled.h3>

            <Box
              display="grid"
              gridTemplateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap={6}
            >
              {productsByCategory[categoryName]?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  projectId={projectId}
                  catalogId={catalogId}
                />
              ))}
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

// Product Card Component (shared with catalog page)
interface ProductCardProps {
  product: ProductWithRelations
  projectId: number
  catalogId: number
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

      {/* Product Content */}
      <Link href={`/dashboard/projects/${projectId}/products/${product.id}`}>
        <Box p={4} cursor="pointer">
          <Stack gap={3}>
            <Stack gap={1}>
              <styled.h3
                fontSize="md"
                fontWeight="semibold"
                color="gray.900"
                truncate
                title={product.name}
              >
                {product.name}
              </styled.h3>
              {product.categories && (
                <styled.span fontSize="xs" color="blue.600" fontWeight="medium">
                  {product.categories.name}
                </styled.span>
              )}
            </Stack>

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
              <styled.div fontSize="sm" fontWeight="medium" color="gray.900">
                {product.min_price === product.max_price
                  ? `$${product.min_price}`
                  : `$${product.min_price} - $${product.max_price}`}
              </styled.div>
            )}
          </Stack>
        </Box>
      </Link>

      {/* Actions */}
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
