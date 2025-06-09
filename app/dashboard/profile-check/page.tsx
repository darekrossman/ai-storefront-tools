import { redirect } from 'next/navigation'
import { Container, Box, Stack, styled } from '@/styled-system/jsx'
import { createClient } from '@/lib/supabase/server'
import { ensureUserProfileAction } from '@/actions/profiles'

export default async function ProfileCheckPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check and ensure profile exists
  const profileResult = await ensureUserProfileAction()

  return (
    <Container py={8}>
      <Box maxW="2xl" mx="auto">
        <Stack gap={6}>
          <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900">
            Profile Status Check
          </styled.h1>

          {profileResult.success ? (
            <Box
              bg="green.50"
              border="1px solid"
              borderColor="green.200"
              borderRadius="lg"
              p={6}
            >
              <Stack gap={3}>
                <styled.h2 fontSize="lg" fontWeight="semibold" color="green.900">
                  ✅ Profile Status: OK
                </styled.h2>

                {profileResult.created ? (
                  <styled.p fontSize="sm" color="green.700">
                    Your profile was missing but has been automatically created. You can
                    now create projects without issues.
                  </styled.p>
                ) : (
                  <styled.p fontSize="sm" color="green.700">
                    Your profile exists and is properly linked to your account.
                  </styled.p>
                )}

                <Box mt={4}>
                  <styled.h3 fontSize="md" fontWeight="medium" color="green.900" mb={2}>
                    Profile Information:
                  </styled.h3>
                  <Stack gap={2} fontSize="sm" color="green.700">
                    <styled.div>
                      <strong>User ID:</strong> {profileResult.profile?.id}
                    </styled.div>
                    <styled.div>
                      <strong>Full Name:</strong>{' '}
                      {profileResult.profile?.full_name || 'Not set'}
                    </styled.div>
                    <styled.div>
                      <strong>Username:</strong>{' '}
                      {profileResult.profile?.username || 'Not set'}
                    </styled.div>
                    <styled.div>
                      <strong>Email:</strong> {user.email}
                    </styled.div>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          ) : (
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="lg"
              p={6}
            >
              <Stack gap={3}>
                <styled.h2 fontSize="lg" fontWeight="semibold" color="red.900">
                  ❌ Profile Issue Detected
                </styled.h2>
                <styled.p fontSize="sm" color="red.700">
                  There was an error with your profile: {profileResult.error}
                </styled.p>
                <styled.p fontSize="sm" color="red.600">
                  Please contact support if this issue persists.
                </styled.p>
              </Stack>
            </Box>
          )}

          <Box
            bg="blue.50"
            border="1px solid"
            borderColor="blue.200"
            borderRadius="lg"
            p={6}
          >
            <Stack gap={3}>
              <styled.h3 fontSize="md" fontWeight="medium" color="blue.900">
                What this page does:
              </styled.h3>
              <styled.ul fontSize="sm" color="blue.700" pl={4}>
                <styled.li>Checks if your user profile exists in our database</styled.li>
                <styled.li>Automatically creates a missing profile if needed</styled.li>
                <styled.li>
                  Ensures you can create projects without foreign key errors
                </styled.li>
                <styled.li>Displays your current profile information</styled.li>
              </styled.ul>
            </Stack>
          </Box>

          <Box textAlign="center">
            <styled.a
              href="/dashboard"
              px={6}
              py={3}
              bg="blue.600"
              color="white"
              borderRadius="lg"
              fontSize="sm"
              fontWeight="medium"
              textDecoration="none"
              _hover={{ bg: 'blue.700' }}
              transition="all 0.2s"
              display="inline-block"
            >
              Return to Dashboard
            </styled.a>
          </Box>
        </Stack>
      </Box>
    </Container>
  )
}

export async function generateMetadata() {
  return {
    title: 'Profile Check - Storefront Tools',
    description: 'Check and fix user profile issues',
  }
}
