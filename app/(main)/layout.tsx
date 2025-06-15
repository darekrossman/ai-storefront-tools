import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Box, Flex } from '@/styled-system/jsx'
import DashboardNav from '@/components/navigation/dashboard-nav'
import { PropsWithChildren } from 'react'
import { UserContextProvider } from '@/components/user-context'

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Enforce authentication - redirect to login if not authenticated
  if (!user) {
    redirect('/login')
  }

  return (
    <UserContextProvider userId={user.id}>
      <Flex height="100vh" overflow="hidden">
        {/* Sidebar Navigation */}
        <DashboardNav />

        {/* Main Content Area */}
        <Flex flex="1" flexDirection="column" bg="stone.50" overflow="auto" minWidth="0">
          {children}
        </Flex>
      </Flex>
    </UserContextProvider>
  )
}
