import { RecipeVariantProps, cva } from '@/styled-system/css'
import { styled } from '@/styled-system/jsx'
import React from 'react'

/**
 * Badge component for displaying status indicators and labels
 *
 * @example
 * <Badge variant="active">Active</Badge>
 * <Badge variant="draft" size="sm">Draft</Badge>
 * <Badge variant="error">Error</Badge>
 */
export const badge = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    h: '5',
    px: 2,
    borderRadius: 'sm',
    lineHeight: '1',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  variants: {
    variant: {
      success: {
        bg: 'green.600',
        color: 'white',
      },
      warning: {
        bg: 'yellow.600',
        color: 'white',
      },
      error: {
        bg: 'red.600',
        color: 'white',
      },
      info: {
        bg: 'blue.600',
        color: 'white',
      },
      neutral: {
        bg: 'gray.600',
        color: 'white',
      },
      active: {
        bg: 'green.600',
        color: 'white',
      },
      draft: {
        bg: 'yellow.600',
        color: 'white',
      },
      archived: {
        bg: 'gray.600',
        color: 'white',
      },
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

export type BadgeVariants = RecipeVariantProps<typeof badge>

export const Badge = styled('div', badge)
