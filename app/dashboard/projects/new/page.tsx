import { Box } from '@/styled-system/jsx'
import CreateProjectForm from '@/components/projects/create-project-form'

export default function NewProjectPage() {
  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      <CreateProjectForm />
    </Box>
  )
}
