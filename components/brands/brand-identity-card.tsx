'use client'

import { useState } from 'react'
import { Box, Flex, Stack, styled } from '@/styled-system/jsx'
import type { Brand } from '@/lib/supabase/database-types'
import Link from 'next/link'

interface BrandIdentityCardProps {
  brand: Brand
  projectId: number
}

function formatPrice(pricePoint: string) {
  if (!pricePoint) return ''
  return pricePoint.charAt(0).toUpperCase() + pricePoint.slice(1)
}

export function BrandIdentityCard({ brand, projectId }: BrandIdentityCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const hasCoreGuidelines =
    brand.mission || brand.vision || (brand.values && brand.values.length > 0)

  const hasTargetMarket =
    brand.target_age_range ||
    brand.target_education ||
    brand.target_income ||
    brand.target_lifestyle ||
    brand.target_location ||
    (brand.target_interests && brand.target_interests.length > 0) ||
    (brand.target_needs && brand.target_needs.length > 0) ||
    (brand.target_pain_points && brand.target_pain_points.length > 0) ||
    (brand.target_personality_traits && brand.target_personality_traits.length > 0) ||
    (brand.target_values && brand.target_values.length > 0)

  const hasBrandPersonality =
    brand.brand_voice ||
    brand.brand_tone ||
    brand.communication_style ||
    brand.brand_archetype ||
    (brand.personality_traits && brand.personality_traits.length > 0)

  const hasPositioning =
    brand.category ||
    brand.market_position ||
    brand.differentiation ||
    brand.price_point ||
    (brand.competitive_advantages && brand.competitive_advantages.length > 0)

  const hasVisualIdentity =
    brand.logo_description ||
    (brand.color_scheme && brand.color_scheme.length > 0) ||
    brand.typography_primary ||
    brand.typography_secondary ||
    brand.typography_accent ||
    brand.imagery_style ||
    brand.imagery_mood ||
    (brand.imagery_guidelines && brand.imagery_guidelines.length > 0) ||
    (brand.design_principles && brand.design_principles.length > 0)

  const hasExtraDetails =
    hasTargetMarket || hasBrandPersonality || hasPositioning || hasVisualIdentity

  return (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
      <Stack gap={6}>
        <styled.h2 fontSize="xl" fontWeight="semibold" color="gray.900">
          Brand Identity
        </styled.h2>

        <Stack gap={4}>
          {/* Mission */}
          {brand.mission && (
            <Stack gap={2}>
              <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                Mission Statement
              </styled.h3>
              <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                {brand.mission}
              </styled.p>
            </Stack>
          )}

          {/* Vision */}
          {brand.vision && (
            <Stack gap={2}>
              <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                Vision Statement
              </styled.h3>
              <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                {brand.vision}
              </styled.p>
            </Stack>
          )}

          {/* Values */}
          {brand.values && brand.values.length > 0 && (
            <Stack gap={2}>
              <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                Brand Values
              </styled.h3>
              <Flex gap={2} wrap="wrap">
                {brand.values.map((value: string, index: number) => (
                  <styled.span
                    key={index}
                    fontSize="sm"
                    px={3}
                    py={1}
                    bg="blue.50"
                    color="blue.700"
                    borderRadius="md"
                    fontWeight="medium"
                  >
                    {value}
                  </styled.span>
                ))}
              </Flex>
            </Stack>
          )}

          {/* Empty State */}
          {!hasCoreGuidelines && !hasExtraDetails && (
            <Box textAlign="center" py={8}>
              <Stack gap={2} align="center">
                <styled.h3 fontSize="md" fontWeight="medium" color="gray.900">
                  No Brand Identity Details Yet
                </styled.h3>
                <styled.p fontSize="sm" color="gray.600">
                  Add mission, vision, and other details to define your brand.
                </styled.p>
                <Link href={`/dashboard/projects/${projectId}/brands/${brand.id}/edit`}>
                  <styled.button
                    px={4}
                    py={2}
                    bg="blue.600"
                    color="white"
                    borderRadius="lg"
                    fontSize="sm"
                    fontWeight="medium"
                    cursor="pointer"
                    _hover={{
                      bg: 'blue.700',
                    }}
                    transition="all 0.2s"
                    mt={2}
                  >
                    Add Brand Details
                  </styled.button>
                </Link>
              </Stack>
            </Box>
          )}
        </Stack>

        {hasExtraDetails && (
          <Flex justify="center" pt={2}>
            <styled.button
              onClick={() => setShowDetails(!showDetails)}
              px={4}
              py={2}
              bg="gray.50"
              color="gray.600"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              fontSize="sm"
              fontWeight="medium"
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
              transition="all 0.2s"
            >
              {showDetails ? 'Hide Details' : 'Show Full Identity Details'}
            </styled.button>
          </Flex>
        )}

        {showDetails && hasExtraDetails && (
          <Stack gap={8} borderTop="1px solid" borderColor="gray.200" pt={6} mt={2}>
            {/* Brand Personality */}
            {hasBrandPersonality && (
              <Stack gap={4}>
                <styled.h2 fontSize="lg" fontWeight="semibold" color="gray.800">
                  Brand Personality
                </styled.h2>

                {/* Brand Voice */}
                {brand.brand_voice && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Brand Voice
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {brand.brand_voice}
                    </styled.p>
                  </Stack>
                )}

                {/* Brand Tone */}
                {brand.brand_tone && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Brand Tone
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {brand.brand_tone}
                    </styled.p>
                  </Stack>
                )}

                {/* Communication Style */}
                {brand.communication_style && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Communication Style
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {brand.communication_style}
                    </styled.p>
                  </Stack>
                )}

                {/* Brand Archetype */}
                {brand.brand_archetype && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Brand Archetype
                    </styled.h3>
                    <styled.span
                      fontSize="sm"
                      fontWeight="medium"
                      px={3}
                      py={1}
                      bg="indigo.50"
                      color="indigo.700"
                      borderRadius="md"
                      display="inline-block"
                    >
                      {brand.brand_archetype}
                    </styled.span>
                  </Stack>
                )}

                {/* Personality Traits */}
                {brand.personality_traits && brand.personality_traits.length > 0 && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Personality Traits
                    </styled.h3>
                    <Flex gap={2} wrap="wrap">
                      {brand.personality_traits.map((trait: string, index: number) => (
                        <styled.span
                          key={index}
                          fontSize="sm"
                          px={3}
                          py={1}
                          bg="purple.50"
                          color="purple.700"
                          borderRadius="md"
                          fontWeight="medium"
                        >
                          {trait}
                        </styled.span>
                      ))}
                    </Flex>
                  </Stack>
                )}
              </Stack>
            )}

            {/* Target Market */}
            {hasTargetMarket && (
              <Stack gap={4}>
                <styled.h2 fontSize="lg" fontWeight="semibold" color="gray.800">
                  Target Market
                </styled.h2>

                {/* Demographics */}
                <Stack gap={3}>
                  <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                    Demographics
                  </styled.h3>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                    gap={3}
                  >
                    {brand.target_age_range && (
                      <Box>
                        <styled.label fontSize="xs" fontWeight="medium" color="gray.600">
                          Age Range
                        </styled.label>
                        <styled.p fontSize="sm" color="gray.900">
                          {brand.target_age_range}
                        </styled.p>
                      </Box>
                    )}
                    {brand.target_income && (
                      <Box>
                        <styled.label fontSize="xs" fontWeight="medium" color="gray.600">
                          Income Level
                        </styled.label>
                        <styled.p fontSize="sm" color="gray.900">
                          {brand.target_income}
                        </styled.p>
                      </Box>
                    )}
                    {brand.target_education && (
                      <Box>
                        <styled.label fontSize="xs" fontWeight="medium" color="gray.600">
                          Education
                        </styled.label>
                        <styled.p fontSize="sm" color="gray.900">
                          {brand.target_education}
                        </styled.p>
                      </Box>
                    )}
                    {brand.target_location && (
                      <Box>
                        <styled.label fontSize="xs" fontWeight="medium" color="gray.600">
                          Location
                        </styled.label>
                        <styled.p fontSize="sm" color="gray.900">
                          {brand.target_location}
                        </styled.p>
                      </Box>
                    )}
                    {brand.target_lifestyle && (
                      <Box>
                        <styled.label fontSize="xs" fontWeight="medium" color="gray.600">
                          Lifestyle
                        </styled.label>
                        <styled.p fontSize="sm" color="gray.900">
                          {brand.target_lifestyle}
                        </styled.p>
                      </Box>
                    )}
                  </Box>
                </Stack>

                {/* Interests */}
                {brand.target_interests && brand.target_interests.length > 0 && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Interests
                    </styled.h3>
                    <Flex gap={2} wrap="wrap">
                      {brand.target_interests.map((interest: string, index: number) => (
                        <styled.span
                          key={index}
                          fontSize="sm"
                          px={3}
                          py={1}
                          bg="cyan.50"
                          color="cyan.700"
                          borderRadius="md"
                          fontWeight="medium"
                        >
                          {interest}
                        </styled.span>
                      ))}
                    </Flex>
                  </Stack>
                )}

                {/* Values */}
                {brand.target_values && brand.target_values.length > 0 && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Values
                    </styled.h3>
                    <Flex gap={2} wrap="wrap">
                      {brand.target_values.map((value: string, index: number) => (
                        <styled.span
                          key={index}
                          fontSize="sm"
                          px={3}
                          py={1}
                          bg="teal.50"
                          color="teal.700"
                          borderRadius="md"
                          fontWeight="medium"
                        >
                          {value}
                        </styled.span>
                      ))}
                    </Flex>
                  </Stack>
                )}

                {/* Personality Traits */}
                {brand.target_personality_traits &&
                  brand.target_personality_traits.length > 0 && (
                    <Stack gap={2}>
                      <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                        Personality Traits
                      </styled.h3>
                      <Flex gap={2} wrap="wrap">
                        {brand.target_personality_traits.map(
                          (trait: string, index: number) => (
                            <styled.span
                              key={index}
                              fontSize="sm"
                              px={3}
                              py={1}
                              bg="emerald.50"
                              color="emerald.700"
                              borderRadius="md"
                              fontWeight="medium"
                            >
                              {trait}
                            </styled.span>
                          ),
                        )}
                      </Flex>
                    </Stack>
                  )}

                {/* Pain Points */}
                {brand.target_pain_points && brand.target_pain_points.length > 0 && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Pain Points
                    </styled.h3>
                    <Stack gap={1}>
                      {brand.target_pain_points.map((point: string, index: number) => (
                        <styled.div
                          key={index}
                          fontSize="sm"
                          color="gray.900"
                          display="flex"
                          alignItems="start"
                          gap={2}
                        >
                          <styled.span color="red.500" mt="1px">
                            •
                          </styled.span>
                          <styled.span>{point}</styled.span>
                        </styled.div>
                      ))}
                    </Stack>
                  </Stack>
                )}

                {/* Needs */}
                {brand.target_needs && brand.target_needs.length > 0 && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Customer Needs
                    </styled.h3>
                    <Stack gap={1}>
                      {brand.target_needs.map((need: string, index: number) => (
                        <styled.div
                          key={index}
                          fontSize="sm"
                          color="gray.900"
                          display="flex"
                          alignItems="start"
                          gap={2}
                        >
                          <styled.span color="green.500" mt="1px">
                            •
                          </styled.span>
                          <styled.span>{need}</styled.span>
                        </styled.div>
                      ))}
                    </Stack>
                  </Stack>
                )}
              </Stack>
            )}

            {/* Market Positioning */}
            {hasPositioning && (
              <Stack gap={4}>
                <styled.h2 fontSize="lg" fontWeight="semibold" color="gray.800">
                  Market Positioning
                </styled.h2>

                {/* Category */}
                {brand.category && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Market Category
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {brand.category}
                    </styled.p>
                  </Stack>
                )}

                {/* Market Position */}
                {brand.market_position && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Market Position
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {brand.market_position}
                    </styled.p>
                  </Stack>
                )}

                {/* Differentiation */}
                {brand.differentiation && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Key Differentiation
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {brand.differentiation}
                    </styled.p>
                  </Stack>
                )}

                {/* Price Point */}
                {brand.price_point && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Price Point
                    </styled.h3>
                    <styled.span
                      fontSize="sm"
                      fontWeight="medium"
                      px={3}
                      py={1}
                      bg="green.50"
                      color="green.700"
                      borderRadius="md"
                    >
                      {formatPrice(brand.price_point)}
                    </styled.span>
                  </Stack>
                )}

                {/* Competitive Advantages */}
                {brand.competitive_advantages &&
                  brand.competitive_advantages.length > 0 && (
                    <Stack gap={2}>
                      <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                        Competitive Advantages
                      </styled.h3>
                      <Stack gap={1}>
                        {brand.competitive_advantages.map(
                          (advantage: string, index: number) => (
                            <styled.div
                              key={index}
                              fontSize="sm"
                              color="gray.900"
                              display="flex"
                              alignItems="start"
                              gap={2}
                            >
                              <styled.span color="blue.500" mt="1px">
                                ✓
                              </styled.span>
                              <styled.span>{advantage}</styled.span>
                            </styled.div>
                          ),
                        )}
                      </Stack>
                    </Stack>
                  )}
              </Stack>
            )}

            {/* Visual Identity */}
            {hasVisualIdentity && (
              <Stack gap={4}>
                <styled.h2 fontSize="lg" fontWeight="semibold" color="gray.800">
                  Visual Identity
                </styled.h2>

                {/* Logo Description */}
                {brand.logo_description && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Logo Description
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {brand.logo_description}
                    </styled.p>
                  </Stack>
                )}

                {/* Color Scheme */}
                {brand.color_scheme && brand.color_scheme.length > 0 && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Color Palette
                    </styled.h3>
                    <Flex gap={2} wrap="wrap">
                      {brand.color_scheme.map((color: string, index: number) => (
                        <styled.span
                          key={index}
                          fontSize="sm"
                          px={3}
                          py={1}
                          bg="orange.50"
                          color="orange.700"
                          borderRadius="md"
                          fontWeight="medium"
                        >
                          {color}
                        </styled.span>
                      ))}
                    </Flex>
                  </Stack>
                )}

                {/* Typography */}
                {(brand.typography_primary ||
                  brand.typography_secondary ||
                  brand.typography_accent) && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Typography
                    </styled.h3>
                    <Stack gap={2}>
                      {brand.typography_primary && (
                        <styled.div fontSize="sm" color="gray.900">
                          <styled.span fontWeight="medium">Primary: </styled.span>
                          {brand.typography_primary}
                        </styled.div>
                      )}
                      {brand.typography_secondary && (
                        <styled.div fontSize="sm" color="gray.900">
                          <styled.span fontWeight="medium">Secondary: </styled.span>
                          {brand.typography_secondary}
                        </styled.div>
                      )}
                      {brand.typography_accent && (
                        <styled.div fontSize="sm" color="gray.900">
                          <styled.span fontWeight="medium">Accent: </styled.span>
                          {brand.typography_accent}
                        </styled.div>
                      )}
                    </Stack>
                  </Stack>
                )}

                {/* Imagery Guidelines */}
                {(brand.imagery_style ||
                  brand.imagery_mood ||
                  (brand.imagery_guidelines && brand.imagery_guidelines.length > 0)) && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Imagery Style
                    </styled.h3>
                    <Stack gap={2}>
                      {brand.imagery_style && (
                        <styled.div fontSize="sm" color="gray.900">
                          <styled.span fontWeight="medium">Style: </styled.span>
                          {brand.imagery_style}
                        </styled.div>
                      )}
                      {brand.imagery_mood && (
                        <styled.div fontSize="sm" color="gray.900">
                          <styled.span fontWeight="medium">Mood: </styled.span>
                          {brand.imagery_mood}
                        </styled.div>
                      )}
                      {brand.imagery_guidelines &&
                        brand.imagery_guidelines.length > 0 && (
                          <Stack gap={1}>
                            <styled.span
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.700"
                            >
                              Guidelines:
                            </styled.span>
                            {brand.imagery_guidelines.map(
                              (guideline: string, index: number) => (
                                <styled.div
                                  key={index}
                                  fontSize="sm"
                                  color="gray.900"
                                  display="flex"
                                  alignItems="start"
                                  gap={2}
                                >
                                  <styled.span color="purple.500" mt="1px">
                                    •
                                  </styled.span>
                                  <styled.span>{guideline}</styled.span>
                                </styled.div>
                              ),
                            )}
                          </Stack>
                        )}
                    </Stack>
                  </Stack>
                )}

                {/* Design Principles */}
                {brand.design_principles && brand.design_principles.length > 0 && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Design Principles
                    </styled.h3>
                    <Stack gap={1}>
                      {brand.design_principles.map((principle: string, index: number) => (
                        <styled.div
                          key={index}
                          fontSize="sm"
                          color="gray.900"
                          display="flex"
                          alignItems="start"
                          gap={2}
                        >
                          <styled.span color="indigo.500" mt="1px">
                            ✦
                          </styled.span>
                          <styled.span>{principle}</styled.span>
                        </styled.div>
                      ))}
                    </Stack>
                  </Stack>
                )}
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
