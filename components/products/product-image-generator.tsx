'use client'

import { ProductWithRelations } from '@/actions/products'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Stack, Box, Flex, styled } from '@/styled-system/jsx'
import Image from 'next/image'
import OpenAI from 'openai'
import { storeGeneratedImageAction } from '@/actions/storage'
import { useRouter } from 'next/navigation'
import { getProductCatalogAction } from '@/actions/product-catalogs'
import type { Tables } from '@/lib/supabase/generated-types'
import { GeneratedImageResponse } from '@/lib/types'

interface ImageGroupPrompt {
  groupName: string
  prompts: string[]
}

interface ProductImageGeneratorProps {
  product: ProductWithRelations
  mode?: 'generate' | 'edit'
  selectedImage?: {
    id: string
    url: string
    alt_text?: string
  }
  onEditComplete?: () => void
}

export default function ProductImageGenerator({
  product,
  mode = 'generate',
  selectedImage,
  onEditComplete,
}: ProductImageGeneratorProps) {
  const router = useRouter()
  const [imageResponse, setImageResponse] = useState<GeneratedImageResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [imageDirection, setImageDirection] = useState('')
  const [savedPrompts, setSavedPrompts] = useState<string[]>([])
  const [catalogPrompts, setCatalogPrompts] = useState<ImageGroupPrompt[]>([])
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null)
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false)

  const STORAGE_KEY = 'product-image-edit-prompts'

  // Load catalog settings on mount
  useEffect(() => {
    if (product.catalog_id) {
      loadCatalogSettings()
    }
  }, [product.catalog_id])

  const loadCatalogSettings = async () => {
    setIsLoadingCatalog(true)
    try {
      const catalog = await getProductCatalogAction(product.catalog_id)
      if (catalog?.settings && typeof catalog.settings === 'object') {
        const settings = catalog.settings as any
        if (settings.imageGroupPrompts && Array.isArray(settings.imageGroupPrompts)) {
          setCatalogPrompts(settings.imageGroupPrompts)
        }
      }
    } catch (error) {
      console.error('Error loading catalog settings:', error)
    } finally {
      setIsLoadingCatalog(false)
    }
  }

  const getImageObject = () => {
    if (!imageResponse) return
    const imageData = imageResponse?.images[0]
    return imageData
    // const imageData = imageResponse?.output.filter(
    //   (output) => output.type === 'image_generation_call',
    // )[0]
    // return imageData as OpenAI.Responses.ResponseOutputItem.ImageGenerationCall & {
    //   size: string
    // }
  }

  const getImageData = () => {
    const imageData = getImageObject()
    if (!imageData) return
    return imageData.url
    // const imageDataUrl = `data:image/webp;base64,${imageData.result}`
    // return imageDataUrl
  }

  // // Load saved prompts from localStorage on mount
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const saved = localStorage.getItem(STORAGE_KEY)
  //     if (saved) {
  //       try {
  //         const prompts = JSON.parse(saved) as string[]
  //         setSavedPrompts(prompts)
  //       } catch (error) {
  //         console.error('Error loading saved prompts:', error)
  //       }
  //     }
  //   }
  // }, [])

  // // Save prompt to localStorage
  // const savePromptToStorage = (prompt: string) => {
  //   if (!prompt.trim() || typeof window === 'undefined') return

  //   const updatedPrompts = [prompt, ...savedPrompts.filter((p) => p !== prompt)].slice(
  //     0,
  //     10,
  //   ) // Keep max 10 prompts
  //   setSavedPrompts(updatedPrompts)
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrompts))
  // }

  // Handle clicking on a saved prompt
  const handleSavedPromptClick = async (prompt: string) => {
    setImageDirection(prompt)
    // Auto-submit after setting the prompt
    setTimeout(() => {
      generateImageWithPrompt(prompt)
    }, 100)
  }

  // Handle clicking on a catalog prompt
  const handleCatalogPromptClick = (prompt: string) => {
    setImageDirection(prompt)
  }

  const productInfo = {
    name: product.name,
    description: product.description,
    tags: product.tags,
    catalog: product.catalog_id,
    category: product.categories?.name,
    baseAttributes: product.base_attributes,
    specifications: product.specifications,
    attributes: product.product_variants?.[0]?.attributes,
    imageDirection,
  }

  // Function to convert image URL to base64
  const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          // Keep the full data URL with prefix
          if (result) {
            resolve(result)
          } else {
            reject(new Error('Failed to convert image to base64'))
          }
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Error converting image to base64:', error)
      throw error
    }
  }

  const generateImageWithPrompt = async (promptText: string) => {
    if (mode === 'edit' && promptText.trim()) {
      // savePromptToStorage(promptText.trim())
    }

    setIsGenerating(true)
    setSaveMessage(null)

    try {
      let requestBody

      if (mode === 'edit' && selectedImage) {
        const base64Image = await convertImageToBase64(selectedImage.url)
        requestBody = {
          promptOverride: promptText || imageDirection,
          prompt: productInfo,
          image_url: base64Image,
        }
      } else {
        requestBody = {
          prompt: productInfo,
        }
      }

      const response = await fetch('/api/agents/images', {
        method: 'POST',
        body: JSON.stringify({ ...requestBody }),
      })
      const { data }: { data: GeneratedImageResponse } = await response.json()
      setImageResponse(data)
    } catch (error) {
      console.error('Error generating image:', error)
      setSaveMessage('Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateImage = async () => {
    await generateImageWithPrompt(imageDirection)
  }

  const saveImage = async () => {
    if (!imageResponse) return

    setIsSaving(true)
    setSaveMessage(null)

    try {
      const result = await storeGeneratedImageAction(
        product.id,
        imageResponse,
        productInfo.attributes || {},
        'gallery',
      )

      if (result.success) {
        setSaveMessage('Image saved successfully!')
        setImageResponse(null) // Clear the generated image
        if (onEditComplete) {
          onEditComplete()
        }
        router.refresh() // Refresh to show the new image in the product
      } else {
        setSaveMessage(`Failed to save image: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving image:', error)
      setSaveMessage('Failed to save image')
    } finally {
      setIsSaving(false)
    }
  }

  const image = getImageData()

  return (
    <Stack gap={4}>
      {/* Edit Mode - Selected Image */}
      {/* {mode === 'edit' && selectedImage && (
        <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
          <Stack gap={4}>
            <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
              Current Image
            </styled.h3>
            <Box borderRadius="md" overflow="hidden" maxWidth="400px" mx="auto">
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt_text || `Image for ${product.name}`}
                width={parseInt(getImageObject()?.size?.split('x')[0] || '400')}
                height={parseInt(getImageObject()?.size?.split('x')[1] || '400')}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </Box>
          </Stack>
        </Box>
      )} */}

      {/* Generated Image Display */}
      {image && (
        <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
          <Stack gap={4}>
            <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
              {mode === 'edit' ? 'Edited Image' : 'Generated Image'}
            </styled.h3>
            <Box borderRadius="md" overflow="hidden" maxWidth="400px" mx="auto">
              <Image
                src={`${image}`}
                alt={`Generated image for ${product.name}`}
                height={400}
                width={400}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </Box>
            <Flex gap={2}>
              <Button onClick={saveImage} disabled={isSaving} variant="primary">
                {isSaving ? 'Saving...' : 'Save Image'}
              </Button>
              <Button
                onClick={() => setImageResponse(null)}
                variant="secondary"
                disabled={isSaving}
              >
                Discard
              </Button>
            </Flex>
          </Stack>
        </Box>
      )}

      {/* Save Message */}
      {saveMessage && (
        <Box
          bg={saveMessage.includes('success') ? 'green.50' : 'red.50'}
          border="1px solid"
          borderColor={saveMessage.includes('success') ? 'green.200' : 'red.200'}
          borderRadius="md"
          p={3}
        >
          <styled.p
            fontSize="sm"
            color={saveMessage.includes('success') ? 'green.800' : 'red.800'}
          >
            {saveMessage}
          </styled.p>
        </Box>
      )}

      {/* Generation Controls */}
      <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
        <Stack gap={4}>
          <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
            {mode === 'edit' ? 'Edit Image' : 'Generate New Image'}
          </styled.h3>
          <styled.p fontSize="sm" color="gray.600">
            {mode === 'edit'
              ? 'Modify the current image using AI based on your instructions.'
              : 'Create a new product image using AI based on the product information.'}
          </styled.p>

          {/* Catalog Prompts */}
          {catalogPrompts.length > 0 && (
            <Stack gap={3}>
              <styled.label fontSize="sm" fontWeight="medium" color="gray.700">
                Catalog Prompts
              </styled.label>
              <styled.p fontSize="xs" color="gray.500">
                Predefined prompts from your catalog settings
              </styled.p>

              {/* Group Selection Dropdown */}
              <Stack gap={2}>
                <styled.label fontSize="sm" fontWeight="medium" color="gray.700">
                  Select Image Group
                </styled.label>
                <styled.select
                  value={selectedGroupIndex ?? ''}
                  onChange={(e) =>
                    setSelectedGroupIndex(
                      e.target.value === '' ? null : parseInt(e.target.value),
                    )
                  }
                  px={3}
                  py={2}
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  fontSize="sm"
                  bg="white"
                  _focus={{ borderColor: 'blue.500', outline: 'none' }}
                  disabled={isGenerating || isSaving}
                >
                  <option value="">Choose an image group...</option>
                  {catalogPrompts.map((group, groupIndex) => (
                    <option key={groupIndex} value={groupIndex}>
                      {group.groupName}
                    </option>
                  ))}
                </styled.select>
              </Stack>

              {/* Selected Group Prompts */}
              {selectedGroupIndex !== null && catalogPrompts[selectedGroupIndex] && (
                <Stack gap={2}>
                  <styled.h4 fontSize="sm" fontWeight="medium" color="gray.800">
                    {catalogPrompts[selectedGroupIndex].groupName} Prompts
                  </styled.h4>
                  <Stack gap={2}>
                    {catalogPrompts[selectedGroupIndex].prompts.map(
                      (prompt, promptIndex) => (
                        <Button
                          key={promptIndex}
                          onClick={() => handleCatalogPromptClick(prompt)}
                          variant="secondary"
                          size="sm"
                          disabled={isGenerating || isSaving}
                          width="full"
                          textAlign="left"
                          justifyContent="flex-start"
                          py={3}
                          px={4}
                          minHeight="auto"
                          whiteSpace="normal"
                          wordBreak="break-word"
                        >
                          {prompt}
                        </Button>
                      ),
                    )}
                  </Stack>
                </Stack>
              )}
            </Stack>
          )}

          {/* Saved Prompts */}
          {mode === 'edit' && savedPrompts.length > 0 && (
            <Stack gap={2}>
              <styled.label fontSize="sm" fontWeight="medium" color="gray.700">
                Recent Edit Prompts
              </styled.label>
              <styled.p fontSize="xs" color="gray.500">
                Previously used prompts for editing images
              </styled.p>
              <Flex gap={2} wrap="wrap">
                {savedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    onClick={() => handleSavedPromptClick(prompt)}
                    variant="secondary"
                    size="sm"
                    disabled={isGenerating || isSaving}
                  >
                    {prompt.length > 30 ? `${prompt.substring(0, 30)}...` : prompt}
                  </Button>
                ))}
              </Flex>
            </Stack>
          )}

          {/* Image Direction Input */}
          <Stack gap={2}>
            <styled.label fontSize="sm" fontWeight="medium" color="gray.700">
              Image Direction/Instructions
            </styled.label>
            <styled.input
              type="text"
              placeholder={
                mode === 'edit'
                  ? 'Describe how you want to modify the image...'
                  : 'Single sneaker from the left side, close up.'
              }
              value={imageDirection}
              onChange={(e) => setImageDirection(e.target.value)}
              px={3}
              py={2}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              fontSize="sm"
              _focus={{ borderColor: 'blue.500', outline: 'none' }}
              disabled={isGenerating || isSaving}
            />
          </Stack>

          <Button
            onClick={generateImage}
            disabled={isGenerating || isSaving || isLoadingCatalog}
            variant="primary"
          >
            {isGenerating
              ? 'Processing...'
              : mode === 'edit'
                ? 'Edit Image'
                : 'Generate Image'}
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}
