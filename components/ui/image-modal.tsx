'use client'

import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import Modal from '@/components/ui/modal'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProductImageAction } from '@/actions/storage'
import type { ProductWithRelations } from '@/actions/products'
import ProductImageGenerator from '@/components/products/product-image-generator'

type SelectedImageType = {
  id: string
  url: string
  alt_text?: string
}

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  selectedImage: SelectedImageType | null
  product: ProductWithRelations
  showEditButton?: boolean
  showDeleteButton?: boolean
}

export default function ImageModal({
  isOpen,
  onClose,
  selectedImage,
  product,
  showEditButton = true,
  showDeleteButton = true,
}: ImageModalProps) {
  const router = useRouter()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)

  const handleModalClose = () => {
    onClose()
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
  }

  const handleEditComplete = () => {
    setIsEditModalOpen(false)
    handleModalClose()
  }

  const handleEditImage = () => {
    setIsEditModalOpen(true)
  }

  const handleDeleteImage = async (imageId: number) => {
    if (deletingImageId) return // Prevent multiple simultaneous deletions

    setDeletingImageId(imageId)
    try {
      const result = await deleteProductImageAction(imageId)
      if (result.success) {
        router.refresh() // Refresh to show updated image list
        handleModalClose() // Close modal after successful deletion
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

  const handleDeleteImageFromModal = async () => {
    if (!selectedImage) return
    await handleDeleteImage(Number(selectedImage.id))
  }

  return (
    <>
      {/* Image View Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} title="Product Image" size="xl">
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
            {(showEditButton || showDeleteButton) && (
              <Flex justify="center" gap={3}>
                {showEditButton && (
                  <Button variant="secondary" size="sm" onClick={handleEditImage}>
                    Edit Image
                  </Button>
                )}
                {showDeleteButton && (
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
                )}
              </Flex>
            )}
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
    </>
  )
}
