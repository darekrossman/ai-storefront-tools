'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import {
  createProductCatalogAction,
  type CreateProductCatalogData,
} from '@/actions/product-catalogs'

interface CreateCatalogFormProps {
  projectId: number
  brandId: number
}

type FormState = {
  error?: string
  message?: string
  success?: boolean
  catalogId?: string
}

async function submitCatalogForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const brandId = parseInt(formData.get('brandId') as string)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const slug = formData.get('slug') as string
    const status = formData.get('status') as string

    if (!name?.trim()) {
      return { error: 'Catalog name is required' }
    }

    if (!slug?.trim()) {
      return { error: 'Catalog slug is required' }
    }

    // Generate a unique catalog_id
    const catalog_id = `catalog_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    // Create catalog data
    const catalogData: CreateProductCatalogData = {
      brand_id: brandId,
      catalog_id: catalog_id,
      name: name.trim(),
      description: description?.trim() || null,
      slug: slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-'),
      status: status as any,
      settings: {},
    }

    // Create the catalog
    const catalog = await createProductCatalogAction(catalogData)

    return {
      success: true,
      catalogId: catalog.catalog_id,
      message: 'Product catalog created successfully!',
    }
  } catch (error) {
    console.error('Error creating catalog:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create catalog',
    }
  }
}

export default function CreateCatalogForm({
  projectId,
  brandId,
}: CreateCatalogFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(submitCatalogForm, {})

  // Handle successful creation
  if (state.success && state.catalogId) {
    // Redirect after successful creation
    setTimeout(() => {
      router.push(`/dashboard/projects/${projectId}/catalogs/${state.catalogId}`)
    }, 2000)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    // Update slug field
    const slugField = document.getElementById('slug') as HTMLInputElement
    if (slugField) {
      slugField.value = slug
    }
  }

  return (
    <Box maxW="2xl" mx="auto">
      <form action={formAction}>
        <input type="hidden" name="brandId" value={brandId} />

        <Stack gap={8}>
          {/* Header */}
          <Stack gap={2}>
            <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
              Create New Product Catalog
            </styled.h1>
            <styled.p fontSize="sm" color="gray.600">
              Organize your products into collections, seasons, or categories.
            </styled.p>
          </Stack>

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
              {state.success && (
                <styled.p fontSize="xs" color="green.600" mt={1}>
                  Redirecting to catalog page...
                </styled.p>
              )}
            </Box>
          )}

          {/* Basic Information */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={6}
          >
            <Stack gap={6}>
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                Catalog Information
              </styled.h3>

              <Stack gap={4}>
                {/* Catalog Name */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="name"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Catalog Name *
                  </styled.label>
                  <styled.input
                    id="name"
                    name="name"
                    type="text"
                    required
                    disabled={isPending}
                    onChange={handleNameChange}
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
                    placeholder="Enter catalog name (e.g., Summer Collection 2024)"
                  />
                </Stack>

                {/* Catalog Slug */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="slug"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    URL Slug *
                  </styled.label>
                  <styled.input
                    id="slug"
                    name="slug"
                    type="text"
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
                    placeholder="summer-collection-2024"
                  />
                  <styled.p fontSize="xs" color="gray.500">
                    URL-friendly identifier for your catalog. Auto-generated from name.
                  </styled.p>
                </Stack>

                {/* Description */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="description"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Description
                  </styled.label>
                  <styled.textarea
                    id="description"
                    name="description"
                    disabled={isPending}
                    rows={4}
                    px={3}
                    py={2}
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    fontSize="sm"
                    resize="vertical"
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
                    placeholder="Describe this catalog and what products it will contain..."
                  />
                </Stack>

                {/* Status */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="status"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Status
                  </styled.label>
                  <styled.select
                    id="status"
                    name="status"
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
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </styled.select>
                  <styled.p fontSize="xs" color="gray.500">
                    Draft catalogs are not visible to customers until made active.
                  </styled.p>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          {/* Form Actions */}
          <Flex gap={3}>
            <styled.button
              type="button"
              onClick={() => router.back()}
              disabled={isPending}
              px={4}
              py={2}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="lg"
              fontSize="sm"
              fontWeight="medium"
              bg="white"
              color="gray.700"
              cursor="pointer"
              _hover={{
                bg: 'gray.50',
                borderColor: 'gray.400',
              }}
              _disabled={{
                opacity: '0.5',
                cursor: 'not-allowed',
              }}
              transition="all 0.2s"
            >
              Cancel
            </styled.button>

            <styled.button
              type="submit"
              disabled={isPending}
              px={6}
              py={2}
              bg={isPending ? 'gray.400' : 'blue.600'}
              color="white"
              borderRadius="lg"
              fontSize="sm"
              fontWeight="medium"
              cursor={isPending ? 'not-allowed' : 'pointer'}
              _hover={{
                bg: isPending ? 'gray.400' : 'blue.700',
              }}
              transition="all 0.2s"
            >
              {isPending ? 'Creating...' : 'Create Catalog'}
            </styled.button>
          </Flex>
        </Stack>
      </form>
    </Box>
  )
}
