import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Box, Flex } from '@/styled-system/jsx'
import DashboardNav from '@/components/navigation/dashboard-nav'
import { PropsWithChildren } from 'react'
import { UserContextProvider } from '@/components/user-context'
import { css } from '@/styled-system/css'

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
      <Flex
        flex="1"
        flexDirection="column"
        className={css({
          '--header-height': '44px',
        })}
      >
        <DashboardNav />
        <Flex flex="1" flexDirection="column" bg="stone.100">
          {children}
        </Flex>
      </Flex>
    </UserContextProvider>
  )
}
