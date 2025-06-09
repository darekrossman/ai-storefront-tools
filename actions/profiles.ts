'use server'

import { createClient } from '@/lib/supabase/server'
import type { Profile, ProfileInsert } from '@/lib/supabase/database-types'

/**
 * Ensure the current user has a profile record
 * This function will create a profile if one doesn't exist
 */
export async function ensureUserProfileAction(): Promise<{
  success: boolean
  profile?: Profile
  error?: string
  created?: boolean
}> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // Error other than "not found"
      console.error('Error fetching profile:', fetchError)
      return { success: false, error: 'Failed to check profile' }
    }

    if (existingProfile) {
      // Profile already exists
      return { success: true, profile: existingProfile, created: false }
    }

    // Profile doesn't exist, create it
    const profileData: ProfileInsert = {
      id: user.id,
      full_name: user.user_metadata?.full_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      updated_at: new Date().toISOString(),
    }

    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    if (createError) {
      console.error('Error creating profile:', createError)
      return { success: false, error: 'Failed to create profile' }
    }

    return { success: true, profile: newProfile, created: true }
  } catch (error) {
    console.error('Error in ensureUserProfileAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Get the current user's profile, creating one if it doesn't exist
 */
export async function getCurrentUserProfileAction(): Promise<Profile | null> {
  const result = await ensureUserProfileAction()
  return result.success ? result.profile || null : null
}
