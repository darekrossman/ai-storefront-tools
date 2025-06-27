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
        bg: 'accent',
        color: 'white',
        _hover: {
          bg: 'accent.hover',
        },
      },
      secondary: {
        bg: 'transparent',
        border: '1px solid',
        borderColor: 'gray.300',
        color: 'gray.700',
        _hover: {
          bg: 'gray.100',
          borderColor: 'gray.400',
        },
      },
      danger: {
        bg: 'red.500',
        color: 'white',
        _hover: {
          bg: 'red.600',
        },
      },
      icon: {
        bg: 'transparent',
        color: 'fg',
      },
    },
    size: {
      lg: { h: '11', px: '4', fontSize: 'sm' },
      md: { h: '9', px: '4', fontSize: 'sm' },
      sm: { h: '7', px: '3', fontSize: 'xs' },
      xs: { h: '6', px: '2', fontSize: 'xs' },
    },
  },

  compoundVariants: [
    {
      variant: 'icon',
      size: ['xs', 'sm', 'md', 'lg'],
      css: {
        px: 0,
        width: '24px',
        height: '24px',
      },
    },
  ],

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type ButtonVariants = RecipeVariantProps<typeof button>

export const Button = styled('button', button)
