'use client'

import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { useBrand } from '@/components/brand-context'
import { button } from '@/components/ui/button'

export function CreateCatalogButton({ children }: PropsWithChildren) {
  const brand = useBrand()
  return (
    <Link
      href={`/brands/${brand.slug}/catalogs/create`}
      className={button({ variant: 'secondary', size: 'sm' })}
    >
      {children}
    </Link>
  )
}
