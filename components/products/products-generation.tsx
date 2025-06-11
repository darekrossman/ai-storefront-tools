'use client'

import { convertToDBFormat } from '@/lib/products/helpers'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Box, Stack, styled, Flex } from '@/styled-system/jsx'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { fullProductSchema } from '@/lib/products/schemas'
import { createMultipleProducts } from '@/actions/products'

type FullProductSchemaType = z.infer<typeof fullProductSchema>

function ProductCard({
  product,
  index,
}: { product: FullProductSchemaType['products'][0]; index: number }) {
  const prices = product.variants.map((v) => v.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceDisplay =
    minPrice === maxPrice
      ? `$${minPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p={4}
      shadow="sm"
    >
      <Flex gap={4} alignItems="flex-start">
        {/* Left: Product Info */}
        <Box flex="1" minW="0">
          <Flex alignItems="center" gap={3} mb={2}>
            <styled.span
              bg="blue.100"
              color="blue.800"
              px={2}
              py={1}
              borderRadius="sm"
              fontSize="xs"
              fontWeight="medium"
              flexShrink="0"
            >
              #{index + 1}
            </styled.span>
            <styled.h3 fontSize="md" fontWeight="semibold" color="gray.900" truncate>
              {product.name}
            </styled.h3>
          </Flex>

          <styled.p fontSize="sm" color="gray.600" mb={1} lineHeight="1.4">
            {product.short_description}
          </styled.p>

          <styled.p fontSize="xs" color="gray.500" mb={2}>
            Category: {product.parent_category_id}
          </styled.p>

          {/* Tags */}
          <Flex gap={1} wrap="wrap" mb={2}>
            {product.tags.slice(0, 4).map((tag) => (
              <styled.span
                key={tag}
                bg="gray.100"
                color="gray.700"
                px={2}
                py={1}
                borderRadius="sm"
                fontSize="xs"
              >
                {tag}
              </styled.span>
            ))}
            {product.tags.length > 4 && (
              <styled.span fontSize="xs" color="gray.500">
                +{product.tags.length - 4}
              </styled.span>
            )}
          </Flex>
        </Box>

        {/* Middle: Attributes & Specs */}
        <Box flex="1" minW="0">
          {/* Attributes & Specs */}
          {(product.base_attributes.length > 0 || product.specifications.length > 0) && (
            <Box mb={3}>
              <styled.h4 fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>
                Attributes & Specs
              </styled.h4>
              <Flex gap={2} wrap="wrap" fontSize="xs">
                {product.base_attributes.slice(0, 3).map((attr) => (
                  <styled.span key={attr.key} color="gray.700">
                    <styled.span fontWeight="medium">{attr.key}:</styled.span>{' '}
                    {attr.value}
                  </styled.span>
                ))}
                {product.specifications.slice(0, 3).map((spec) => (
                  <styled.span key={spec.key} color="blue.700">
                    <styled.span fontWeight="medium">{spec.key}:</styled.span>{' '}
                    {spec.value}
                  </styled.span>
                ))}
              </Flex>
            </Box>
          )}

          {/* Variation Attributes */}
          {product.variation_attributes.length > 0 && (
            <Box>
              <styled.h4 fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>
                Variations
              </styled.h4>
              <Flex gap={2} wrap="wrap">
                {product.variation_attributes.map((attr) => (
                  <styled.span key={attr.attribute_key} fontSize="xs" color="purple.800">
                    <styled.span fontWeight="medium">{attr.attribute_label}:</styled.span>{' '}
                    {attr.attribute_options.length > 0
                      ? attr.attribute_options.join(', ')
                      : attr.attribute_type}
                  </styled.span>
                ))}
              </Flex>
            </Box>
          )}
        </Box>

        {/* Right: Price & Variants */}
        <Box flexShrink="0" textAlign="right">
          <styled.span
            fontSize="lg"
            fontWeight="semibold"
            color="green.700"
            display="block"
            mb={1}
          >
            {priceDisplay}
          </styled.span>
          <styled.span fontSize="xs" color="gray.600">
            {product.variants.length} variants
          </styled.span>
        </Box>
      </Flex>
    </Box>
  )
}

function ProductsDisplay({ products }: { products: FullProductSchemaType['products'] }) {
  return (
    <Box>
      <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900" mb={4}>
        Generated Products ({products.length})
      </styled.h2>
      <Stack gap={3}>
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

  const { object, submit, isLoading } = useObject({
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

  if (isLoading) {
    return (
      <Box textAlign="center" py={12}>
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
        </Stack>
      </Box>
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
