import { createClient } from '@/lib/supabase/server'
import { Box, Flex, Stack, styled, Grid, GridItem } from '@/styled-system/jsx'
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

      {/* Hero Section */}
      <Box bg="gray.50" _dark={{ bg: 'gray.900' }} py={{ base: 24, md: 32 }}>
        <Stack maxW="6xl" mx="auto" px={{ base: 4, md: 8 }} gap={10} textAlign="center">
          <styled.h1
            textStyle={{ base: '5xl', md: '7xl' }}
            fontWeight="extrabold"
            letterSpacing="tight"
            color="gray.900"
            _dark={{ color: 'white' }}
          >
            Forge a store before your coffee cools
          </styled.h1>

          <styled.p
            maxW="3xl"
            mx="auto"
            textStyle={{ base: 'lg', md: 'xl' }}
            color="gray.600"
            _dark={{ color: 'gray.300' }}
          >
            Realistic catalogs. Zero busywork. StoreCraft generates brand-perfect
            products, images, and CSV exports so you can start building—not typing
            lorem-ipsum.
          </styled.p>

          {/* Inline Waitlist Form CTA */}
          <Box w="full" maxW="md" mx="auto">
            <WaitlistForm />
          </Box>
        </Stack>
      </Box>

      {/* Feature Highlights Section */}
      <Box bg="white" _dark={{ bg: 'gray.800' }} py={{ base: 20, md: 28 }}>
        <Stack maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} gap={16}>
          <Box textAlign="center" maxW="3xl" mx="auto">
            <styled.h2
              textStyle={{ base: '3xl', md: '4xl' }}
              fontWeight="bold"
              color="gray.900"
              _dark={{ color: 'white' }}
            >
              Goodbye manual seeding. Hello one-click demo stores.
            </styled.h2>
            <styled.p
              mt={4}
              textStyle="lg"
              color="gray.600"
              _dark={{ color: 'gray.300' }}
            >
              StoreCraft fixes the three biggest pains in storefront development: slow
              setup, fake-looking data, and platform silos.
            </styled.p>
          </Box>

          {/* Value Grid */}
          <Grid
            gridTemplateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap={{ base: 10, md: 12 }}
          >
            <GridItem>
              <styled.h3
                fontSize="xl"
                fontWeight="semibold"
                color="gray.900"
                _dark={{ color: 'white' }}
              >
                Brand Forge
              </styled.h3>
              <styled.p mt={2} color="gray.600" _dark={{ color: 'gray.300' }}>
                Generate a full brand identity—name, palette, voice, and logo
                placeholder—in seconds.
              </styled.p>
            </GridItem>

            <GridItem>
              <styled.h3
                fontSize="xl"
                fontWeight="semibold"
                color="gray.900"
                _dark={{ color: 'white' }}
              >
                Catalog Builder
              </styled.h3>
              <styled.p mt={2} color="gray.600" _dark={{ color: 'gray.300' }}>
                Auto-creates a deep category tree and fills every sub-category with rich,
                variant-ready products.
              </styled.p>
            </GridItem>

            <GridItem>
              <styled.h3
                fontSize="xl"
                fontWeight="semibold"
                color="gray.900"
                _dark={{ color: 'white' }}
              >
                Image Factory
              </styled.h3>
              <styled.p mt={2} color="gray.600" _dark={{ color: 'gray.300' }}>
                Photoreal product hero shots and alt angles, generated in bulk and stored
                in your Supabase bucket.
              </styled.p>
            </GridItem>

            <GridItem>
              <styled.h3
                fontSize="xl"
                fontWeight="semibold"
                color="gray.900"
                _dark={{ color: 'white' }}
              >
                Shopify-ready CSV Export
              </styled.h3>
              <styled.p mt={2} color="gray.600" _dark={{ color: 'gray.300' }}>
                One-click download that imports flawlessly into Shopify today—Woo,
                Magento, and BigCommerce next.
              </styled.p>
            </GridItem>
          </Grid>
        </Stack>
      </Box>
    </Box>
  )
}
