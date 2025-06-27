import { Box, BoxProps } from '@/styled-system/jsx'
import { PropsWithChildren } from 'react'

export function ContentContainer({ children, ...props }: PropsWithChildren<BoxProps>) {
  return (
    <Box {...props}>
      <Box px={8} pb={8}>
        {children}
      </Box>
    </Box>
  )
}
