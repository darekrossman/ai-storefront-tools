'use client'

import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import { useBrandChat } from './brand-chat-context'

export function Phase1Foundation() {
  const { object, selections, handleSelection, handlePhaseSubmit } = useBrandChat()

  if (!object?.phase1) return null

  return (
    <Stack gap={6}>
      <Box>
        <styled.h2 fontSize="xl" fontWeight="bold" color="gray.900" mb={2}>
          Phase 1: Brand Foundation Options
        </styled.h2>
        <styled.p fontSize="sm" color="gray.600" mb={4}>
          Industry: {object.phase1.industry}
        </styled.p>
        <styled.p fontSize="sm" color="gray.600" mb={6}>
          {object.phase1.nextStep}
        </styled.p>
      </Box>

      <Stack gap={4}>
        {object.phase1.brandOptions?.map((option: any, index: number) => (
          <Box
            key={index}
            border="2px solid"
            borderColor={selections.phase1Selection === index ? 'blue.500' : 'gray.200'}
            borderRadius="lg"
            p={4}
            cursor="pointer"
            transition="all 0.2s"
            bg={selections.phase1Selection === index ? 'blue.50' : 'white'}
            _hover={{
              borderColor: selections.phase1Selection === index ? 'blue.600' : 'gray.300',
              shadow: 'sm',
            }}
            onClick={() => handleSelection('phase1Selection', index)}
          >
            <Stack gap={3}>
              <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900">
                {option?.name}
              </styled.h3>
              <styled.p fontSize="sm" color="gray.600" fontStyle="italic">
                "{option?.tagline}"
              </styled.p>
              <styled.p fontSize="sm" color="gray.700" lineHeight="relaxed">
                {option?.concept}
              </styled.p>
              <styled.div>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                  Target Audience
                </styled.label>
                <styled.p fontSize="sm" color="gray.600">
                  {option?.targetAudience}
                </styled.p>
              </styled.div>
            </Stack>
          </Box>
        )) ?? []}
      </Stack>

      {selections.phase1Selection !== undefined && (
        <Button onClick={() => handlePhaseSubmit('phase1Selection')}>
          Continue with Selected Brand
        </Button>
      )}
    </Stack>
  )
}
