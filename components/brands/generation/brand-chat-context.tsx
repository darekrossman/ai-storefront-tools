'use client'

import { brandStructuredOutputSchemas } from '@/lib/brand/schemas'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { convertToDBFormat } from '@/lib/brand/helpers'
import { createBrandAction } from '@/actions/brands'
import { useRouter } from 'next/navigation'
import { useUser } from '../../user-context'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { z } from 'zod'

const api = '/api/agents/brand'

type SelectionState = {
  phase1Selection?: number
  phase2Selection?: number
  phase3Selection?: number
  phase4Selection?: number
}

type Message = {
  role: 'user' | 'assistant'
  content: string
}

interface BrandChatContextType {
  // State
  messages: Message[]
  selections: SelectionState
  isSaving: boolean
  object: any // Using any to match useObject return type
  isLoading: boolean
  userId: string

  // Functions
  handleSelection: (phase: keyof SelectionState, index: number) => void
  handlePhaseSubmit: (phase: keyof SelectionState) => void
  handleSave: () => Promise<void>
  handleDiscard: () => void
  submit: (options: { messages: Message[] }) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

const BrandChatContext = createContext<BrandChatContextType | undefined>(undefined)

export function BrandChatProvider({ children }: { children: ReactNode }) {
  const { id: userId } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [selections, setSelections] = useState<SelectionState>({})
  const [isSaving, setIsSaving] = useState(false)
  const { object, submit, isLoading } = useObject({
    api,
    schema: brandStructuredOutputSchemas,
  })
  const router = useRouter()

  const handleSelection = (phase: keyof SelectionState, index: number) => {
    setSelections((prev) => ({ ...prev, [phase]: index }))
  }

  const handlePhaseSubmit = (phase: keyof SelectionState) => {
    const selectedIndex = selections[phase]
    if (selectedIndex === undefined) return

    let selectedOption: any
    let nextMessage = ''

    switch (phase) {
      case 'phase1Selection':
        selectedOption = object?.phase1?.brandOptions?.[selectedIndex]
        nextMessage = JSON.stringify({ phase: 1, selectedOption })
        break
      case 'phase2Selection':
        selectedOption = object?.phase2?.positioningOptions?.[selectedIndex]
        nextMessage = JSON.stringify({ phase: 2, selectedOption })
        break
      case 'phase3Selection':
        selectedOption = object?.phase3?.personalityOptions?.[selectedIndex]
        nextMessage = JSON.stringify({ phase: 3, selectedOption })
        break
      case 'phase4Selection':
        selectedOption = object?.phase4?.visualOptions?.[selectedIndex]
        nextMessage = JSON.stringify({ phase: 4, selectedOption })
        break
    }

    const newMessages = [...messages, { role: 'user' as const, content: nextMessage }]
    setMessages(newMessages)
    submit({ messages: newMessages })
  }

  const handleSave = async () => {
    const data = object?.phase5 as z.infer<typeof brandStructuredOutputSchemas>['phase5']

    setIsSaving(true)
    try {
      const brandData = convertToDBFormat(data, userId)
      const newBrand = await createBrandAction(brandData)
      router.push(`/brands/${newBrand.slug}`)
    } catch (error) {
      console.error('Error saving brand:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    setMessages([])
    setSelections({})
  }

  const value: BrandChatContextType = {
    messages,
    selections,
    isSaving,
    object,
    isLoading,
    userId,
    handleSelection,
    handlePhaseSubmit,
    handleSave,
    handleDiscard,
    submit,
    setMessages,
  }

  return <BrandChatContext.Provider value={value}>{children}</BrandChatContext.Provider>
}

export function useBrandChat() {
  const context = useContext(BrandChatContext)
  if (context === undefined) {
    throw new Error('useBrandChat must be used within a BrandChatProvider')
  }
  return context
}
