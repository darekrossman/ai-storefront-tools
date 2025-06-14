import { notFound, redirect } from 'next/navigation'
import { Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import EditBrandForm from '@/components/brands/edit-brand-form'
import { getBrandBySlugAction } from '@/actions/brands'

interface EditBrandPageProps {
  params: Promise<{
    brandSlug: string
  }>
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { brandSlug } = await params
  const brand = await getBrandBySlugAction(brandSlug)

  if (!brand) {
    notFound()
  }

  return (
    <Container py={8}>
      <Stack gap={6}>
        {/* Breadcrumb */}
        <Flex align="center" gap={2}>
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
          <Link href="/brands">
            <styled.span
              fontSize="sm"
              color="gray.600"
              _hover={{ color: 'gray.900' }}
              cursor="pointer"
            >
              Brands
            </styled.span>
          </Link>
          <styled.span fontSize="sm" color="gray.400">
            /
          </styled.span>
          <Link href={`/brands/${brand.slug}`}>
            <styled.span
              fontSize="sm"
              color="gray.600"
              _hover={{ color: 'gray.900' }}
              cursor="pointer"
            >
              {brand.name}
            </styled.span>
          </Link>
          <styled.span fontSize="sm" color="gray.400">
            /
          </styled.span>
          <styled.span fontSize="sm" color="gray.900" fontWeight="medium">
            Edit
          </styled.span>
        </Flex>

        {/* Edit Form */}
        <EditBrandForm brand={brand} />
      </Stack>
    </Container>
  )
}
