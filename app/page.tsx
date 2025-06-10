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

  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/dashboard')
  }

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
        <Stack gap={6} maxW="2xl">
          {/* Main Heading */}
          <styled.h1
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            fontWeight="bold"
            color="gray.900"
            lineHeight="tight"
          >
            AI-Powered E-Commerce Platform
          </styled.h1>

          {/* Subheading */}
          <styled.p
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.600"
            lineHeight="relaxed"
          >
            Generate complete product catalogs, brand identities, and marketing assets
            with AI. Build your entire storefront in minutes, not months.
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
            🚀 Coming Soon - Join our waitlist to be the first to know when we launch!
          </styled.p>

          {/* Waitlist Form */}
          <Box pt={4}>
            <WaitlistForm />
          </Box>
        </Stack>

        {/* Feature Highlights */}
        <Stack gap={4} pt={16} maxW="4xl">
          <styled.h2
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="semibold"
            color="gray.900"
            textAlign="center"
          >
            What You Can Build
          </styled.h2>

          <Flex gap={8} direction={{ base: 'column', md: 'row' }} justify="center" pt={8}>
            <Box textAlign="center" flex="1">
              <styled.h3 fontWeight="semibold" color="gray.900" mb={2}>
                Brand Identity
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600">
                AI-generated mission, values, and visual identity
              </styled.p>
            </Box>

            <Box textAlign="center" flex="1">
              <styled.h3 fontWeight="semibold" color="gray.900" mb={2}>
                Product Catalogs
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600">
                Complete products with variants, pricing, and descriptions
              </styled.p>
            </Box>

            <Box textAlign="center" flex="1">
              <styled.h3 fontWeight="semibold" color="gray.900" mb={2}>
                Marketing Assets
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600">
                Professional images and marketing materials
              </styled.p>
            </Box>
          </Flex>
        </Stack>
      </Flex>
    </Box>
  )
}
