import { convertToDBFormat } from '@/lib/catalog/helpers'
import { createClient } from '@/lib/supabase/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

let messages: Message[] = [
  {
    role: 'user',
    content:
      'I want to create a brand for a sustainable fashion startup targeting eco-conscious millennials.',
  },
]

const sendPrompt = async () => {
  const res = await fetch('http://localhost:3000/api/agents/catalog', {
    method: 'POST',
    body: JSON.stringify({ messages, brandId: 1 }),
  })

  return await res.json()
}

const main = async () => {
  await sendPrompt()
}

main()
