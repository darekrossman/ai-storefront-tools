import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { getProductsByCatalog } from '@/actions/products'
import type { ProductWithRelations } from '@/actions/products'
import { button } from '@/components/ui/button'
import { useBrand } from '../brand-context'

interface ProductsTabProps {
  catalogId: string
}

export default async function ProductsTab({ catalogId }: ProductsTabProps) {
  const { brandId } = useBrand()
  let products: ProductWithRelations[] = []
  let error: string | null = null

  try {
    products = await getProductsByCatalog(catalogId)
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
    <Stack gap={6}>
      <Flex justify="space-between" align="center">
        <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
          Products
        </styled.h2>
        {products.length > 0 && (
          <Link
            href={`/dashboard/brands/${brandId}/catalogs/${catalogId}/products/new`}
            className={button()}
          >
            Add Product
          </Link>
        )}
      </Flex>

      {/* Products Table */}
      {products.length === 0 ? (
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
                Start building your catalog by adding products. Each product can have
                multiple variants, attributes, and images.
              </styled.p>
            </Stack>

            <Link
              href={`/dashboard/brands/${brandId}/catalogs/${catalogId}/products/new`}
              className={button()}
            >
              Add Your First Product
            </Link>
          </Stack>
        </Box>
      ) : (
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          overflow="hidden"
        >
          <styled.table w="full">
            <styled.thead bg="gray.50">
              <styled.tr>
                <styled.th
                  textAlign="left"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  w={16}
                >
                  Image
                </styled.th>
                <styled.th
                  textAlign="left"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Product
                </styled.th>
                <styled.th
                  textAlign="left"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Category
                </styled.th>
                <styled.th
                  textAlign="left"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Status
                </styled.th>
                <styled.th
                  textAlign="left"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Variants
                </styled.th>
                <styled.th
                  textAlign="left"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Price Range
                </styled.th>
                <styled.th
                  textAlign="left"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Created
                </styled.th>
                <styled.th
                  textAlign="right"
                  px={6}
                  py={3}
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  w={24}
                >
                  Actions
                </styled.th>
              </styled.tr>
            </styled.thead>
            <styled.tbody>
              {products.map((product) => (
                <ProductTableRow key={product.id} product={product} />
              ))}
            </styled.tbody>
          </styled.table>
        </Box>
      )}
    </Stack>
  )
}

// Product Table Row Component
interface ProductTableRowProps {
  product: ProductWithRelations
}

function ProductTableRow({ product }: ProductTableRowProps) {
  const { brandId } = useBrand()
  const getStatusColor = (status: string) => {
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

  const statusColor = getStatusColor(product.status)
  const variantCount = product.product_variants?.length || 0
  const heroImage = product.product_images?.find((img) => img.type === 'hero')

  return (
    <styled.tr
      borderBottom="1px solid"
      borderColor="gray.100"
      _hover={{ bg: 'gray.50' }}
      transition="all 0.2s"
    >
      {/* Product Image */}
      <styled.td px={6} py={4}>
        <Box w={12} h={12} borderRadius="md" overflow="hidden" bg="gray.100">
          {heroImage ? (
            <styled.img
              src={heroImage.url}
              alt={heroImage.alt_text || product.name}
              w="full"
              h="full"
              objectFit="cover"
            />
          ) : (
            <Flex w="full" h="full" align="center" justify="center">
              <styled.div fontSize="lg" color="gray.400">
                📦
              </styled.div>
            </Flex>
          )}
        </Box>
      </styled.td>

      {/* Product Name & Description */}
      <styled.td px={6} py={4}>
        <Stack gap={1}>
          <Link href={`/dashboard/brands/${brandId}/products/${product.id}`}>
            <styled.span
              fontSize="sm"
              fontWeight="medium"
              color="gray.900"
              _hover={{ color: 'blue.600' }}
              cursor="pointer"
              transition="all 0.2s"
            >
              {product.name}
            </styled.span>
          </Link>
          {product.description && (
            <styled.p
              fontSize="xs"
              color="gray.500"
              overflow="hidden"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {product.description}
            </styled.p>
          )}
        </Stack>
      </styled.td>

      {/* Category */}
      <styled.td px={6} py={4}>
        {product.categories ? (
          <styled.span fontSize="sm" color="blue.600" fontWeight="medium">
            {product.categories.name}
          </styled.span>
        ) : (
          <styled.span fontSize="sm" color="gray.400">
            —
          </styled.span>
        )}
      </styled.td>

      {/* Status */}
      <styled.td px={6} py={4}>
        <styled.span
          fontSize="xs"
          fontWeight="medium"
          px={2}
          py={1}
          borderRadius="md"
          bg={statusColor.bg}
          color={statusColor.color}
          textTransform="capitalize"
        >
          {product.status}
        </styled.span>
      </styled.td>

      {/* Variants */}
      <styled.td px={6} py={4}>
        <styled.span fontSize="sm" color="gray.900">
          {variantCount}
        </styled.span>
      </styled.td>

      {/* Price Range */}
      <styled.td px={6} py={4}>
        {product.min_price !== null ? (
          <styled.span fontSize="sm" fontWeight="medium" color="gray.900">
            {product.min_price === product.max_price
              ? `$${product.min_price}`
              : `$${product.min_price} - $${product.max_price}`}
          </styled.span>
        ) : (
          <styled.span fontSize="sm" color="gray.400">
            —
          </styled.span>
        )}
      </styled.td>

      {/* Created Date */}
      <styled.td px={6} py={4}>
        <styled.span fontSize="sm" color="gray.600">
          {new Date(product.created_at).toLocaleDateString()}
        </styled.span>
      </styled.td>

      {/* Actions */}
      <styled.td px={6} py={4}>
        <Flex gap={2} justify="end">
          <Link
            href={`/dashboard/brands/${brandId}/products/${product.id}`}
            className={button({ variant: 'secondary', size: 'sm' })}
          >
            View
          </Link>
        </Flex>
      </styled.td>
    </styled.tr>
  )
}
