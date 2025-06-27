'use client'

import { ProductCatalog } from '@/lib/supabase/database-types'
import { Box, Divider, Flex, HStack, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { useBrand } from '@/components/brand-context'
import { button } from '../ui/button'

interface CatalogCardProps {
  catalog: ProductCatalog
}

export function CatalogCard({ catalog }: CatalogCardProps) {
  const brand = useBrand()

  return (
    <Stack p="4" bg="white" boxShadow="xs">
      {/* Header */}
      <Box>
        <Flex justify="space-between" align="center" gap={3}>
          <Link href={`/brands/${brand.slug}/catalogs/${catalog.slug}`}>
            <styled.h3
              fontSize="md"
              fontWeight="semibold"
              color="gray.900"
              _hover={{ color: 'fg/50' }}
              transition="color 0.2s"
              truncate
            >
              {catalog.name}
            </styled.h3>
          </Link>

          <HStack>
            <Link
              href={`/brands/${brand.slug}/catalogs/${catalog.slug}/settings`}
              className={button({ variant: 'secondary', size: 'xs' })}
            >
              Settings
            </Link>
          </HStack>
        </Flex>
      </Box>

      {/* Content */}

      <Box>
        <Stack gap={4}>
          {/* Description */}
          {catalog.description && (
            <styled.p pr="6" fontSize="sm" color="fg.muted" lineClamp={3}>
              {catalog.description}
            </styled.p>
          )}

          {/* Stats */}
          <Flex gap={4}>
            <HStack gap={2}>
              <styled.p fontSize="xs" fontWeight="semibold" color="gray.900">
                {catalog.total_categories || 0}{' '}
                <styled.span fontWeight="normal" color="fg.muted">
                  Categories
                </styled.span>
              </styled.p>
              <Divider orientation="vertical" h="3" color="gray.400" />
              <styled.p fontSize="xs" fontWeight="semibold" color="gray.900">
                {catalog.total_products || 0}{' '}
                <styled.span fontWeight="normal" color="fg.muted">
                  Products
                </styled.span>
              </styled.p>
            </HStack>
          </Flex>

          {/* Empty State */}
          {!catalog.description && (
            <styled.p fontSize="sm" color="gray.500" fontStyle="italic">
              No description yet. Click to add catalog details.
            </styled.p>
          )}
        </Stack>
      </Box>
    </Stack>
  )
}
