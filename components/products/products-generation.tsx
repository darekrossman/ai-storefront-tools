'use client'

import { convertToDBFormat } from '@/lib/products/helpers'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Box, Stack, styled, Flex, Grid } from '@/styled-system/jsx'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {
  fullProductSchema,
  productSchema,
  productSchemaWithVariants,
} from '@/lib/products/schemas'
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
  console.log(product)
  // useEffect(() => {
  //   if (!isValid.success) {
  //     onInvalid?.()
  //   }
  // }, [isValid.success, onInvalid])

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p={5}
      shadow="sm"
      fontSize="xs"
    >
      <Stack gap={2}>
        <styled.p>{product.name}</styled.p>
        <styled.p>{product.parent_category_id}</styled.p>
        <styled.p>{product.short_description}</styled.p>
        <styled.p>{isValid.success ? 'valid' : 'invalid'}</styled.p>
      </Stack>
    </Box>
  )
}

function ProductsDisplay({ products }: { products: FullProductSchemaType['products'] }) {
  return (
    <Box w="full">
      <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900" mb={4}>
        Generated Products ({products.length})
      </styled.h2>
      <Stack gap={3} w="full">
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

  const { object, submit, isLoading, stop } = useObject({
    api: '/api/agents/products',
    schema: fullProductSchema,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    // Submit the form data to the AI agent
    submit({
      catalogId,
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
      <Stack gap={6} alignItems="flex-start">
        {/* Loading Header */}
        <Box textAlign="center" w="full">
          <Stack gap={4} alignItems="center">
            <Box
              w={8}
              h={8}
              bg="blue.100"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <styled.div
                w={4}
                h={4}
                bg="blue.500"
                borderRadius="full"
                style={{
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </Box>
            <styled.h2 fontSize="lg" fontWeight="medium" color="gray.700">
              Generating Products
            </styled.h2>
            {completedProductsCount > 0 && (
              <Box
                bg="blue.50"
                border="1px solid"
                borderColor="blue.200"
                borderRadius="md"
                px={4}
                py={2}
              >
                <styled.p fontSize="sm" color="blue.700" fontWeight="medium">
                  {completedProductsCount} of 15 products completed
                </styled.p>
                <styled.div
                  w="200px"
                  h="2px"
                  bg="blue.200"
                  borderRadius="full"
                  mt={2}
                  overflow="hidden"
                >
                  <styled.div
                    h="full"
                    bg="blue.500"
                    borderRadius="full"
                    style={{
                      width: `${(completedProductsCount / 15) * 100}%`,
                      transition: 'width 0.3s ease-in-out',
                    }}
                  />
                </styled.div>
              </Box>
            )}

            <Button onClick={stop} variant="secondary">
              Stop Generation
            </Button>
          </Stack>
        </Box>

        {/* Show completed products as they stream in */}
        {completedProducts.length > 0 && (
          <Box w="full">
            <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900" mb={4}>
              Generated Products ({completedProducts.length})
            </styled.h3>
            <Stack gap={3}>
              {completedProducts.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product as FullProductSchemaType['products'][0]}
                  index={index}
                  onInvalid={() => {
                    alert('Invalid product. Stopping generation.')
                    console.log('Invalid product', product)
                    stop()
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    )
  }

  return (
    <Stack gap={6} alignItems="flex-start">
      <Flex gap={3} alignItems="center">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Products'}
        </Button>

        {object?.products && object.products.every((p) => p && p.name && p.variants) && (
          <Button onClick={handleSave} disabled={isSaving} variant="primary">
            {isSaving ? 'Saving...' : 'Save Products'}
          </Button>
        )}
      </Flex>

      {object?.products && object.products.every((p) => p && p.name && p.variants) && (
        <ProductsDisplay
          products={object.products as FullProductSchemaType['products']}
        />
      )}
    </Stack>
  )
}
