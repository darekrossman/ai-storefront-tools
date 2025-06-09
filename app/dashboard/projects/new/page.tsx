import { Container } from '@/styled-system/jsx'
import CreateProjectForm from '@/components/projects/create-project-form'

export default function NewProjectPage() {
  return (
    <Container py={8}>
      <CreateProjectForm />
    </Container>
  )
}
