import { Box, Flex, styled } from '@/styled-system/jsx'
import Link from 'next/link'

export default function GuestHeader() {
  return (
    <Box borderBottom="1px solid" borderColor="gray.200" py={4}>
      <Flex maxW="1200px" mx="auto" px={4} justify="space-between" align="center">
        {/* App Name/Logo */}
        <Link href="/">
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

        {/* Navigation Buttons */}
        <Flex gap={3} align="center">
          <Link href="/login">
            <styled.div
              px={4}
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
              display="inline-block"
            >
              Log In
            </styled.div>
          </Link>

          <Link href="/login">
            <styled.div
              px={4}
              py={2}
              fontSize="sm"
              fontWeight="medium"
              color="white"
              bg="blue.600"
              border="1px solid"
              borderColor="blue.600"
              borderRadius="md"
              cursor="pointer"
              _hover={{
                bg: 'blue.700',
                borderColor: 'blue.700',
              }}
              transition="all 0.2s"
              display="inline-block"
            >
              Sign Up
            </styled.div>
          </Link>
        </Flex>
      </Flex>
    </Box>
  )
}
