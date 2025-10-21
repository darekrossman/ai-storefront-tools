'use client'

import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import { useBrandChat } from './brand-chat-context'

export function Phase5Strategy() {
  const { object } = useBrandChat()

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
        <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={4}>
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
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500" mb={1}>
                    Core Values
                  </styled.label>
                  <Flex gap={1} wrap="wrap">
                    {strategy.brandFoundation.values
                      .filter((value): value is string => value !== undefined)
                      .map((value, i) => (
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
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500" mb={2}>
                    Demographics
                  </styled.label>
                  <Stack gap={2}>
                    <Flex gap={4}>
                      <Box flex={1}>
                        <styled.label fontSize="xs" fontWeight="medium" color="gray.400">
                          Age Range
                        </styled.label>
                        <styled.p fontSize="sm">
                          {strategy.targetMarket.demographics.ageRange}
                        </styled.p>
                      </Box>
                      <Box flex={1}>
                        <styled.label fontSize="xs" fontWeight="medium" color="gray.400">
                          Income
                        </styled.label>
                        <styled.p fontSize="sm">
                          {strategy.targetMarket.demographics.income}
                        </styled.p>
                      </Box>
                    </Flex>
                    <Flex gap={4}>
                      <Box flex={1}>
                        <styled.label fontSize="xs" fontWeight="medium" color="gray.400">
                          Education
                        </styled.label>
                        <styled.p fontSize="sm">
                          {strategy.targetMarket.demographics.education}
                        </styled.p>
                      </Box>
                      <Box flex={1}>
                        <styled.label fontSize="xs" fontWeight="medium" color="gray.400">
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
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500" mb={2}>
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
                            {strategy.targetMarket.psychographics.interests
                              .filter(
                                (interest): interest is string => interest !== undefined,
                              )
                              .map((interest, i) => (
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
                              ))}
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
                            {strategy.targetMarket.psychographics.values
                              .filter((value): value is string => value !== undefined)
                              .map((value, i) => (
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
                              ))}
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
                            {strategy.targetMarket.psychographics.personalityTraits
                              .filter((trait): trait is string => trait !== undefined)
                              .map((trait, i) => (
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
                              ))}
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
                      {strategy.targetMarket.painPoints
                        .filter((pain): pain is string => pain !== undefined)
                        .map((pain, i) => (
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
              {strategy.targetMarket.needs && strategy.targetMarket.needs.length > 0 && (
                <Box>
                  <styled.label fontSize="xs" fontWeight="medium" color="gray.500" mb={1}>
                    Needs
                  </styled.label>
                  <Flex gap={1} wrap="wrap">
                    {strategy.targetMarket.needs
                      .filter((need): need is string => need !== undefined)
                      .map((need, i) => (
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
                      {strategy.brandPersonality.personality
                        .filter((trait): trait is string => trait !== undefined)
                        .map((trait, i) => (
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
                      {strategy.positioning.competitiveAdvantages
                        .filter(
                          (advantage): advantage is string => advantage !== undefined,
                        )
                        .map((advantage, i) => (
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
                        ))}
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
                      {strategy.visualIdentity.colorScheme
                        .filter((color): color is string => color !== undefined)
                        .map((color, i) => (
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
                            {strategy.visualIdentity.imagery.guidelines
                              .filter(
                                (guideline): guideline is string =>
                                  guideline !== undefined,
                              )
                              .map((guideline, i) => (
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
                              ))}
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
                      {strategy.visualIdentity.designPrinciples
                        .filter(
                          (principle): principle is string => principle !== undefined,
                        )
                        .map((principle, i) => (
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
