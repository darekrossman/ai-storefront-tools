import { notFound } from 'next/navigation'
import { Box } from '@/styled-system/jsx'
import { getBrandAction } from '@/actions/brands'
import EditBrandForm from '@/components/brands/edit-brand-form'

interface EditBrandPageProps {
  params: Promise<{
    id: string
    brandId: string
  }>
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { id, brandId } = await params
  const projectId = parseInt(id)
  const brandIdNum = parseInt(brandId)

  if (isNaN(projectId) || isNaN(brandIdNum)) {
    notFound()
  }

  // Get brand details
  const brand = await getBrandAction(brandIdNum)

  if (!brand) {
    notFound()
  }

  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      <EditBrandForm brand={brand} projectId={projectId} />
    </Box>
  )
}

export async function generateMetadata({ params }: EditBrandPageProps) {
  const { brandId } = await params
  const brandIdNum = parseInt(brandId)

  if (isNaN(brandIdNum)) {
    return {
      title: 'Edit Brand - Storefront Tools',
    }
  }

  const brand = await getBrandAction(brandIdNum)

  return {
    title: brand
      ? `Edit ${brand.name} - Storefront Tools`
      : 'Edit Brand - Storefront Tools',
    description: brand
      ? `Edit ${brand.name} brand details and guidelines`
      : 'Edit brand details and guidelines',
  }
}
