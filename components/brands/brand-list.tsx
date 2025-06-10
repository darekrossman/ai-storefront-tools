import { getBrandsAction } from '@/actions/brands'
import { button } from '@/components/ui/button'
import type { Brand } from '@/lib/supabase/database-types'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import BrandCard from './brand-card'

interface BrandListProps {
  projectId: number
}

export default async function BrandList({ projectId }: BrandListProps) {
  let brands: Brand[] = []
  let error: string | null = null

  try {
    brands = await getBrandsAction(projectId)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load brands'
    brands = []
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
            Error Loading Brands
          </styled.h3>
          <styled.p fontSize="sm" color="red.700">
            {error}
          </styled.p>
        </Stack>
      </Box>
    )
  }

  // Brands Grid
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Stack gap={1}>
          <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
            Brands
          </styled.h2>
          <styled.p fontSize="sm" color="gray.600">
            {brands.length} {brands.length === 1 ? 'brand' : 'brands'} in this project
          </styled.p>
        </Stack>

        <Link href={`/dashboard/projects/${projectId}/brands/new`} className={button()}>
          Add Brand
        </Link>
      </Flex>

      {brands.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={6}
        >
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} projectId={projectId} />
          ))}
        </Box>
      ) : (
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
                🏷️
              </styled.div>
            </Box>

            <Stack gap={2} textAlign="center">
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                No brands yet
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                Create your first brand to start organizing your products and defining
                your brand identity. You can add logos, guidelines, and brand values.
              </styled.p>
            </Stack>

            <Link href={`/dashboard/projects/${projectId}/brands/new`}>
              <styled.div
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
                display="inline-block"
              >
                Create Your First Brand
              </styled.div>
            </Link>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
