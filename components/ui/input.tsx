import { styled } from '@/styled-system/jsx'

export const Input = styled(
  'input',
  {
    base: {
      px: '3',
      py: '2',
      border: '1px solid',
      borderColor: 'gray.300',
      borderRadius: 'md',
      fontSize: 'sm',
      _focus: {
        outline: 'none',
        borderColor: 'blue.500',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },
      _hover: {
        borderColor: 'gray.400',
      },
    },
  },
  { shouldForwardProp: (prop) => true },
)
