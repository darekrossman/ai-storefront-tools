'use client'

import { Brand } from '@/lib/supabase/database-types'
import { createContext, PropsWithChildren, use } from 'react'

export const BrandContext = createContext<Brand | null>(null)

export const BrandContextProvider = ({
  brand,
  children,
}: PropsWithChildren<{ brand: Brand }>) => {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
}

export const useBrand = () => {
  const context = use(BrandContext)
  if (!context) {
    throw new Error('useBrand must be used within a BrandContext')
  }
  return context
}
