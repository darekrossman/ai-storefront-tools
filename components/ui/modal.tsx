import { ReactNode } from 'react'
import { Box, Flex, styled } from '@/styled-system/jsx'
import { Button } from './button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
}: ModalProps) {
  if (!isOpen) return null

  const getMaxWidth = () => {
    switch (size) {
      case 'sm':
        return '32rem'
      case 'md':
        return '48rem'
      case 'lg':
        return '64rem'
      case 'xl':
        return '80rem'
      default:
        return '64rem'
    }
  }

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.5)"
      zIndex={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="white"
        borderRadius="lg"
        shadow="xl"
        maxWidth={getMaxWidth()}
        maxHeight="90vh"
        width="full"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          p={6}
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
            {title}
          </styled.h2>
          <Button onClick={onClose} variant="secondary" size="sm">
            ×
          </Button>
        </Flex>

        {/* Content */}
        <Box flex={1} overflow="auto" p={6}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
