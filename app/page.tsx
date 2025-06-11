import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Box, Flex, Stack, styled, Grid, GridItem } from '@/styled-system/jsx'
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
    <Box>
      <GuestHeader />

      {/* Combined Hero + Core Features Section */}
      <Box bg="gray.50" _dark={{ bg: 'gray.900' }} py={{ base: 20, md: 28 }}>
        <Stack maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} gap={{ base: 12, md: 20 }}>
          <Box textAlign="center" maxW="4xl" mx="auto">
            <styled.h1
              textStyle={{ base: '4xl', md: '6xl' }}
              fontWeight="extrabold"
              letterSpacing="tight"
              color="gray.900"
              _dark={{ color: 'white' }}
            >
              Build, Migrate, and Test at Lightning Speed
            </styled.h1>
            <styled.p
              mt={4}
              textStyle={{ base: 'lg', md: 'xl' }}
              color="gray.600"
              _dark={{ color: 'gray.300' }}
              maxW="3xl"
              mx="auto"
            >
              Go from a simple idea to a platform-ready ecommerce catalog in minutes.
              AI-powered generation and migration for Shopify, BigCommerce, and beyond.
            </styled.p>
          </Box>

          <Stack gap={{ base: 10, md: 16 }}>
            {/* Instant Store Seeding */}
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={{ base: 8, md: 12 }}
              align="center"
            >
              <Box flex="1">
                <styled.h2
                  textStyle={{ base: '2xl', md: '3xl' }}
                  fontWeight="bold"
                  color="gray.900"
                  _dark={{ color: 'white' }}
                >
                  Instant Store Seeding
                </styled.h2>
                <styled.p
                  mt={4}
                  textStyle="lg"
                  color="gray.600"
                  _dark={{ color: 'gray.300' }}
                >
                  Populate new stores or development environments with realistic,
                  high-quality product data in a fraction of the time, cutting down your
                  setup process from days to minutes.
                </styled.p>
              </Box>
              <Box
                flex="1"
                bg="white"
                _dark={{ bg: 'gray.800' }}
                p={8}
                borderRadius="xl"
                shadow="lg"
              >
                <styled.p
                  fontFamily="mono"
                  fontSize="md"
                  color="gray.700"
                  _dark={{ color: 'gray.300' }}
                >
                  {`// Before: 2-3 days of manual data entry`}
                  <br />
                  <br />
                  {`// After: ~5 minutes to a full store`}
                </styled.p>
              </Box>
            </Flex>

            {/* Effortless Platform Migration */}
            <Flex
              direction={{ base: 'column-reverse', md: 'row' }}
              gap={{ base: 8, md: 12 }}
              align="center"
            >
              <Box
                flex="1"
                bg="white"
                _dark={{ bg: 'gray.800' }}
                p={8}
                borderRadius="xl"
                shadow="lg"
              >
                <styled.p
                  fontFamily="mono"
                  fontSize="md"
                  color="gray.700"
                  _dark={{ color: 'gray.300' }}
                >
                  {`// Shopify -> BigCommerce`}
                  <br />
                  {`// Salesforce -> WooCommerce`}
                  <br />
                  {`// Any CSV -> Any Platform`}
                </styled.p>
              </Box>
              <Box flex="1">
                <styled.h2
                  textStyle={{ base: '2xl', md: '3xl' }}
                  fontWeight="bold"
                  color="gray.900"
                  _dark={{ color: 'white' }}
                >
                  Effortless Platform Migration
                </styled.h2>
                <styled.p
                  mt={4}
                  textStyle="lg"
                  color="gray.600"
                  _dark={{ color: 'gray.300' }}
                >
                  Move your entire catalog from one ecommerce platform to another without
                  the headache of manual data mapping and cleanup.
                </styled.p>
              </Box>
            </Flex>
          </Stack>
        </Stack>
      </Box>

      {/* Waitlist CTA Section */}
      <Box bg="white" _dark={{ bg: 'gray.800' }} py={{ base: 20, md: 24 }}>
        <Flex
          maxW="3xl"
          mx="auto"
          px={{ base: 4, md: 8 }}
          direction="column"
          align="center"
          textAlign="center"
        >
          <styled.h2
            textStyle={{ base: '3xl', md: '4xl' }}
            fontWeight="bold"
            color="gray.900"
            _dark={{ color: 'white' }}
          >
            The End of Tedious Catalog Management
          </styled.h2>
          <styled.p mt={4} textStyle="lg" color="gray.600" _dark={{ color: 'gray.300' }}>
            Stop waiting on data and start building. Join our waitlist to get early access
            and shape the future of ecommerce catalog management.
          </styled.p>
          <Box mt={8} w="full" maxW="md">
            <WaitlistForm />
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}
