'use client'

import { useActionState } from 'react'
import { Box, Stack, styled } from '@/styled-system/jsx'
import { login, type AuthState } from './actions'

export default function AuthForm() {
  const [loginState, loginAction, loginPending] = useActionState(login, {})

  return (
    <Box maxW="md" w="full" mx={4}>
      {/* Header */}
      <Stack gap={6} align="center" mb={8}>
        <Stack gap={2} textAlign="center">
          <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
            Welcome back
          </styled.h2>
          <styled.p fontSize="sm" color="gray.600">
            Sign in to your account to continue
          </styled.p>
        </Stack>
      </Stack>

      {/* Alert Messages */}
      {loginState.error && (
        <Box
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="md"
          p={4}
          mb={6}
        >
          <styled.p fontSize="sm" color="red.700">
            {loginState.error}
          </styled.p>
        </Box>
      )}

      {loginState.message && (
        <Box
          bg="green.50"
          border="1px solid"
          borderColor="green.200"
          borderRadius="md"
          p={4}
          mb={6}
        >
          <styled.p fontSize="sm" color="green.700">
            {loginState.message}
          </styled.p>
        </Box>
      )}

      {/* Login Form */}
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        p={6}
        shadow="sm"
      >
        <form action={loginAction}>
          <Stack gap={5}>
            {/* Email Field */}
            <Stack gap={2}>
              <styled.label
                htmlFor="email"
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
              >
                Email address
              </styled.label>
              <styled.input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                px={3}
                py={2}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                fontSize="sm"
                disabled={loginPending}
                _focus={{
                  outline: 'none',
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                }}
                _hover={{
                  borderColor: 'gray.400',
                }}
                _disabled={{
                  opacity: 0.6,
                  cursor: 'not-allowed',
                }}
              />
            </Stack>

            {/* Password Field */}
            <Stack gap={2}>
              <styled.label
                htmlFor="password"
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
              >
                Password
              </styled.label>
              <styled.input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                px={3}
                py={2}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                fontSize="sm"
                disabled={loginPending}
                _focus={{
                  outline: 'none',
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                }}
                _hover={{
                  borderColor: 'gray.400',
                }}
                _disabled={{
                  opacity: 0.6,
                  cursor: 'not-allowed',
                }}
              />
            </Stack>

            {/* Submit Button */}
            <styled.button
              type="submit"
              w="full"
              py={3}
              px={4}
              fontSize="sm"
              fontWeight="semibold"
              color="white"
              bg={loginPending ? 'gray.400' : 'blue.600'}
              border="1px solid"
              borderColor={loginPending ? 'gray.400' : 'blue.600'}
              borderRadius="md"
              cursor={loginPending ? 'not-allowed' : 'pointer'}
              disabled={loginPending}
              _hover={
                loginPending
                  ? {}
                  : {
                      bg: 'blue.700',
                      borderColor: 'blue.700',
                    }
              }
              _focus={{
                outline: 'none',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              }}
              transition="all 0.2s"
            >
              {loginPending ? 'Loading...' : 'Sign In'}
            </styled.button>
          </Stack>
        </form>
      </Box>
    </Box>
  )
}
