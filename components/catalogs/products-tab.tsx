import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { getProductsByBrand, getProductsByCatalog } from '@/actions/products'
import type { ProductWithRelations } from '@/actions/products'
import { button } from '@/components/ui/button'
import { getBrandIdByCatalog } from '@/actions'
import { Brand } from '@/lib/supabase/database-types'
import Image from 'next/image'

interface ProductsTabProps {
  brand: Brand
  catalogId?: string
}

export default async function ProductsTab({ catalogId, brand }: ProductsTabProps) {
  let products: ProductWithRelations[] = []
  let error: string | null = null

  const brandId = brand.id

  try {
    products = !catalogId
      ? await getProductsByBrand(brandId)
      : await getProductsByCatalog(catalogId)
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

            <Link href={`/brands/${brand?.slug}/products/create`} className={button()}>
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
                  Variants
                </styled.th>
              </styled.tr>
            </styled.thead>
            <styled.tbody>
              {products.map((product) => (
                <ProductTableRow key={product.id} product={product} brand={brand!} />
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
  brand: Brand
}

function ProductTableRow({ product, brand }: ProductTableRowProps) {
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
  const mainImage = product.product_images?.[0]

  return (
    <styled.tr
      borderBottom="1px solid"
      borderColor="gray.100"
      _hover={{ bg: 'gray.50' }}
      transition="all 0.2s"
    >
      {/* Product Image */}
      <styled.td px={6} py={4}>
        <Box w={12} borderRadius="md" overflow="hidden" bg="gray.100">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.alt_text || product.name}
              width={100}
              height={100}
              objectFit="contain"
            />
          ) : (
            <Flex w="full" h={12} align="center" justify="center">
              <styled.div fontSize="lg" color="gray.400">
                📦
              </styled.div>
            </Flex>
          )}
        </Box>
      </styled.td>

      {/* Product Name & Description */}
      <styled.td px={6} py={4}>
        <Stack gap={3} maxW="340px">
          <Link href={`/brands/${brand?.slug}/products/${product.id}`}>
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
          {product.short_description && (
            <styled.p fontSize="xs" color="gray.500">
              {product.short_description}
            </styled.p>
          )}
        </Stack>
      </styled.td>

      {/* Category */}
      <styled.td px={6} py={4}>
        {product.categories ? (
          <styled.span fontSize="xs">{product.categories.name}</styled.span>
        ) : (
          <styled.span fontSize="xs" color="gray.400">
            —
          </styled.span>
        )}
      </styled.td>

      {/* Variants */}
      <styled.td px={6} py={4}>
        <styled.p fontSize="xs" color="gray.900">
          {variantCount}
        </styled.p>
      </styled.td>
    </styled.tr>
  )
}
