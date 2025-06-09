import { notFound } from 'next/navigation'
import { Box } from '@/styled-system/jsx'
import { getProjectAction } from '@/actions/projects'
import CreateBrandForm from '@/components/brands/create-brand-form'

interface CreateBrandPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CreateBrandPage({ params }: CreateBrandPageProps) {
  const { id } = await params
  const projectId = parseInt(id)

  if (isNaN(projectId)) {
    notFound()
  }

  // Verify project exists and user has access
  const project = await getProjectAction(projectId)

  if (!project) {
    notFound()
  }

  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      <CreateBrandForm projectId={projectId} />
    </Box>
  )
}

export async function generateMetadata({ params }: CreateBrandPageProps) {
  const { id } = await params
  const projectId = parseInt(id)

  if (isNaN(projectId)) {
    return {
      title: 'Create Brand - Storefront Tools',
    }
  }

  const project = await getProjectAction(projectId)

  return {
    title: project
      ? `Create Brand - ${project.name} - Storefront Tools`
      : 'Create Brand - Storefront Tools',
    description: project
      ? `Create a new brand for ${project.name}`
      : 'Create a new brand for your project',
  }
}
