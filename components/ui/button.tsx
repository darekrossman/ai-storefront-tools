import { styled } from '@/styled-system/jsx'

export const Button = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    py: '2',
    px: '4',
    rounded: 'md',
  },
  variants: {
    variant: {
      primary: {
        bg: 'blue.500',
        color: 'white',
      },
      secondary: {
        bg: 'gray.500',
        color: 'white',
      },
      danger: {
        bg: 'red.500',
        color: 'white',
      },
    },
  },
})
