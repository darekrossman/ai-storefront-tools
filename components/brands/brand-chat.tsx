'use client'

import { brandStructuredOutputSchemas } from '@/lib/brand/schemas'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { useRef, useState } from 'react'
import { convertToDBFormat } from '@/lib/brand/helpers'
import { createBrandAction } from '@/actions/brands'
import { useRouter } from 'next/navigation'
import { useUser } from '../user-context'
import { z } from 'zod'

const api = '/api/agents/brand'

type SelectionState = {
  phase1Selection?: number
  phase2Selection?: number
  phase3Selection?: number
  phase4Selection?: number
}

export default function BrandChat() {
  const { userId } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [selections, setSelections] = useState<SelectionState>({})
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { object, submit, isLoading } = useObject({
    api,
    schema: brandStructuredOutputSchemas,
  })
  const router = useRouter()

  const handleSelection = (phase: keyof SelectionState, index: number) => {
    setSelections((prev) => ({ ...prev, [phase]: index }))
  }

  const handlePhaseSubmit = (phase: keyof SelectionState) => {
    const selectedIndex = selections[phase]
    if (selectedIndex === undefined) return

    let selectedOption: any
    let nextMessage = ''

    switch (phase) {
      case 'phase1Selection':
        selectedOption = object?.phase1?.brandOptions?.[selectedIndex]
        nextMessage = JSON.stringify({ phase: 1, selectedOption })
        break
      case 'phase2Selection':
        selectedOption = object?.phase2?.positioningOptions?.[selectedIndex]
        nextMessage = JSON.stringify({ phase: 2, selectedOption })
        break
      case 'phase3Selection':
        selectedOption = object?.phase3?.personalityOptions?.[selectedIndex]
        nextMessage = JSON.stringify({ phase: 3, selectedOption })
        break
      case 'phase4Selection':
        selectedOption = object?.phase4?.visualOptions?.[selectedIndex]
        nextMessage = JSON.stringify({ phase: 4, selectedOption })
        break
    }

    const newMessages = [...messages, { role: 'user' as const, content: nextMessage }]
    setMessages(newMessages)
    submit({ messages: newMessages })
  }

  const handleSave = async () => {
    const data = object?.phase5 as z.infer<typeof brandStructuredOutputSchemas>['phase5']

    setIsSaving(true)
    try {
      const brandData = convertToDBFormat(data, userId)
      const newBrand = await createBrandAction(brandData)
      router.push(`/dashboard/brands/${newBrand.id}`)
    } catch (error) {
      console.error('Error saving brand:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    // Reset the component to initial state
    setMessages([])
    setSelections({})
  }

  const renderPhase1 = () => {
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
          {object.phase1.brandOptions?.map((option, index) => (
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
                borderColor:
                  selections.phase1Selection === index ? 'blue.600' : 'gray.300',
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

  const renderPhase2 = () => {
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
          {object.phase2.positioningOptions?.map((option, index) => (
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
                borderColor:
                  selections.phase2Selection === index ? 'blue.600' : 'gray.300',
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
                    {option?.differentiators?.map((diff, i) => (
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

  const renderPhase3 = () => {
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
          {object.phase3.personalityOptions?.map((option, index) => (
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
                borderColor:
                  selections.phase3Selection === index ? 'blue.600' : 'gray.300',
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
                    {option?.values?.map((value, i) => (
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
                    {option?.traits?.map((trait, i) => (
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

  const renderPhase4 = () => {
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
          {object.phase4.visualOptions?.map((option, index) => (
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
                borderColor:
                  selections.phase4Selection === index ? 'blue.600' : 'gray.300',
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
                    {option?.designPrinciples?.map((principle, i) => (
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

  const renderPhase5 = () => {
    if (!object?.phase5) return null

    const strategy = object.phase5.comprehensiveStrategy

    return (
      <Stack gap={6}>
        <Box>
          <styled.h2 fontSize="xl" fontWeight="bold" color="gray.900" mb={2}>
            Phase 5: Comprehensive Brand Strategy
          </styled.h2>
          <styled.p fontSize="sm" color="green.600" mb={4}>
            ✓ Brand strategy complete!
          </styled.p>
        </Box>

        <Stack gap={6}>
          {/* Brand Foundation */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={4}
          >
            <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900" mb={3}>
              Brand Foundation
            </styled.h3>
            <Stack gap={2}>
              <Box>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                  Name
                </styled.label>
                <styled.p fontSize="sm" fontWeight="medium">
                  {strategy?.brandFoundation?.name}
                </styled.p>
              </Box>
              <Box>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                  Tagline
                </styled.label>
                <styled.p fontSize="sm" fontStyle="italic">
                  "{strategy?.brandFoundation?.tagline}"
                </styled.p>
              </Box>
              <Box>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                  Mission
                </styled.label>
                <styled.p fontSize="sm" lineHeight="relaxed">
                  {strategy?.brandFoundation?.mission}
                </styled.p>
              </Box>
              <Box>
                <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                  Vision
                </styled.label>
                <styled.p fontSize="sm" lineHeight="relaxed">
                  {strategy?.brandFoundation?.vision}
                </styled.p>
              </Box>
              {strategy?.brandFoundation?.values &&
                strategy.brandFoundation.values.length > 0 && (
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
                      {strategy.brandFoundation.values.map((value, i) => (
                        <styled.span
                          key={i}
                          fontSize="xs"
                          px={2}
                          py={0.5}
                          bg="emerald.100"
                          color="emerald.700"
                          borderRadius="sm"
                        >
                          {value}
                        </styled.span>
                      ))}
                    </Flex>
                  </Box>
                )}
            </Stack>
          </Box>

          {/* Target Market */}
          {strategy?.targetMarket && (
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={4}
            >
              <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900" mb={3}>
                Target Market
              </styled.h3>
              <Stack gap={4}>
                {/* Demographics */}
                {strategy.targetMarket.demographics && (
                  <Box>
                    <styled.label
                      fontSize="xs"
                      fontWeight="medium"
                      color="gray.500"
                      mb={2}
                    >
                      Demographics
                    </styled.label>
                    <Stack gap={2}>
                      <Flex gap={4}>
                        <Box flex={1}>
                          <styled.label
                            fontSize="xs"
                            fontWeight="medium"
                            color="gray.400"
                          >
                            Age Range
                          </styled.label>
                          <styled.p fontSize="sm">
                            {strategy.targetMarket.demographics.ageRange}
                          </styled.p>
                        </Box>
                        <Box flex={1}>
                          <styled.label
                            fontSize="xs"
                            fontWeight="medium"
                            color="gray.400"
                          >
                            Income
                          </styled.label>
                          <styled.p fontSize="sm">
                            {strategy.targetMarket.demographics.income}
                          </styled.p>
                        </Box>
                      </Flex>
                      <Flex gap={4}>
                        <Box flex={1}>
                          <styled.label
                            fontSize="xs"
                            fontWeight="medium"
                            color="gray.400"
                          >
                            Education
                          </styled.label>
                          <styled.p fontSize="sm">
                            {strategy.targetMarket.demographics.education}
                          </styled.p>
                        </Box>
                        <Box flex={1}>
                          <styled.label
                            fontSize="xs"
                            fontWeight="medium"
                            color="gray.400"
                          >
                            Location
                          </styled.label>
                          <styled.p fontSize="sm">
                            {strategy.targetMarket.demographics.location}
                          </styled.p>
                        </Box>
                      </Flex>
                    </Stack>
                  </Box>
                )}

                {/* Psychographics */}
                {strategy.targetMarket.psychographics && (
                  <Box>
                    <styled.label
                      fontSize="xs"
                      fontWeight="medium"
                      color="gray.500"
                      mb={2}
                    >
                      Psychographics
                    </styled.label>
                    <Stack gap={2}>
                      <Box>
                        <styled.label fontSize="xs" fontWeight="medium" color="gray.400">
                          Lifestyle
                        </styled.label>
                        <styled.p fontSize="sm" lineHeight="relaxed">
                          {strategy.targetMarket.psychographics.lifestyle}
                        </styled.p>
                      </Box>
                      {strategy.targetMarket.psychographics.interests &&
                        strategy.targetMarket.psychographics.interests.length > 0 && (
                          <Box>
                            <styled.label
                              fontSize="xs"
                              fontWeight="medium"
                              color="gray.400"
                              mb={1}
                            >
                              Interests
                            </styled.label>
                            <Flex gap={1} wrap="wrap">
                              {strategy.targetMarket.psychographics.interests.map(
                                (interest, i) => (
                                  <styled.span
                                    key={i}
                                    fontSize="xs"
                                    px={2}
                                    py={0.5}
                                    bg="cyan.100"
                                    color="cyan.700"
                                    borderRadius="sm"
                                  >
                                    {interest}
                                  </styled.span>
                                ),
                              )}
                            </Flex>
                          </Box>
                        )}
                      {strategy.targetMarket.psychographics.values &&
                        strategy.targetMarket.psychographics.values.length > 0 && (
                          <Box>
                            <styled.label
                              fontSize="xs"
                              fontWeight="medium"
                              color="gray.400"
                              mb={1}
                            >
                              Values
                            </styled.label>
                            <Flex gap={1} wrap="wrap">
                              {strategy.targetMarket.psychographics.values.map(
                                (value, i) => (
                                  <styled.span
                                    key={i}
                                    fontSize="xs"
                                    px={2}
                                    py={0.5}
                                    bg="violet.100"
                                    color="violet.700"
                                    borderRadius="sm"
                                  >
                                    {value}
                                  </styled.span>
                                ),
                              )}
                            </Flex>
                          </Box>
                        )}
                      {strategy.targetMarket.psychographics.personalityTraits &&
                        strategy.targetMarket.psychographics.personalityTraits.length >
                          0 && (
                          <Box>
                            <styled.label
                              fontSize="xs"
                              fontWeight="medium"
                              color="gray.400"
                              mb={1}
                            >
                              Personality Traits
                            </styled.label>
                            <Flex gap={1} wrap="wrap">
                              {strategy.targetMarket.psychographics.personalityTraits.map(
                                (trait, i) => (
                                  <styled.span
                                    key={i}
                                    fontSize="xs"
                                    px={2}
                                    py={0.5}
                                    bg="amber.100"
                                    color="amber.700"
                                    borderRadius="sm"
                                  >
                                    {trait}
                                  </styled.span>
                                ),
                              )}
                            </Flex>
                          </Box>
                        )}
                    </Stack>
                  </Box>
                )}

                {/* Pain Points */}
                {strategy.targetMarket.painPoints &&
                  strategy.targetMarket.painPoints.length > 0 && (
                    <Box>
                      <styled.label
                        fontSize="xs"
                        fontWeight="medium"
                        color="gray.500"
                        mb={1}
                      >
                        Pain Points
                      </styled.label>
                      <Flex gap={1} wrap="wrap">
                        {strategy.targetMarket.painPoints.map((pain, i) => (
                          <styled.span
                            key={i}
                            fontSize="xs"
                            px={2}
                            py={0.5}
                            bg="red.100"
                            color="red.700"
                            borderRadius="sm"
                          >
                            {pain}
                          </styled.span>
                        ))}
                      </Flex>
                    </Box>
                  )}

                {/* Needs */}
                {strategy.targetMarket.needs &&
                  strategy.targetMarket.needs.length > 0 && (
                    <Box>
                      <styled.label
                        fontSize="xs"
                        fontWeight="medium"
                        color="gray.500"
                        mb={1}
                      >
                        Needs
                      </styled.label>
                      <Flex gap={1} wrap="wrap">
                        {strategy.targetMarket.needs.map((need, i) => (
                          <styled.span
                            key={i}
                            fontSize="xs"
                            px={2}
                            py={0.5}
                            bg="blue.100"
                            color="blue.700"
                            borderRadius="sm"
                          >
                            {need}
                          </styled.span>
                        ))}
                      </Flex>
                    </Box>
                  )}
              </Stack>
            </Box>
          )}

          {/* Brand Personality */}
          {strategy?.brandPersonality && (
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={4}
            >
              <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900" mb={3}>
                Brand Personality
              </styled.h3>
              <Stack gap={2}>
                <Flex gap={4}>
                  <Box flex={1}>
                    <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                      Voice
                    </styled.label>
                    <styled.p fontSize="sm" fontWeight="medium">
                      {strategy.brandPersonality.voice}
                    </styled.p>
                  </Box>
                  <Box flex={1}>
                    <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                      Tone
                    </styled.label>
                    <styled.p fontSize="sm" fontWeight="medium">
                      {strategy.brandPersonality.tone}
                    </styled.p>
                  </Box>
                </Flex>
                <Box>
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                    Brand Archetype
                  </styled.label>
                  <styled.p fontSize="sm" fontWeight="medium">
                    {strategy.brandPersonality.brandArchetype}
                  </styled.p>
                </Box>
                <Box>
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                    Communication Style
                  </styled.label>
                  <styled.p fontSize="sm" lineHeight="relaxed">
                    {strategy.brandPersonality.communicationStyle}
                  </styled.p>
                </Box>
                {strategy.brandPersonality.personality &&
                  strategy.brandPersonality.personality.length > 0 && (
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
                        {strategy.brandPersonality.personality.map((trait, i) => (
                          <styled.span
                            key={i}
                            fontSize="xs"
                            px={2}
                            py={0.5}
                            bg="purple.100"
                            color="purple.700"
                            borderRadius="sm"
                          >
                            {trait}
                          </styled.span>
                        ))}
                      </Flex>
                    </Box>
                  )}
              </Stack>
            </Box>
          )}

          {/* Positioning Strategy */}
          {strategy?.positioning && (
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={4}
            >
              <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900" mb={3}>
                Positioning Strategy
              </styled.h3>
              <Stack gap={2}>
                <Box>
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                    Category
                  </styled.label>
                  <styled.p fontSize="sm" lineHeight="relaxed">
                    {strategy.positioning.category}
                  </styled.p>
                </Box>
                <Box>
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                    Differentiation
                  </styled.label>
                  <styled.p fontSize="sm" lineHeight="relaxed">
                    {strategy.positioning.differentiation}
                  </styled.p>
                </Box>
                <Box>
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                    Market Position
                  </styled.label>
                  <styled.p fontSize="sm" lineHeight="relaxed">
                    {strategy.positioning.marketPosition}
                  </styled.p>
                </Box>
                <Box>
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                    Price Point
                  </styled.label>
                  <styled.p fontSize="sm" fontWeight="medium" textTransform="capitalize">
                    {strategy.positioning.pricePoint}
                  </styled.p>
                </Box>
                {strategy.positioning.competitiveAdvantages &&
                  strategy.positioning.competitiveAdvantages.length > 0 && (
                    <Box>
                      <styled.label
                        fontSize="xs"
                        fontWeight="medium"
                        color="gray.500"
                        mb={1}
                      >
                        Competitive Advantages
                      </styled.label>
                      <Flex gap={1} wrap="wrap">
                        {strategy.positioning.competitiveAdvantages.map(
                          (advantage, i) => (
                            <styled.span
                              key={i}
                              fontSize="xs"
                              px={2}
                              py={0.5}
                              bg="green.100"
                              color="green.700"
                              borderRadius="sm"
                            >
                              {advantage}
                            </styled.span>
                          ),
                        )}
                      </Flex>
                    </Box>
                  )}
              </Stack>
            </Box>
          )}

          {/* Visual Identity */}
          {strategy?.visualIdentity && (
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={4}
            >
              <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900" mb={3}>
                Visual Identity
              </styled.h3>
              <Stack gap={2}>
                <Box>
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                    Logo Description
                  </styled.label>
                  <styled.p fontSize="sm" lineHeight="relaxed">
                    {strategy.visualIdentity.logoDescription}
                  </styled.p>
                </Box>
                {strategy.visualIdentity.colorScheme &&
                  strategy.visualIdentity.colorScheme.length > 0 && (
                    <Box>
                      <styled.label
                        fontSize="xs"
                        fontWeight="medium"
                        color="gray.500"
                        mb={1}
                      >
                        Color Scheme
                      </styled.label>
                      <Flex gap={1} wrap="wrap">
                        {strategy.visualIdentity.colorScheme.map((color, i) => (
                          <styled.span
                            key={i}
                            fontSize="xs"
                            px={2}
                            py={0.5}
                            bg="gray.100"
                            color="gray.700"
                            borderRadius="sm"
                          >
                            {color}
                          </styled.span>
                        ))}
                      </Flex>
                    </Box>
                  )}
                {strategy.visualIdentity.typography && (
                  <Box>
                    <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                      Typography
                    </styled.label>
                    <Stack gap={1}>
                      <styled.p fontSize="sm">
                        <styled.span fontWeight="medium">Primary:</styled.span>{' '}
                        {strategy.visualIdentity.typography.primary}
                      </styled.p>
                      <styled.p fontSize="sm">
                        <styled.span fontWeight="medium">Secondary:</styled.span>{' '}
                        {strategy.visualIdentity.typography.secondary}
                      </styled.p>
                    </Stack>
                  </Box>
                )}
                {strategy.visualIdentity.imagery && (
                  <Box>
                    <styled.label fontSize="xs" fontWeight="medium" color="gray.500">
                      Imagery
                    </styled.label>
                    <Stack gap={1}>
                      <styled.p fontSize="sm">
                        <styled.span fontWeight="medium">Style:</styled.span>{' '}
                        {strategy.visualIdentity.imagery.style}
                      </styled.p>
                      <styled.p fontSize="sm">
                        <styled.span fontWeight="medium">Mood:</styled.span>{' '}
                        {strategy.visualIdentity.imagery.mood}
                      </styled.p>
                      {strategy.visualIdentity.imagery.guidelines &&
                        strategy.visualIdentity.imagery.guidelines.length > 0 && (
                          <Box>
                            <styled.label
                              fontSize="xs"
                              fontWeight="medium"
                              color="gray.500"
                              mb={1}
                            >
                              Guidelines
                            </styled.label>
                            <Flex gap={1} wrap="wrap">
                              {strategy.visualIdentity.imagery.guidelines.map(
                                (guideline, i) => (
                                  <styled.span
                                    key={i}
                                    fontSize="xs"
                                    px={2}
                                    py={0.5}
                                    bg="teal.100"
                                    color="teal.700"
                                    borderRadius="sm"
                                  >
                                    {guideline}
                                  </styled.span>
                                ),
                              )}
                            </Flex>
                          </Box>
                        )}
                    </Stack>
                  </Box>
                )}
                {strategy.visualIdentity.designPrinciples &&
                  strategy.visualIdentity.designPrinciples.length > 0 && (
                    <Box>
                      <styled.label
                        fontSize="xs"
                        fontWeight="medium"
                        color="gray.500"
                        mb={1}
                      >
                        Design Principles
                      </styled.label>
                      <Flex gap={1} wrap="wrap">
                        {strategy.visualIdentity.designPrinciples.map((principle, i) => (
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
                        ))}
                      </Flex>
                    </Box>
                  )}
              </Stack>
            </Box>
          )}
        </Stack>
      </Stack>
    )
  }

  return (
    <Box maxW="4xl" mx="auto" py={8}>
      <Stack gap={8}>
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
          <Box>
            <styled.h1 fontSize="2xl" fontWeight="bold" color="gray.900" mb={4}>
              Brand Strategy Generator
            </styled.h1>
            <styled.p fontSize="md" color="gray.600" mb={6}>
              We'll use your project details to generate brand strategy options.
            </styled.p>
            <form
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
                <Input ref={inputRef} placeholder="Describe your brand..." />
                <Button type="submit">Generate Brand Options</Button>
              </Stack>
            </form>
          </Box>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box textAlign="center" py={12}>
            <Stack gap={4} alignItems="center">
              <Box
                w={8}
                h={8}
                bg="blue.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <styled.div
                  w={4}
                  h={4}
                  bg="blue.500"
                  borderRadius="full"
                  style={{
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              </Box>
              <styled.h2 fontSize="lg" fontWeight="medium" color="gray.700">
                Generating Brand Strategy...
              </styled.h2>
              <styled.p fontSize="sm" color="gray.500">
                Our AI is crafting personalized brand options for you
              </styled.p>
            </Stack>
          </Box>
        )}

        {/* Phase Rendering - Only show when not loading */}
        {!isLoading && (
          <>
            {renderPhase1()}
            {renderPhase2()}
            {renderPhase3()}
            {renderPhase4()}
            {renderPhase5()}
          </>
        )}
      </Stack>
    </Box>
  )
}
