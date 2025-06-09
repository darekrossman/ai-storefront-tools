import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import GuestHeader from '@/components/navigation/guest-header'

export default async function Page() {
  return <div>Hello</div>
  // const supabase = await createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // // Redirect authenticated users to dashboard
  // if (user) {
  //   redirect('/dashboard')
  // }

  // return (
  //   <Box minH="100vh" bg="gray.50">
  //     <GuestHeader />

  //     {/* Hero Section */}
  //     <Flex
  //       maxW="1200px"
  //       mx="auto"
  //       px={4}
  //       py={16}
  //       direction="column"
  //       align="center"
  //       textAlign="center"
  //     >
  //       <Stack gap={6} maxW="2xl">
  //         {/* Main Heading */}
  //         <styled.h1
  //           fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
  //           fontWeight="bold"
  //           color="gray.900"
  //           lineHeight="tight"
  //         >
  //           AI-Powered E-Commerce Platform
  //         </styled.h1>

  //         {/* Subheading */}
  //         <styled.p
  //           fontSize={{ base: 'lg', md: 'xl' }}
  //           color="gray.600"
  //           lineHeight="relaxed"
  //         >
  //           Generate complete product catalogs, brand identities, and marketing assets
  //           with AI. Build your entire storefront in minutes, not months.
  //         </styled.p>

  //         {/* Call to Action Buttons */}
  //         <Flex gap={4} justify="center" direction={{ base: 'column', sm: 'row' }} pt={4}>
  //           <Link href="/login">
  //             <styled.div
  //               px={8}
  //               py={3}
  //               fontSize="lg"
  //               fontWeight="semibold"
  //               color="white"
  //               bg="blue.600"
  //               borderRadius="lg"
  //               cursor="pointer"
  //               _hover={{
  //                 bg: 'blue.700',
  //               }}
  //               transition="all 0.2s"
  //               w={{ base: 'full', sm: 'auto' }}
  //               display="inline-block"
  //               textAlign="center"
  //             >
  //               Get Started Free
  //             </styled.div>
  //           </Link>

  //           <Link href="/login">
  //             <styled.div
  //               px={8}
  //               py={3}
  //               fontSize="lg"
  //               fontWeight="semibold"
  //               color="gray.700"
  //               bg="white"
  //               border="2px solid"
  //               borderColor="gray.300"
  //               borderRadius="lg"
  //               cursor="pointer"
  //               _hover={{
  //                 bg: 'gray.50',
  //                 borderColor: 'gray.400',
  //               }}
  //               transition="all 0.2s"
  //               w={{ base: 'full', sm: 'auto' }}
  //               display="inline-block"
  //               textAlign="center"
  //             >
  //               Learn More
  //             </styled.div>
  //           </Link>
  //         </Flex>
  //       </Stack>

  //       {/* Feature Highlights */}
  //       <Stack gap={4} pt={16} maxW="4xl">
  //         <styled.h2
  //           fontSize={{ base: 'xl', md: '2xl' }}
  //           fontWeight="semibold"
  //           color="gray.900"
  //           textAlign="center"
  //         >
  //           What You Can Build
  //         </styled.h2>

  //         <Flex gap={8} direction={{ base: 'column', md: 'row' }} justify="center" pt={8}>
  //           <Box textAlign="center" flex="1">
  //             <styled.h3 fontWeight="semibold" color="gray.900" mb={2}>
  //               Brand Identity
  //             </styled.h3>
  //             <styled.p fontSize="sm" color="gray.600">
  //               AI-generated mission, values, and visual identity
  //             </styled.p>
  //           </Box>

  //           <Box textAlign="center" flex="1">
  //             <styled.h3 fontWeight="semibold" color="gray.900" mb={2}>
  //               Product Catalogs
  //             </styled.h3>
  //             <styled.p fontSize="sm" color="gray.600">
  //               Complete products with variants, pricing, and descriptions
  //             </styled.p>
  //           </Box>

  //           <Box textAlign="center" flex="1">
  //             <styled.h3 fontWeight="semibold" color="gray.900" mb={2}>
  //               Marketing Assets
  //             </styled.h3>
  //             <styled.p fontSize="sm" color="gray.600">
  //               Professional images and marketing materials
  //             </styled.p>
  //           </Box>
  //         </Flex>
  //       </Stack>
  //     </Flex>
  //   </Box>
  // )
}
