'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import {
  updateProductCatalogAction,
  type UpdateProductCatalogData,
} from '@/actions/product-catalogs'
import type { Tables } from '@/lib/supabase/generated-types'
import { useBrand } from '@/components/brand-context'

type ProductCatalog = Tables<'product_catalogs'>

interface CatalogSettingsFormProps {
  catalog: ProductCatalog
}

interface ImageGroupPrompt {
  groupName: string
  prompts: string[]
}

type FormState = {
  error?: string
  message?: string
  success?: boolean
}

async function updateCatalogSettings(
  catalogId: string,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const slug = formData.get('slug') as string

    if (!name?.trim()) {
      return { error: 'Catalog name is required' }
    }

    if (!slug?.trim()) {
      return { error: 'Catalog slug is required' }
    }

    // Handle image group prompts
    const groups: ImageGroupPrompt[] = []

    // Collect all group data
    for (const [key, value] of formData.entries()) {
      if (
        key.startsWith('groupName_') &&
        value &&
        typeof value === 'string' &&
        value.trim()
      ) {
        const groupIndex = parseInt(key.replace('groupName_', ''))
        const groupName = value.trim()
        const prompts: string[] = []

        // Collect prompts for this group
        for (const [promptKey, promptValue] of formData.entries()) {
          if (
            promptKey.startsWith(`prompt_${groupIndex}_`) &&
            promptValue &&
            typeof promptValue === 'string' &&
            promptValue.trim()
          ) {
            prompts.push(promptValue.trim())
          }
        }

        if (groupName || prompts.length > 0) {
          groups.push({ groupName, prompts })
        }
      }
    }

    // Build settings object
    const settings =
      groups.length > 0 ? ({ imageGroupPrompts: groups } as any) : ({} as any)

    // Create update data
    const updateData: UpdateProductCatalogData = {
      name: name.trim(),
      description: description?.trim() || null,
      slug: slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, ''),
      settings: settings,
    }

    // Update the catalog
    await updateProductCatalogAction(catalogId, updateData)

    return {
      success: true,
      message: 'Catalog settings updated successfully!',
    }
  } catch (error) {
    console.error('Error updating catalog settings:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update catalog settings',
    }
  }
}

export default function CatalogSettingsForm({ catalog }: CatalogSettingsFormProps) {
  const brand = useBrand()
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    updateCatalogSettings.bind(null, catalog.catalog_id),
    {},
  )

  // Initialize image group prompts from existing catalog settings
  const existingPrompts =
    catalog.settings &&
    typeof catalog.settings === 'object' &&
    catalog.settings !== null &&
    'imageGroupPrompts' in catalog.settings
      ? (catalog.settings.imageGroupPrompts as any)
      : null

  const [imageGroupPrompts, setImageGroupPrompts] = useState<ImageGroupPrompt[]>(
    existingPrompts && Array.isArray(existingPrompts)
      ? existingPrompts
      : [{ groupName: '', prompts: [''] }],
  )

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple consecutive hyphens

    e.target.value = slug
  }

  const addGroup = () => {
    setImageGroupPrompts((prev) => [...prev, { groupName: '', prompts: [''] }])
  }

  const removeGroup = (groupIndex: number) => {
    setImageGroupPrompts((prev) => prev.filter((_, i) => i !== groupIndex))
  }

  const addPrompt = (groupIndex: number) => {
    setImageGroupPrompts((prev) =>
      prev.map((group, i) =>
        i === groupIndex ? { ...group, prompts: [...group.prompts, ''] } : group,
      ),
    )
  }

  const removePrompt = (groupIndex: number, promptIndex: number) => {
    setImageGroupPrompts((prev) =>
      prev.map((group, i) =>
        i === groupIndex
          ? { ...group, prompts: group.prompts.filter((_, j) => j !== promptIndex) }
          : group,
      ),
    )
  }

  const updatePrompt = (groupIndex: number, promptIndex: number, value: string) => {
    setImageGroupPrompts((prev) =>
      prev.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              prompts: group.prompts.map((prompt, j) =>
                j === promptIndex ? value : prompt,
              ),
            }
          : group,
      ),
    )
  }

  const updateGroupName = (groupIndex: number, value: string) => {
    setImageGroupPrompts((prev) =>
      prev.map((group, i) => (i === groupIndex ? { ...group, groupName: value } : group)),
    )
  }

  return (
    <Box>
      <form action={formAction}>
        <Stack gap={8}>
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

          {/* Read-only Information */}
          <Box
            bg="gray.50"
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
                {/* Database ID */}
                <Stack gap={2}>
                  <styled.label fontSize="sm" fontWeight="medium" color="gray.700">
                    Database ID
                  </styled.label>
                  <styled.div
                    px={3}
                    py={2}
                    bg="gray.100"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    fontSize="sm"
                    color="gray.600"
                    fontFamily="mono"
                  >
                    {catalog.id}
                  </styled.div>
                </Stack>

                {/* Catalog ID */}
                <Stack gap={2}>
                  <styled.label fontSize="sm" fontWeight="medium" color="gray.700">
                    Catalog ID
                  </styled.label>
                  <styled.div
                    px={3}
                    py={2}
                    bg="gray.100"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    fontSize="sm"
                    color="gray.600"
                    fontFamily="mono"
                  >
                    {catalog.catalog_id}
                  </styled.div>
                </Stack>

                {/* Brand ID */}
                <Stack gap={2}>
                  <styled.label fontSize="sm" fontWeight="medium" color="gray.700">
                    Brand ID
                  </styled.label>
                  <styled.div
                    px={3}
                    py={2}
                    bg="gray.100"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    fontSize="sm"
                    color="gray.600"
                    fontFamily="mono"
                  >
                    {catalog.brand_id}
                  </styled.div>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          {/* Editable Settings */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={6}
          >
            <Stack gap={6}>
              <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                Catalog Settings
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
                    defaultValue={catalog.name}
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
                    placeholder="Enter catalog name"
                  />
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
                    defaultValue={catalog.description || ''}
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
                    placeholder="Describe this catalog and what products it contains..."
                  />
                </Stack>

                {/* Slug */}
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
                    defaultValue={catalog.slug}
                    onChange={handleSlugChange}
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
                    placeholder="catalog-url-slug"
                  />
                  <styled.p fontSize="xs" color="gray.500">
                    URL-friendly identifier for your catalog. Only lowercase letters,
                    numbers, and hyphens allowed.
                  </styled.p>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          {/* Image Group Prompts */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={6}
          >
            <Stack gap={6}>
              <Flex justify="space-between" align="center">
                <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                  Image Group Prompts
                </styled.h3>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addGroup}
                  disabled={isPending}
                >
                  Add Group
                </Button>
              </Flex>

              <styled.p fontSize="sm" color="gray.600">
                Create groups of prompts that can be used for generating image groups for
                products in this catalog.
              </styled.p>

              <Stack gap={6}>
                {imageGroupPrompts.map((group, groupIndex) => (
                  <Box
                    key={groupIndex}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={4}
                  >
                    <Stack gap={4}>
                      <Flex justify="space-between" align="center">
                        <styled.h4 fontSize="md" fontWeight="medium" color="gray.800">
                          Group {groupIndex + 1}
                        </styled.h4>
                        {imageGroupPrompts.length > 1 && (
                          <Button
                            type="button"
                            variant="danger"
                            size="xs"
                            onClick={() => removeGroup(groupIndex)}
                            disabled={isPending}
                          >
                            Remove Group
                          </Button>
                        )}
                      </Flex>

                      {/* Group Name */}
                      <Stack gap={2}>
                        <styled.label fontSize="sm" fontWeight="medium" color="gray.700">
                          Group Name
                        </styled.label>
                        <input
                          type="hidden"
                          name={`groupName_${groupIndex}`}
                          value={group.groupName}
                        />
                        <styled.input
                          type="text"
                          disabled={isPending}
                          value={group.groupName}
                          onChange={(e) => updateGroupName(groupIndex, e.target.value)}
                          px={3}
                          py={2}
                          border="1px solid"
                          borderColor="gray.300"
                          borderRadius="md"
                          fontSize="sm"
                          bg="white"
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
                          placeholder="Enter group name (e.g., Product Hero Images)"
                        />
                      </Stack>

                      {/* Prompts */}
                      <Stack gap={3}>
                        <styled.label fontSize="sm" fontWeight="medium" color="gray.700">
                          Prompts
                        </styled.label>

                        {group.prompts.map((prompt, promptIndex) => (
                          <Flex key={promptIndex} gap={2} align="flex-start">
                            <styled.textarea
                              name={`prompt_${groupIndex}_${promptIndex}`}
                              disabled={isPending}
                              value={prompt}
                              onChange={(e) =>
                                updatePrompt(groupIndex, promptIndex, e.target.value)
                              }
                              rows={3}
                              px={3}
                              py={2}
                              border="1px solid"
                              borderColor="gray.300"
                              borderRadius="md"
                              fontSize="sm"
                              resize="vertical"
                              flex="1"
                              bg="white"
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
                              placeholder={`Enter prompt ${promptIndex + 1}...`}
                            />
                            {group.prompts.length > 1 && (
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => removePrompt(groupIndex, promptIndex)}
                                disabled={isPending}
                              >
                                Remove
                              </Button>
                            )}
                          </Flex>
                        ))}

                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => addPrompt(groupIndex)}
                          disabled={isPending}
                          alignSelf="flex-start"
                        >
                          Add Prompt
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>

          {/* Form Actions */}
          <Flex gap={3} justify="flex-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              variant={isPending ? 'secondary' : 'primary'}
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  )
}
