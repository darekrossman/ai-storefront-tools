import { Box, Container, Flex, styled } from '@/styled-system/jsx'
import Link from 'next/link'

export default function GuestHeader() {
  return (
    <Box borderBottom="1px solid" borderColor="gray.200" py={4}>
      <Container>
        <Flex justify="space-between" align="center">
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

          {/* Status Badge */}
          <Flex gap={3} align="center">
            <styled.div
              px={4}
              py={2}
              fontSize="sm"
              fontWeight="medium"
              color="orange.700"
              bg="orange.100"
              border="1px solid"
              borderColor="orange.200"
              borderRadius="md"
            >
              Coming Soon
            </styled.div>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
