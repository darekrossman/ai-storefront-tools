import { notFound } from 'next/navigation'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { getProjectAction, getProjectStatsAction } from '@/actions/projects'
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

  // Get project statistics
  const stats = await getProjectStatsAction(projectId)

  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      <Stack gap={8}>
        {/* Project Header */}
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

        {/* Quick Stats Cards */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }}
          gap={4}
        >
          <Link href={`/dashboard/projects/${projectId}/brands`}>
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                borderColor: 'blue.300',
                shadow: 'sm',
              }}
            >
              <Stack gap={2}>
                <styled.div fontSize="2xl" fontWeight="bold" color="blue.600">
                  {stats.brandsCount}
                </styled.div>
                <styled.div fontSize="sm" fontWeight="medium" color="gray.900">
                  Brands
                </styled.div>
                <styled.div fontSize="xs" color="gray.600">
                  Manage brand identities
                </styled.div>
              </Stack>
            </Box>
          </Link>

          <Link href={`/dashboard/projects/${projectId}/catalogs`}>
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                borderColor: 'green.300',
                shadow: 'sm',
              }}
            >
              <Stack gap={2}>
                <styled.div fontSize="2xl" fontWeight="bold" color="green.600">
                  {stats.catalogsCount}
                </styled.div>
                <styled.div fontSize="sm" fontWeight="medium" color="gray.900">
                  Catalogs
                </styled.div>
                <styled.div fontSize="xs" color="gray.600">
                  Product collections
                </styled.div>
              </Stack>
            </Box>
          </Link>

          <Link href={`/dashboard/projects/${projectId}/products`}>
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={6}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                borderColor: 'purple.300',
                shadow: 'sm',
              }}
            >
              <Stack gap={2}>
                <styled.div fontSize="2xl" fontWeight="bold" color="purple.600">
                  {stats.productsCount}
                </styled.div>
                <styled.div fontSize="sm" fontWeight="medium" color="gray.900">
                  Products
                </styled.div>
                <styled.div fontSize="xs" color="gray.600">
                  Total products
                </styled.div>
              </Stack>
            </Box>
          </Link>
        </Box>

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

        {/* Quick Actions */}
        <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
          <Stack gap={6}>
            <styled.h3 fontSize="lg" fontWeight="medium" color="gray.900">
              Quick Actions
            </styled.h3>

            <Box
              display="grid"
              gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={4}
            >
              <Link href={`/dashboard/projects/${projectId}/brands/new`}>
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    borderColor: 'blue.300',
                    bg: 'blue.50',
                  }}
                >
                  <Stack gap={2}>
                    <styled.div fontSize="sm" fontWeight="medium" color="gray.900">
                      Create New Brand
                    </styled.div>
                    <styled.div fontSize="xs" color="gray.600">
                      Define brand identity and guidelines
                    </styled.div>
                  </Stack>
                </Box>
              </Link>

              <Link href={`/dashboard/projects/${projectId}/catalogs/new`}>
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    borderColor: 'green.300',
                    bg: 'green.50',
                  }}
                >
                  <Stack gap={2}>
                    <styled.div fontSize="sm" fontWeight="medium" color="gray.900">
                      Create Product Catalog
                    </styled.div>
                    <styled.div fontSize="xs" color="gray.600">
                      Start organizing your products
                    </styled.div>
                  </Stack>
                </Box>
              </Link>
            </Box>

            {stats.brandsCount === 0 && (
              <Box
                bg="blue.50"
                border="1px solid"
                borderColor="blue.200"
                borderRadius="md"
                p={4}
              >
                <Stack gap={2}>
                  <styled.div fontSize="sm" fontWeight="medium" color="blue.900">
                    Get Started
                  </styled.div>
                  <styled.div fontSize="xs" color="blue.700">
                    Create your first brand to begin organizing products and building your
                    catalog.
                  </styled.div>
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
