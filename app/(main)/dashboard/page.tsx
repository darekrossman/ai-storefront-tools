import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Box, Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { button } from '@/components/ui/button'
import { getBrandsAction } from '@/actions/brands'
import { getUser } from '@/actions/user'
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'

export default async function DashboardPage() {
  const user = await getUser()
  const brands = await getBrandsAction()

  const brandCount = brands?.length || 0

  // Mock job data for now - will be replaced with real data later
  const mockJobStats = {
    totalJobs: 147,
    completedJobs: 98,
    activeJobs: 12,
  }

  return (
    <Box>
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
            Manage your brands and create new storefronts with AI assistance.
          </styled.p>
        </Stack>

        {/* Create New Brand Button */}
        <Flex justify="flex-start">
          <Link href="/brands/new" className={button({ variant: 'primary', size: 'lg' })}>
            Create New Brand
          </Link>
        </Flex>
      </Stack>

      {/* Analytics Dashboard */}
      <styled.div mb={8}>
        <styled.h2
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="semibold"
          color="gray.900"
          mb={6}
        >
          Analytics Overview
        </styled.h2>
        <AnalyticsDashboard
          brandCount={brandCount}
          totalJobs={mockJobStats.totalJobs}
          completedJobs={mockJobStats.completedJobs}
          activeJobs={mockJobStats.activeJobs}
        />
      </styled.div>

      {/* Brands Section */}
      <Stack gap={6}>
        <Flex justify="space-between" align="center">
          <styled.h2
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="semibold"
            color="gray.900"
          >
            Your Brands
          </styled.h2>
          <styled.span fontSize="sm" color="gray.500">
            {brandCount} brand{brandCount !== 1 ? 's' : ''}
          </styled.span>
        </Flex>

        {/* Brands List */}
        {brandCount === 0 ? (
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
                  🏷️
                </styled.span>
              </styled.div>
              <Stack gap={2}>
                <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900">
                  No brands yet
                </styled.h3>
                <styled.p fontSize="md" color="gray.600" maxW="md">
                  Get started by creating your first brand. You'll be able to generate
                  brand identities, product catalogs, and marketing assets with AI.
                </styled.p>
              </Stack>
              <Link href="/brands/new" className={button({ variant: 'primary' })}>
                Create Your First Brand
              </Link>
            </Stack>
          </Box>
        ) : (
          /* Brands Grid */
          <styled.div
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(320px, 1fr))"
            gap={6}
          >
            {brands?.map((brand) => (
              <Link key={brand.id} href={`/brands/${brand.slug}`}>
                <styled.div
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  p={6}
                  cursor="pointer"
                  _hover={{ borderColor: 'gray.300', shadow: 'sm' }}
                  transition="all 0.2s"
                >
                  <styled.div mb={4}>
                    <styled.h3
                      fontSize="xl"
                      fontWeight="semibold"
                      color="gray.900"
                      mb={2}
                    >
                      {brand.name}
                    </styled.h3>
                    {brand.tagline && (
                      <styled.p fontSize="sm" color="gray.600" mb={3}>
                        {brand.tagline}
                      </styled.p>
                    )}
                    {brand.category && (
                      <styled.span
                        display="inline-block"
                        bg="blue.50"
                        color="blue.700"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="medium"
                      >
                        {brand.category}
                      </styled.span>
                    )}
                  </styled.div>

                  <styled.div
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderTop="1px solid"
                    borderColor="gray.100"
                    pt={4}
                  >
                    <styled.div fontSize="sm" color="gray.500">
                      {brand.status === 'draft' && (
                        <styled.span color="yellow.600">Draft</styled.span>
                      )}
                      {brand.status === 'active' && (
                        <styled.span color="green.600">Active</styled.span>
                      )}
                      {brand.status === 'inactive' && (
                        <styled.span color="gray.600">Inactive</styled.span>
                      )}
                      {brand.status === 'archived' && (
                        <styled.span color="red.600">Archived</styled.span>
                      )}
                    </styled.div>
                    <styled.div fontSize="sm" color="gray.500">
                      {new Date(brand.created_at).toLocaleDateString()}
                    </styled.div>
                  </styled.div>
                </styled.div>
              </Link>
            ))}
          </styled.div>
        )}
      </Stack>
    </Box>
  )
}
