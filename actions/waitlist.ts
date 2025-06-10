'use server'

import { createClient } from '@/lib/supabase/server'

export type WaitlistFormState = {
  error?: string
  message?: string
  success?: boolean
}

/**
 * Add an email to the waitlist
 */
export async function joinWaitlistAction(
  prevState: WaitlistFormState,
  formData: FormData,
): Promise<WaitlistFormState> {
  try {
    const email = formData.get('email') as string

    // Basic validation
    if (!email) {
      return { error: 'Email address is required' }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { error: 'Please enter a valid email address' }
    }

    // Normalize email (lowercase and trim)
    const normalizedEmail = email.toLowerCase().trim()

    const supabase = await createClient()

    // Check if email already exists
    const { data: existing, error: checkError } = await (supabase as any)
      .from('waitlist')
      .select('id, status')
      .eq('email', normalizedEmail)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // Error other than "not found"
      console.error('Error checking existing waitlist entry:', checkError)
      return { error: 'Something went wrong. Please try again.' }
    }

    if (existing) {
      if (existing.status === 'active') {
        return {
          message: "You're already on our waitlist! We'll notify you when we launch.",
          success: true,
        }
      } else if (existing.status === 'disabled') {
        // Reactivate disabled entry
        const { error: updateError } = await (supabase as any)
          .from('waitlist')
          .update({
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)

        if (updateError) {
          console.error('Error reactivating waitlist entry:', updateError)
          return { error: 'Something went wrong. Please try again.' }
        }

        return {
          message:
            "Welcome back! You're now on our waitlist and we'll notify you when we launch.",
          success: true,
        }
      } else {
        return {
          message: "You're already on our waitlist! We'll notify you when we launch.",
          success: true,
        }
      }
    }

    // Add new entry to waitlist
    const { error: insertError } = await (supabase as any).from('waitlist').insert({
      email: normalizedEmail,
      source: 'homepage',
      status: 'active',
      metadata: {
        user_agent: formData.get('user_agent') || null,
        referrer: formData.get('referrer') || null,
        timestamp: new Date().toISOString(),
      },
    })

    if (insertError) {
      console.error('Error inserting waitlist entry:', insertError)

      // Handle duplicate email constraint error (in case of race condition)
      if (insertError.code === '23505') {
        return {
          message: "You're already on our waitlist! We'll notify you when we launch.",
          success: true,
        }
      }

      return { error: 'Something went wrong. Please try again.' }
    }

    return {
      message: "Thanks for joining our waitlist! We'll notify you as soon as we launch.",
      success: true,
    }
  } catch (error) {
    console.error('Error in joinWaitlistAction:', error)
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
    }
  }
}

/**
 * Get waitlist statistics (for admin use)
 */
export async function getWaitlistStatsAction(): Promise<{
  success: boolean
  stats?: {
    total: number
    active: number
    notified: number
    recent: number // last 7 days
  }
  error?: string
}> {
  try {
    const supabase = await createClient()

    // Check if user is authenticated (basic admin check)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Authentication required' }
    }

    // Get total count
    const { count: total, error: totalError } = await (supabase as any)
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    if (totalError) {
      console.error('Error getting total waitlist count:', totalError)
      return { success: false, error: 'Failed to get waitlist statistics' }
    }

    // Get active count
    const { count: active, error: activeError } = await (supabase as any)
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    if (activeError) {
      console.error('Error getting active waitlist count:', activeError)
      return { success: false, error: 'Failed to get waitlist statistics' }
    }

    // Get notified count
    const { count: notified, error: notifiedError } = await (supabase as any)
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'notified')

    if (notifiedError) {
      console.error('Error getting notified waitlist count:', notifiedError)
      return { success: false, error: 'Failed to get waitlist statistics' }
    }

    // Get recent signups (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: recent, error: recentError } = await (supabase as any)
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())

    if (recentError) {
      console.error('Error getting recent waitlist count:', recentError)
      return { success: false, error: 'Failed to get waitlist statistics' }
    }

    return {
      success: true,
      stats: {
        total: total || 0,
        active: active || 0,
        notified: notified || 0,
        recent: recent || 0,
      },
    }
  } catch (error) {
    console.error('Error in getWaitlistStatsAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
