'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { updateProjectAction } from '@/actions/projects'
import type { UpdateProjectData } from '@/actions/projects'
import type { Project } from '@/lib/supabase/database-types'

interface EditProjectFormProps {
  project: Project
  onCancel?: () => void
}

export default function EditProjectForm({ project, onCancel }: EditProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<UpdateProjectData>({
    name: project.name,
    description: project.description || '',
    status: project.status || 'active',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name?.trim()) {
      setError('Project name is required')
      return
    }

    startTransition(async () => {
      try {
        await updateProjectAction(project.id, formData)
        router.push(`/dashboard/projects/${project.id}`)
      } catch (err) {
        console.error('Error updating project:', err)
        setError('Failed to update project. Please try again.')
      }
    })
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push(`/dashboard/projects/${project.id}`)
    }
  }

  return (
    <Box maxW="2xl" mx="auto">
      <form onSubmit={handleSubmit}>
        <Stack gap={6}>
          {/* Form Header */}
          <Stack gap={2}>
            <styled.h1
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="bold"
              color="gray.900"
            >
              Edit Project
            </styled.h1>
            <styled.p fontSize="md" color="gray.600">
              Update your project information and settings.
            </styled.p>
          </Stack>

          {/* Error Message */}
          {error && (
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="md"
              p={4}
            >
              <styled.p fontSize="sm" color="red.700">
                {error}
              </styled.p>
            </Box>
          )}

          {/* Form Fields */}
          <Stack gap={4}>
            {/* Project Name */}
            <Stack gap={2}>
              <styled.label
                htmlFor="name"
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
              >
                Project Name *
              </styled.label>
              <styled.input
                id="name"
                type="text"
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData((prev: UpdateProjectData) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="e.g., My Awesome Store"
                px={3}
                py={2}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                fontSize="sm"
                _focus={{
                  outline: 'none',
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                }}
                _hover={{
                  borderColor: 'gray.400',
                }}
                disabled={isPending}
              />
            </Stack>

            {/* Project Description */}
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
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData((prev: UpdateProjectData) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe your project and what you plan to build..."
                rows={4}
                px={3}
                py={2}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                fontSize="sm"
                resize="vertical"
                _focus={{
                  outline: 'none',
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                }}
                _hover={{
                  borderColor: 'gray.400',
                }}
                disabled={isPending}
              />
            </Stack>

            {/* Project Status */}
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
                value={formData.status || 'active'}
                onChange={(e) =>
                  setFormData((prev: UpdateProjectData) => ({
                    ...prev,
                    status: e.target.value as 'active' | 'completed' | 'archived',
                  }))
                }
                px={3}
                py={2}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                fontSize="sm"
                _focus={{
                  outline: 'none',
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                }}
                _hover={{
                  borderColor: 'gray.400',
                }}
                disabled={isPending}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </styled.select>
            </Stack>
          </Stack>

          {/* Form Actions */}
          <Flex gap={3} justify="flex-end" pt={4}>
            <styled.button
              type="button"
              onClick={handleCancel}
              px={4}
              py={2}
              fontSize="sm"
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
              disabled={isPending}
            >
              Cancel
            </styled.button>

            <styled.button
              type="submit"
              px={6}
              py={2}
              fontSize="sm"
              fontWeight="medium"
              color="white"
              bg="blue.600"
              border="1px solid"
              borderColor="blue.600"
              borderRadius="md"
              cursor="pointer"
              _hover={{
                bg: 'blue.700',
                borderColor: 'blue.700',
              }}
              _disabled={{
                opacity: 0.5,
                cursor: 'not-allowed',
              }}
              disabled={isPending}
            >
              {isPending ? 'Updating...' : 'Update Project'}
            </styled.button>
          </Flex>
        </Stack>
      </form>
    </Box>
  )
}
