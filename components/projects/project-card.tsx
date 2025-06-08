'use client'

import { useState, useTransition } from 'react'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { deleteProjectAction } from '@/actions/projects'
import type { Project } from '@/lib/supabase/database-types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setIsDeleting(true)
    startTransition(async () => {
      try {
        await deleteProjectAction(project.id)
      } catch (error) {
        console.error('Error deleting project:', error)
        setIsDeleting(false)
        setShowDeleteConfirm(false)
      }
    })
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      overflow="hidden"
      _hover={{
        borderColor: 'gray.300',
        shadow: 'sm',
      }}
      transition="all 0.2s"
      opacity={isDeleting ? 0.5 : 1}
    >
      {/* Main Content - Clickable */}
      <Link href={`/dashboard/projects/${project.id}`}>
        <Box p={6} cursor="pointer">
          <Stack gap={3}>
            {/* Project Header */}
            <Stack gap={2}>
              <styled.h3
                fontSize="lg"
                fontWeight="semibold"
                color="gray.900"
                lineHeight="tight"
              >
                {project.name}
              </styled.h3>
              {project.description && (
                <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                  {project.description}
                </styled.p>
              )}
            </Stack>

            {/* Project Meta */}
            <Flex justify="space-between" align="center">
              <styled.span
                fontSize="xs"
                color="gray.500"
                fontWeight="medium"
                px={2}
                py={1}
                bg="gray.100"
                borderRadius="md"
              >
                {project.status || 'Active'}
              </styled.span>
              <styled.span fontSize="xs" color="gray.500">
                {new Date(project.created_at).toLocaleDateString()}
              </styled.span>
            </Flex>
          </Stack>
        </Box>
      </Link>

      {/* Action Buttons */}
      <Box borderTop="1px solid" borderColor="gray.100" p={4} bg="gray.25">
        {showDeleteConfirm ? (
          <Stack gap={3}>
            <styled.p fontSize="sm" color="gray.700" textAlign="center">
              Delete "{project.name}"? This action cannot be undone.
            </styled.p>
            <Flex gap={2} justify="center">
              <styled.button
                px={3}
                py={2}
                fontSize="xs"
                fontWeight="medium"
                color="gray.600"
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                cursor="pointer"
                _hover={{
                  bg: 'gray.50',
                }}
                onClick={handleCancelDelete}
                disabled={isPending}
              >
                Cancel
              </styled.button>
              <styled.button
                px={3}
                py={2}
                fontSize="xs"
                fontWeight="medium"
                color="white"
                bg="red.600"
                border="1px solid"
                borderColor="red.600"
                borderRadius="md"
                cursor="pointer"
                _hover={{
                  bg: 'red.700',
                }}
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </styled.button>
            </Flex>
          </Stack>
        ) : (
          <Flex gap={2} justify="center">
            <Link href={`/dashboard/projects/${project.id}/edit`}>
              <styled.div
                px={3}
                py={2}
                fontSize="xs"
                fontWeight="medium"
                color="gray.700"
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                cursor="pointer"
                _hover={{
                  bg: 'gray.50',
                  borderColor: 'gray.400',
                }}
                display="inline-block"
              >
                Edit
              </styled.div>
            </Link>
            <styled.button
              px={3}
              py={2}
              fontSize="xs"
              fontWeight="medium"
              color="red.600"
              bg="white"
              border="1px solid"
              borderColor="red.300"
              borderRadius="md"
              cursor="pointer"
              _hover={{
                bg: 'red.50',
                borderColor: 'red.400',
              }}
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete
            </styled.button>
          </Flex>
        )}
      </Box>
    </Box>
  )
}
