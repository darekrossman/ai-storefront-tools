import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import type { ProductCatalog } from '@/lib/supabase/database-types'
import { button } from '@/components/ui/button'
import { getBrandBySlugAction } from '@/actions/brands'
import { PageContainer } from '@/components/ui/page-container'

interface BrandCatalogsPageProps {
  params: Promise<{
    brandSlug: string
  }>
}

export default async function BrandCatalogsPage({ params }: BrandCatalogsPageProps) {
  const { brandSlug } = await params
  const brand = await getBrandBySlugAction(brandSlug)

  if (!brand) {
    notFound()
  }

  const catalogs = await getProductCatalogsAction(brand.id)

  return (
    <PageContainer>
      {/* Header */}
      <Flex justify="space-between" align="start" gap={4} mb={8}>
        <Stack gap={2} flex={1}>
          <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
            Product Catalogs
          </styled.h1>
          <styled.p fontSize="sm" color="gray.600">
            Catalogs for {brand.name}
          </styled.p>
        </Stack>

        <Link href={`/brands/${brand.slug}/catalogs/create`} className={button()}>
          Create Catalog
        </Link>
      </Flex>

      {/* Empty State */}
      {catalogs.length === 0 ? (
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
                Create your first product catalog to organize your products by
                collections, seasons, or categories.
              </styled.p>
            </Stack>

            <Link href={`/brands/${brand.slug}/catalogs/create`} className={button()}>
              Create Your First Catalog
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
          {catalogs.map((catalog) => (
            <CatalogCard key={catalog.id} catalog={catalog} brandSlug={brand.slug} />
          ))}
        </Box>
      )}
    </PageContainer>
  )
}

// Catalog Card Component
interface CatalogCardProps {
  catalog: ProductCatalog
  brandSlug: string
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

function CatalogCard({ catalog, brandSlug }: CatalogCardProps) {
  const statusColor = getStatusColor(catalog.status)

  return (
    <Link href={`/brands/${brandSlug}/catalogs/${catalog.slug}`}>
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
                display="inline-block"
                w="fit-content"
              >
                {catalog.status}
              </styled.span>
            </Stack>
          </Flex>
        </Box>

        {/* Content */}
        <Box p={4}>
          <Stack gap={3}>
            {catalog.description && (
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
                {catalog.description}
              </styled.p>
            )}

            <Box>
              <styled.div fontSize="xs" color="gray.500" mb={1}>
                Products
              </styled.div>
              <styled.div fontSize="sm" fontWeight="medium" color="gray.900">
                {catalog.total_products || 0}
              </styled.div>
            </Box>

            <Box fontSize="xs" color="gray.500">
              Created {new Date(catalog.created_at).toLocaleDateString()}
            </Box>
          </Stack>
        </Box>
      </Box>
    </Link>
  )
}
