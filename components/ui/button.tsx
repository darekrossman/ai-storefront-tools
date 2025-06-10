import { RecipeVariantProps, cva } from '@/styled-system/css'
import { styled } from '@/styled-system/jsx'
import React from 'react'

export const button = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    rounded: 'sm',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'medium',
    lineHeight: '1',
    transition: 'all 0.2s',
  },
  variants: {
    variant: {
      primary: {
        bg: 'blue.500',
        color: 'white',
        _hover: {
          bg: 'blue.600',
        },
      },
      secondary: {
        bg: 'gray.500',
        color: 'white',
        _hover: {
          bg: 'gray.600',
        },
      },
      danger: {
        bg: 'red.500',
        color: 'white',
        _hover: {
          bg: 'red.600',
        },
      },
    },
    size: {
      lg: { h: '11', px: '4', fontSize: 'sm' },
      md: { h: '9', px: '4', fontSize: 'sm' },
      sm: { h: '7', px: '3', fontSize: 'xs' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type ButtonVariants = RecipeVariantProps<typeof button>

export const Button = styled('button', button)
