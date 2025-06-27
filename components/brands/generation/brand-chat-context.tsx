'use client'

import { brandStructuredOutputSchemas } from '@/lib/brand/schemas'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { convertToDBFormat } from '@/lib/brand/helpers'
import { createBrandAction } from '@/actions/brands'
import { useRouter } from 'next/navigation'
import { useUser } from '../../user-context'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { z } from 'zod'
import { DeepPartial } from 'ai'

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

type BrandObject = DeepPartial<z.infer<typeof brandStructuredOutputSchemas>> | undefined

export type Phase =
  | 'initial'
  | 'phase1'
  | 'phase2'
  | 'phase3'
  | 'phase4'
  | 'phase5'
  | 'complete'

interface BrandChatContextType {
  // State
  messages: Message[]
  selections: SelectionState
  isSaving: boolean
  object: BrandObject
  isLoading: boolean
  userId: string
  currentPhase: Phase
  completedPhases: Set<Phase>

  // Functions
  handleSelection: (phase: keyof SelectionState, index: number) => void
  handlePhaseSubmit: (phase: keyof SelectionState) => void
  handleSave: () => Promise<void>
  handleDiscard: () => void
  submit: (options: { messages: Message[] }) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  advanceToPhase: (phase: Phase) => void
  canAdvanceToPhase: (phase: Phase) => boolean
  markPhaseComplete: (phase: Phase) => void
}

const BrandChatContext = createContext<BrandChatContextType | undefined>(undefined)

export function BrandChatProvider({ children }: { children: ReactNode }) {
  const { id: userId } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [selections, setSelections] = useState<SelectionState>({})
  const [isSaving, setIsSaving] = useState(false)
  const [object, setObject] = useState<
    DeepPartial<z.infer<typeof brandStructuredOutputSchemas>> | undefined
  >(undefined)
  const [currentPhase, setCurrentPhase] = useState<Phase>('initial')
  const [completedPhases, setCompletedPhases] = useState<Set<Phase>>(new Set())
  const router = useRouter()

  const { submit, isLoading } = useObject({
    api,
    schema: brandStructuredOutputSchemas,
    onFinish: ({ object }) => {
      setObject((o) => ({ ...o, ...object }))

      // Auto-advance phases based on generated content
      if (object?.phase1 && currentPhase === 'initial') {
        setCurrentPhase('phase1')
      } else if (object?.phase2 && currentPhase === 'phase1') {
        setCurrentPhase('phase2')
      } else if (object?.phase3 && currentPhase === 'phase2') {
        setCurrentPhase('phase3')
      } else if (object?.phase4 && currentPhase === 'phase3') {
        setCurrentPhase('phase4')
      } else if (object?.phase5 && currentPhase === 'phase4') {
        setCurrentPhase('phase5')
      }
    },
  })

  // Phase management functions
  const advanceToPhase = (phase: Phase) => {
    if (canAdvanceToPhase(phase)) {
      setCurrentPhase(phase)
    }
  }

  const canAdvanceToPhase = (phase: Phase): boolean => {
    switch (phase) {
      case 'initial':
        return true
      case 'phase1':
        return !!object?.phase1
      case 'phase2':
        return !!object?.phase1 && completedPhases.has('phase1')
      case 'phase3':
        return !!object?.phase2 && completedPhases.has('phase2')
      case 'phase4':
        return !!object?.phase3 && completedPhases.has('phase3')
      case 'phase5':
        return !!object?.phase4 && completedPhases.has('phase4')
      case 'complete':
        return !!object?.phase5?.comprehensiveStrategy
      default:
        return false
    }
  }

  const markPhaseComplete = (phase: Phase) => {
    setCompletedPhases((prev) => new Set([...prev, phase]))
  }

  const handleSelection = (phase: keyof SelectionState, index: number) => {
    setSelections((prev) => ({ ...prev, [phase]: index }))
  }

  const handlePhaseSubmit = (phase: keyof SelectionState) => {
    const selectedIndex = selections[phase]
    if (selectedIndex === undefined) return

    let selectedOption: any
    let nextMessage = ''
    let currentPhaseKey: Phase

    switch (phase) {
      case 'phase1Selection':
        selectedOption = object?.phase1?.brandOptions?.[selectedIndex]
        nextMessage = JSON.stringify({ phase: 1, selectedOption })
        currentPhaseKey = 'phase1'
        break
      case 'phase2Selection':
        selectedOption = object?.phase2?.positioningOptions?.[selectedIndex]
        nextMessage = JSON.stringify({ phase: 2, selectedOption })
        currentPhaseKey = 'phase2'
        break
      case 'phase3Selection':
        selectedOption = object?.phase3?.personalityOptions?.[selectedIndex]
        nextMessage = JSON.stringify({ phase: 3, selectedOption })
        currentPhaseKey = 'phase3'
        break
      case 'phase4Selection':
        selectedOption = object?.phase4?.visualOptions?.[selectedIndex]
        nextMessage = JSON.stringify({ phase: 4, selectedOption })
        currentPhaseKey = 'phase4'
        break
      default:
        return
    }

    // Mark current phase as complete and advance
    markPhaseComplete(currentPhaseKey)

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
    setObject(undefined)
    setCurrentPhase('initial')
    setCompletedPhases(new Set())
  }

  const value: BrandChatContextType = {
    messages,
    selections,
    isSaving,
    object,
    isLoading,
    userId,
    currentPhase,
    completedPhases,
    handleSelection,
    handlePhaseSubmit,
    handleSave,
    handleDiscard,
    submit,
    setMessages,
    advanceToPhase,
    canAdvanceToPhase,
    markPhaseComplete,
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
