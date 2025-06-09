import { Box, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import AuthForm from './auth-form'

export default function LoginPage() {
  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box maxW="md" w="full" mx={4}>
        {/* Header */}
        <Stack gap={6} align="center" mb={8}>
          <Link href="/">
            <styled.h1
              fontSize="2xl"
              fontWeight="bold"
              color="gray.900"
              _hover={{ color: 'gray.700' }}
              cursor="pointer"
              textAlign="center"
            >
              Storefront Tools
            </styled.h1>
          </Link>
        </Stack>

        <AuthForm />

        {/* Footer */}
        <Stack gap={4} align="center" pt={6}>
          <Link href="/">
            <styled.span
              fontSize="sm"
              color="gray.500"
              _hover={{ color: 'gray.700' }}
              cursor="pointer"
            >
              ← Back to homepage
            </styled.span>
          </Link>
        </Stack>
      </Box>
    </Box>
  )
}
