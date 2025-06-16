'use client'

import { User } from '@supabase/supabase-js'
import { createContext, PropsWithChildren, use } from 'react'

export type UserContextType = User | null

export const UserContext = createContext<UserContextType>(null)

export const UserContextProvider = ({
  user,
  children,
}: PropsWithChildren<{ user: UserContextType }>) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = use(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserContext')
  }
  return context
}
