import { Flex } from '@/styled-system/jsx'
import { PropsWithChildren } from 'react'

export const HeaderBar = ({ children }: PropsWithChildren) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      h="headerHeight"
      flexShrink={0}
      bg="bg"
      position="sticky"
      top={0}
      zIndex={1}
      borderBottom="base"
    >
      {children}
    </Flex>
  )
}
