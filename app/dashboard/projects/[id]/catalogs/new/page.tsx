import { notFound } from 'next/navigation'
import { Container } from '@/styled-system/jsx'
import { getProjectAction } from '@/actions/projects'
import CreateBrandForm from '@/components/brands/create-brand-form'
import type { Metadata } from 'next'
import BrandChat from '@/components/brands/brand-chat'
import CatalogGeneration from '@/components/catalogs/catalog-generation'

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
    <Container py={8}>
      <CatalogGeneration project={project} />
    </Container>
  )
}

export async function generateMetadata({
  params,
}: CreateBrandPageProps): Promise<Metadata> {
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
