'use client'

import { Box, Flex, Grid, HStack, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import { SelectableCard } from '@/components/ui/card'
import { useBrandChat } from './brand-chat-context'

export function Phase4Visual() {
  const { object, selections, handleSelection, handlePhaseSubmit } = useBrandChat()

  if (!object?.phase4) return null

  return (
    <Stack gap={6}>
      <Box>
        <styled.h2 fontSize="xl" fontWeight="bold" color="gray.900">
          Phase 4: Visual Identity
        </styled.h2>
        <styled.p fontSize="sm" color="gray.600">
          Selected Personality: {object.phase4.selectedPersonality}
        </styled.p>
      </Box>

      <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
        {object.phase4.visualOptions?.map((option: any, index: number) => {
          const isSelected = selections.phase4Selection === index

          return (
            <SelectableCard
              key={index}
              isSelected={isSelected}
              onClick={() => handleSelection('phase4Selection', index)}
            >
              <Stack gap={4}>
                <Stack gap={1}>
                  <styled.h3
                    fontSize="md"
                    fontWeight="semibold"
                    color="gray.900"
                    textBox="trim-both"
                    textWrap="balance"
                  >
                    {option?.colorApproach}
                  </styled.h3>
                  <styled.p fontSize="sm" fontStyle="italic">
                    {option?.typography}
                  </styled.p>
                </Stack>

                <styled.p fontSize="sm" color="fg/80" flex="1">
                  {option?.visualStyle}
                </styled.p>

                <Box>
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500" mb={1}>
                    Design Principles
                  </styled.label>
                  <Flex gap={1} wrap="wrap">
                    {option?.designPrinciples?.map((principle: string, i: number) => (
                      <styled.span
                        key={i}
                        fontSize="xs"
                        px={2}
                        py={0.5}
                        bg="indigo.100"
                        color="indigo.700"
                        borderRadius="sm"
                      >
                        {principle}
                      </styled.span>
                    )) ?? []}
                  </Flex>
                </Box>
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
          onClick={() => handlePhaseSubmit('phase4Selection')}
          w="max-content"
          disabled={selections.phase4Selection === undefined}
        >
          Generate Strategy
        </Button>
      </HStack>
    </Stack>
  )
}
