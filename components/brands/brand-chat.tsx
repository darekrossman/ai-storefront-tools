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
import { PulseSpinner } from '../ui/spinner'

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
  } = useBrandChat()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  console.log(object, selections, messages)

  return (
    <PageContainer>
      {/* Save/Discard buttons - show when phase 5 is complete */}
      {object?.phase5?.comprehensiveStrategy && (
        <Flex
          gap={4}
          justifyContent="flex-end"
          borderBottom="1px solid"
          borderColor="gray.200"
          pb={4}
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
      {!object && !isLoading && (
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

      {!object && isLoading && (
        <Stack alignItems="center" justifyContent="center" h="full">
          <PulseSpinner size="lg" />
          <styled.p fontSize="sm" color="fg.muted">
            Generating the initial foundation...
          </styled.p>
        </Stack>
      )}

      {/* Phase Components - Only show when not loading */}
      {!isLoading && (
        <>
          <Phase1Foundation />
          <Phase2Positioning />
          <Phase3Personality />
          <Phase4Visual />
          <Phase5Strategy />
        </>
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
