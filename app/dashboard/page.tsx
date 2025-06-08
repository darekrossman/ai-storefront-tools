import { createClient } from '@/lib/supabase/server'
import { getProjectsAction } from '@/actions/projects'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import ProjectList from '@/components/projects/project-list'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's projects
  const projects = await getProjectsAction()

  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      {/* Welcome Section */}
      <Stack gap={6} mb={8}>
        <Stack gap={2}>
          <styled.h1
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="bold"
            color="gray.900"
          >
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </styled.h1>
          <styled.p fontSize="lg" color="gray.600">
            Manage your projects and create new storefronts with AI assistance.
          </styled.p>
        </Stack>

        {/* Create New Project Button */}
        <Flex justify="flex-start">
          <Link href="/dashboard/projects/new">
            <styled.div
              px={6}
              py={3}
              fontSize="md"
              fontWeight="semibold"
              color="white"
              bg="blue.600"
              borderRadius="lg"
              cursor="pointer"
              _hover={{
                bg: 'blue.700',
              }}
              transition="all 0.2s"
              display="inline-block"
            >
              Create New Project
            </styled.div>
          </Link>
        </Flex>
      </Stack>

      {/* Projects Section */}
      <Stack gap={6}>
        <Flex justify="space-between" align="center">
          <styled.h2
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="semibold"
            color="gray.900"
          >
            Your Projects
          </styled.h2>
          <styled.span fontSize="sm" color="gray.500">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </styled.span>
        </Flex>

        {/* Projects List */}
        {projects.length === 0 ? (
          /* Empty State */
          <Box
            bg="white"
            border="2px dashed"
            borderColor="gray.300"
            borderRadius="lg"
            p={12}
            textAlign="center"
          >
            <Stack gap={4} align="center">
              <styled.div
                w={16}
                h={16}
                bg="gray.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <styled.span fontSize="2xl" color="gray.400">
                  📁
                </styled.span>
              </styled.div>
              <Stack gap={2}>
                <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900">
                  No projects yet
                </styled.h3>
                <styled.p fontSize="md" color="gray.600" maxW="md">
                  Get started by creating your first project. You'll be able to generate
                  brand identities, product catalogs, and marketing assets with AI.
                </styled.p>
              </Stack>
              <Link href="/dashboard/projects/new">
                <styled.div
                  px={6}
                  py={3}
                  fontSize="md"
                  fontWeight="semibold"
                  color="white"
                  bg="blue.600"
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{
                    bg: 'blue.700',
                  }}
                  transition="all 0.2s"
                  display="inline-block"
                >
                  Create Your First Project
                </styled.div>
              </Link>
            </Stack>
          </Box>
        ) : (
          /* Projects Grid */
          <ProjectList projects={projects} />
        )}
      </Stack>
    </Box>
  )
}
