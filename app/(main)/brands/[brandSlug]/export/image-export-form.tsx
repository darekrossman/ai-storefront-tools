'use client'

import { useActionState } from 'react'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import type { Brand } from '@/lib/supabase/database-types'
import type { ProductWithRelations } from '@/actions/products'

interface ImageExportFormProps {
  brand: Brand
  products: ProductWithRelations[]
}

type FormState = {
  error?: string
  message?: string
  success?: boolean
}

async function exportImagesAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const brandId = formData.get('brandId') as string

  if (!brandId) {
    return { error: 'Brand ID is required' }
  }

  try {
    // Call the API endpoint to export images as ZIP
    const response = await fetch(`/api/brands/${brandId}/export-images`, {
      method: 'POST',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.error || 'Failed to export images' }
    }

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition')
    const filename =
      contentDisposition?.match(/filename="(.+)"/)?.[1] || 'product_images.zip'

    // Create blob and download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    return {
      message: `Successfully downloaded ${filename}`,
      success: true,
    }
  } catch (error) {
    console.error('Image export error:', error)
    return { error: 'An unexpected error occurred during image export' }
  }
}

export default function ImageExportForm({ brand, products }: ImageExportFormProps) {
  const [state, formAction, isPending] = useActionState(exportImagesAction, {})

  // Calculate total number of images
  const totalImages = products.reduce((total, product) => {
    return total + (product.product_images?.length || 0)
  }, 0)

  const hasImages = totalImages > 0

  return (
    <Box maxW="2xl">
      <form action={formAction}>
        <input type="hidden" name="brandId" value={brand.id} />

        <Stack gap={6}>
          {/* Error/Success Messages */}
          {state.error && (
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="lg"
              p={4}
            >
              <styled.p fontSize="sm" color="red.700">
                {state.error}
              </styled.p>
            </Box>
          )}

          {state.message && (
            <Box
              bg="green.50"
              border="1px solid"
              borderColor="green.200"
              borderRadius="lg"
              p={4}
            >
              <styled.p fontSize="sm" color="green.700">
                {state.message}
              </styled.p>
            </Box>
          )}

          {/* Form Content */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={6}
          >
            <Stack gap={6}>
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                Image Export Settings
              </styled.h3>

              <Stack gap={4}>
                {/* Export Statistics */}
                <Box
                  bg="blue.50"
                  border="1px solid"
                  borderColor="blue.200"
                  borderRadius="md"
                  p={4}
                >
                  <Stack gap={3}>
                    <styled.h4 fontSize="sm" fontWeight="medium" color="blue.900">
                      Export Summary
                    </styled.h4>
                    <Stack gap={2}>
                      <Flex justify="space-between" align="center">
                        <styled.span fontSize="sm" color="blue.700">
                          Total Products:
                        </styled.span>
                        <styled.span fontSize="sm" fontWeight="medium" color="blue.900">
                          {products.length}
                        </styled.span>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <styled.span fontSize="sm" color="blue.700">
                          Total Images:
                        </styled.span>
                        <styled.span fontSize="sm" fontWeight="medium" color="blue.900">
                          {totalImages}
                        </styled.span>
                      </Flex>
                    </Stack>
                  </Stack>
                </Box>

                {/* Export Info */}
                <Box
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={3}
                >
                  <Stack gap={2}>
                    <styled.h4 fontSize="sm" fontWeight="medium" color="gray.900">
                      What will be exported:
                    </styled.h4>
                    <styled.ul fontSize="xs" color="gray.700" lineHeight="relaxed" pl={4}>
                      <styled.li>• All product images from {brand.name}</styled.li>
                      <styled.li>• Images will be named with product names</styled.li>
                      <styled.li>• Downloads as a ZIP file for easy handling</styled.li>
                      <styled.li>• Original image quality and format preserved</styled.li>
                    </styled.ul>
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Box>

          {/* Form Actions */}
          <Flex gap={3} justify="end">
            <Button
              type="submit"
              disabled={isPending || !hasImages}
              variant={isPending ? 'secondary' : 'primary'}
            >
              {isPending ? 'Preparing ZIP...' : 'Download Images ZIP'}
            </Button>
          </Flex>

          {/* Empty State */}
          {!hasImages && (
            <Box
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
              textAlign="center"
            >
              <Stack gap={3} align="center">
                <styled.div fontSize="2xl" color="gray.400">
                  🖼️
                </styled.div>
                <Stack gap={1} textAlign="center">
                  <styled.h4 fontSize="md" fontWeight="medium" color="gray.900">
                    No images to export
                  </styled.h4>
                  <styled.p fontSize="sm" color="gray.600">
                    Add images to your products before you can export them.
                  </styled.p>
                </Stack>
              </Stack>
            </Box>
          )}
        </Stack>
      </form>
    </Box>
  )
}
