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

type FullProductSchemaType = z.infer<typeof fullProductSchema>

function ProductCard({
  product,
  onInvalid,
  index,
}: {
  product: FullProductSchemaType['products'][0]
  onInvalid?: () => void
  index: number
}) {
  const isValid = productSchemaWithVariants.safeParse(product)

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      p={6}
      shadow="sm"
      _hover={{ shadow: 'md', borderColor: 'gray.300' }}
      transition="all 0.2s"
    >
      <Stack gap={4}>
        <Flex justify="space-between" align="start">
          <styled.h3
            fontSize="lg"
            fontWeight="semibold"
            color="gray.900"
            lineHeight="tight"
          >
            {product.name}
          </styled.h3>
          <Box
            px={2}
            py={1}
            bg={isValid.success ? 'green.50' : 'red.50'}
            color={isValid.success ? 'green.700' : 'red.700'}
            borderRadius="md"
            fontSize="xs"
            fontWeight="medium"
          >
            {isValid.success ? 'Valid' : 'Invalid'}
          </Box>
        </Flex>

        <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
          {product.short_description}
        </styled.p>

        <Flex gap={4} fontSize="xs" color="gray.500">
          <styled.span>Category: {product.parent_category_id}</styled.span>
          <styled.span>Variants: {product.variants?.length || 0}</styled.span>
        </Flex>
      </Stack>
    </Box>
  )
}

function ProductsDisplay({ products }: { products: FullProductSchemaType['products'] }) {
  return (
    <Box w="full">
      <styled.h2 fontSize="2xl" fontWeight="bold" color="gray.900" mb={6}>
        Generated Products
        <styled.span fontSize="lg" fontWeight="normal" color="gray.500" ml={2}>
          ({products.length})
        </styled.span>
      </styled.h2>
      <Stack gap={4} w="full">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} index={index} />
        ))}
      </Stack>
    </Box>
  )
}

export default function ProductsGeneration({
  catalogId,
  projectId,
}: {
  catalogId: string
  projectId: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('category')
  const [count, setCount] = useState(3)

  const { object, submit, isLoading, stop } = useObject({
    api: '/api/agents/products',
    schema: fullProductSchema,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    submit({
      catalogId,
      categoryId,
      count,
    })
  }

  const handleSave = async () => {
    if (!object || !catalogId || isSaving) return
    const fullProductSchemaData = object as z.infer<typeof fullProductSchema>

    setIsSaving(true)
    try {
      const result = await createMultipleProducts(catalogId, fullProductSchemaData)

      if (result.success) {
        router.push(`/dashboard/projects/${projectId}/catalogs/${catalogId}`)
      } else {
        console.error('Error saving catalog:', result.error)
      }
    } catch (error) {
      console.error('Error saving catalog:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Count completed products during streaming
  const completedProductsCount = object?.products
    ? object.products.filter((p) => p && p.name && p.variants && p.variants.length > 0)
        .length
    : 0

  if (isLoading) {
    const completedProducts = object?.products
      ? object.products.filter((p) => p && p.name && p.variants && p.variants.length > 0)
      : []

    return (
      <Box maxW="4xl" mx="auto" p={6}>
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
                <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
                  Generating Products
                </styled.h1>
                <styled.p fontSize="lg" color="gray.600">
                  AI is creating {count} products for your catalog
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
                    Progress: {completedProductsCount} of {count} completed
                  </styled.p>
                  <Box w="full" h="3" bg="blue.100" borderRadius="full" overflow="hidden">
                    <styled.div
                      h="full"
                      bg="blue.500"
                      borderRadius="full"
                      style={{
                        width: `${(completedProductsCount / count) * 100}%`,
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

          {/* Show completed products as they stream in */}
          {completedProducts.length > 0 && (
            <Box w="full" maxW="4xl">
              <ProductsDisplay
                products={completedProducts as FullProductSchemaType['products']}
              />
            </Box>
          )}
        </Stack>
      </Box>
    )
  }

  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <Stack gap={8}>
        {/* Header */}
        <Box>
          <styled.h1 fontSize="3xl" fontWeight="bold" color="gray.900" mb={2}>
            Generate Products
          </styled.h1>
          <styled.p fontSize="lg" color="gray.600">
            Use AI to automatically generate products for your catalog
          </styled.p>
        </Box>

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
                htmlFor="count-input"
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                display="block"
                mb={2}
              >
                Number of products to generate
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
                px={4}
                py={3}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="lg"
                fontSize="base"
                w="32"
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
                Choose between 1-20 products (recommended: 3-5)
              </styled.p>
            </Box>

            <Flex gap={4} alignItems="center">
              <Button onClick={handleSubmit} disabled={isLoading} size="lg">
                {isLoading ? 'Generating...' : 'Generate Products'}
              </Button>

              {object?.products &&
                object.products.every((p) => p && p.name && p.variants) && (
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    variant="primary"
                    size="lg"
                  >
                    {isSaving ? 'Saving...' : 'Save Products'}
                  </Button>
                )}
            </Flex>
          </Stack>
        </Box>

        {/* Results */}
        {object?.products && object.products.every((p) => p && p.name && p.variants) && (
          <ProductsDisplay
            products={object.products as FullProductSchemaType['products']}
          />
        )}
      </Stack>
    </Box>
  )
}
