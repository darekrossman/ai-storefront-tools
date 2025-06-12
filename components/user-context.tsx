'use client'

import { createContext, PropsWithChildren, use } from 'react'

export type UserContextType = {
  userId: string
} | null

export const UserContext = createContext<UserContextType>(null)

export const UserContextProvider = ({
  userId,
  children,
}: PropsWithChildren<UserContextType>) => {
  return <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = use(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserContext')
  }
  return context
}
