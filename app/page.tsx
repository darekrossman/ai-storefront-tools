import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import GuestHeader from '@/components/navigation/guest-header'
import WaitlistForm from '@/components/waitlist-form'

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Note: Removed automatic redirect to allow logged-in users to view homepage

  return (
    <Box minH="100vh" bg="gray.50">
      <GuestHeader />

      {/* Hero Section */}
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        py={16}
        direction="column"
        align="center"
        textAlign="center"
      >
        <Stack gap={6} maxW="3xl">
          {/* Main Heading */}
          <styled.h1
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            fontWeight="bold"
            color="gray.900"
            lineHeight="tight"
          >
            Generate, Transform & Migrate Ecommerce Catalogs in Minutes
          </styled.h1>

          {/* Subheading */}
          <styled.p
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.600"
            lineHeight="relaxed"
          >
            AI-powered catalog generation from simple prompts. Export to any platform.
            Migrate between Shopify, BigCommerce, Salesforce, and more with just a few
            clicks.
          </styled.p>

          {/* Coming Soon Notice */}
          <styled.p
            fontSize="md"
            color="orange.700"
            fontWeight="medium"
            bg="orange.50"
            px={4}
            py={2}
            borderRadius="md"
            border="1px solid"
            borderColor="orange.200"
            textAlign="center"
          >
            🚀 Coming Soon - Join our waitlist to be the first to access the beta!
          </styled.p>

          {/* Waitlist Form */}
          <Box pt={4}>
            <WaitlistForm />
          </Box>
        </Stack>

        {/* Features Section */}
        <Stack gap={8} pt={16} maxW="5xl" w="full">
          <styled.h2
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="semibold"
            color="gray.900"
            textAlign="center"
          >
            Everything You Need for Catalog Management
          </styled.h2>

          <Flex gap={6} direction={{ base: 'column', md: 'row' }} justify="center">
            <Box
              textAlign="center"
              flex="1"
              bg="white"
              p={6}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <styled.h3 fontWeight="semibold" color="gray.900" mb={3} fontSize="lg">
                🤖 AI Generation
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                Generate complete catalogs with rich product descriptions, variants,
                pricing, and professional imagery from simple prompts
              </styled.p>
            </Box>

            <Box
              textAlign="center"
              flex="1"
              bg="white"
              p={6}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <styled.h3 fontWeight="semibold" color="gray.900" mb={3} fontSize="lg">
                📤 Multi-Platform Export
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                Export to Shopify, BigCommerce, Salesforce Commerce Cloud, WooCommerce,
                and custom platforms in the right format
              </styled.p>
            </Box>

            <Box
              textAlign="center"
              flex="1"
              bg="white"
              p={6}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <styled.h3 fontWeight="semibold" color="gray.900" mb={3} fontSize="lg">
                🔄 Easy Migration
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600" lineHeight="relaxed">
                Export from your current platform and migrate to any other in minutes. No
                manual data entry or complex integrations
              </styled.p>
            </Box>
          </Flex>
        </Stack>

        {/* Use Cases Section */}
        <Stack gap={8} pt={16} maxW="5xl" w="full">
          <styled.h2
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="semibold"
            color="gray.900"
            textAlign="center"
          >
            Perfect For Your Team
          </styled.h2>

          <Flex gap={6} direction={{ base: 'column', md: 'row' }} justify="center">
            <Box textAlign="center" flex="1">
              <styled.h3 fontWeight="semibold" color="blue.700" mb={2} fontSize="md">
                Sales Teams
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600">
                Create realistic demo catalogs for client presentations and
                proof-of-concepts
              </styled.p>
            </Box>

            <Box textAlign="center" flex="1">
              <styled.h3 fontWeight="semibold" color="blue.700" mb={2} fontSize="md">
                Platform Developers
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600">
                Generate test data for integration testing and storefront accelerators
              </styled.p>
            </Box>

            <Box textAlign="center" flex="1">
              <styled.h3 fontWeight="semibold" color="blue.700" mb={2} fontSize="md">
                Ecommerce Admins
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600">
                Migrate catalogs between platforms without losing data or formatting
              </styled.p>
            </Box>

            <Box textAlign="center" flex="1">
              <styled.h3 fontWeight="semibold" color="blue.700" mb={2} fontSize="md">
                Merchandisers
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600">
                Quickly populate new stores with rich product content and imagery
              </styled.p>
            </Box>
          </Flex>
        </Stack>
      </Flex>
    </Box>
  )
}
