'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { createBrandAction, type CreateBrandData } from '@/actions/brands'
import { uploadBrandLogoAction } from '@/actions/storage'
import { useState } from 'react'

interface CreateBrandFormProps {
  projectId: number
}

type FormState = {
  error?: string
  message?: string
  success?: boolean
  brandId?: number
}

async function submitBrandForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const projectId = parseInt(formData.get('projectId') as string)

    // Extract form values
    const name = formData.get('name') as string
    const tagline = formData.get('tagline') as string
    const mission = formData.get('mission') as string
    const vision = formData.get('vision') as string
    const values = formData.get('values') as string
    const status = (formData.get('status') as string) || 'draft'

    // Validate required fields
    if (!name?.trim()) {
      return { error: 'Brand name is required' }
    }

    // Parse values array
    const valuesArray = values
      ? values
          .split(',')
          .map((v) => v.trim())
          .filter((v) => v.length > 0)
      : []

    // Create brand data
    const brandData: CreateBrandData = {
      project_id: projectId,
      name: name.trim(),
      tagline: tagline?.trim() || null,
      mission: mission?.trim() || null,
      vision: vision?.trim() || null,
      values: valuesArray.length > 0 ? valuesArray : null,
      status: status as any,
      brand_personality: {},
      target_market: {},
      positioning: {},
      visual_identity: {},
    }

    // Create the brand
    const brand = await createBrandAction(brandData)

    // Handle logo upload if provided
    const logoFile = formData.get('logo') as File
    if (logoFile && logoFile.size > 0) {
      const logoFormData = new FormData()
      logoFormData.append('logo', logoFile)

      const logoResult = await uploadBrandLogoAction(projectId, brand.id, logoFormData)
      if (!logoResult.success) {
        // Brand was created but logo upload failed
        return {
          success: true,
          brandId: brand.id,
          message: `Brand created successfully, but logo upload failed: ${logoResult.error}`,
        }
      }
    }

    return {
      success: true,
      brandId: brand.id,
      message: 'Brand created successfully!',
    }
  } catch (error) {
    console.error('Error creating brand:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create brand',
    }
  }
}

export default function CreateBrandForm({ projectId }: CreateBrandFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(submitBrandForm, {})
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Handle successful creation
  if (state.success && state.brandId) {
    // Redirect after successful creation
    setTimeout(() => {
      router.push(`/dashboard/projects/${projectId}/brands/${state.brandId}`)
    }, 2000)
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setLogoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setLogoPreview(null)
    }
  }

  const handleValuesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    <Box maxW="2xl" mx="auto">
      <form action={formAction}>
        <input type="hidden" name="projectId" value={projectId} />

        <Stack gap={8}>
          {/* Header */}
          <Stack gap={2}>
            <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
              Create New Brand
            </styled.h1>
            <styled.p fontSize="sm" color="gray.600">
              Define your brand identity with logos, guidelines, and core values.
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
                  Redirecting to brand page...
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
                {/* Brand Name */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="name"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Brand Name *
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
                    placeholder="Enter brand name"
                  />
                </Stack>

                {/* Tagline */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="tagline"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Tagline
                  </styled.label>
                  <styled.input
                    id="tagline"
                    name="tagline"
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
                    placeholder="A brief catchy phrase that represents your brand"
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

          {/* Logo Upload */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={6}
          >
            <Stack gap={6}>
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                Brand Logo
              </styled.h3>

              <Stack gap={4}>
                <styled.label
                  htmlFor="logo"
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.700"
                >
                  Upload Logo
                </styled.label>

                <Box>
                  <styled.input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={isPending}
                    onChange={handleLogoChange}
                    fontSize="sm"
                  />
                  <styled.p fontSize="xs" color="gray.500" mt={1}>
                    Supports JPEG, PNG, and WebP files. Maximum size: 5MB.
                  </styled.p>
                </Box>

                {logoPreview && (
                  <Box>
                    <styled.p fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                      Preview:
                    </styled.p>
                    <Box
                      w={24}
                      h={24}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      overflow="hidden"
                      bg="gray.50"
                    >
                      <styled.img
                        src={logoPreview}
                        alt="Logo preview"
                        w="full"
                        h="full"
                        objectFit="cover"
                      />
                    </Box>
                  </Box>
                )}
              </Stack>
            </Stack>
          </Box>

          {/* Brand Guidelines */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={6}
          >
            <Stack gap={6}>
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                Brand Guidelines
              </styled.h3>

              <Stack gap={4}>
                {/* Mission */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="mission"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Mission Statement
                  </styled.label>
                  <styled.textarea
                    id="mission"
                    name="mission"
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
                    placeholder="What is your brand's purpose and reason for existence?"
                  />
                </Stack>

                {/* Vision */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="vision"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Vision Statement
                  </styled.label>
                  <styled.textarea
                    id="vision"
                    name="vision"
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
                    placeholder="What does your brand aspire to achieve in the future?"
                  />
                </Stack>

                {/* Values */}
                <Stack gap={2}>
                  <styled.label
                    htmlFor="values"
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    Brand Values
                  </styled.label>
                  <styled.input
                    id="values"
                    name="values"
                    type="text"
                    disabled={isPending}
                    onKeyDown={handleValuesKeyDown}
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
                    placeholder="Enter values separated by commas (e.g., Innovation, Quality, Trust)"
                  />
                  <styled.p fontSize="xs" color="gray.500">
                    Separate multiple values with commas. Press Enter to add a comma.
                  </styled.p>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          {/* Form Actions */}
          <Flex gap={3} justify="end">
            <styled.button
              type="button"
              onClick={() => router.back()}
              disabled={isPending}
              px={4}
              py={2}
              bg="white"
              color="gray.700"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="lg"
              fontSize="sm"
              fontWeight="medium"
              cursor="pointer"
              _hover={{
                bg: 'gray.50',
              }}
              _disabled={{
                opacity: 0.5,
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
              bg="blue.600"
              color="white"
              borderRadius="lg"
              fontSize="sm"
              fontWeight="medium"
              cursor="pointer"
              _hover={{
                bg: 'blue.700',
              }}
              _disabled={{
                opacity: 0.5,
                cursor: 'not-allowed',
              }}
              transition="all 0.2s"
            >
              {isPending ? 'Creating Brand...' : 'Create Brand'}
            </styled.button>
          </Flex>
        </Stack>
      </form>
    </Box>
  )
}
