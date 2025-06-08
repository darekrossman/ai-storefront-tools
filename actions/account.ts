'use server'

import { createClient } from '@/lib/supabase/server'
import { User } from '@supabase/supabase-js'

export const getProfileAction = async (user: User) => {
  const supabase = await createClient()
  const { data, error, status } = await supabase
    .from('profiles')
    .select(`full_name, username, website, avatar_url`)
    .eq('id', user?.id)
    .single()

  if (error && status !== 406) {
    console.log(error)
    throw error
  }

  return data
}

export const updateProfileAction = async ({
  username,
  website,
  avatar_url,
  fullname,
}: {
  username: string | null
  fullname: string | null
  website: string | null
  avatar_url: string | null
}) => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('profiles').upsert({
    id: user?.id as string,
    full_name: fullname,
    username,
    website,
    avatar_url,
    updated_at: new Date().toISOString(),
  })

  if (error) throw error
}
