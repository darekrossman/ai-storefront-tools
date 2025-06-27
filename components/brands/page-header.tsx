import { Flex, HStack, Stack, styled } from '@/styled-system/jsx'
import { PropsWithChildren, ReactElement, Children, isValidElement } from 'react'

export function PageHeader({ children }: PropsWithChildren) {
  const childrenArray = Children.toArray(children)

  const titleElement = childrenArray.find(
    (child): child is ReactElement =>
      isValidElement(child) && child.type === PageHeaderTitle,
  )

  const subtitleElement = childrenArray.find(
    (child): child is ReactElement =>
      isValidElement(child) && child.type === PageHeaderSubtitle,
  )

  const actionsElement = childrenArray.find(
    (child): child is ReactElement =>
      isValidElement(child) && child.type === PageHeaderActions,
  )

  return (
    <Flex justify="space-between" alignItems="flex-start" gap={4} p="8">
      <Stack gap={3} flex={1}>
        {titleElement}
        {subtitleElement}
      </Stack>
      {actionsElement}
    </Flex>
  )
}

export function PageHeaderTitle({ children }: PropsWithChildren) {
  return (
    <styled.h1
      fontSize="2xl"
      fontWeight="bold"
      color="fg"
      textBox="trim-both cap alphabetic"
    >
      {children}
    </styled.h1>
  )
}

export function PageHeaderSubtitle({ children }: PropsWithChildren) {
  return (
    <styled.p fontSize="sm" color="gray.600" maxW="95%" textWrap="pretty">
      {children}
    </styled.p>
  )
}

export function PageHeaderActions({ children }: PropsWithChildren) {
  return (
    <HStack gap={2} mt="-6px">
      {children}
    </HStack>
  )
}
