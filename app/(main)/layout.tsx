import { redirect } from 'next/navigation'
import { Box, Flex } from '@/styled-system/jsx'
import PrimaryNav from '@/components/navigation/primary-nav'
import { PropsWithChildren } from 'react'
import { UserContextProvider } from '@/components/user-context'
import { getUser } from '@/actions/user'
import { PageContainer } from '@/components/ui/page-container'
import { css } from '@/styled-system/css'

export default async function DashboardLayout({ children }: PropsWithChildren) {
  try {
    const user = await getUser()

    return (
      <UserContextProvider user={user}>
        <Flex
          height="100dvh"
          overflow="hidden"
          bg="stone.100"
          gap={3}
          className={css({
            '--header-height': '60px',
            '--sidebar-width': '240px',
          })}
        >
          <Box w="var(--sidebar-width)" h="full">
            <PrimaryNav />
          </Box>

          <PageContainer overflow="auto" pr="3" py="3">
            <Flex
              alignItems="center"
              justifyContent="space-between"
              h="var(--header-height)"
              flexShrink={0}
              bg="stone.200"
              borderRadius="xl"
              position="sticky"
              top={0}
              zIndex={1}
            >
              header
            </Flex>

            <PageContainer>{children}</PageContainer>
          </PageContainer>
        </Flex>
      </UserContextProvider>
    )
  } catch {
    redirect('/login')
  }
}
