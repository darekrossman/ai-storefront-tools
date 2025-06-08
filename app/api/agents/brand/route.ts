import { AI_AGENTS } from '@/lib/constants'
import { openai } from '@ai-sdk/openai'
import { ToolInvocation, createDataStreamResponse, streamText } from 'ai'
import { z } from 'zod'

interface Message {
  role: 'user' | 'assistant'
  content: string
  toolInvocations?: ToolInvocation[]
}

const agentConfig = AI_AGENTS.brand

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json()

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const lastMessage = messages[messages.length - 1]

      console.log(lastMessage)

      const result = streamText({
        model: openai('gpt-4o-mini'),
        system: `${agentConfig.systemPrompt}`,
        messages,
        // toolChoice: 'required',
        // tools: {
        //   presentBrandOptions: {
        //     description: 'Present multiple brand name and description options to the user',
        //     parameters: z.object({
        //       brandOptions: z
        //         .array(
        //           z.object({
        //             name: z.string().describe('The brand name'),
        //             description: z.string().describe('A brief description of the brand concept'),
        //             tagline: z.string().optional().describe('A catchy tagline for the brand'),
        //             targetAudience: z.string().describe('Primary target audience'),
        //           }),
        //         )
        //         .min(3)
        //         .max(5)
        //         .describe('Array of 3-5 brand options'),
        //       context: z.string().describe('Brief context about what inspired these options'),
        //     }),
        //   },
        // },
      })

      result.mergeIntoDataStream(dataStream)
    },
  })
}
