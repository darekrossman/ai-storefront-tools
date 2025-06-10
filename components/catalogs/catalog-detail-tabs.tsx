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
      id: 'products',
      label: `Products (${productsCount})`,
      content: productsTab,
    },
    {
      id: 'categories',
      label: 'Categories',
      content: categoriesTab,
    },
  ]

  return <Tabs items={tabItems} defaultTab="products" />
}
