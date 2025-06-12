import { notFound, redirect } from 'next/navigation'
import { Container, Flex, Stack, styled } from '@/styled-system/jsx'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import EditBrandForm from '@/components/brands/edit-brand-form'

interface EditBrandPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = await params
  const brandId = parseInt(id)

  if (isNaN(brandId)) {
    notFound()
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Get brand data and verify ownership
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('*')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single()

  if (brandError || !brand) {
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
          <Link href="/dashboard/brands">
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
          <Link href={`/dashboard/brands/${brand.id}`}>
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
