'use client'

import { convertToDBFormat } from '@/lib/products/helpers'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Box, Stack, styled, Flex, Grid } from '@/styled-system/jsx'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { fullProductSchema, productSchemaWithVariants } from '@/lib/products/schemas'
import { createMultipleProducts } from '@/actions/products'
import { ProductCatalog, Category } from '@/lib/supabase/database-types'
import { getCategoriesAction } from '@/actions/categories'
import { useBrand } from '@/components/brand-context'
import { Card } from '../ui/card'

function ProductCard({
  product,
  onInvalid,
  index,
}: {
  product: z.infer<typeof productSchemaWithVariants>
  onInvalid?: () => void
  index: number
}) {
  return (
    <Card>
      <Stack gap={2}>
        <Flex justify="space-between" align="start">
          <styled.h3 fontSize="md" fontWeight="medium" lineHeight="1.3">
            {product.name}
          </styled.h3>
        </Flex>

        <styled.p fontSize="xs" color="gray.600" lineHeight="1.4">
          {product.short_description}
        </styled.p>

        {/* <Flex gap={4} fontSize="xs" color="gray.500">
          <styled.span>Category: {product.parent_category_id}</styled.span>
          <styled.span>Variants: {product.variants?.length || 0}</styled.span>
        </Flex> */}
      </Stack>
    </Card>
  )
}

function ProductsDisplay({
  products,
}: { products: z.infer<typeof productSchemaWithVariants>[] }) {
  return (
    <Box w="full">
      <Grid gridTemplateColumns="repeat(4, minmax(200px, 1fr))" gap={4}>
        {products.map((product, index) => (
          <ProductCard key={index} product={product} index={index} />
        ))}
      </Grid>
    </Box>
  )
}

export default function ProductsGeneration({ catalogs }: { catalogs: ProductCatalog[] }) {
  const router = useRouter()
  const { id, slug } = useBrand()
  const [count, setCount] = useState(3)
  const [catalogId, setCatalogId] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  const { object, submit, isLoading, stop } = useObject({
    api: '/api/agents/products',
    schema: fullProductSchema,
  })

  console.log('object', object)

  const [isSaving, setIsSaving] = useState(false)

  // Fetch categories when catalog is selected
  useEffect(() => {
    if (catalogId) {
      setLoadingCategories(true)
      getCategoriesAction(catalogId)
        .then((fetchedCategories) => {
          setCategories(fetchedCategories)
          setSelectedCategoryIds([]) // Reset selected categories
        })
        .catch((error) => {
          console.error('Error fetching categories:', error)
          setCategories([])
        })
        .finally(() => {
          setLoadingCategories(false)
        })
    } else {
      setCategories([])
      setSelectedCategoryIds([])
    }
  }, [catalogId])

  const handleSubmit = (e: React.FormEvent) => {
    submit({
      catalogId,
      categoryIds: selectedCategoryIds,
      count,
    })
  }

  const handleSave = async () => {
    if (!object || !catalogId || isSaving) return

    setIsSaving(true)
    const productsInCategories = Object.keys(object || {})
      .map((key) => {
        if (selectedCategoryIds.includes(key)) {
          return object?.[key]?.products
        }
      })
      .flat() as z.infer<typeof productSchemaWithVariants>[]
    try {
      const result = await createMultipleProducts(catalogId, productsInCategories)

      if (result.success) {
        router.push(`/brands/${slug}/products`)
      } else {
        console.error('Error saving catalog:', result.error)
      }
    } catch (error) {
      console.error('Error saving catalog:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Group categories by parent
  const parentCategories = categories.filter((cat) => !cat.parent_category_id)
  const getSubcategories = (parentId: string) =>
    categories.filter((cat) => cat.parent_category_id === parentId)

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    )
  }

  // Count completed products during streaming
  const totalExpectedProducts = count * selectedCategoryIds.length

  const productsInCategories = Object.keys(object || {})
    .map((key) => {
      if (selectedCategoryIds.includes(key)) {
        return object?.[key]?.products
      }
    })
    .filter(Boolean)
    .flat()

  console.log('productsInCategories', productsInCategories)

  const completedProducts = productsInCategories
    ? productsInCategories.filter(
        (p) => p && p.name && p.variants && p.variants.length > 0,
      )
    : []

  const completedProductsCount = completedProducts.length

  if (isLoading) {
    return (
      <Stack gap={8} alignItems="center">
        {/* Loading Header */}
        <Box textAlign="center" w="full">
          <Stack gap={6} alignItems="center">
            <Box
              w={16}
              h={16}
              bg="blue.50"
              border="2px solid"
              borderColor="blue.200"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <styled.div
                w={6}
                h={6}
                bg="blue.500"
                borderRadius="full"
                style={{
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </Box>

            <Stack gap={2} alignItems="center">
              <styled.h1 fontSize="xl" fontWeight="bold" color="gray.900">
                Generating Products
              </styled.h1>
              <styled.p fontSize="md" color="gray.600">
                AI is creating {totalExpectedProducts} products for your catalog
              </styled.p>
            </Stack>

            {completedProductsCount > 0 && (
              <Box
                bg="blue.50"
                border="1px solid"
                borderColor="blue.200"
                borderRadius="lg"
                p={6}
                w="full"
                maxW="md"
              >
                <styled.p fontSize="base" color="blue.900" fontWeight="semibold" mb={3}>
                  Progress: {completedProductsCount} of {totalExpectedProducts} completed
                </styled.p>
                <Box w="full" h="3" bg="blue.100" borderRadius="full" overflow="hidden">
                  <styled.div
                    h="full"
                    bg="blue.500"
                    borderRadius="full"
                    style={{
                      width: `${(completedProductsCount / totalExpectedProducts) * 100}%`,
                      transition: 'width 0.3s ease-in-out',
                    }}
                  />
                </Box>
              </Box>
            )}

            <Button onClick={stop} variant="secondary" size="lg">
              Stop Generation
            </Button>
          </Stack>
        </Box>

        {/* Results */}
        {productsInCategories && (
          <ProductsDisplay
            products={productsInCategories as z.infer<typeof productSchemaWithVariants>[]}
          />
        )}
      </Stack>
    )
  }

  return (
    <Stack gap={6} pb="12">
      {/* Form Controls */}
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        p={6}
        shadow="sm"
      >
        <Stack gap={6}>
          <Box>
            <styled.label
              htmlFor="catalog-select"
              fontSize="sm"
              fontWeight="semibold"
              color="gray.700"
              display="block"
              mb={2}
            >
              Select Catalog
            </styled.label>
            <styled.select
              id="catalog-select"
              value={catalogId}
              onChange={(e) => setCatalogId(e.target.value)}
              disabled={isLoading}
              px={2}
              py={1}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="xs"
              fontSize="sm"
              w="full"
              maxW="md"
              bg="white"
              _focus={{
                outline: 'none',
                borderColor: 'blue.500',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              }}
              _disabled={{
                bg: 'gray.50',
                color: 'gray.500',
                cursor: 'not-allowed',
              }}
            >
              <option value="">Choose a catalog...</option>
              {catalogs.map((catalog) => (
                <option key={catalog.catalog_id} value={catalog.catalog_id}>
                  {catalog.name}
                </option>
              ))}
            </styled.select>
            <styled.p fontSize="sm" color="gray.500" mt={1}>
              Products will be added to the selected catalog
            </styled.p>
          </Box>

          {/* Categories Selection */}
          {catalogId && (
            <Box>
              <styled.label
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                display="block"
                mb={1}
              >
                Select Categories
              </styled.label>
              {loadingCategories ? (
                <Box p={4} textAlign="center">
                  <styled.p fontSize="sm" color="gray.500">
                    Loading categories...
                  </styled.p>
                </Box>
              ) : parentCategories.length === 0 ? (
                <Box p={4} textAlign="center">
                  <styled.p fontSize="sm" color="gray.500">
                    No categories found for this catalog.
                  </styled.p>
                </Box>
              ) : (
                <Box
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="xs"
                  p={2}
                  h="360px"
                  overflowY="auto"
                  bg="white"
                >
                  <Stack gap={4}>
                    {parentCategories.map((parentCategory) => {
                      const subcategories = getSubcategories(parentCategory.category_id)
                      return (
                        <Box key={parentCategory.category_id}>
                          <styled.h4
                            fontSize="sm"
                            fontWeight="semibold"
                            color="gray.800"
                            mb={2}
                          >
                            {parentCategory.name}
                          </styled.h4>
                          {subcategories.length > 0 ? (
                            <Stack gap={2} pl={4}>
                              {subcategories.map((subcategory) => (
                                <Flex
                                  key={subcategory.category_id}
                                  align="center"
                                  gap={2}
                                >
                                  <styled.input
                                    type="checkbox"
                                    id={`category-${subcategory.category_id}`}
                                    checked={selectedCategoryIds.includes(
                                      subcategory.category_id,
                                    )}
                                    onChange={() =>
                                      handleCategoryToggle(subcategory.category_id)
                                    }
                                    disabled={isLoading}
                                    w={4}
                                    h={4}
                                    accentColor="blue.500"
                                  />
                                  <styled.label
                                    htmlFor={`category-${subcategory.category_id}`}
                                    fontSize="sm"
                                    color="gray.700"
                                    cursor="pointer"
                                    flex="1"
                                  >
                                    {subcategory.name}
                                  </styled.label>
                                </Flex>
                              ))}
                            </Stack>
                          ) : (
                            <Flex align="center" gap={2} pl={4}>
                              <styled.input
                                type="checkbox"
                                id={`category-${parentCategory.category_id}`}
                                checked={selectedCategoryIds.includes(
                                  parentCategory.category_id,
                                )}
                                onChange={() =>
                                  handleCategoryToggle(parentCategory.category_id)
                                }
                                disabled={isLoading}
                                w={4}
                                h={4}
                                accentColor="blue.500"
                              />
                              <styled.label
                                htmlFor={`category-${parentCategory.category_id}`}
                                fontSize="sm"
                                color="gray.700"
                                cursor="pointer"
                                flex="1"
                              >
                                No subcategories
                              </styled.label>
                            </Flex>
                          )}
                        </Box>
                      )
                    })}
                  </Stack>
                </Box>
              )}
              <styled.p fontSize="sm" color="gray.500" mt={1}>
                Select categories to generate products for ({selectedCategoryIds.length}{' '}
                selected)
              </styled.p>
            </Box>
          )}

          <Box>
            <styled.label
              htmlFor="count-input"
              fontSize="sm"
              fontWeight="semibold"
              color="gray.700"
              display="block"
              mb={2}
            >
              Products per category
            </styled.label>
            <styled.input
              id="count-input"
              type="number"
              value={count}
              onChange={(e) =>
                setCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))
              }
              min="1"
              max="20"
              disabled={isLoading}
              pl={2}
              py={1}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="xs"
              fontSize="base"
              w="60px"
              bg="white"
              _focus={{
                outline: 'none',
                borderColor: 'blue.500',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              }}
              _disabled={{
                bg: 'gray.50',
                color: 'gray.500',
                cursor: 'not-allowed',
              }}
            />
            <styled.p fontSize="sm" color="gray.500" mt={1}>
              {selectedCategoryIds.length > 0
                ? `Total: ${count * selectedCategoryIds.length} products (${count} per category × ${selectedCategoryIds.length} categories)`
                : `Choose between 1-20 products per category (recommended: 3-5)`}
            </styled.p>
          </Box>

          <Flex gap={4} alignItems="center">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !catalogId || selectedCategoryIds.length === 0}
              size="sm"
            >
              {isLoading ? 'Generating...' : 'Generate Products'}
            </Button>

            {productsInCategories.length > 0 &&
              !isLoading &&
              productsInCategories.every((p) => p && p.name && p.variants) && (
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  variant="primary"
                  size="sm"
                >
                  {isSaving ? 'Saving...' : 'Save Products'}
                </Button>
              )}
          </Flex>
        </Stack>
      </Box>

      {/* Results */}
      {productsInCategories && (
        <ProductsDisplay
          products={productsInCategories as z.infer<typeof productSchemaWithVariants>[]}
        />
      )}
    </Stack>
  )
}
