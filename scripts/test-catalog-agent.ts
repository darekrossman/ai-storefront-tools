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
    body: JSON.stringify({ messages, brandId: 2 }),
  })

  return await res.json()
}

const main = async () => {
  const result = await sendPrompt()

  const { catalog, categories } = convertToDBFormat(result.object, 2)

  const supabase = await createClient()

  await supabase.auth.signInWithPassword({
    email: 'darek@subpopular.dev',
    password: 'test123',
  })

  console.dir(result, { depth: null })
}

main()
