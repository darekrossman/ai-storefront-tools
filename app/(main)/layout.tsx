import { redirect } from 'next/navigation'
import { Box, Flex } from '@/styled-system/jsx'
import PrimaryNav from '@/components/layout/primary-nav'
import { PropsWithChildren } from 'react'
import { UserContextProvider } from '@/components/user-context'
import { getUser } from '@/actions/user'
import { PageContainer } from '@/components/ui/page-container'

export default async function DashboardLayout({ children }: PropsWithChildren) {
  try {
    const user = await getUser()

    return (
      <UserContextProvider user={user}>
        <PageContainer flexDirection="row" bg="bg">
          <Box h="100dvh" position="sticky" top={0} borderRight="base">
            <PrimaryNav />
          </Box>

          <PageContainer>{children}</PageContainer>
        </PageContainer>
      </UserContextProvider>
    )
  } catch {
    redirect('/login')
  }
}
