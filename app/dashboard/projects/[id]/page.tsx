import { notFound } from 'next/navigation'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { getProjectAction } from '@/actions/projects'
import ProjectActions from '@/components/projects/project-actions'

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
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
      <Stack gap={8}>
        {/* Header with Breadcrumb */}
        <Stack gap={4}>
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
            <styled.span fontSize="sm" color="gray.900" fontWeight="medium">
              {project.name}
            </styled.span>
          </Flex>

          <Flex justify="space-between" align="start" gap={4}>
            <Stack gap={2}>
              <styled.h1
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="bold"
                color="gray.900"
              >
                {project.name}
              </styled.h1>
              {project.description && (
                <styled.p fontSize="lg" color="gray.600" lineHeight="relaxed">
                  {project.description}
                </styled.p>
              )}
            </Stack>

            <ProjectActions project={project} />
          </Flex>
        </Stack>

        {/* Project Details */}
        <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
          <Stack gap={6}>
            <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
              Project Details
            </styled.h2>

            <Box
              display="grid"
              gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={6}
            >
              {/* Basic Information */}
              <Stack gap={4}>
                <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                  Basic Information
                </styled.h3>

                <Stack gap={3}>
                  <Box>
                    <styled.label
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.700"
                      display="block"
                      mb={1}
                    >
                      Name
                    </styled.label>
                    <styled.p fontSize="sm" color="gray.900">
                      {project.name}
                    </styled.p>
                  </Box>

                  <Box>
                    <styled.label
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.700"
                      display="block"
                      mb={1}
                    >
                      Status
                    </styled.label>
                    <styled.span
                      fontSize="sm"
                      fontWeight="medium"
                      px={2}
                      py={1}
                      bg="gray.100"
                      borderRadius="md"
                      color="gray.700"
                    >
                      {project.status || 'Active'}
                    </styled.span>
                  </Box>

                  {project.description && (
                    <Box>
                      <styled.label
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.700"
                        display="block"
                        mb={1}
                      >
                        Description
                      </styled.label>
                      <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                        {project.description}
                      </styled.p>
                    </Box>
                  )}
                </Stack>
              </Stack>

              {/* Metadata */}
              <Stack gap={4}>
                <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
                  Metadata
                </styled.h3>

                <Stack gap={3}>
                  <Box>
                    <styled.label
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.700"
                      display="block"
                      mb={1}
                    >
                      Created
                    </styled.label>
                    <styled.p fontSize="sm" color="gray.900">
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </styled.p>
                  </Box>

                  <Box>
                    <styled.label
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.700"
                      display="block"
                      mb={1}
                    >
                      Last Updated
                    </styled.label>
                    <styled.p fontSize="sm" color="gray.900">
                      {new Date(project.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </styled.p>
                  </Box>

                  <Box>
                    <styled.label
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.700"
                      display="block"
                      mb={1}
                    >
                      Project ID
                    </styled.label>
                    <styled.p fontSize="sm" color="gray.500">
                      {project.id}
                    </styled.p>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Future Sections Placeholder */}
        <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
          <Stack gap={4} align="center" textAlign="center">
            <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
              Coming Soon
            </styled.h3>
            <styled.p fontSize="sm" color="gray.600" maxW="md">
              Brand management, product catalogs, and AI-powered content generation will
              be available here in future updates.
            </styled.p>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
