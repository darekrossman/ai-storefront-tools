'use client'

import { useState, ReactNode } from 'react'
import { Box, Flex, styled } from '@/styled-system/jsx'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  items: TabItem[]
  defaultTab?: string
}

export default function Tabs({ items, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id)

  const activeTabContent = items.find((item) => item.id === activeTab)?.content

  return (
    <Box>
      {/* Tab Headers */}
      <Box borderBottom="1px solid" borderColor="gray.200" mb={6}>
        <Flex gap={1}>
          {items.map((item) => {
            const isActive = activeTab === item.id

            return (
              <styled.button
                key={item.id}
                px={4}
                py={3}
                fontSize="sm"
                fontWeight="medium"
                color={isActive ? 'blue.600' : 'gray.600'}
                bg={isActive ? 'blue.50' : 'transparent'}
                borderBottom="2px solid"
                borderBottomColor={isActive ? 'blue.600' : 'transparent'}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  bg: isActive ? 'blue.50' : 'gray.50',
                  color: isActive ? 'blue.600' : 'gray.900',
                }}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </styled.button>
            )
          })}
        </Flex>
      </Box>

      {/* Tab Content */}
      <Box>{activeTabContent}</Box>
    </Box>
  )
}
