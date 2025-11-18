'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type AuthState = {
  error?: string
  message?: string
  success?: boolean
}

export async function login(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Basic validation
  if (!email || !password) {
    return { error: 'Please fill in all fields' }
  }

  if (!email.includes('@')) {
    return { error: 'Please enter a valid email address' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Handle specific error cases
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid email or password' }
    } else if (error.message.includes('Email not confirmed')) {
      return { error: 'Please check your email and confirm your account' }
    } else {
      return { error: error.message }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/brands')
}
