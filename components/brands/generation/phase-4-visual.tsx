'use client'

import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import { useBrandChat } from './brand-chat-context'

export function Phase4Visual() {
  const { object, selections, handleSelection, handlePhaseSubmit } = useBrandChat()

  if (!object?.phase4) return null

  return (
    <Stack gap={6}>
      <Box>
        <styled.h2 fontSize="xl" fontWeight="bold" color="gray.900" mb={2}>
          Phase 4: Visual Identity
        </styled.h2>
        <styled.p fontSize="sm" color="gray.600" mb={4}>
          Selected Personality: {object.phase4.selectedPersonality}
        </styled.p>
        <styled.p fontSize="sm" color="gray.600" mb={6}>
          {object.phase4.nextStep}
        </styled.p>
      </Box>

      <Stack gap={4}>
        {object.phase4.visualOptions?.map((option: any, index: number) => (
          <Box
            key={index}
            border="2px solid"
            borderColor={selections.phase4Selection === index ? 'blue.500' : 'gray.200'}
            borderRadius="lg"
            p={4}
            cursor="pointer"
            transition="all 0.2s"
            bg={selections.phase4Selection === index ? 'blue.50' : 'white'}
            _hover={{
              borderColor: selections.phase4Selection === index ? 'blue.600' : 'gray.300',
              shadow: 'sm',
            }}
            onClick={() => handleSelection('phase4Selection', index)}
          >
            <Stack gap={3}>
              <styled.div>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                  Color Approach
                </styled.label>
                <styled.p fontSize="sm" color="gray.700" fontWeight="medium">
                  {option?.colorApproach}
                </styled.p>
              </styled.div>

              <styled.div>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                  Typography Style
                </styled.label>
                <styled.p fontSize="sm" color="gray.700">
                  {option?.typography}
                </styled.p>
              </styled.div>

              <styled.div>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                  Visual Style
                </styled.label>
                <styled.p fontSize="sm" color="gray.700" lineHeight="relaxed">
                  {option?.visualStyle}
                </styled.p>
              </styled.div>

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
          </Box>
        )) ?? []}
      </Stack>

      {selections.phase4Selection !== undefined && (
        <Button onClick={() => handlePhaseSubmit('phase4Selection')}>
          Generate Comprehensive Strategy
        </Button>
      )}
    </Stack>
  )
}
