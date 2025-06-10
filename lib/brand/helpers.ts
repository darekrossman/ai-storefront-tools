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
    values: strategy.brandPersonality.personality,
    target_market: {
      demographics: strategy.targetMarket.demographics,
      psychographics: strategy.targetMarket.psychographics,
      pain_points: strategy.targetMarket.painPoints,
      needs: strategy.targetMarket.needs,
    },
    brand_personality: {
      voice: strategy.brandPersonality.voice,
      tone: strategy.brandPersonality.tone,
      personality: strategy.brandPersonality.personality,
      communication_style: strategy.brandPersonality.communicationStyle,
      brand_archetype: strategy.brandPersonality.brandArchetype,
    },
    positioning: {
      category: strategy.positioning.category,
      differentiation: strategy.positioning.differentiation,
      competitive_advantages: strategy.positioning.competitiveAdvantages,
      price_point: strategy.positioning.pricePoint,
      market_position: strategy.positioning.marketPosition,
    },
    visual_identity: {
      logo_description: strategy.visualIdentity.logoDescription,
      color_scheme: strategy.visualIdentity.colorScheme,
      typography: strategy.visualIdentity.typography,
      imagery: strategy.visualIdentity.imagery,
      design_principles: strategy.visualIdentity.designPrinciples,
    },
    status: 'draft' as const,
  }
}
