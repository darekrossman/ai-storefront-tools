'use client'

import { Box, Grid, HStack, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import { SelectableCard } from '@/components/ui/card'
import { useBrandChat } from './brand-chat-context'

export function Phase1Foundation() {
  const { object, selections, handleSelection, handlePhaseSubmit } = useBrandChat()

  if (!object?.phase1) return null

  return (
    <Stack gap={6}>
      <Box>
        <styled.h2 fontSize="xl" fontWeight="bold" color="gray.900">
          Phase 1: Brand Foundation Options
        </styled.h2>
        <styled.p fontSize="sm" color="gray.600">
          Industry: {object.phase1.vertical}
        </styled.p>
      </Box>

      <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
        {object.phase1.brandOptions?.map((option: any, index: number) => {
          const isSelected = selections.phase1Selection === index

          return (
            <SelectableCard
              key={index}
              isSelected={isSelected}
              onClick={() => handleSelection('phase1Selection', index)}
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
                    {option?.name}
                  </styled.h3>
                  <styled.p fontSize="sm" fontStyle="italic">
                    {option?.tagline}
                  </styled.p>
                </Stack>

                <styled.p fontSize="sm" color="fg/80" flex="1">
                  {option?.concept}
                </styled.p>
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
          onClick={() => handlePhaseSubmit('phase1Selection')}
          w="max-content"
          disabled={selections.phase1Selection === undefined}
        >
          Continue to Phase 2
        </Button>
      </HStack>
    </Stack>
  )
}
