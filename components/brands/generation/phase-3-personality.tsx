'use client'

import { Box, Flex, Grid, HStack, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import { SelectableCard } from '@/components/ui/card'
import { useBrandChat } from './brand-chat-context'

export function Phase3Personality() {
  const { object, selections, handleSelection, handlePhaseSubmit } = useBrandChat()

  if (!object?.phase3) return null

  return (
    <Stack gap={6}>
      <Box>
        <styled.h2 fontSize="xl" fontWeight="bold" color="gray.900">
          Phase 3: Brand Personality
        </styled.h2>
        <styled.p fontSize="sm" color="gray.600">
          Selected Positioning: {object.phase3.selectedPositioning}
        </styled.p>
      </Box>

      <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
        {object.phase3.personalityOptions?.map((option: any, index: number) => {
          const isSelected = selections.phase3Selection === index

          return (
            <SelectableCard
              key={index}
              isSelected={isSelected}
              onClick={() => handleSelection('phase3Selection', index)}
            >
              <Stack gap={4}>
                <Stack gap={1}>
                  <styled.div display="flex" gap={4}>
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
                  </styled.div>
                </Stack>

                <styled.p fontSize="sm" color="fg/80" flex="1">
                  {option?.communicationStyle}
                </styled.p>

                <Stack gap={2}>
                  <Box>
                    <styled.label
                      fontSize="xs"
                      fontWeight="medium"
                      color="gray.500"
                      mb={1}
                    >
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
                    <styled.label
                      fontSize="xs"
                      fontWeight="medium"
                      color="gray.500"
                      mb={1}
                    >
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
                </Stack>
              </Stack>
            </SelectableCard>
          )
        }) ?? []}
      </Grid>

      <HStack gap={4}>
        <Button variant="secondary" w="max-content" onClick={() => alert('wip')}>
          Regenerate
        </Button>
        <Button
          onClick={() => handlePhaseSubmit('phase3Selection')}
          w="max-content"
          disabled={selections.phase3Selection === undefined}
        >
          Continue to Phase 4
        </Button>
      </HStack>
    </Stack>
  )
}
