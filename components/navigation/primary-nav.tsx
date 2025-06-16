'use client'

import { useState } from 'react'
import { Box, Flex, HStack, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Blocks, House, Settings, User, Wrench } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: <House size={16} /> },
  { name: 'Brands', href: '/brands', icon: <Blocks size={16} /> },
  { name: 'Jobs', href: '/dashboard/jobs', icon: <Wrench size={16} /> },
  { name: 'Profile', href: '/profile', icon: <User size={16} /> },
]

export default function PrimaryNav() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <Box py="3" pl="3" width="full" h="full">
      <Stack h="full" bg="zinc.800" borderRadius="2xl" boxShadow="sm">
        <Flex
          px="4"
          alignItems="center"
          justifyContent="space-between"
          height="var(--header-height)"
        >
          {/* Logo/Brand */}
          <Link href="/dashboard">
            <styled.h1
              fontSize="lg"
              fontWeight="bold"
              color="zinc.100"
              whiteSpace="nowrap"
            >
              StoreCraft
            </styled.h1>
          </Link>
        </Flex>

        {/* Navigation Menu */}
        <styled.nav px="3" flex="1">
          <Stack gap={1}>
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link key={item.name} href={item.href}>
                  <HStack
                    gap="3"
                    px="3"
                    py="2"
                    borderRadius="sm"
                    fontSize="sm"
                    fontWeight="medium"
                    cursor="pointer"
                    transition="all 0.2s"
                    bg={active ? 'white/80' : 'transparent'}
                    color={active ? 'zinc.900' : 'white/80'}
                    _hover={{
                      bg: active ? 'white/80' : 'white/5',
                      color: active ? 'zinc.900' : 'white/80',
                    }}
                    boxShadow={active ? 'xs' : 'none'}
                    role="menuitem"
                    aria-current={active ? 'page' : undefined}
                  >
                    <Box opacity={active ? 1 : 0.5}>{item.icon}</Box>
                    {item.name}
                  </HStack>
                </Link>
              )
            })}
          </Stack>
        </styled.nav>

        <Stack px="3" py="5">
          <Link href="/settings">
            <HStack
              gap="3"
              px="3"
              borderRadius="sm"
              fontSize="sm"
              fontWeight="medium"
              cursor="pointer"
              transition="all 0.2s"
              color="white/90"
            >
              <Settings size={16} opacity={0.8} />
              Settings
            </HStack>
          </Link>
        </Stack>
      </Stack>
    </Box>
  )
}
