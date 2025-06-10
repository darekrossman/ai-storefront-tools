'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { createProduct, type CreateProductData } from '@/actions/products'

interface CreateProductFormProps {
  projectId: number
  catalogId: string
  categories?: Array<{ category_id: string; name: string }>
}

type FormState = {
  error?: string
  message?: string
  success?: boolean
  productId?: number
}

async function submitProductForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const catalogId = formData.get('catalogId') as string
    const categoryId = formData.get('categoryId') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const metaTitle = formData.get('metaTitle') as string
    const metaDescription = formData.get('metaDescription') as string
    const tags = formData.get('tags') as string
    const status = (formData.get('status') as string) || 'draft'

    // Validate required fields
    if (!name?.trim()) {
      return { error: 'Product name is required' }
    }

    if (!catalogId?.trim()) {
      return { error: 'Catalog ID is required' }
    }

    // Parse tags
    const tagsArray =
      tags && tags.trim()
        ? tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : []

    // Create product data
    const productData: CreateProductData = {
      catalog_id: catalogId,
      parent_category_id: categoryId && categoryId.trim() ? categoryId : null,
      name: name.trim(),
      description: description && description.trim() ? description.trim() : '',
      short_description: '', // This field is required in the database
      specifications: {},
      attributes: {},
      meta_title: metaTitle && metaTitle.trim() ? metaTitle.trim() : null,
      meta_description:
        metaDescription && metaDescription.trim() ? metaDescription.trim() : null,
      tags: tagsArray.length > 0 ? tagsArray : [],
      status: status as any,
      sort_order: 0,
    }

    // Create the product
    const result = await createProduct(productData)

    if (!result.success) {
      return { error: result.error || 'Failed to create product' }
    }

    return {
      success: true,
      productId: result.data?.id,
      message: 'Product created successfully!',
    }
  } catch (error) {
    console.error('Error creating product:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create product',
    }
  }
}

export default function CreateProductForm({
  projectId,
  catalogId,
  categories = [],
}: CreateProductFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(submitProductForm, {})

  // Handle successful creation
  if (state.success && state.productId) {
    // Redirect after successful creation
    setTimeout(() => {
      router.push(`/dashboard/projects/${projectId}/products/${state.productId}`)
    }, 2000)
  }

  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const input = e.target as HTMLInputElement
      const currentValue = input.value.trim()
      if (currentValue && !currentValue.includes(',')) {
        input.value = currentValue + ', '
      }
    }
  }

  return (
    <Box maxW="4xl" mx="auto">
      <form action={formAction}>
        <input type="hidden" name="catalogId" value={catalogId} />

        <Stack gap={8}>
          {/* Header */}
          <Stack gap={2}>
            <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
              Create New Product
            </styled.h1>
            <styled.p fontSize="sm" color="gray.600">
              Add a new product to your catalog with details, attributes, and metadata.
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
                  Redirecting to product page...
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
                Basic Information
              </styled.h3>

              <Stack gap={4}>
                {/* Product Name */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="name"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Product Name *
                  </styled.label>
                  <styled.input
                    id="name"
                    name="name"
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
                    placeholder="Enter product name"
                  />
                </Stack>

                {/* Category */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="categoryId"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Category
                  </styled.label>
                  <styled.select
                    id="categoryId"
                    name="categoryId"
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
                    <option value="">Select a category (optional)</option>
                    {categories.map((category) => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.name}
                      </option>
                    ))}
                  </styled.select>
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
                    placeholder="Describe the product features, benefits, and details..."
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
                </Stack>
              </Stack>
            </Stack>
          </Box>

          {/* SEO & Marketing */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={6}
          >
            <Stack gap={6}>
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                SEO & Marketing
              </styled.h3>

              <Stack gap={4}>
                {/* Meta Title */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="metaTitle"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Meta Title
                  </styled.label>
                  <styled.input
                    id="metaTitle"
                    name="metaTitle"
                    type="text"
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
                    placeholder="SEO-optimized title for search engines"
                  />
                </Stack>

                {/* Meta Description */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="metaDescription"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Meta Description
                  </styled.label>
                  <styled.textarea
                    id="metaDescription"
                    name="metaDescription"
                    disabled={isPending}
                    rows={3}
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
                    placeholder="Brief description for search engine results (150-160 characters)"
                  />
                </Stack>

                {/* Tags */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="tags"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Tags
                  </styled.label>
                  <styled.input
                    id="tags"
                    name="tags"
                    type="text"
                    disabled={isPending}
                    onKeyDown={handleTagsKeyDown}
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
                    placeholder="Enter tags separated by commas (e.g., clothing, summer, cotton)"
                  />
                  <styled.p fontSize="xs" color="gray.500">
                    Separate multiple tags with commas. Press Enter to add a comma.
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
              {isPending ? 'Creating...' : 'Create Product'}
            </styled.button>
          </Flex>

          {/* Next Steps */}
          <Box
            bg="blue.50"
            border="1px solid"
            borderColor="blue.200"
            borderRadius="lg"
            p={4}
          >
            <Stack gap={2}>
              <styled.h4 fontSize="sm" fontWeight="medium" color="blue.900">
                After creating your product
              </styled.h4>
              <styled.ul fontSize="sm" color="blue.700" pl={4}>
                <styled.li>
                  Add product variants (different colors, sizes, etc.)
                </styled.li>
                <styled.li>Define product attributes and options</styled.li>
                <styled.li>Upload product images and organize them by type</styled.li>
                <styled.li>Set pricing and inventory for each variant</styled.li>
              </styled.ul>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Box>
  )
}
