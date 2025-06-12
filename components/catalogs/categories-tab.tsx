'use client'

import { useState } from 'react'
import React from 'react'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { getCategoriesAction } from '@/actions/categories'
import type { Category } from '@/lib/supabase/database-types'
import { button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useBrand } from '../brand-context'

interface CategoriesTabProps {
  catalogId: string
  categories: Category[]
}

export default function CategoriesTab({ catalogId, categories }: CategoriesTabProps) {
  const { brandId } = useBrand()

  return (
    <Stack gap={6}>
      <Flex justify="space-between" align="center">
        <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
          Categories
        </styled.h2>
        <Link
          href={`/dashboard/brands/${brandId}/catalogs/${catalogId}/categories/new`}
          className={button()}
        >
          Add Category
        </Link>
      </Flex>

      {/* Categories List */}
      {categories.length === 0 ? (
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
                📁
              </styled.div>
            </Box>

            <Stack gap={2} textAlign="center">
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                No categories yet
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                Organize your products by creating categories. Categories help customers
                navigate your catalog and find products more easily.
              </styled.p>
            </Stack>

            <Link
              href={`/dashboard/brands/${brandId}/catalogs/${catalogId}/categories/new`}
              className={button()}
            >
              Create Your First Category
            </Link>
          </Stack>
        </Box>
      ) : (
        <CategoriesTable categories={categories} catalogId={catalogId} />
      )}
    </Stack>
  )
}

// Categories Table Component with Hierarchical Structure
interface CategoriesTableProps {
  categories: Category[]
  catalogId: string
}

function CategoriesTable({ categories, catalogId }: CategoriesTableProps) {
  const { brandId } = useBrand()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Organize categories into hierarchy
  const topLevelCategories = categories.filter((cat) => !cat.parent_category_id)
  const getChildCategories = (parentId: string) =>
    categories.filter((cat) => cat.parent_category_id === parentId)

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg">
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
              Slug
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
          </styled.tr>
        </styled.thead>
        <styled.tbody>
          {topLevelCategories.map((category) => {
            const childCategories = getChildCategories(category.category_id)
            const hasChildren = childCategories.length > 0
            const isExpanded = expandedCategories.has(category.category_id)

            return (
              <React.Fragment key={category.category_id}>
                <CategoryTableRow
                  category={category}
                  hasChildren={hasChildren}
                  isExpanded={isExpanded}
                  onToggle={() => toggleCategory(category.category_id)}
                  level={0}
                  catalogId={catalogId}
                />
                {isExpanded &&
                  childCategories.map((childCategory) => (
                    <CategoryTableRow
                      key={childCategory.category_id}
                      category={childCategory}
                      hasChildren={false}
                      isExpanded={false}
                      onToggle={() => {}}
                      level={1}
                      catalogId={catalogId}
                    />
                  ))}
              </React.Fragment>
            )
          })}
        </styled.tbody>
      </styled.table>
    </Box>
  )
}

// Category Table Row Component
interface CategoryTableRowProps {
  category: Category
  hasChildren: boolean
  isExpanded: boolean
  onToggle: () => void
  level: number
  catalogId: string
}

function CategoryTableRow({
  category,
  hasChildren,
  isExpanded,
  onToggle,
  level,
  catalogId,
}: CategoryTableRowProps) {
  const { brandId } = useBrand()
  const getStatusVariant = (status: boolean) => {
    return status
      ? { variant: 'success' as const, text: 'Active' }
      : { variant: 'neutral' as const, text: 'Inactive' }
  }

  const statusInfo = getStatusVariant(category.is_active)

  return (
    <styled.tr
      borderBottom="1px solid"
      borderColor="gray.100"
      _hover={{ bg: 'gray.50' }}
      transition="all 0.2s"
    >
      {/* Category Name and Description */}
      <styled.td>
        <Flex align="start" gap={2}>
          {/* Indentation for child categories */}
          {level > 0 && (
            <styled.div w={6} flexShrink={0}>
              <styled.div
                w={4}
                h={4}
                borderLeft="2px solid"
                borderColor="gray.300"
                borderBottom="2px solid"
                borderBottomColor="gray.300"
              />
            </styled.div>
          )}

          {/* Expand/collapse button for parent categories */}
          {hasChildren && (
            <Button
              px={0}
              w={5}
              h={5}
              variant="secondary"
              flexShrink={0}
              onClick={onToggle}
            >
              {isExpanded ? '−' : '+'}
            </Button>
          )}

          {/* Spacer for alignment when no expand button */}
          {!hasChildren && level === 0 && <styled.div w={5} flexShrink={0} />}

          {/* Category content */}
          <Stack gap={3} flex={1} py={3}>
            <Link
              href={`/dashboard/brands/${brandId}/catalogs/${catalogId}/categories/${category.category_id}`}
            >
              <styled.p
                fontSize="sm"
                fontWeight="medium"
                color="gray.900"
                _hover={{ color: 'blue.600' }}
                cursor="pointer"
                transition="all 0.2s"
              >
                {category.name}
              </styled.p>
            </Link>
            {category.description && (
              <styled.p fontSize="xs" color="gray.500">
                {category.description}
              </styled.p>
            )}
          </Stack>
        </Flex>
      </styled.td>

      {/* Slug */}
      <styled.td>
        <styled.p fontSize="xs" color="gray.500" fontFamily="mono" whiteSpace="nowrap">
          /{category.slug}
        </styled.p>
      </styled.td>

      {/* Status */}
      <styled.td>
        <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
      </styled.td>
    </styled.tr>
  )
}
