'use client'

import { Box, Center, Divider, Flex, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { useRef } from 'react'
import {
  BrandChatProvider,
  useBrandChat,
  Phase1Foundation,
  Phase2Positioning,
  Phase3Personality,
  Phase4Visual,
  Phase5Strategy,
} from './generation'
import { PageContainer } from '../ui/page-container'
import { PulseSpinner, Spinner } from '../ui/spinner'

function BrandChatContent() {
  const {
    object,
    selections,
    isLoading,
    isSaving,
    handleSave,
    handleDiscard,
    submit,
    setMessages,
    messages,
    currentPhase,
    completedPhases,
    canAdvanceToPhase,
  } = useBrandChat()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  console.log(object, selections, messages, currentPhase, completedPhases)

  const getPhaseTitle = (phase: typeof currentPhase) => {
    switch (phase) {
      case 'initial':
        return 'Getting Started'
      case 'phase1':
        return 'Foundation'
      case 'phase2':
        return 'Positioning'
      case 'phase3':
        return 'Personality'
      case 'phase4':
        return 'Visual Identity'
      case 'phase5':
        return 'Strategy'
      case 'complete':
        return 'Complete'
    }
  }

  return (
    <PageContainer>
      {/* Phase Progress Indicator */}
      {currentPhase !== 'initial' && (
        <Stack gap={4} borderBottom="1px solid" borderColor="gray.200" pb={6} mb={6}>
          <styled.h2 fontSize="lg" fontWeight="semibold">
            Brand Development: {getPhaseTitle(currentPhase)}
          </styled.h2>

          <Flex gap={2} alignItems="center">
            {(['phase1', 'phase2', 'phase3', 'phase4', 'phase5'] as const).map(
              (phase, index) => {
                const isActive = currentPhase === phase
                const isCompleted = completedPhases.has(phase)
                const isAccessible = canAdvanceToPhase(phase)

                return (
                  <Flex key={phase} alignItems="center" gap={2}>
                    <styled.div
                      w={8}
                      h={8}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="sm"
                      fontWeight="medium"
                      bg={isCompleted ? 'green.500' : isActive ? 'blue.500' : 'gray.200'}
                      color={isCompleted || isActive ? 'white' : 'gray.500'}
                      cursor={isAccessible ? 'pointer' : 'default'}
                    >
                      {index + 1}
                    </styled.div>
                    <styled.span
                      fontSize="sm"
                      color={
                        isActive ? 'blue.600' : isCompleted ? 'green.600' : 'gray.500'
                      }
                      fontWeight={isActive ? 'medium' : 'normal'}
                    >
                      {getPhaseTitle(phase)}
                    </styled.span>
                    {index < 4 && <styled.div w={4} h="1px" bg="gray.200" />}
                  </Flex>
                )
              },
            )}
          </Flex>
        </Stack>
      )}

      {/* Save/Discard buttons - show when phase 5 is complete */}
      {object?.phase5?.comprehensiveStrategy && (
        <Flex
          gap={4}
          justifyContent="flex-end"
          borderBottom="1px solid"
          borderColor="gray.200"
          pb={4}
          mb={4}
        >
          <Button variant="secondary" onClick={handleDiscard} disabled={isSaving}>
            Discard
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            bg={isSaving ? 'gray.400' : 'blue.600'}
            color="white"
            _hover={{ bg: isSaving ? 'gray.400' : 'blue.700' }}
            cursor={isSaving ? 'not-allowed' : 'pointer'}
          >
            {isSaving ? 'Saving...' : 'Save Brand'}
          </Button>
        </Flex>
      )}

      {/* Initial Input Form */}
      {currentPhase === 'initial' && !isLoading && (
        <Center w="full" h="full" flexDirection="column">
          <Stack maxW="md" bg="white" p={8} shadow="xs" alignItems="center">
            <Stack alignItems="center" gap={1}>
              <styled.h1 fontSize="xl" fontWeight="bold">
                Let's create your brand
              </styled.h1>
              <styled.p
                fontSize="sm"
                color="fg.muted"
                textAlign="center"
                textWrap="pretty"
              >
                Describe the brand or vertical in as much or as little detail as you like,
                and we'll generate the initial foundation.
              </styled.p>
            </Stack>

            <Box aria-hidden="true" />

            <styled.form
              w="full"
              onSubmit={(e) => {
                e.preventDefault()
                const message = inputRef.current?.value
                if (message) {
                  const newMessages = [{ role: 'user' as const, content: message }]
                  setMessages(newMessages)
                  submit({ messages: newMessages })
                }
              }}
            >
              <Stack gap={4}>
                <styled.textarea
                  ref={inputRef}
                  placeholder="A global sporting goods retailer..."
                  fontSize="sm"
                  w="full"
                  color="fg"
                  py="2"
                  px="3"
                  border="base"
                  _focus={{ outline: 'none' }}
                  _placeholder={{ color: 'fg.muted/50' }}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                      e.preventDefault()
                      const message = inputRef.current?.value
                      if (message) {
                        const newMessages = [{ role: 'user' as const, content: message }]
                        setMessages(newMessages)
                        submit({ messages: newMessages })
                      }
                    }
                  }}
                />
                <Button type="submit">Generate</Button>
              </Stack>
            </styled.form>
          </Stack>
        </Center>
      )}

      {/* Loading State */}
      {isLoading && (
        <Stack alignItems="center" justifyContent="center" h="full">
          <Spinner size="lg" />
          <styled.p fontSize="sm" color="fg.muted">
            {currentPhase === 'initial' && 'Generating the initial foundation...'}
            {currentPhase === 'phase1' && 'Generating positioning options...'}
            {currentPhase === 'phase2' && 'Generating personality options...'}
            {currentPhase === 'phase3' && 'Generating visual options...'}
            {currentPhase === 'phase4' && 'Generating comprehensive strategy...'}
          </styled.p>
        </Stack>
      )}

      {/* Phase Content */}
      {!isLoading && currentPhase !== 'initial' && (
        <Box p={8}>
          {currentPhase === 'phase1' && <Phase1Foundation />}
          {currentPhase === 'phase2' && <Phase2Positioning />}
          {currentPhase === 'phase3' && <Phase3Personality />}
          {currentPhase === 'phase4' && <Phase4Visual />}
          {currentPhase === 'phase5' && <Phase5Strategy />}
        </Box>
      )}
    </PageContainer>
  )
}

export default function BrandChat() {
  return (
    <BrandChatProvider>
      <BrandChatContent />
    </BrandChatProvider>
  )
}
