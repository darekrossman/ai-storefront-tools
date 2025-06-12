'use client'

import { convertToDBFormat } from '@/lib/catalog/helpers'
import { catalogStructuredOutputSchemas } from '@/lib/catalog/schemas'
import type { Brand } from '@/lib/supabase/database-types'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Box, Container, Stack, styled } from '@/styled-system/jsx'
import { z } from 'zod'
import { createProductCatalogAction } from '@/actions/product-catalogs'
import { createCategoryAction } from '@/actions'
import { useRouter } from 'next/navigation'
import { useBrand } from '../brand-context'

export default function CatalogGeneration() {
  const router = useRouter()
  const { brandId } = useBrand()
  const [formData, setFormData] = useState({
    parentCategoryCount: 5,
    subcategoryCount: 3,
  })

  const { object, submit, isLoading } = useObject({
    api: '/api/agents/catalog',
    schema: catalogStructuredOutputSchemas,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Submit the form data to the AI agent
    submit({
      brandId,
      parentCategoryCount: formData.parentCategoryCount,
      subcategoryCount: formData.subcategoryCount,
    })
  }

  const handleSave = async () => {
    if (!object) return
    const { catalog, categories } = convertToDBFormat(
      object as z.infer<typeof catalogStructuredOutputSchemas>,
      brandId,
    )

    try {
      const createdCatalog = await createProductCatalogAction(catalog)

      await Promise.all(
        categories.filter((c) => !c.parent_category_id).map(createCategoryAction),
      )
      await Promise.all(
        categories.filter((c) => c.parent_category_id).map(createCategoryAction),
      )

      router.push(`/dashboard/brands/${brandId}/catalogs/${createdCatalog.catalog_id}`)
    } catch (error) {
      console.error('Error saving catalog:', error)
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
            Generating Catalog
          </styled.h2>
        </Stack>
      </Box>
    )
  }

  if (object && !isLoading) {
    return (
      <Container maxW="3xl">
        <Box
          mt={6}
          p={6}
          bg="white"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          shadow="sm"
        >
          <Stack gap={6}>
            {/* Catalog Header */}
            <Box>
              <styled.h3 fontSize="xl" fontWeight="semibold" color="gray.900" mb={2}>
                {object.name}
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                {object.description}
              </styled.p>
              <styled.p fontSize="xs" color="gray.500" mt={1}>
                Slug: {object.slug}
              </styled.p>
            </Box>

            {/* Summary Stats */}
            <Box
              p={4}
              bg="blue.50"
              borderRadius="md"
              border="1px solid"
              borderColor="blue.100"
            >
              <styled.div fontSize="sm" color="blue.800">
                <strong>{object.categories?.length || 0}</strong> categories with{' '}
                <strong>
                  {object.categories?.reduce(
                    (total, cat) => total + (cat?.subcategories?.length || 0),
                    0,
                  ) || 0}
                </strong>{' '}
                subcategories total
              </styled.div>
            </Box>

            {/* Categories List */}
            <Stack gap={4}>
              <styled.h4 fontSize="md" fontWeight="medium" color="gray.800">
                Category Structure
              </styled.h4>

              {object.categories?.map((category, categoryIndex) => {
                if (!category) return null
                return (
                  <Box
                    key={categoryIndex}
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <Stack gap={3}>
                      {/* Category Header */}
                      <Box>
                        <styled.h5 fontSize="sm" fontWeight="medium" color="gray.900">
                          {category.name}
                        </styled.h5>
                        <styled.p fontSize="xs" color="gray.600" mt={1}>
                          {category.description}
                        </styled.p>
                      </Box>

                      {/* Subcategories */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <Box>
                          <styled.div
                            fontSize="xs"
                            color="gray.700"
                            mb={2}
                            fontWeight="medium"
                          >
                            Subcategories ({category.subcategories.length}):
                          </styled.div>
                          <Stack gap={1}>
                            {category.subcategories.map((subcategory, subIndex) => {
                              if (!subcategory) return null
                              return (
                                <Box
                                  key={subIndex}
                                  p={2}
                                  bg="white"
                                  borderRadius="sm"
                                  border="1px solid"
                                  borderColor="gray.200"
                                >
                                  <styled.div
                                    fontSize="xs"
                                    fontWeight="medium"
                                    color="gray.800"
                                  >
                                    {subcategory.name}
                                  </styled.div>
                                  <styled.div fontSize="xs" color="gray.600" mt={1}>
                                    {subcategory.description}
                                  </styled.div>
                                </Box>
                              )
                            })}
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                )
              })}
            </Stack>

            {/* Action Buttons */}
            <Box
              pt={4}
              borderTop="1px solid"
              borderColor="gray.200"
              display="flex"
              gap={3}
              justifyContent="flex-end"
            >
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Generate New
              </Button>
              <Button onClick={handleSave}>Save Catalog</Button>
            </Box>
          </Stack>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxW="lg">
      <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
        <Stack gap={6}>
          <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
            Generate Product Catalog
          </styled.h2>

          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              {/* Parent Category Count */}
              <Stack gap={2}>
                <styled.label
                  htmlFor="parentCategoryCount"
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.700"
                >
                  Parent Category Count
                </styled.label>
                <styled.input
                  id="parentCategoryCount"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.parentCategoryCount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      parentCategoryCount: parseInt(e.target.value) || 5,
                    }))
                  }
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
                  disabled={isLoading}
                />
              </Stack>

              {/* Subcategory Count */}
              <Stack gap={2}>
                <styled.label
                  htmlFor="subcategoryCount"
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.700"
                >
                  Subcategory Count
                </styled.label>
                <styled.input
                  id="subcategoryCount"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.subcategoryCount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subcategoryCount: parseInt(e.target.value) || 3,
                    }))
                  }
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
                  disabled={isLoading}
                />
              </Stack>

              {/* Submit Button */}
              <Button type="submit" disabled={isLoading}>
                Generate Catalog
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Container>
  )
}
