import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Box } from '@/styled-system/jsx'

interface BrandLayoutProps {
  children: React.ReactNode
  params: Promise<{
    id: string
  }>
}

export default async function BrandLayout({ children, params }: BrandLayoutProps) {
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
    .select('id, name, user_id')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single()

  if (brandError || !brand) {
    notFound()
  }

  return (
    <>
      <Box minH="calc(100vh - 140px)">{children}</Box>
    </>
  )
}
