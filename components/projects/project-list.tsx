import { Box } from '@/styled-system/jsx'
import type { Project } from '@/lib/supabase/database-types'
import ProjectCard from './project-card'

interface ProjectListProps {
  projects: Project[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return null // Empty state is handled by parent component
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: '1fr',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
      }}
      gap={6}
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </Box>
  )
}
