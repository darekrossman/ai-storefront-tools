import { Box, BoxProps } from '@/styled-system/jsx'
import { ReactNode } from 'react'

interface BaseCardProps extends BoxProps {
  children: ReactNode
}

interface SelectableCardProps extends BoxProps {
  children: ReactNode
  isSelected?: boolean
  onClick?: () => void
  disabled?: boolean
}

// Base Card - non-interactive, just styling
export function Card({ children, ...props }: BaseCardProps) {
  return (
    <Box
      p={4}
      bg="white"
      border="1px solid"
      borderColor="transparent"
      shadow="xs"
      {...props}
    >
      {children}
    </Box>
  )
}

// Selectable Card - interactive with selection states
export function SelectableCard({
  children,
  isSelected = false,
  onClick,
  disabled = false,
  ...props
}: SelectableCardProps) {
  return (
    <Box
      p={4}
      bg="white"
      border="1px solid"
      borderColor={isSelected ? 'accent' : 'transparent'}
      shadow="xs"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      transition="all 0.2s"
      opacity={disabled ? 0.6 : 1}
      _hover={{
        borderColor: disabled ? 'transparent' : isSelected ? 'accent' : 'accent/50',
      }}
      role="button"
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </Box>
  )
}
