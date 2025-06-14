'use client'

import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import type { ProductWithRelations } from '@/actions/products'
import { Button, button } from '@/components/ui/button'
import ProductImageGenerator from './product-image-generator'
import Modal from '@/components/ui/modal'
import { useState } from 'react'
import { useBrand } from '../brand-context'
import Image from 'next/image'
import { deleteProductImageAction } from '@/actions/storage'
import { useRouter } from 'next/navigation'

interface ProductDetailsProps {
  product: ProductWithRelations
}

type SelectedImageType = {
  id: string
  url: string
  alt_text?: string
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { id: brandId, slug: brandSlug } = useBrand()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<SelectedImageType | null>(null)
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)

  const handleImageClick = (image: SelectedImageType) => {
    setSelectedImage(image)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
  }

  const handleEditComplete = () => {
    setIsEditModalOpen(false)
    handleModalClose()
  }

  const handleEditImage = () => {
    setIsModalOpen(false)
    setIsEditModalOpen(true)
  }

  const handleDeleteImageFromModal = async () => {
    if (!selectedImage) return
    await handleDeleteImage(Number(selectedImage.id))
    handleModalClose()
  }

  const handleDeleteImage = async (imageId: number) => {
    if (deletingImageId) return // Prevent multiple simultaneous deletions

    setDeletingImageId(imageId)
    try {
      const result = await deleteProductImageAction(imageId)
      if (result.success) {
        router.refresh() // Refresh to show updated image list
      } else {
        console.error('Failed to delete image:', result.error)
        // You could add a toast notification here
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      // You could add a toast notification here
    } finally {
      setDeletingImageId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'green.100', color: 'green.700' }
      case 'draft':
        return { bg: 'yellow.100', color: 'yellow.700' }
      case 'archived':
        return { bg: 'gray.100', color: 'gray.700' }
      default:
        return { bg: 'gray.100', color: 'gray.700' }
    }
  }

  const statusColor = getStatusColor(product.status)
  const variants = product.product_variants || []
  const attributes = product.product_attribute_schemas || []
  const images = product.product_images || []

  // Group images by type
  const imagesByType = images.reduce(
    (acc: Record<string, typeof images>, image) => {
      const type = image.type || 'gallery'
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(image)
      return acc
    },
    {} as Record<string, typeof images>,
  )

  // Sort images by sort_order
  Object.keys(imagesByType).forEach((type) => {
    imagesByType[type]?.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  })

  const heroImage = imagesByType.hero?.[0]

  return (
    <Box>
      {/* Header */}
      <Stack gap={4} mb={8}>
        <Flex justify="space-between" align="start" gap={4}>
          <Stack gap={2} flex={1}>
            <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
              {product.name}
            </styled.h1>
            <Flex gap={2} align="center" wrap="wrap">
              <styled.span
                fontSize="sm"
                fontWeight="medium"
                px={3}
                py={1}
                borderRadius="md"
                bg={statusColor.bg}
                color={statusColor.color}
              >
                {product.status}
              </styled.span>

              {product.categories && (
                <styled.span
                  fontSize="sm"
                  px={3}
                  py={1}
                  bg="blue.50"
                  color="blue.700"
                  borderRadius="md"
                >
                  {product.categories.name}
                </styled.span>
              )}

              <styled.span fontSize="sm" color="gray.500">
                •
              </styled.span>
              <styled.span fontSize="sm" color="gray.600">
                {variants.length} {variants.length === 1 ? 'variant' : 'variants'}
              </styled.span>
              <styled.span fontSize="sm" color="gray.600">
                • {images.length} {images.length === 1 ? 'image' : 'images'}
              </styled.span>
            </Flex>
          </Stack>

          <Flex gap={2}>
            <Link
              href={`/brands/${brandSlug}/products/${product.id}/variants`}
              className={button({ variant: 'primary', size: 'sm' })}
            >
              Manage Variants
            </Link>
            <Link
              href={`/brands/${brandSlug}/products/${product.id}/edit`}
              className={button({ variant: 'secondary', size: 'sm' })}
            >
              Edit Product
            </Link>
          </Flex>
        </Flex>

        {/* Price Range */}
        {product.min_price !== null && (
          <Box>
            <styled.div fontSize="xl" fontWeight="semibold" color="gray.900">
              {product.min_price === product.max_price
                ? `$${product.min_price}`
                : `$${product.min_price} - $${product.max_price}`}
            </styled.div>
          </Box>
        )}
      </Stack>

      {/* Main Content Grid */}
      <Box
        display="grid"
        gridTemplateColumns={{
          base: '1fr',
          lg: '2fr 1fr',
        }}
        gap={8}
      >
        {/* Left Column - Images and Description */}
        <Stack gap={8}>
          {/* Hero Image */}
          {heroImage && (
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              overflow="hidden"
            >
              <Stack gap={4} p={4}>
                <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                  Product Image
                </styled.h3>
                <Box
                  h={96}
                  bg="gray.100"
                  borderRadius="md"
                  overflow="hidden"
                  position="relative"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ transform: 'scale(1.02)', shadow: 'md' }}
                  onClick={() =>
                    handleImageClick({
                      id: String(heroImage.id),
                      url: heroImage.url,
                      alt_text: heroImage.alt_text || undefined,
                    })
                  }
                >
                  <styled.img
                    src={heroImage.url}
                    alt={heroImage.alt_text || product.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                </Box>
              </Stack>
            </Box>
          )}

          {/* Description */}
          {product.description && (
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
            >
              <Stack gap={4}>
                <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                  Description
                </styled.h3>
                <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                  {product.description}
                </styled.p>
              </Stack>
            </Box>
          )}

          <Box>
            <ProductImageGenerator product={product} />
          </Box>

          {/* Gallery Images */}
          {imagesByType.gallery && imagesByType.gallery.length > 0 && (
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
            >
              <Stack gap={4}>
                <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                  Gallery ({imagesByType.gallery.length})
                </styled.h3>
                <Box
                  display="grid"
                  gridTemplateColumns={{
                    base: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                  }}
                  gap={4}
                >
                  {imagesByType.gallery.map(
                    (image: NonNullable<ProductWithRelations['product_images']>[0]) => (
                      <Box
                        key={image.id}
                        position="relative"
                        width="150px"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        overflow="hidden"
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ borderColor: 'blue.500' }}
                        css={{
                          '&:hover .delete-button': {
                            opacity: 1,
                          },
                        }}
                        onClick={() =>
                          handleImageClick({
                            id: String(image.id),
                            url: image.url,
                            alt_text: image.alt_text || undefined,
                          })
                        }
                      >
                        <Image
                          src={image.url}
                          alt={image.alt_text || ''}
                          width={150}
                          height={150}
                          objectFit="contain"
                        />

                        {/* Delete Button */}
                        <styled.button
                          className="delete-button"
                          position="absolute"
                          top={2}
                          right={2}
                          width={6}
                          height={6}
                          bg="red.500"
                          color="white"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="xs"
                          fontWeight="bold"
                          opacity={0}
                          transition="opacity 0.2s"
                          cursor="pointer"
                          border="none"
                          _hover={{ bg: 'red.600' }}
                          disabled={deletingImageId === image.id}
                          onClick={(e) => {
                            e.stopPropagation() // Prevent image modal from opening
                            handleDeleteImage(image.id)
                          }}
                        >
                          {deletingImageId === image.id ? '...' : '×'}
                        </styled.button>
                      </Box>
                    ),
                  )}
                </Box>
              </Stack>
            </Box>
          )}
        </Stack>

        {/* Right Column - Variants and Attributes */}
        <Stack gap={6}>
          {/* Product Attributes */}
          {attributes.length > 0 && (
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
            >
              <Stack gap={4}>
                <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                  Attributes ({attributes.length})
                </styled.h3>
                <Stack gap={3}>
                  {attributes.map(
                    (
                      attribute: NonNullable<
                        ProductWithRelations['product_attribute_schemas']
                      >[0],
                    ) => (
                      <Box key={attribute.id}>
                        <Flex justify="space-between" align="center" mb={2}>
                          <styled.div fontSize="sm" fontWeight="medium" color="gray.700">
                            {attribute.attribute_label}
                          </styled.div>
                          {attribute.is_required && (
                            <styled.span
                              fontSize="xs"
                              px={2}
                              py={0.5}
                              bg="red.100"
                              color="red.700"
                              borderRadius="sm"
                            >
                              Required
                            </styled.span>
                          )}
                        </Flex>
                        <Flex gap={2} wrap="wrap">
                          {attribute.options &&
                            Array.isArray(attribute.options) &&
                            attribute.options.map((option: unknown, index: number) => (
                              <styled.span
                                key={index}
                                fontSize="xs"
                                px={2}
                                py={1}
                                bg="gray.100"
                                color="gray.700"
                                borderRadius="sm"
                              >
                                {typeof option === 'object' && option && 'label' in option
                                  ? (option as { label: string }).label
                                  : String(option)}
                              </styled.span>
                            ))}
                        </Flex>
                      </Box>
                    ),
                  )}
                </Stack>
              </Stack>
            </Box>
          )}

          {/* Product Variants */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={6}
          >
            <Stack gap={4}>
              <Flex justify="space-between" align="center">
                <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                  Variants ({variants.length})
                </styled.h3>
                <Link
                  href={`/brands/${brandSlug}/products/${product.id}/variants`}
                  className={button({ variant: 'primary', size: 'xs' })}
                >
                  Manage
                </Link>
              </Flex>

              {variants.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Stack gap={2} align="center">
                    <styled.div fontSize="2xl" color="gray.400">
                      📦
                    </styled.div>
                    <styled.p fontSize="sm" color="gray.600">
                      No variants yet. Add variants to define different options for this
                      product.
                    </styled.p>
                  </Stack>
                </Box>
              ) : (
                <Stack gap={3}>
                  {variants
                    .slice(0, 5)
                    .map(
                      (
                        variant: NonNullable<ProductWithRelations['product_variants']>[0],
                      ) => (
                        <Box
                          key={variant.id}
                          p={3}
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="md"
                        >
                          <Flex justify="space-between" align="start" gap={3}>
                            <Stack gap={1} flex={1}>
                              <styled.div
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.900"
                              >
                                {variant.sku}
                              </styled.div>
                              <styled.div
                                fontSize="lg"
                                fontWeight="semibold"
                                color="gray.900"
                              >
                                ${variant.price}
                              </styled.div>
                              {variant.attributes &&
                                typeof variant.attributes === 'object' && (
                                  <Flex gap={1} wrap="wrap">
                                    {Object.entries(variant.attributes).map(
                                      ([key, value]) => (
                                        <styled.span
                                          key={key}
                                          fontSize="xs"
                                          px={2}
                                          py={0.5}
                                          bg="blue.50"
                                          color="blue.700"
                                          borderRadius="sm"
                                        >
                                          {key}: {String(value)}
                                        </styled.span>
                                      ),
                                    )}
                                  </Flex>
                                )}
                            </Stack>
                            <styled.span
                              fontSize="xs"
                              px={2}
                              py={1}
                              bg={variant.is_active ? 'green.100' : 'red.100'}
                              color={variant.is_active ? 'green.700' : 'red.700'}
                              borderRadius="sm"
                            >
                              {variant.is_active ? 'Available' : 'Unavailable'}
                            </styled.span>
                          </Flex>
                        </Box>
                      ),
                    )}

                  {variants.length > 5 && (
                    <styled.p fontSize="sm" color="gray.500" textAlign="center">
                      ... and {variants.length - 5} more variants
                    </styled.p>
                  )}
                </Stack>
              )}
            </Stack>
          </Box>

          {/* SEO Information */}
          {(product.meta_title ||
            product.meta_description ||
            (product.tags && product.tags.length > 0)) && (
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
            >
              <Stack gap={4}>
                <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                  SEO & Marketing
                </styled.h3>

                {product.meta_title && (
                  <Stack gap={1}>
                    <styled.label fontSize="xs" fontWeight="medium" color="gray.700">
                      Meta Title
                    </styled.label>
                    <styled.p fontSize="sm" color="gray.600">
                      {product.meta_title}
                    </styled.p>
                  </Stack>
                )}

                {product.meta_description && (
                  <Stack gap={1}>
                    <styled.label fontSize="xs" fontWeight="medium" color="gray.700">
                      Meta Description
                    </styled.label>
                    <styled.p fontSize="sm" color="gray.600">
                      {product.meta_description}
                    </styled.p>
                  </Stack>
                )}

                {product.tags && product.tags.length > 0 && (
                  <Stack gap={1}>
                    <styled.label fontSize="xs" fontWeight="medium" color="gray.700">
                      Tags
                    </styled.label>
                    <Flex gap={1} wrap="wrap">
                      {product.tags.map((tag: string, index: number) => (
                        <styled.span
                          key={index}
                          fontSize="xs"
                          px={2}
                          py={1}
                          bg="purple.100"
                          color="purple.700"
                          borderRadius="sm"
                        >
                          {tag}
                        </styled.span>
                      ))}
                    </Flex>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Image View Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Product Image"
        size="xl"
      >
        {selectedImage && (
          <Stack gap={6}>
            {/* Large Image Display */}
            <Box display="flex" justifyContent="center" alignItems="center">
              <styled.img
                src={selectedImage.url}
                alt={selectedImage.alt_text || 'Product image'}
                maxH="500px"
                bg="white"
                borderRadius="lg"
                objectFit="contain"
              />
            </Box>

            {/* Action Buttons */}
            <Flex justify="center" gap={3}>
              <Button variant="secondary" size="sm" onClick={handleEditImage}>
                Edit Image
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteImageFromModal}
                disabled={deletingImageId === Number(selectedImage.id)}
              >
                {deletingImageId === Number(selectedImage.id)
                  ? 'Deleting...'
                  : 'Delete Image'}
              </Button>
            </Flex>
          </Stack>
        )}
      </Modal>

      {/* Image Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Edit Product Image"
        size="xl"
      >
        {selectedImage && (
          <ProductImageGenerator
            product={product}
            mode="edit"
            selectedImage={selectedImage}
            onEditComplete={handleEditComplete}
          />
        )}
      </Modal>
    </Box>
  )
}
