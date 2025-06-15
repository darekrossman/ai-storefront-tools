'use client'

import { useState } from 'react'
import { Box, Flex, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Brands', href: '/brands', icon: '🏷️' },
  { name: 'Jobs', href: '/dashboard/jobs', icon: '⚡' },
  { name: 'Profile', href: '/profile', icon: '👤' },
]

export default function DashboardNav() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <styled.div
          position="fixed"
          inset="0"
          bg="black"
          opacity="0.5"
          zIndex="40"
          display={{ base: 'block', lg: 'none' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <styled.div
        position={{ base: 'fixed', lg: 'relative' }}
        inset={{ base: isMobileMenuOpen ? '0 0 0 0' : '0 0 0 -280px', lg: '0' }}
        width={{ base: '280px', lg: isCollapsed ? '80px' : '280px' }}
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        zIndex="50"
        transition="all 0.3s ease"
        display="flex"
        flexDirection="column"
        height="100vh"
      >
        {/* Header */}
        <styled.div
          p="4"
          borderBottom="1px solid"
          borderColor="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          height="64px"
        >
          {/* Logo/Brand */}
          <Link href="/dashboard">
            <styled.div
              display="flex"
              alignItems="center"
              gap="3"
              _hover={{ opacity: 0.8 }}
              transition="opacity 0.2s"
            >
              <styled.div
                fontSize="xl"
                width="8"
                height="8"
                bg="blue.600"
                color="white"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
              >
                S
              </styled.div>
              {(!isCollapsed || isMobileMenuOpen) && (
                <styled.h1
                  fontSize="lg"
                  fontWeight="bold"
                  color="gray.900"
                  whiteSpace="nowrap"
                >
                  Storefront Tools
                </styled.h1>
              )}
            </styled.div>
          </Link>

          {/* Collapse/Mobile Toggle */}
          <styled.button
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setIsCollapsed(!isCollapsed)
              } else {
                setIsMobileMenuOpen(false)
              }
            }}
            p="2"
            borderRadius="md"
            _hover={{ bg: 'gray.100' }}
            color="gray.500"
            fontSize="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? '→' : '←'}
          </styled.button>
        </styled.div>

        {/* Navigation Menu */}
        <styled.nav flex="1" p="4" display="flex" flexDirection="column" gap="2">
          {navigation.map((item) => {
            const active = isActive(item.href)
            return (
              <Link key={item.name} href={item.href}>
                <styled.div
                  display="flex"
                  alignItems="center"
                  gap="3"
                  px="3"
                  py="2"
                  borderRadius="lg"
                  fontSize="sm"
                  fontWeight="medium"
                  cursor="pointer"
                  transition="all 0.2s"
                  bg={active ? 'blue.50' : 'transparent'}
                  color={active ? 'blue.700' : 'gray.700'}
                  _hover={{
                    bg: active ? 'blue.50' : 'gray.50',
                    color: active ? 'blue.700' : 'gray.900',
                  }}
                  role="menuitem"
                  aria-current={active ? 'page' : undefined}
                >
                  <styled.span
                    fontSize="lg"
                    width="5"
                    height="5"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {item.icon}
                  </styled.span>
                  {(!isCollapsed || isMobileMenuOpen) && (
                    <styled.span whiteSpace="nowrap">{item.name}</styled.span>
                  )}
                </styled.div>
              </Link>
            )
          })}
        </styled.nav>

        {/* User Profile Section */}
        <styled.div p="4" borderTop="1px solid" borderColor="gray.200">
          <styled.div
            display="flex"
            alignItems="center"
            gap="3"
            p="3"
            borderRadius="lg"
            _hover={{ bg: 'gray.50' }}
            transition="all 0.2s"
          >
            <styled.div
              width="8"
              height="8"
              bg="gray.200"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="lg"
              flexShrink="0"
            >
              👤
            </styled.div>
            {(!isCollapsed || isMobileMenuOpen) && (
              <styled.div flex="1" minWidth="0">
                <styled.div fontSize="sm" fontWeight="medium" color="gray.900" truncate>
                  User Profile
                </styled.div>
                <form action="/auth/signout" method="post" style={{ display: 'inline' }}>
                  <styled.button
                    type="submit"
                    fontSize="xs"
                    color="gray.500"
                    _hover={{ color: 'gray.700' }}
                    transition="color 0.2s"
                    textAlign="left"
                    bg="transparent"
                    border="none"
                    cursor="pointer"
                  >
                    Sign out
                  </styled.button>
                </form>
              </styled.div>
            )}
          </styled.div>
        </styled.div>
      </styled.div>

      {/* Mobile Menu Button */}
      <styled.button
        display={{ base: 'flex', lg: 'none' }}
        position="fixed"
        top="4"
        left="4"
        width="10"
        height="10"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        alignItems="center"
        justifyContent="center"
        fontSize="lg"
        zIndex="60"
        _hover={{ bg: 'gray.50' }}
        transition="all 0.2s"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open navigation menu"
      >
        ☰
      </styled.button>
    </>
  )
}
