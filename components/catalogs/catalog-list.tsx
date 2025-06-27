import { Box, Flex, Grid, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { getProductCatalogsAction } from '@/actions/product-catalogs'
import type { ProductCatalog } from '@/lib/supabase/database-types'
import { getBrandBySlugAction } from '@/actions/brands'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { CreateCatalogButton } from './client-components'
import { CatalogCard } from './catalog-card'

interface CatalogListProps {
  brandSlug: string
}

export default async function CatalogList({ brandSlug }: CatalogListProps) {
  const brand = await getBrandBySlugAction(brandSlug)

  if (!brand) {
    return null
  }

  const catalogs = await getProductCatalogsAction(brand.id)

  return catalogs.length === 0 ? (
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
            Create your first product catalog to organize your products by collections,
            seasons, or categories.
          </styled.p>
        </Stack>

        <Suspense>
          <CreateCatalogButton>Create Your First Catalog</CreateCatalogButton>
        </Suspense>
      </Stack>
    </Box>
  ) : (
    /* Catalogs List */
    <Suspense>
      <Grid gridTemplateColumns="1fr 1fr" gap={6}>
        {catalogs.map((catalog) => (
          <CatalogCard key={catalog.id} catalog={catalog} />
        ))}
      </Grid>
    </Suspense>
  )
}
