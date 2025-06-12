import { Box, Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import { getProductsByCatalog } from '@/actions/products'
import type { ProductWithRelations } from '@/actions/products'
import { button } from '@/components/ui/button'

interface BrandProductsPageProps {
  params: Promise<{
    id: string
  }>
}

// Extended type to include catalog information
interface ProductWithContext extends ProductWithRelations {
  catalog?: {
    catalog_id: string
    name: string
  }
}

export default async function BrandProductsPage({ params }: BrandProductsPageProps) {
  const { id } = await params
  const brandId = parseInt(id)

  if (isNaN(brandId)) {
    notFound()
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Get brand data and verify ownership
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('id, name, user_id')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single()

  if (brandError || !brand) {
    notFound()
  }

  let productsWithContext: ProductWithContext[] = []
  let error: string | null = null

  try {
    // Get all catalogs for this brand
    const brandCatalogs = await getProductCatalogsAction(brandId)

    // Get all products from all catalogs
    const allProducts: ProductWithContext[] = []
    for (const catalog of brandCatalogs) {
      try {
        const catalogProducts = await getProductsByCatalog(catalog.catalog_id)
        const productsWithCatalogInfo = catalogProducts.map((product) => ({
          ...product,
          catalog: {
            catalog_id: catalog.catalog_id,
            name: catalog.name,
          },
        }))
        allProducts.push(...productsWithCatalogInfo)
      } catch (err) {
        console.error(`Error fetching products for catalog ${catalog.catalog_id}:`, err)
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
          {productsWithContext.length} products across all catalogs for {brand.name}
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
                Create product catalogs first, then add products to start building your
                inventory.
              </styled.p>
            </Stack>

            <Link href={`/dashboard/brands/${brandId}/catalogs`} className={button()}>
              Manage Catalogs
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
            <ProductCard key={product.id} product={product} brandId={brandId} />
          ))}
        </Box>
      )}
    </Container>
  )
}

// Product Card Component with catalog context
interface ProductCardProps {
  product: ProductWithContext
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

function ProductCard({ product, brandId }: ProductCardProps) {
  const statusColor = getStatusColor(product.status)
  const variantCount = product.product_variants?.length || 0
  const imageCount = product.product_images?.length || 0

  // Get the hero image if available
  const heroImage = product.product_images?.find((img) => img.type === 'hero')

  return (
    <Link href={`/dashboard/brands/${brandId}/products/${product.id}`}>
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
              <styled.div fontSize="4xl" color="gray.400">
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
              py={0.5}
              borderRadius="sm"
              bg={statusColor.bg}
              color={statusColor.color}
            >
              {product.status}
            </styled.span>
          </Box>
        </Box>

        {/* Product Details */}
        <Box p={4}>
          <Stack gap={3}>
            {/* Name and Price */}
            <Stack gap={1}>
              <styled.h3
                fontSize="md"
                fontWeight="semibold"
                color="gray.900"
                overflow="hidden"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {product.name}
              </styled.h3>

              {/* Price Range */}
              {(product.min_price || product.max_price) && (
                <styled.div fontSize="sm" fontWeight="medium" color="gray.700">
                  {product.min_price && product.max_price
                    ? product.min_price === product.max_price
                      ? `$${product.min_price}`
                      : `$${product.min_price} - $${product.max_price}`
                    : `$${product.min_price || product.max_price}`}
                </styled.div>
              )}
            </Stack>

            {/* Catalog Info */}
            {product.catalog && (
              <styled.span
                fontSize="xs"
                px={2}
                py={0.5}
                bg="blue.50"
                color="blue.700"
                borderRadius="sm"
                w="fit-content"
              >
                {product.catalog.name}
              </styled.span>
            )}

            {/* Short Description */}
            {product.short_description && (
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
                {product.short_description}
              </styled.p>
            )}

            {/* Stats */}
            <Flex gap={4} fontSize="xs" color="gray.500">
              <styled.span>
                {variantCount} variant{variantCount !== 1 ? 's' : ''}
              </styled.span>
              <styled.span>
                {imageCount} image{imageCount !== 1 ? 's' : ''}
              </styled.span>
            </Flex>
          </Stack>
        </Box>
      </Box>
    </Link>
  )
}

export async function generateMetadata({ params }: BrandProductsPageProps) {
  const { id } = await params
  const brandId = parseInt(id)

  if (isNaN(brandId)) {
    return {
      title: 'Products',
    }
  }

  const supabase = await createClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('name')
    .eq('id', brandId)
    .single()

  return {
    title: brand ? `Products - ${brand.name}` : 'Products',
  }
}
