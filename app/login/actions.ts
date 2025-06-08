'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Basic validation
  if (!email || !password) {
    redirect('/login?error=Please fill in all fields')
  }

  if (!email.includes('@')) {
    redirect('/login?error=Please enter a valid email address')
  }

  if (password.length < 6) {
    redirect('/login?error=Password must be at least 6 characters')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Handle specific error cases
    if (error.message.includes('Invalid login credentials')) {
      redirect('/login?error=Invalid email or password')
    } else if (error.message.includes('Email not confirmed')) {
      redirect('/login?error=Please check your email and confirm your account')
    } else {
      redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Basic validation
  if (!email || !password) {
    redirect('/login?error=Please fill in all fields')
  }

  if (!email.includes('@')) {
    redirect('/login?error=Please enter a valid email address')
  }

  if (password.length < 6) {
    redirect('/login?error=Password must be at least 6 characters')
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    // Handle specific error cases
    if (error.message.includes('User already registered')) {
      redirect(
        '/login?error=An account with this email already exists. Try logging in instead.',
      )
    } else if (error.message.includes('Password should be')) {
      redirect('/login?error=Password must be at least 6 characters')
    } else {
      redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  // Show success message for signup
  redirect('/login?message=Check your email to confirm your account before logging in')
}
