'use client'

import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import { useBrandChat } from './brand-chat-context'

export function Phase3Personality() {
  const { object, selections, handleSelection, handlePhaseSubmit } = useBrandChat()

  if (!object?.phase3) return null

  return (
    <Stack gap={6}>
      <Box>
        <styled.h2 fontSize="xl" fontWeight="bold" color="gray.900" mb={2}>
          Phase 3: Brand Personality
        </styled.h2>
        <styled.p fontSize="sm" color="gray.600" mb={4}>
          Selected Positioning: {object.phase3.selectedPositioning}
        </styled.p>
        <styled.p fontSize="sm" color="gray.600" mb={6}>
          {object.phase3.nextStep}
        </styled.p>
      </Box>

      <Stack gap={4}>
        {object.phase3.personalityOptions?.map((option: any, index: number) => (
          <Box
            key={index}
            border="2px solid"
            borderColor={selections.phase3Selection === index ? 'blue.500' : 'gray.200'}
            borderRadius="lg"
            p={4}
            cursor="pointer"
            transition="all 0.2s"
            bg={selections.phase3Selection === index ? 'blue.50' : 'white'}
            _hover={{
              borderColor: selections.phase3Selection === index ? 'blue.600' : 'gray.300',
              shadow: 'sm',
            }}
            onClick={() => handleSelection('phase3Selection', index)}
          >
            <Stack gap={3}>
              <Flex gap={4}>
                <Box flex={1}>
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                    Voice
                  </styled.label>
                  <styled.p fontSize="sm" color="gray.700" fontWeight="medium">
                    {option?.voice}
                  </styled.p>
                </Box>
                <Box flex={1}>
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                    Tone
                  </styled.label>
                  <styled.p fontSize="sm" color="gray.700" fontWeight="medium">
                    {option?.tone}
                  </styled.p>
                </Box>
              </Flex>

              <Box>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500" mb={1}>
                  Core Values
                </styled.label>
                <Flex gap={1} wrap="wrap">
                  {option?.values?.map((value: string, i: number) => (
                    <styled.span
                      key={i}
                      fontSize="xs"
                      px={2}
                      py={0.5}
                      bg="purple.100"
                      color="purple.700"
                      borderRadius="sm"
                    >
                      {value}
                    </styled.span>
                  )) ?? []}
                </Flex>
              </Box>

              <Box>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500" mb={1}>
                  Personality Traits
                </styled.label>
                <Flex gap={1} wrap="wrap">
                  {option?.traits?.map((trait: string, i: number) => (
                    <styled.span
                      key={i}
                      fontSize="xs"
                      px={2}
                      py={0.5}
                      bg="orange.100"
                      color="orange.700"
                      borderRadius="sm"
                    >
                      {trait}
                    </styled.span>
                  )) ?? []}
                </Flex>
              </Box>

              <styled.div>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                  Communication Style
                </styled.label>
                <styled.p fontSize="sm" color="gray.600">
                  {option?.communicationStyle}
                </styled.p>
              </styled.div>
            </Stack>
          </Box>
        )) ?? []}
      </Stack>

      {selections.phase3Selection !== undefined && (
        <Button onClick={() => handlePhaseSubmit('phase3Selection')}>
          Continue with Selected Personality
        </Button>
      )}
    </Stack>
  )
}
