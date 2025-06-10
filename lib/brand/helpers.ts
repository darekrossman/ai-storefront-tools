import type { Brand as DBBrand } from '@/lib/supabase/database-types'
import { brandStructuredOutputSchemas } from './schemas'
import { z } from 'zod'

export function convertToDBFormat(
  structuredOutput: z.infer<typeof brandStructuredOutputSchemas>['phase5'],
  projectId: number,
): Omit<DBBrand, 'id' | 'created_at' | 'updated_at'> {
  const strategy = structuredOutput?.comprehensiveStrategy

  if (!strategy) {
    throw new Error('Brand strategy is not complete. Cannot convert to database format.')
  }

  return {
    project_id: projectId,
    name: strategy.brandFoundation.name,
    tagline: strategy.brandFoundation.tagline,
    mission: strategy.brandFoundation.mission,
    vision: strategy.brandFoundation.vision,
    values: strategy.brandFoundation.values,

    // Target Market - Demographics (now structured)
    target_age_range: strategy.targetMarket.demographics.ageRange,
    target_income: strategy.targetMarket.demographics.income,
    target_education: strategy.targetMarket.demographics.education,
    target_location: strategy.targetMarket.demographics.location,

    // Target Market - Psychographics (now structured)
    target_lifestyle: strategy.targetMarket.psychographics.lifestyle,
    target_interests: strategy.targetMarket.psychographics.interests,
    target_values: strategy.targetMarket.psychographics.values,
    target_personality_traits: strategy.targetMarket.psychographics.personalityTraits,
    target_pain_points: strategy.targetMarket.painPoints,
    target_needs: strategy.targetMarket.needs,

    // Brand Personality (flattened)
    brand_voice: strategy.brandPersonality.voice,
    brand_tone: strategy.brandPersonality.tone,
    personality_traits: strategy.brandPersonality.personality,
    communication_style: strategy.brandPersonality.communicationStyle,
    brand_archetype: strategy.brandPersonality.brandArchetype,

    // Positioning (flattened)
    category: strategy.positioning.category,
    differentiation: strategy.positioning.differentiation,
    competitive_advantages: strategy.positioning.competitiveAdvantages,
    price_point: strategy.positioning.pricePoint,
    market_position: strategy.positioning.marketPosition,

    // Visual Identity - Basic (flattened)
    logo_description: strategy.visualIdentity.logoDescription,
    color_scheme: strategy.visualIdentity.colorScheme,
    design_principles: strategy.visualIdentity.designPrinciples,

    // Visual Identity - Typography (flattened)
    typography_primary: strategy.visualIdentity.typography.primary,
    typography_secondary: strategy.visualIdentity.typography.secondary,
    typography_accent: strategy.visualIdentity.typography.accent || null,

    // Visual Identity - Imagery (flattened)
    imagery_style: strategy.visualIdentity.imagery.style,
    imagery_mood: strategy.visualIdentity.imagery.mood,
    imagery_guidelines: strategy.visualIdentity.imagery.guidelines,

    status: 'draft' as const,
  }
}
