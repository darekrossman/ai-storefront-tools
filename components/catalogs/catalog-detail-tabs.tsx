'use client'

import { ReactNode } from 'react'
import Tabs, { type TabItem } from '@/components/ui/tabs'

interface CatalogDetailTabsProps {
  categoriesTab: ReactNode
  productsTab: ReactNode
  productsCount: number
}

export default function CatalogDetailTabs({
  categoriesTab,
  productsTab,
  productsCount,
}: CatalogDetailTabsProps) {
  const tabItems: TabItem[] = [
    {
      id: 'categories',
      label: 'Categories',
      content: categoriesTab,
    },
    {
      id: 'products',
      label: `Products (${productsCount})`,
      content: productsTab,
    },
  ]

  return <Tabs items={tabItems} />
}
