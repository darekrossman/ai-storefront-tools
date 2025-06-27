'use client'

import { Center, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Tabs } from 'radix-ui'
import { css } from '@/styled-system/css'
import { startTransition, useOptimistic } from 'react'
import { motion } from 'motion/react'
import { token } from '@/styled-system/tokens'

const StyledLink = styled(Link, {
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    h: 'full',
    w: 'max-content',
    fontWeight: 'medium',
    fontSize: 'sm',
    color: 'fg.dark/60',
    _hover: {
      color: 'fg.hover',
    },
    '&[data-state="active"]': {
      color: 'fg.dark',
      fontWeight: 'bold',
    },
    _before: {
      content: 'attr(data-label)',
      fontWeight: 'bold',
      visibility: 'hidden',
    },
  },
})

const links = [
  {
    href: '',
    label: 'Brand Info',
  },
  {
    href: '/catalogs',
    label: 'Catalogs',
  },
  {
    href: '/products',
    label: 'Products',
  },
  {
    href: '/export',
    label: 'Export',
  },
  {
    href: '/settings',
    label: 'Settings',
  },
]

export function BrandNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const pathParts = pathname.split('/')
  const brandIndex = pathParts.findIndex((part) => part === 'brands')
  const brandBasePath =
    brandIndex !== -1 && brandIndex + 1 < pathParts.length
      ? pathParts.slice(0, brandIndex + 2).join('/')
      : '/brands'

  const [activeTab, setActiveTab] = useOptimistic(getActiveTab(pathname))

  return (
    <Tabs.Root
      value={activeTab}
      className={css({
        h: 'full',
      })}
    >
      <Tabs.List
        aria-label="Manage your brand"
        className={css({
          display: 'flex',
          flexDirection: 'row',
          h: 'full',
          px: 8,
          gap: 6,
        })}
      >
        {links.map((link) => {
          const href = `${brandBasePath}${link.href}`
          const isActive = activeTab === link.href

          return (
            <Tabs.Trigger key={link.href} value={link.href} asChild>
              <StyledLink
                href={href}
                data-label={link.label}
                onNavigate={(e) => {
                  e.preventDefault()
                  startTransition(() => {
                    setActiveTab(link.href)
                    router.push(href)
                  })
                }}
              >
                <Center position="absolute" inset={0} alignItems="flex-end" pb="3">
                  {link.label}
                </Center>
                {isActive && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: token('colors.accent'),
                    }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeInOut',
                    }}
                    layoutId="underline"
                    id="underline"
                  />
                )}
              </StyledLink>
            </Tabs.Trigger>
          )
        })}
      </Tabs.List>
    </Tabs.Root>
  )
}

function getActiveTab(pathname: string): string {
  // Extract the brand base path (e.g., "/brands/mybrand")
  const pathParts = pathname.split('/')
  const brandIndex = pathParts.findIndex((part) => part === 'brands')

  if (brandIndex === -1 || brandIndex + 1 >= pathParts.length) {
    return '' // Default to Brand Info if no brand found
  }

  const brandBasePath = pathParts.slice(0, brandIndex + 2).join('/')
  const remainingPath = pathname.substring(brandBasePath.length)

  // If no remaining path, it's the brand info page
  if (!remainingPath || remainingPath === '/') {
    return ''
  }

  // Check which section we're in based on the first part after brand base
  const firstSection = remainingPath.split('/')[1]

  // Find matching link
  const matchingLink = links.find((link) => {
    if (link.href === '') return false // Brand Info already handled above
    return link.href === `/${firstSection}`
  })

  return matchingLink?.href || ''
}
