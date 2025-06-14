'use client'

import { useActionState } from 'react'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import type { ProductCatalog } from '@/lib/supabase/database-types'

interface ExportFormProps {
  catalogs: ProductCatalog[]
}

type FormState = {
  error?: string
  message?: string
  success?: boolean
}

async function exportCatalogAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const catalogId = formData.get('catalogId') as string

  if (!catalogId) {
    return { error: 'Please select a catalog to export' }
  }

  try {
    // Call the API endpoint to export the catalog
    const response = await fetch(`/api/catalogs/${catalogId}/export-shopify-csv`, {
      method: 'GET',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.error || 'Failed to export catalog' }
    }

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition')
    const filename =
      contentDisposition?.match(/filename="(.+)"/)?.[1] || 'catalog_export.csv'

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
      message: `Successfully exported catalog to ${filename}`,
      success: true,
    }
  } catch (error) {
    console.error('Export error:', error)
    return { error: 'An unexpected error occurred during export' }
  }
}

export default function ExportForm({ catalogs }: ExportFormProps) {
  const [state, formAction, isPending] = useActionState(exportCatalogAction, {})

  return (
    <Box maxW="2xl">
      <form action={formAction}>
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
                Export Settings
              </styled.h3>

              <Stack gap={4}>
                {/* Catalog Selection */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="catalogId"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Select Catalog *
                  </styled.label>
                  <styled.select
                    id="catalogId"
                    name="catalogId"
                    required
                    disabled={isPending}
                    px={3}
                    py={2}
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    fontSize="sm"
                    _focus={{
                      borderColor: 'blue.500',
                      outline: 'none',
                      ring: '2px',
                      ringColor: 'blue.200',
                    }}
                    _disabled={{
                      bg: 'gray.50',
                      cursor: 'not-allowed',
                    }}
                  >
                    <option value="">Choose a catalog to export</option>
                    {catalogs.map((catalog) => (
                      <option key={catalog.id} value={catalog.catalog_id}>
                        {catalog.name} ({catalog.total_products || 0} products)
                      </option>
                    ))}
                  </styled.select>
                  <styled.p fontSize="xs" color="gray.500">
                    Select which catalog you want to export to Shopify CSV format.
                  </styled.p>
                </Stack>

                {/* Export Format Info */}
                <Box
                  bg="blue.50"
                  border="1px solid"
                  borderColor="blue.200"
                  borderRadius="md"
                  p={3}
                >
                  <Stack gap={2}>
                    <styled.h4 fontSize="sm" fontWeight="medium" color="blue.900">
                      Export Format: Shopify CSV
                    </styled.h4>
                    <styled.p fontSize="xs" color="blue.700" lineHeight="relaxed">
                      Products will be exported in Shopify's CSV format with all required
                      fields including variants, images, and inventory data. The exported
                      file can be directly imported into your Shopify store.
                    </styled.p>
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Box>

          {/* Form Actions */}
          <Flex gap={3} justify="end">
            <Button
              type="submit"
              disabled={isPending || catalogs.length === 0}
              variant={isPending ? 'secondary' : 'primary'}
            >
              {isPending ? 'Exporting...' : 'Export to CSV'}
            </Button>
          </Flex>

          {/* Empty State */}
          {catalogs.length === 0 && (
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
                  📂
                </styled.div>
                <Stack gap={1} textAlign="center">
                  <styled.h4 fontSize="md" fontWeight="medium" color="gray.900">
                    No catalogs available
                  </styled.h4>
                  <styled.p fontSize="sm" color="gray.600">
                    Create a catalog with products before you can export.
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
