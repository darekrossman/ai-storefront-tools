'use client'

import { useState } from 'react'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import { ProductWithRelations } from '@/actions/products'
import { storeGeneratedImageAction } from '@/actions/storage'
import { GeneratedImageResponse } from '@/lib/types'

interface BulkImageGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  selectedProducts: ProductWithRelations[]
  onComplete: () => void
}

interface GenerationResult {
  productId: number
  productName: string
  success: boolean
  error?: string
}

export default function BulkImageGeneratorModal({
  isOpen,
  onClose,
  selectedProducts,
  onComplete,
}: BulkImageGeneratorModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResults, setGenerationResults] = useState<GenerationResult[]>([])
  const [completedCount, setCompletedCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  if (!isOpen) return null

  const generateImagesForProduct = async (
    product: ProductWithRelations,
  ): Promise<GenerationResult> => {
    try {
      const productInfo = {
        name: product.name,
        description: product.description,
        tags: product.tags,
        catalog: product.catalog_id,
        category: product.categories?.name,
        baseAttributes: product.base_attributes,
        specifications: product.specifications,
        attributes: product.product_variants?.[0]?.attributes,
      }

      const requestBody = {
        prompt: productInfo,
      }

      const response = await fetch('/api/agents/images', {
        method: 'POST',
        body: JSON.stringify({ ...requestBody }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const { data }: { data: GeneratedImageResponse } = await response.json()

      const result = await storeGeneratedImageAction(
        product.id,
        data,
        productInfo.attributes || {},
        'gallery',
      )

      if (!result.success) {
        throw new Error(result.error || 'Failed to save image')
      }

      return {
        productId: product.id,
        productName: product.name,
        success: true,
      }
    } catch (error) {
      console.error(`Error generating image for product ${product.id}:`, error)
      return {
        productId: product.id,
        productName: product.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerationResults([])
    setCompletedCount(0)
    setIsComplete(false)

    try {
      const promises = selectedProducts.map((product) =>
        generateImagesForProduct(product).then((result) => {
          setGenerationResults((prev) => [...prev, result])
          setCompletedCount((prev) => prev + 1)
          return result
        }),
      )

      const results = await Promise.all(promises)
      setIsComplete(true)

      // Call onComplete to refresh the parent component
      onComplete()
    } catch (error) {
      console.error('Error in bulk image generation:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    if (!isGenerating) {
      setIsComplete(false)
      setGenerationResults([])
      setCompletedCount(0)
      onClose()
    }
  }

  const successCount = generationResults.filter((r) => r.success).length
  const errorCount = generationResults.filter((r) => !r.success).length

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={50}
    >
      <Box
        bg="white"
        borderRadius="xl"
        maxWidth="500px"
        width="full"
        mx={4}
        maxHeight="80vh"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <Box px={6} py={4} borderBottom="1px solid" borderColor="gray.200">
          <styled.h2 fontSize="lg" fontWeight="semibold" color="gray.900">
            {isComplete ? 'Generation Complete' : 'Generate Images'}
          </styled.h2>
        </Box>

        {/* Content */}
        <Box px={6} py={4} flex={1} overflow="auto">
          <Stack gap={4}>
            {!isGenerating && !isComplete && (
              <>
                <styled.p fontSize="sm" color="gray.600">
                  Generate AI images for {selectedProducts.length} selected product
                  {selectedProducts.length === 1 ? '' : 's'}?
                </styled.p>
                <Box
                  bg="blue.50"
                  border="1px solid"
                  borderColor="blue.200"
                  borderRadius="md"
                  p={3}
                >
                  <styled.p fontSize="xs" color="blue.800">
                    This will create one gallery image for each selected product using
                    their product information.
                  </styled.p>
                </Box>
              </>
            )}

            {isGenerating && (
              <Stack gap={4}>
                <styled.p fontSize="sm" color="gray.600">
                  Generating images for {selectedProducts.length} products...
                </styled.p>

                {/* Progress Bar */}
                <Box>
                  <Flex justify="space-between" mb={2}>
                    <styled.span fontSize="xs" color="gray.500">
                      Progress
                    </styled.span>
                    <styled.span fontSize="xs" color="gray.500">
                      {completedCount} / {selectedProducts.length}
                    </styled.span>
                  </Flex>
                  <Box bg="gray.200" borderRadius="full" h={2} overflow="hidden">
                    <Box
                      bg="blue.500"
                      h="full"
                      borderRadius="full"
                      width={`${(completedCount / selectedProducts.length) * 100}%`}
                      transition="width 0.3s ease"
                    />
                  </Box>
                </Box>

                {/* Results List */}
                {generationResults.length > 0 && (
                  <Box maxHeight="200px" overflow="auto">
                    <Stack gap={2}>
                      {generationResults.map((result) => (
                        <Flex
                          key={result.productId}
                          align="center"
                          gap={3}
                          px={3}
                          py={2}
                          bg={result.success ? 'green.50' : 'red.50'}
                          borderRadius="md"
                          border="1px solid"
                          borderColor={result.success ? 'green.200' : 'red.200'}
                        >
                          <Box
                            w={2}
                            h={2}
                            borderRadius="full"
                            bg={result.success ? 'green.500' : 'red.500'}
                          />
                          <styled.span fontSize="xs" color="gray.700" flex={1}>
                            {result.productName}
                          </styled.span>
                          <styled.span
                            fontSize="xs"
                            color={result.success ? 'green.700' : 'red.700'}
                          >
                            {result.success ? 'Success' : 'Failed'}
                          </styled.span>
                        </Flex>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}

            {isComplete && (
              <Stack gap={4}>
                <Box textAlign="center">
                  <styled.div fontSize="3xl" mb={2}>
                    {errorCount === 0 ? '✅' : '⚠️'}
                  </styled.div>
                  <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900" mb={1}>
                    Generation Complete
                  </styled.h3>
                  <styled.p fontSize="sm" color="gray.600">
                    {successCount} image{successCount === 1 ? '' : 's'} generated
                    successfully
                    {errorCount > 0 && `, ${errorCount} failed`}
                  </styled.p>
                </Box>

                {errorCount > 0 && (
                  <Box
                    bg="yellow.50"
                    border="1px solid"
                    borderColor="yellow.200"
                    borderRadius="md"
                    p={3}
                  >
                    <styled.p fontSize="xs" color="yellow.800" mb={2}>
                      Failed products:
                    </styled.p>
                    <Stack gap={1}>
                      {generationResults
                        .filter((r) => !r.success)
                        .map((result) => (
                          <styled.div
                            key={result.productId}
                            fontSize="xs"
                            color="yellow.700"
                          >
                            • {result.productName}: {result.error}
                          </styled.div>
                        ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </Box>

        {/* Footer */}
        <Box px={6} py={4} borderTop="1px solid" borderColor="gray.200">
          <Flex gap={3} justify="flex-end">
            {!isGenerating && !isComplete && (
              <>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleGenerate}>
                  Generate
                </Button>
              </>
            )}

            {isGenerating && (
              <Button variant="secondary" disabled>
                Generating...
              </Button>
            )}

            {isComplete && (
              <Button variant="primary" onClick={handleClose}>
                Close
              </Button>
            )}
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}
