'use client'

import { createContext, PropsWithChildren, use } from 'react'

export type BrandContextType = {
  brandName: string
  brandId: number
} | null

type ProviderProps = {
  brand: BrandContextType
}

export const BrandContext = createContext<BrandContextType>(null)

export const BrandContextProvider = ({
  brand,
  children,
}: PropsWithChildren<ProviderProps>) => {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
}

export const useBrand = () => {
  const context = use(BrandContext)
  if (!context) {
    throw new Error('useBrand must be used within a BrandContext')
  }
  return context
}
