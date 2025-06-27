'use client'

import { useState } from 'react'
import { Box, Center, Flex, HStack, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Blocks,
  House,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoIcon } from '@/components/logo-icon'
import { css } from '@/styled-system/css'
import { hstack } from '@/styled-system/patterns'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: <House size={20} /> },
  { name: 'Brands', href: '/brands', icon: <Blocks size={20} /> },
  { name: 'Jobs', href: '/dashboard/jobs', icon: <Wrench size={20} /> },
  { name: 'Profile', href: '/profile', icon: <User size={20} /> },
  { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
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
    <Box width={isCollapsed ? 'headerHeight' : 'sidebarWidth'} h="full" overflow="hidden">
      <Stack h="full" position="relative">
        <Flex
          px="3.5"
          alignItems="center"
          justifyContent="flex-start"
          height="headerHeight"
          borderBottom="base"
        >
          {/* Logo/Brand */}
          <Link href="/dashboard" className={hstack({})}>
            <LogoIcon w="32px" h="32px" />
            <Box
              visibility={isCollapsed ? 'hidden' : 'visible'}
              fontSize="16px"
              fontWeight="900"
              letterSpacing="1px"
              color="fg/90"
            >
              STORECRAFT
            </Box>
          </Link>
        </Flex>

        {/* Navigation Menu */}
        <styled.nav pl="3.5" pr="4" flex="1" pt="2">
          <Stack gap={2.5}>
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={css({ display: 'block', lineHeight: '1' })}
                >
                  <HStack
                    gap={isCollapsed ? '0' : '1'}
                    borderRadius="sm"
                    fontSize="sm"
                    fontWeight="medium"
                    cursor="pointer"
                    transition="all 0.2s"
                    color={active ? 'fg' : 'fg/50'}
                    _hover={{
                      color: active ? 'fg' : 'fg.hover',
                    }}
                    role="menuitem"
                    aria-current={active ? 'page' : undefined}
                  >
                    <Center
                      w="8"
                      h="8"
                      bg={
                        active ? (isCollapsed ? 'accent' : 'transprent') : 'transparent'
                      }
                      color={active ? (isCollapsed ? 'fg.light' : 'accent') : 'fg/50'}
                      _hover={{
                        bg: active ? (isCollapsed ? 'accent' : 'transprent') : 'fg/10',
                        color: active ? (isCollapsed ? 'fg.light' : 'accent') : 'fg/50',
                      }}
                      borderRadius="sm"
                      flexShrink="0"
                    >
                      {item.icon}
                    </Center>
                    <Box visibility={isCollapsed ? 'hidden' : 'visible'}>{item.name}</Box>
                  </HStack>
                </Link>
              )
            })}
          </Stack>
        </styled.nav>

        <Button
          position="absolute"
          variant="icon"
          bottom="4"
          left="3.5"
          w="8"
          h="8"
          // transform="translate(-0.5px, -0.5px)"
          color="fg/50"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? <PanelLeftClose size={22} /> : <PanelLeftOpen size={22} />}
        </Button>
      </Stack>
    </Box>
  )
}
