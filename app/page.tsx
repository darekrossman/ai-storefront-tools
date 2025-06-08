'use client'

import { MemoizedMarkdown } from '@/components/memoized-mardown'
import { BrandSchema } from '@/lib/schemas'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { useChat } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'

const BrandOptionSchema = z.object({
  name: z.string().describe('The brand name'),
  description: z.string().describe('A brief description of the brand concept'),
  tagline: z.string().optional().describe('A catchy tagline for the brand'),
  targetAudience: z.string().describe('Primary target audience'),
})

type BrandOption = z.infer<typeof BrandOptionSchema>

export default function Page() {
  const { messages, input, setInput, append, addToolResult } = useChat({
    api: '/api/agents/brand',
    maxSteps: 10,

    async onToolCall({ toolCall }) {
      console.log(toolCall)
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false)

  // Auto-scroll to bottom when new messages arrive, unless user scrolled up
  useEffect(() => {
    if (!isUserScrolledUp && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isUserScrolledUp])

  // Check if user is scrolled up from bottom
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50 // 50px threshold
      setIsUserScrolledUp(!isNearBottom)
    }
  }

  return (
    <Flex direction="column" height="100vh" width="100%">
      {/* Messages container - scrollable */}
      <Flex
        ref={scrollContainerRef}
        direction="column"
        flex="1"
        overflow="auto"
        padding="1rem"
        maxHeight="calc(100vh - 80px)"
        onScroll={handleScroll}
      >
        {messages.map((m, index) => (
          <Box
            key={index}
            border="1px solid"
            padding="1rem"
            borderRadius="md"
            marginBottom="1rem"
          >
            <Box fontWeight="bold" fontSize="sm" color="gray.500">
              {m.role}
            </Box>

            {m.parts?.map((p, i) => {
              const toolInvocation =
                p.type === 'tool-invocation' ? p.toolInvocation : null

              if (!toolInvocation) {
                if (p.type === 'text') {
                  return <MemoizedMarkdown content={p.text} id={m.id} key={i} />
                }

                return null
              }

              const isToolCall = toolInvocation.state === 'call'
              const isToolResult = toolInvocation.state === 'result'
              const toolName = toolInvocation.toolName
              const toolCallId = toolInvocation.toolCallId
              const args = toolInvocation.args

              console.log(m.id, p)

              if (isToolCall && toolName === 'createBrandFoundation') {
                return (
                  <Stack key={i}>
                    {args?.brandOptions.map((brand: BrandOption, i: number) => (
                      <styled.button
                        key={i}
                        cursor="pointer"
                        textAlign="left"
                        _hover={{ backgroundColor: 'gray.100' }}
                        onClick={() => addToolResult({ toolCallId, result: brand.name })}
                      >
                        <Box fontWeight="bold">{brand.name}</Box>
                        <Box>{brand.description}</Box>
                        <Box>{brand.tagline}</Box>
                        <Box>{brand.targetAudience}</Box>
                      </styled.button>
                    ))}
                  </Stack>
                )
              }
            })}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Flex>

      {/* Input container - fixed at bottom */}
      <Box borderTop="1px solid" padding="1rem" backgroundColor="white" minHeight="80px">
        <styled.input
          width="100%"
          border="1px solid"
          borderRadius="md"
          padding="0.75rem"
          fontSize="md"
          value={input}
          placeholder="Type your message..."
          onChange={(event) => {
            setInput(event.target.value)
          }}
          onKeyDown={async (event) => {
            if (event.key === 'Enter') {
              append({ content: input, role: 'user' })
              setInput('')
            }
          }}
        />
      </Box>
    </Flex>
  )
}
