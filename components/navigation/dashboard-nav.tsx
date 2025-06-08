import { Box, Flex, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardNav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <Box borderBottom="1px solid" borderColor="gray.200" py={4}>
      <Flex maxW="1200px" mx="auto" px={4} justify="space-between" align="center">
        {/* App Name/Logo */}
        <Link href="/dashboard">
          <styled.h1
            fontSize="xl"
            fontWeight="bold"
            color="gray.900"
            _hover={{ color: 'gray.700' }}
            cursor="pointer"
          >
            Storefront Tools
          </styled.h1>
        </Link>

        {/* Navigation Links */}
        <Flex gap={6} align="center">
          <Link href="/dashboard">
            <styled.span
              fontSize="sm"
              fontWeight="medium"
              color="gray.700"
              _hover={{ color: 'gray.900' }}
              cursor="pointer"
            >
              Dashboard
            </styled.span>
          </Link>

          <Link href="/account">
            <styled.span
              fontSize="sm"
              fontWeight="medium"
              color="gray.700"
              _hover={{ color: 'gray.900' }}
              cursor="pointer"
            >
              Account
            </styled.span>
          </Link>
        </Flex>

        {/* User Info & Logout */}
        <Flex gap={4} align="center">
          {user?.email && (
            <styled.span
              fontSize="sm"
              color="gray.600"
              display={{ base: 'none', md: 'block' }}
            >
              {user.email}
            </styled.span>
          )}

          <form action="/auth/signout" method="post">
            <styled.button
              px={3}
              py={2}
              fontSize="sm"
              fontWeight="medium"
              color="gray.700"
              bg="transparent"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              cursor="pointer"
              _hover={{
                bg: 'gray.50',
                borderColor: 'gray.400',
              }}
              transition="all 0.2s"
              type="submit"
            >
              Logout
            </styled.button>
          </form>
        </Flex>
      </Flex>
    </Box>
  )
}
