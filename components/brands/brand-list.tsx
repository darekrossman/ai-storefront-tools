import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { getBrandsAction } from '@/actions/brands'
import BrandCard from './brand-card'
import type { Brand } from '@/lib/supabase/database-types'

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

  // Empty State
  if (brands.length === 0) {
    return (
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
            Brands
          </styled.h2>
          <Link href={`/dashboard/projects/${projectId}/brands/new`}>
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
              Create Brand
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
                Create Your First Brand
              </styled.button>
            </Link>
          </Stack>
        </Box>
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

        <Link href={`/dashboard/projects/${projectId}/brands/new`}>
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
            Add Brand
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
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} projectId={projectId} />
        ))}
      </Box>
    </Box>
  )
}
