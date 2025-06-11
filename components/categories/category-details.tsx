'use client'

import { Box, Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import type { Category } from '@/lib/supabase/database-types'
import type { ProductWithRelations } from '@/actions/products'
import { button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getSubcategoriesAction } from '@/actions/categories'
import { getProductsByCategory } from '@/actions/products'

interface CategoryDetailsProps {
  category: Category
  products: ProductWithRelations[]
  projectId: number
  catalogId: string
}

export default function CategoryDetails({
  category,
  products,
  projectId,
  catalogId,
}: CategoryDetailsProps) {
  const [subcategories, setSubcategories] = useState<Category[]>([])
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(
    new Set(),
  )
  const [subcategoryProducts, setSubcategoryProducts] = useState<
    Record<string, ProductWithRelations[]>
  >({})
  const [loadingSubcategories, setLoadingSubcategories] = useState<Set<string>>(new Set())

  const getStatusVariant = (status: boolean) => {
    return status
      ? { variant: 'success' as const, text: 'Active' }
      : { variant: 'neutral' as const, text: 'Inactive' }
  }

  const statusInfo = getStatusVariant(category.is_active)

  // Load subcategories on mount
  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        const subs = await getSubcategoriesAction(category.category_id)
        setSubcategories(subs)
      } catch (error) {
        console.error('Failed to load subcategories:', error)
      }
    }

    loadSubcategories()
  }, [category.category_id])

  // Toggle subcategory expansion and load products if needed
  const toggleSubcategory = async (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories)

    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId)
    } else {
      newExpanded.add(subcategoryId)

      // Load products for this subcategory if not already loaded
      if (!subcategoryProducts[subcategoryId]) {
        setLoadingSubcategories((prev) => new Set(prev).add(subcategoryId))
        try {
          const products = await getProductsByCategory(subcategoryId)
          setSubcategoryProducts((prev) => ({
            ...prev,
            [subcategoryId]: products,
          }))
        } catch (error) {
          console.error('Failed to load products for subcategory:', error)
        } finally {
          setLoadingSubcategories((prev) => {
            const newLoading = new Set(prev)
            newLoading.delete(subcategoryId)
            return newLoading
          })
        }
      }
    }

    setExpandedSubcategories(newExpanded)
  }

  return (
    <Stack gap={8}>
      {/* Header */}
      <Stack gap={4}>
        {/* Breadcrumb */}
        <Stack gap={2}>
          <Flex align="center" gap={2} fontSize="sm" color="gray.600">
            <Link href={`/dashboard/projects/${projectId}`} className="hover-underline">
              Project
            </Link>
            <styled.span color="gray.400">/</styled.span>
            <Link
              href={`/dashboard/projects/${projectId}/catalogs/${catalogId}`}
              className="hover-underline"
            >
              Catalog
            </Link>
            <styled.span color="gray.400">/</styled.span>
            <styled.span color="gray.900" fontWeight="medium">
              {category.name}
            </styled.span>
          </Flex>
        </Stack>

        {/* Title and Actions */}
        <Flex justify="space-between" align="start" gap={4}>
          <Stack gap={3}>
            <Flex align="center" gap={3}>
              <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
                {category.name}
              </styled.h1>
              <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
            </Flex>

            {category.description && (
              <styled.p fontSize="base" color="gray.600" lineHeight="relaxed" maxW="2xl">
                {category.description}
              </styled.p>
            )}
          </Stack>

          <Flex gap={2} flexShrink={0}>
            <Link
              href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/categories/${category.category_id}/edit`}
              className={button({ variant: 'secondary', size: 'sm' })}
            >
              Edit Category
            </Link>
            <Link
              href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/products/new?category=${category.category_id}`}
              className={button({ size: 'sm' })}
            >
              Add Product
            </Link>
          </Flex>
        </Flex>

        {/* Category Stats */}
        <Box
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          p={6}
        >
          <Flex gap={8}>
            <Stack gap={1} textAlign="center">
              <styled.p fontSize="2xl" fontWeight="bold" color="gray.900">
                {products.length}
              </styled.p>
              <styled.p fontSize="sm" color="gray.600">
                Products
              </styled.p>
            </Stack>

            <styled.div w="1px" bg="gray.200" alignSelf="stretch" />

            <Stack gap={1} textAlign="center">
              <styled.p fontSize="2xl" fontWeight="bold" color="gray.900">
                {products.filter((p) => p.status === 'active').length}
              </styled.p>
              <styled.p fontSize="sm" color="gray.600">
                Active
              </styled.p>
            </Stack>

            <styled.div w="1px" bg="gray.200" alignSelf="stretch" />

            <Stack gap={1} textAlign="center">
              <styled.p fontSize="2xl" fontWeight="bold" color="gray.900">
                {products.filter((p) => p.status === 'draft').length}
              </styled.p>
              <styled.p fontSize="sm" color="gray.600">
                Draft
              </styled.p>
            </Stack>
          </Flex>
        </Box>
      </Stack>

      {/* Subcategories Section */}
      <Stack gap={6}>
        <Flex justify="space-between" align="center">
          <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
            Subcategories and Products
          </styled.h2>

          <Link
            href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/categories/new?parent=${category.category_id}`}
            className={button({ variant: 'secondary', size: 'sm' })}
          >
            Add Subcategory
          </Link>
        </Flex>

        {/* Subcategories with Products */}
        {subcategories.length === 0 && products.length === 0 ? (
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
                  No subcategories or products yet
                </styled.h3>
                <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                  Organize your catalog by creating subcategories or add products directly
                  to this category.
                </styled.p>
              </Stack>

              <Flex gap={2}>
                <Link
                  href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/categories/new?parent=${category.category_id}`}
                  className={button({ variant: 'secondary' })}
                >
                  Add Subcategory
                </Link>
                <Link
                  href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/products/new?category=${category.category_id}`}
                  className={button()}
                >
                  Add Product
                </Link>
              </Flex>
            </Stack>
          </Box>
        ) : (
          <Stack gap={4}>
            {/* Direct Products in this Category */}
            {products.length > 0 && (
              <SubcategoryProductSection
                title="Products in this category"
                products={products}
                isExpanded={true}
                onToggle={() => {}}
                hasToggle={false}
                projectId={projectId}
                catalogId={catalogId}
                categoryId={category.category_id}
              />
            )}

            {/* Subcategories */}
            {subcategories.map((subcategory) => {
              const isExpanded = expandedSubcategories.has(subcategory.category_id)
              const products = subcategoryProducts[subcategory.category_id] || []
              const isLoading = loadingSubcategories.has(subcategory.category_id)

              return (
                <SubcategoryProductSection
                  key={subcategory.category_id}
                  title={subcategory.name}
                  description={subcategory.description}
                  products={products}
                  isExpanded={isExpanded}
                  isLoading={isLoading}
                  onToggle={() => toggleSubcategory(subcategory.category_id)}
                  hasToggle={true}
                  projectId={projectId}
                  catalogId={catalogId}
                  categoryId={subcategory.category_id}
                />
              )
            })}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

// Product List Item for list view
interface ProductListItemProps {
  product: ProductWithRelations
  projectId: number
  catalogId: string
}

function ProductListItem({ product, projectId, catalogId }: ProductListItemProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return { variant: 'success' as const, text: 'Active' }
      case 'draft':
        return { variant: 'neutral' as const, text: 'Draft' }
      case 'archived':
        return { variant: 'neutral' as const, text: 'Archived' }
      default:
        return { variant: 'neutral' as const, text: status }
    }
  }

  const statusInfo = getStatusVariant(product.status)

  return (
    <Link href={`/dashboard/projects/${projectId}/products/${product.id}`}>
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        p={6}
        cursor="pointer"
        _hover={{ borderColor: 'gray.300', shadow: 'sm' }}
        transition="all 0.2s"
      >
        <Flex justify="space-between" align="start" gap={4}>
          <Stack gap={3} flex={1}>
            <Flex align="center" gap={3}>
              <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900">
                {product.name}
              </styled.h3>
              <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
            </Flex>

            {product.short_description && (
              <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                {product.short_description}
              </styled.p>
            )}

            <Flex gap={4} fontSize="xs" color="gray.500">
              {product.product_variants && product.product_variants.length > 0 && (
                <styled.span>
                  {product.product_variants.length} variant
                  {product.product_variants.length > 1 ? 's' : ''}
                </styled.span>
              )}
              {product.min_price && product.max_price && (
                <styled.span>
                  ${product.min_price.toFixed(2)}
                  {product.min_price !== product.max_price &&
                    ` - $${product.max_price.toFixed(2)}`}
                </styled.span>
              )}
            </Flex>
          </Stack>

          <styled.div fontSize="sm" color="gray.400">
            →
          </styled.div>
        </Flex>
      </Box>
    </Link>
  )
}

// Subcategory Product Section Component
interface SubcategoryProductSectionProps {
  title: string
  description?: string
  products: ProductWithRelations[]
  isExpanded: boolean
  isLoading?: boolean
  onToggle: () => void
  hasToggle: boolean
  projectId: number
  catalogId: string
  categoryId: string
}

function SubcategoryProductSection({
  title,
  description,
  products,
  isExpanded,
  isLoading = false,
  onToggle,
  hasToggle,
  projectId,
  catalogId,
  categoryId,
}: SubcategoryProductSectionProps) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      overflow="hidden"
    >
      {/* Header */}
      <Box p={4} borderBottom="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="center" gap={4}>
          <Stack gap={1} flex={1}>
            <Flex align="center" gap={3}>
              {hasToggle && (
                <Button
                  px={0}
                  w={6}
                  h={6}
                  variant="secondary"
                  flexShrink={0}
                  onClick={onToggle}
                  fontSize="xs"
                >
                  {isExpanded ? '−' : '+'}
                </Button>
              )}

              <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900">
                {title}
              </styled.h3>

              <styled.span fontSize="sm" color="gray.500">
                ({products.length} product{products.length !== 1 ? 's' : ''})
              </styled.span>
            </Flex>

            {description && (
              <styled.p fontSize="sm" color="gray.600" mt={1}>
                {description}
              </styled.p>
            )}
          </Stack>

          <Flex gap={2} flexShrink={0}>
            <Link
              href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/products/new?category=${categoryId}`}
              className={button({ variant: 'secondary', size: 'xs' })}
            >
              Add Product
            </Link>
            <Link
              href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/categories/${categoryId}`}
              className={button({ variant: 'secondary', size: 'xs' })}
            >
              View Category
            </Link>
          </Flex>
        </Flex>
      </Box>

      {/* Products */}
      {isExpanded && (
        <Box>
          {isLoading ? (
            <Box p={8} textAlign="center">
              <styled.div fontSize="sm" color="gray.500">
                Loading products...
              </styled.div>
            </Box>
          ) : products.length === 0 ? (
            <Box p={8} textAlign="center">
              <Stack gap={2} align="center">
                <styled.div fontSize="2xl" color="gray.400">
                  📦
                </styled.div>
                <styled.p fontSize="sm" color="gray.500">
                  No products in this {hasToggle ? 'subcategory' : 'category'} yet
                </styled.p>
                <Link
                  href={`/dashboard/projects/${projectId}/catalogs/${catalogId}/products/new?category=${categoryId}`}
                  className={button({ size: 'xs' })}
                >
                  Add First Product
                </Link>
              </Stack>
            </Box>
          ) : (
            <Stack gap={0}>
              {products.map((product, index) => (
                <CompactProductRow
                  key={product.id}
                  product={product}
                  projectId={projectId}
                  isLast={index === products.length - 1}
                />
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Box>
  )
}

// Compact Product Row Component
interface CompactProductRowProps {
  product: ProductWithRelations
  projectId: number
  isLast: boolean
}

function CompactProductRow({ product, projectId, isLast }: CompactProductRowProps) {
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
    <Link href={`/dashboard/projects/${projectId}/products/${product.id}`}>
      <Box
        p={4}
        borderBottom={!isLast ? '1px solid' : 'none'}
        borderColor="gray.100"
        cursor="pointer"
        _hover={{ bg: 'gray.50' }}
        transition="all 0.2s"
      >
        <Flex align="center" gap={4}>
          {/* Product Image */}
          <Box
            w={12}
            h={12}
            borderRadius="md"
            overflow="hidden"
            bg="gray.100"
            flexShrink={0}
          >
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

          {/* Product Info */}
          <Stack gap={1} flex={1} minW={0}>
            <Flex align="center" gap={2}>
              <styled.h4
                fontSize="sm"
                fontWeight="medium"
                color="gray.900"
                truncate
                title={product.name}
              >
                {product.name}
              </styled.h4>
              <styled.span
                fontSize="xs"
                fontWeight="medium"
                px={2}
                py={0.5}
                borderRadius="sm"
                bg={statusColor.bg}
                color={statusColor.color}
                flexShrink={0}
              >
                {product.status}
              </styled.span>
            </Flex>

            {product.short_description && (
              <styled.p
                fontSize="xs"
                color="gray.500"
                truncate
                title={product.short_description}
              >
                {product.short_description}
              </styled.p>
            )}
          </Stack>

          {/* Stats */}
          <Flex gap={4} align="center" fontSize="xs" color="gray.500" flexShrink={0}>
            <styled.span>
              {variantCount} variant{variantCount !== 1 ? 's' : ''}
            </styled.span>
            {product.min_price !== null && (
              <styled.span fontWeight="medium" color="gray.900">
                {product.min_price === product.max_price
                  ? `$${product.min_price.toFixed(2)}`
                  : `$${product.min_price.toFixed(2)} - $${product.max_price?.toFixed(2)}`}
              </styled.span>
            )}
          </Flex>

          {/* Arrow */}
          <styled.div fontSize="sm" color="gray.400" flexShrink={0}>
            →
          </styled.div>
        </Flex>
      </Box>
    </Link>
  )
}
