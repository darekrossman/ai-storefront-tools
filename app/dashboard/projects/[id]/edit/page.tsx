import { notFound } from 'next/navigation'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { getProjectAction } from '@/actions/projects'
import EditProjectForm from '@/components/projects/edit-project-form'

interface EditProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  const projectId = parseInt(id)

  if (isNaN(projectId)) {
    notFound()
  }

  const project = await getProjectAction(projectId)

  if (!project) {
    notFound()
  }

  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      <Stack gap={6}>
        {/* Breadcrumb */}
        <Flex align="center" gap={2}>
          <Link href="/dashboard">
            <styled.span
              fontSize="sm"
              color="gray.600"
              _hover={{ color: 'gray.900' }}
              cursor="pointer"
            >
              Dashboard
            </styled.span>
          </Link>
          <styled.span fontSize="sm" color="gray.400">
            /
          </styled.span>
          <Link href={`/dashboard/projects/${project.id}`}>
            <styled.span
              fontSize="sm"
              color="gray.600"
              _hover={{ color: 'gray.900' }}
              cursor="pointer"
            >
              {project.name}
            </styled.span>
          </Link>
          <styled.span fontSize="sm" color="gray.400">
            /
          </styled.span>
          <styled.span fontSize="sm" color="gray.900" fontWeight="medium">
            Edit
          </styled.span>
        </Flex>

        {/* Edit Form */}
        <EditProjectForm project={project} />
      </Stack>
    </Box>
  )
}
