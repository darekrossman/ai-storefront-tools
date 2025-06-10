'use client'

import { useActionState } from 'react'
import { joinWaitlistAction, type WaitlistFormState } from '@/actions/waitlist'
import { Box, Stack, styled } from '@/styled-system/jsx'

export default function WaitlistForm() {
  const [state, formAction, isPending] = useActionState(joinWaitlistAction, {})

  return (
    <Box maxW="md" mx="auto">
      <form action={formAction}>
        <Stack gap={4}>
          {/* Error Display */}
          {state.error && (
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="md"
              p={3}
            >
              <styled.p fontSize="sm" color="red.700">
                {state.error}
              </styled.p>
            </Box>
          )}

          {/* Success Message */}
          {state.message && state.success && (
            <Box
              bg="green.50"
              border="1px solid"
              borderColor="green.200"
              borderRadius="md"
              p={3}
            >
              <styled.p fontSize="sm" color="green.700">
                {state.message}
              </styled.p>
            </Box>
          )}

          {/* Email Input and Submit Button */}
          {!state.success && (
            <Stack gap={3}>
              <styled.input
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                disabled={isPending}
                px={4}
                py={3}
                fontSize="md"
                border="2px solid"
                borderColor="gray.300"
                borderRadius="lg"
                bg="white"
                color="gray.900"
                outline="none"
                _focus={{
                  borderColor: 'blue.500',
                  ring: '2px',
                  ringColor: 'blue.100',
                }}
                _disabled={{
                  bg: 'gray.100',
                  cursor: 'not-allowed',
                }}
                transition="all 0.2s"
              />

              <styled.button
                type="submit"
                disabled={isPending}
                px={8}
                py={3}
                fontSize="lg"
                fontWeight="semibold"
                color="white"
                bg={isPending ? 'gray.400' : 'blue.600'}
                borderRadius="lg"
                cursor={isPending ? 'not-allowed' : 'pointer'}
                _hover={
                  isPending
                    ? {}
                    : {
                        bg: 'blue.700',
                      }
                }
                transition="all 0.2s"
                w="full"
              >
                {isPending ? 'Joining...' : 'Join Waitlist'}
              </styled.button>
            </Stack>
          )}

          {/* Privacy Note */}
          <styled.p
            fontSize="xs"
            color="gray.500"
            textAlign="center"
            lineHeight="relaxed"
          >
            We'll only use your email to notify you when we launch. No spam, ever.
          </styled.p>
        </Stack>

        {/* Hidden fields for tracking */}
        <styled.input
          type="hidden"
          name="user_agent"
          value={typeof navigator !== 'undefined' ? navigator.userAgent : ''}
        />
        <styled.input
          type="hidden"
          name="referrer"
          value={typeof document !== 'undefined' ? document.referrer : ''}
        />
      </form>
    </Box>
  )
}
