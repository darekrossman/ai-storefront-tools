'use client'

import { MemoizedMarkdown } from '@/components/memoized-mardown'
import { BrandSchema } from '@/lib/schemas'
import { Box, Stack, styled } from '@/styled-system/jsx'
import { useChat } from '@ai-sdk/react'
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
    maxSteps: 2,
  })

  console.log(messages)

  return (
    <styled.div>
      <styled.input
        border="1px solid"
        value={input}
        onChange={(event) => {
          setInput(event.target.value)
        }}
        onKeyDown={async (event) => {
          if (event.key === 'Enter') {
            append({ content: input, role: 'user' })
          }
        }}
      />

      {messages.map((m, index) => (
        <Box key={index} border="1px solid" padding="1rem" borderRadius="md" marginBottom="1rem">
          <Box fontWeight="bold" fontSize="sm" color="gray.500">
            {m.role}
          </Box>

          {m.parts?.map((p, i) => {
            if (
              p.type === 'tool-invocation' &&
              p.toolInvocation?.toolName === 'presentBrandOptions' &&
              p.toolInvocation.state === 'call'
            ) {
              const { toolCallId, args } = p.toolInvocation
              return (
                <Stack key={i}>
                  {args.brandOptions.map((brand: BrandOption, i: number) => (
                    <styled.button
                      key={i}
                      cursor="pointer"
                      textAlign="left"
                      _hover={{ backgroundColor: 'gray.100' }}
                      onClick={() => addToolResult({ toolCallId, result: brand.name })}
                    >
                      <Box fontWeight="bold">{brand.name}</Box>
                      <Box>{brand.description}</Box>
                    </styled.button>
                  ))}
                </Stack>
              )
            }

            if (p.type === 'text') {
              return <MemoizedMarkdown content={p.text} id={m.id} key={i} />
            }
          })}
        </Box>
      ))}
    </styled.div>
  )
}
