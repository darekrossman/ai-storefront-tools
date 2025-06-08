'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { login, signup } from './actions'

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

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

          <Stack gap={2} textAlign="center">
            <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </styled.h2>
            <styled.p fontSize="sm" color="gray.600">
              {isSignup
                ? 'Start building your AI-powered storefront'
                : 'Sign in to your account to continue'}
            </styled.p>
          </Stack>
        </Stack>

        {/* Auth Toggle */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          p={1}
          mb={6}
          display="flex"
        >
          <styled.button
            flex="1"
            py={2}
            px={4}
            fontSize="sm"
            fontWeight="medium"
            borderRadius="md"
            transition="all 0.2s"
            bg={!isSignup ? 'blue.600' : 'transparent'}
            color={!isSignup ? 'white' : 'gray.700'}
            _hover={!isSignup ? {} : { bg: 'gray.50' }}
            onClick={() => setIsSignup(false)}
          >
            Sign In
          </styled.button>
          <styled.button
            flex="1"
            py={2}
            px={4}
            fontSize="sm"
            fontWeight="medium"
            borderRadius="md"
            transition="all 0.2s"
            bg={isSignup ? 'blue.600' : 'transparent'}
            color={isSignup ? 'white' : 'gray.700'}
            _hover={isSignup ? {} : { bg: 'gray.50' }}
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </styled.button>
        </Box>

        {/* Alert Messages */}
        {error && (
          <Box
            bg="red.50"
            border="1px solid"
            borderColor="red.200"
            borderRadius="md"
            p={4}
            mb={6}
          >
            <styled.p fontSize="sm" color="red.700">
              {error}
            </styled.p>
          </Box>
        )}

        {message && (
          <Box
            bg="green.50"
            border="1px solid"
            borderColor="green.200"
            borderRadius="md"
            p={4}
            mb={6}
          >
            <styled.p fontSize="sm" color="green.700">
              {message}
            </styled.p>
          </Box>
        )}

        {/* Login/Signup Form */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          p={6}
          shadow="sm"
        >
          <form action={isSignup ? signup : login}>
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
                  _focus={{
                    outline: 'none',
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                  }}
                  _hover={{
                    borderColor: 'gray.400',
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
                  _focus={{
                    outline: 'none',
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                  }}
                  _hover={{
                    borderColor: 'gray.400',
                  }}
                />
                {isSignup && (
                  <styled.p fontSize="xs" color="gray.500">
                    Must be at least 6 characters long
                  </styled.p>
                )}
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
                bg="blue.600"
                border="1px solid"
                borderColor="blue.600"
                borderRadius="md"
                cursor="pointer"
                _hover={{
                  bg: 'blue.700',
                  borderColor: 'blue.700',
                }}
                _focus={{
                  outline: 'none',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                }}
                transition="all 0.2s"
              >
                {isSignup ? 'Create Account' : 'Sign In'}
              </styled.button>
            </Stack>
          </form>
        </Box>

        {/* Footer */}
        <Stack gap={4} align="center" pt={6}>
          <styled.p fontSize="sm" color="gray.600" textAlign="center">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <styled.button
                  color="blue.600"
                  fontWeight="medium"
                  _hover={{ color: 'blue.700' }}
                  onClick={() => setIsSignup(false)}
                >
                  Sign in
                </styled.button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <styled.button
                  color="blue.600"
                  fontWeight="medium"
                  _hover={{ color: 'blue.700' }}
                  onClick={() => setIsSignup(true)}
                >
                  Sign up
                </styled.button>
              </>
            )}
          </styled.p>

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
