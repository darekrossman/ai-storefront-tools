import { notFound } from 'next/navigation'
import { getProjectAction } from '@/actions/projects'
import ProjectNav from '@/components/navigation/project-nav'
import { Box } from '@/styled-system/jsx'

interface ProjectLayoutProps {
  children: React.ReactNode
  params: Promise<{
    id: string
  }>
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { id } = await params
  const projectId = parseInt(id)

  if (isNaN(projectId)) {
    notFound()
  }

  const project = await getProjectAction(projectId)

  if (!project) {
    notFound()
  }

  return (
    <>
      <ProjectNav projectId={project.id} projectName={project.name} />
      <Box minH="calc(100vh - 140px)">{children}</Box>
    </>
  )
}
