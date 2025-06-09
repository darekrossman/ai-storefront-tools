'use client'

import { usePathname } from 'next/navigation'
import { Box, Flex, styled } from '@/styled-system/jsx'
import Link from 'next/link'

interface ProjectNavProps {
  projectId: number
  projectName: string
}

const navigationItems = [
  {
    label: 'Overview',
    href: '',
    description: 'Project details and statistics',
  },
  {
    label: 'Brands',
    href: '/brands',
    description: 'Manage project brands',
  },
  {
    label: 'Catalogs',
    href: '/catalogs',
    description: 'Product catalog management',
  },
  {
    label: 'Products',
    href: '/products',
    description: 'Product management across catalogs',
  },
]

export default function ProjectNav({ projectId, projectName }: ProjectNavProps) {
  const pathname = usePathname()
  const basePath = `/dashboard/projects/${projectId}`

  const isActive = (href: string) => {
    if (href === '') {
      // For overview, only match exact path
      return pathname === basePath
    }
    return pathname.startsWith(`${basePath}${href}`)
  }

  return (
    <Box borderBottom="1px solid" borderColor="gray.200" bg="white">
      <Box maxW="1200px" mx="auto" px={4}>
        {/* Project Header */}
        <Box py={4} borderBottom="1px solid" borderColor="gray.100">
          <Flex align="center" gap={2} mb={2}>
            <Link href="/dashboard">
              <styled.span
                fontSize="sm"
                color="gray.600"
                _hover={{ color: 'gray.900' }}
                cursor="pointer"
              >
                Dashboard
              </styled.span>
            </Link>
            <styled.span fontSize="sm" color="gray.400">
              /
            </styled.span>
            <styled.span fontSize="sm" color="gray.900" fontWeight="medium">
              {projectName}
            </styled.span>
          </Flex>
        </Box>

        {/* Navigation Tabs */}
        <Box py={3}>
          <Flex gap={{ base: 1, md: 4 }} overflowX="auto" pb={2}>
            {navigationItems.map((item) => {
              const fullHref = `${basePath}${item.href}`
              const active = isActive(item.href)

              return (
                <Link key={item.label} href={fullHref}>
                  <styled.div
                    px={{ base: 3, md: 4 }}
                    py={2}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="medium"
                    whiteSpace="nowrap"
                    cursor="pointer"
                    transition="all 0.2s"
                    bg={active ? 'blue.50' : 'transparent'}
                    color={active ? 'blue.700' : 'gray.600'}
                    borderBottom={active ? '2px solid' : '2px solid transparent'}
                    borderBottomColor={active ? 'blue.600' : 'transparent'}
                    _hover={{
                      bg: active ? 'blue.50' : 'gray.50',
                      color: active ? 'blue.700' : 'gray.900',
                    }}
                  >
                    {item.label}
                  </styled.div>
                </Link>
              )
            })}
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}
