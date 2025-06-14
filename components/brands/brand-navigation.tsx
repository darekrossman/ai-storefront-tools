'use client'

import { Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { useBrand } from '@/components/brand-context'
import { usePathname } from 'next/navigation'

const StyledLink = styled(Link, {
  base: {
    display: 'block',
    py: 2,
    px: 4,
    fontSize: 'sm',
    borderRadius: 'md',
    color: 'gray.500',
    _hover: {
      color: 'gray.700',
    },
  },
  variants: {
    isActive: {
      true: {
        color: 'gray.900',
        fontWeight: 'bold',
      },
    },
  },
})

export function BrandNavigation() {
  const pathname = usePathname()
  const brand = useBrand()

  const pathPrefix = `/brands/${brand.slug}`

  const links = [
    {
      href: `${pathPrefix}`,
      label: 'Brand Info',
    },
    {
      href: `${pathPrefix}/catalogs`,
      label: 'Catalogs',
    },
    {
      href: `${pathPrefix}/products`,
      label: 'Products',
    },
    {
      href: `${pathPrefix}/export`,
      label: 'Export',
    },
    {
      href: `${pathPrefix}/settings`,
      label: 'Settings',
    },
  ]

  return (
    <Stack gap="0" py="6">
      {links.map((link) => (
        <StyledLink key={link.href} href={link.href} isActive={pathname === link.href}>
          {link.label}
        </StyledLink>
      ))}
    </Stack>
  )
}
