import { createClient } from '@/lib/supabase/server'
import { Box, Flex, Stack, styled, Grid, GridItem } from '@/styled-system/jsx'
import GuestHeader from '@/components/layout/guest-header'
import WaitlistForm from '@/components/waitlist-form'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/brands')
  } else {
    redirect('/login')
  }
}
