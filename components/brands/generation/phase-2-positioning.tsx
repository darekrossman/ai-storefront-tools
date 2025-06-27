'use client'

import { Box, Flex, Grid, HStack, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import { SelectableCard } from '@/components/ui/card'
import { useBrandChat } from './brand-chat-context'

export function Phase2Positioning() {
  const { object, selections, handleSelection, handlePhaseSubmit } = useBrandChat()

  if (!object?.phase2) return null

  return (
    <Stack gap={6}>
      <Box>
        <styled.h2 fontSize="xl" fontWeight="bold" color="gray.900">
          Phase 2: Positioning Strategies
        </styled.h2>
        <styled.p fontSize="sm" color="gray.600">
          Selected Brand: {object.phase2.selectedBrand}
        </styled.p>
      </Box>

      <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
        {object.phase2.positioningOptions?.map((option: any, index: number) => {
          const isSelected = selections.phase2Selection === index

          return (
            <SelectableCard
              key={index}
              isSelected={isSelected}
              onClick={() => handleSelection('phase2Selection', index)}
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
                    {option?.demographics}
                  </styled.h3>
                </Stack>

                <styled.p fontSize="sm" color="fg/80" flex="1">
                  {option?.positioning}
                </styled.p>

                <Stack gap={2}>
                  <Box>
                    <styled.label
                      fontSize="xs"
                      fontWeight="medium"
                      color="gray.500"
                      mb={1}
                    >
                      Key Differentiators
                    </styled.label>
                    <Flex gap={1} wrap="wrap">
                      {option?.differentiators?.map((diff: string, i: number) => (
                        <styled.span
                          key={i}
                          fontSize="xs"
                          px={2}
                          py={0.5}
                          bg="green.100"
                          color="green.700"
                          borderRadius="sm"
                        >
                          {diff}
                        </styled.span>
                      )) ?? []}
                    </Flex>
                  </Box>

                  <Box>
                    <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                      Competitive Advantage
                    </styled.label>
                    <styled.p fontSize="xs" color="gray.600">
                      {option?.advantage}
                    </styled.p>
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
          onClick={() => handlePhaseSubmit('phase2Selection')}
          w="max-content"
          disabled={selections.phase2Selection === undefined}
        >
          Continue to Phase 3
        </Button>
      </HStack>
    </Stack>
  )
}
