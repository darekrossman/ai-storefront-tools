import { Box, Container, Flex, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardNav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <Flex
      w="full"
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top="0"
      h="var(--header-height)"
      px="4"
      borderBottom="1px solid {colors.gray.200}"
      bg="white"
      zIndex="100"
    >
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
  )
}
