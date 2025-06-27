'use client'

import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import { useBrandChat } from './brand-chat-context'

export function Phase2Positioning() {
  const { object, selections, handleSelection, handlePhaseSubmit } = useBrandChat()

  if (!object?.phase2) return null

  return (
    <Stack gap={6}>
      <Box>
        <styled.h2 fontSize="xl" fontWeight="bold" color="gray.900" mb={2}>
          Phase 2: Positioning Strategies
        </styled.h2>
        <styled.p fontSize="sm" color="gray.600" mb={4}>
          Selected Brand: {object.phase2.selectedBrand}
        </styled.p>
        <styled.p fontSize="sm" color="gray.600" mb={6}>
          {object.phase2.nextStep}
        </styled.p>
      </Box>

      <Stack gap={4}>
        {object.phase2.positioningOptions?.map((option: any, index: number) => (
          <Box
            key={index}
            border="2px solid"
            borderColor={selections.phase2Selection === index ? 'blue.500' : 'gray.200'}
            borderRadius="lg"
            p={4}
            cursor="pointer"
            transition="all 0.2s"
            bg={selections.phase2Selection === index ? 'blue.50' : 'white'}
            _hover={{
              borderColor: selections.phase2Selection === index ? 'blue.600' : 'gray.300',
              shadow: 'sm',
            }}
            onClick={() => handleSelection('phase2Selection', index)}
          >
            <Stack gap={3}>
              <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900">
                {option?.demographics}
              </styled.h3>
              <styled.p fontSize="sm" color="gray.700" lineHeight="relaxed">
                {option?.positioning}
              </styled.p>
              <Box>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500" mb={1}>
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
              <styled.div>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                  Competitive Advantage
                </styled.label>
                <styled.p fontSize="sm" color="gray.600">
                  {option?.advantage}
                </styled.p>
              </styled.div>
            </Stack>
          </Box>
        )) ?? []}
      </Stack>

      {selections.phase2Selection !== undefined && (
        <Button onClick={() => handlePhaseSubmit('phase2Selection')}>
          Continue with Selected Positioning
        </Button>
      )}
    </Stack>
  )
}
