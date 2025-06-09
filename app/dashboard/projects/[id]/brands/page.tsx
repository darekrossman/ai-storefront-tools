import { notFound } from 'next/navigation'
import { Container } from '@/styled-system/jsx'
import { getProjectAction } from '@/actions/projects'
import BrandList from '@/components/brands/brand-list'

interface ProjectBrandsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectBrandsPage({ params }: ProjectBrandsPageProps) {
  const { id } = await params
  const projectId = parseInt(id)

  if (isNaN(projectId)) {
    notFound()
  }

  // Verify project exists and user has access (via project layout)
  const project = await getProjectAction(projectId)

  if (!project) {
    notFound()
  }

  return (
    <Container py={8}>
      <BrandList projectId={projectId} />
    </Container>
  )
}

export async function generateMetadata({ params }: ProjectBrandsPageProps) {
  const { id } = await params
  const projectId = parseInt(id)

  if (isNaN(projectId)) {
    return {
      title: 'Brands - Storefront Tools',
    }
  }

  const project = await getProjectAction(projectId)

  return {
    title: project
      ? `Brands - ${project.name} - Storefront Tools`
      : 'Brands - Storefront Tools',
    description: project
      ? `Manage brands for ${project.name}`
      : 'Manage your project brands',
  }
}
