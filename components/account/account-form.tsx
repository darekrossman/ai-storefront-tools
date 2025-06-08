'use client'

import { useEffect, useState, useTransition } from 'react'
import { type User } from '@supabase/supabase-js'
import { getProfileAction, updateProfileAction } from '../../app/account/actions'

export default function AccountForm({ user }: { user: User | null }) {
  const [isPending, startTransition] = useTransition()
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      getProfileAction(user).then((data) => {
        setFullname(data?.full_name)
        setUsername(data?.username)
        setWebsite(data?.website)
        setAvatarUrl(data?.avatar_url)
      })
    }
  }, [user])

  return (
    <div className="form-widget">
      {/* ... */}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() =>
            startTransition(
              async () =>
                await updateProfileAction({ fullname, username, website, avatar_url }),
            )
          }
          disabled={isPending}
        >
          {isPending ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
