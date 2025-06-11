'use client'

import { ProductWithRelations } from '@/actions/products'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Stack, Box, Flex, styled } from '@/styled-system/jsx'
import Image from 'next/image'
import OpenAI from 'openai'
import { storeGeneratedImageAction } from '@/actions/storage'
import { useRouter } from 'next/navigation'

interface ProductImageGeneratorProps {
  product: ProductWithRelations
}

export default function ProductImageGenerator({ product }: ProductImageGeneratorProps) {
  const router = useRouter()
  const [imageResponse, setImageResponse] = useState<OpenAI.Images.ImagesResponse | null>(
    null,
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const productInfo = {
    name: product.name,
    description: product.description,
    tags: product.tags,
    catalog: product.catalog_id,
    category: product.categories?.name,
    baseAttributes: product.base_attributes,
    specifications: product.specifications,
    attributes: product.product_variants?.[0]?.attributes,
    imageDirection: 'single sneaker from the left side, close up',
  }

  const generateImage = async () => {
    setIsGenerating(true)
    setSaveMessage(null)

    try {
      const response = await fetch('/api/agents/images', {
        method: 'POST',
        body: JSON.stringify({ prompt: productInfo }),
      })
      const data: OpenAI.Images.ImagesResponse = await response.json()
      setImageResponse(data)
    } catch (error) {
      console.error('Error generating image:', error)
      setSaveMessage('Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }

  const saveImage = async () => {
    if (!imageResponse?.data?.[0]?.b64_json) return

    setIsSaving(true)
    setSaveMessage(null)

    try {
      const result = await storeGeneratedImageAction(
        product.id,
        `${imageResponse.data[0].b64_json}`,
        'gallery',
        `Generated image for ${product.name}`,
      )

      if (result.success) {
        setSaveMessage('Image saved successfully!')
        setImageResponse(null) // Clear the generated image
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

  console.log(product)
  console.log(imageResponse)

  const image = imageResponse?.data?.[0]?.b64_json

  return (
    <Stack gap={4}>
      {/* Generated Image Display */}
      {image && (
        <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
          <Stack gap={4}>
            <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
              Generated Image
            </styled.h3>
            <Box borderRadius="md" overflow="hidden">
              <Image
                src={`${image}`}
                alt={`Generated image for ${product.name}`}
                height={400}
                width={400}
                style={{ width: '100%', height: 'auto' }}
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
            Generate New Image
          </styled.h3>
          <styled.p fontSize="sm" color="gray.600">
            Create a new product image using AI based on the product information.
          </styled.p>
          <Button
            onClick={generateImage}
            disabled={isGenerating || isSaving}
            variant="primary"
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}
