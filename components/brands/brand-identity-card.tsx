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

  // Parse JSONB fields
  const targetMarket = brand.target_market as any
  const brandPersonality = brand.brand_personality as any
  const positioning = brand.positioning as any
  const visualIdentity = brand.visual_identity as any

  const hasCoreGuidelines =
    brand.mission || brand.vision || (brand.values && brand.values.length > 0)
  const hasExtraDetails =
    (targetMarket && Object.keys(targetMarket).length > 0) ||
    (brandPersonality && Object.keys(brandPersonality).length > 0) ||
    (positioning && Object.keys(positioning).length > 0) ||
    (visualIdentity && Object.keys(visualIdentity).length > 0)

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
            {/* Target Market */}
            {targetMarket && Object.keys(targetMarket).length > 0 && (
              <Stack gap={4}>
                <styled.h2 fontSize="lg" fontWeight="semibold" color="gray.800">
                  Target Market
                </styled.h2>

                {/* Demographics */}
                {targetMarket.demographics && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Demographics
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {targetMarket.demographics}
                    </styled.p>
                  </Stack>
                )}

                {/* Psychographics */}
                {targetMarket.psychographics && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Psychographics
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {targetMarket.psychographics}
                    </styled.p>
                  </Stack>
                )}

                {/* Pain Points */}
                {targetMarket.pain_points && targetMarket.pain_points.length > 0 && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Pain Points
                    </styled.h3>
                    <Stack gap={1}>
                      {targetMarket.pain_points.map((point: string, index: number) => (
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
                {targetMarket.needs && targetMarket.needs.length > 0 && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Customer Needs
                    </styled.h3>
                    <Stack gap={1}>
                      {targetMarket.needs.map((need: string, index: number) => (
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

            {/* Brand Personality */}
            {brandPersonality && Object.keys(brandPersonality).length > 0 && (
              <Stack gap={4}>
                <styled.h2 fontSize="lg" fontWeight="semibold" color="gray.800">
                  Brand Personality
                </styled.h2>

                {/* Voice */}
                {brandPersonality.voice && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Brand Voice
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {brandPersonality.voice}
                    </styled.p>
                  </Stack>
                )}

                {/* Tone */}
                {brandPersonality.tone && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Brand Tone
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {brandPersonality.tone}
                    </styled.p>
                  </Stack>
                )}

                {/* Personality Traits */}
                {brandPersonality.personality &&
                  brandPersonality.personality.length > 0 && (
                    <Stack gap={2}>
                      <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                        Personality Traits
                      </styled.h3>
                      <Flex gap={2} wrap="wrap">
                        {brandPersonality.personality.map(
                          (trait: string, index: number) => (
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
                          ),
                        )}
                      </Flex>
                    </Stack>
                  )}

                {/* Communication Style */}
                {brandPersonality.communication_style && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Communication Style
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {brandPersonality.communication_style}
                    </styled.p>
                  </Stack>
                )}

                {/* Brand Archetype */}
                {brandPersonality.brand_archetype && (
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
                      {brandPersonality.brand_archetype}
                    </styled.span>
                  </Stack>
                )}
              </Stack>
            )}

            {/* Market Positioning */}
            {positioning && Object.keys(positioning).length > 0 && (
              <Stack gap={4}>
                <styled.h2 fontSize="lg" fontWeight="semibold" color="gray.800">
                  Market Positioning
                </styled.h2>

                {/* Category */}
                {positioning.category && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Market Category
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {positioning.category}
                    </styled.p>
                  </Stack>
                )}

                {/* Differentiation */}
                {positioning.differentiation && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Key Differentiation
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {positioning.differentiation}
                    </styled.p>
                  </Stack>
                )}

                {/* Competitive Advantages */}
                {positioning.competitive_advantages &&
                  positioning.competitive_advantages.length > 0 && (
                    <Stack gap={2}>
                      <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                        Competitive Advantages
                      </styled.h3>
                      <Stack gap={1}>
                        {positioning.competitive_advantages.map(
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

                {/* Price Point & Market Position */}
                <Flex gap={6}>
                  {positioning.price_point && (
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
                        {formatPrice(positioning.price_point)}
                      </styled.span>
                    </Stack>
                  )}

                  {positioning.market_position && (
                    <Stack gap={2} flex={1}>
                      <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                        Market Position
                      </styled.h3>
                      <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                        {positioning.market_position}
                      </styled.p>
                    </Stack>
                  )}
                </Flex>
              </Stack>
            )}

            {/* Visual Identity */}
            {visualIdentity && Object.keys(visualIdentity).length > 0 && (
              <Stack gap={4}>
                <styled.h2 fontSize="lg" fontWeight="semibold" color="gray.800">
                  Visual Identity
                </styled.h2>

                {/* Logo Description */}
                {visualIdentity.logo_description && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Logo Description
                    </styled.h3>
                    <styled.p fontSize="sm" color="gray.900" lineHeight="relaxed">
                      {visualIdentity.logo_description}
                    </styled.p>
                  </Stack>
                )}

                {/* Color Scheme */}
                {visualIdentity.color_scheme &&
                  visualIdentity.color_scheme.length > 0 && (
                    <Stack gap={2}>
                      <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                        Color Palette
                      </styled.h3>
                      <Flex gap={2} wrap="wrap">
                        {visualIdentity.color_scheme.map(
                          (color: string, index: number) => (
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
                          ),
                        )}
                      </Flex>
                    </Stack>
                  )}

                {/* Typography */}
                {visualIdentity.typography && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Typography
                    </styled.h3>
                    <Stack gap={2}>
                      {visualIdentity.typography.primary && (
                        <styled.div fontSize="sm" color="gray.900">
                          <styled.span fontWeight="medium">Primary: </styled.span>
                          {visualIdentity.typography.primary}
                        </styled.div>
                      )}
                      {visualIdentity.typography.secondary && (
                        <styled.div fontSize="sm" color="gray.900">
                          <styled.span fontWeight="medium">Secondary: </styled.span>
                          {visualIdentity.typography.secondary}
                        </styled.div>
                      )}
                    </Stack>
                  </Stack>
                )}

                {/* Imagery Guidelines */}
                {visualIdentity.imagery && (
                  <Stack gap={2}>
                    <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                      Imagery Style
                    </styled.h3>
                    <Stack gap={2}>
                      {visualIdentity.imagery.style && (
                        <styled.div fontSize="sm" color="gray.900">
                          <styled.span fontWeight="medium">Style: </styled.span>
                          {visualIdentity.imagery.style}
                        </styled.div>
                      )}
                      {visualIdentity.imagery.mood && (
                        <styled.div fontSize="sm" color="gray.900">
                          <styled.span fontWeight="medium">Mood: </styled.span>
                          {visualIdentity.imagery.mood}
                        </styled.div>
                      )}
                      {visualIdentity.imagery.guidelines &&
                        visualIdentity.imagery.guidelines.length > 0 && (
                          <Stack gap={1}>
                            <styled.span
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.700"
                            >
                              Guidelines:
                            </styled.span>
                            {visualIdentity.imagery.guidelines.map(
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
                {visualIdentity.design_principles &&
                  visualIdentity.design_principles.length > 0 && (
                    <Stack gap={2}>
                      <styled.h3 fontSize="sm" fontWeight="medium" color="gray.700">
                        Design Principles
                      </styled.h3>
                      <Stack gap={1}>
                        {visualIdentity.design_principles.map(
                          (principle: string, index: number) => (
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
                          ),
                        )}
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
