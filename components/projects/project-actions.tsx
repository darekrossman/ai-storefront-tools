'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { deleteProjectAction } from '@/actions/projects'
import type { Project } from '@/lib/supabase/database-types'

interface ProjectActionsProps {
  project: Project
}

export default function ProjectActions({ project }: ProjectActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    startTransition(async () => {
      try {
        await deleteProjectAction(project.id)
        router.push('/dashboard')
      } catch (error) {
        console.error('Error deleting project:', error)
        setShowDeleteConfirm(false)
      }
    })
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  if (showDeleteConfirm) {
    return (
      <Stack gap={3} align="end" minW="300px">
        <styled.p fontSize="sm" color="gray.700" textAlign="right">
          Delete "{project.name}"? This action cannot be undone.
        </styled.p>
        <Flex gap={2}>
          <styled.button
            px={3}
            py={2}
            fontSize="sm"
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
            px={4}
            py={2}
            fontSize="sm"
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
            {isPending ? 'Deleting...' : 'Delete Project'}
          </styled.button>
        </Flex>
      </Stack>
    )
  }

  return (
    <Flex gap={3}>
      <Link href={`/dashboard/projects/${project.id}/edit`}>
        <styled.div
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
          display="inline-block"
        >
          Edit Project
        </styled.div>
      </Link>

      <styled.button
        px={4}
        py={2}
        fontSize="sm"
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
        Delete Project
      </styled.button>
    </Flex>
  )
}
