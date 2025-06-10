import { z } from 'zod'

export const brandStructuredOutputSchemas = z.object({
  phase1: z
    .object({
      phase: z.literal(1),
      industry: z.string().describe('Industry/product type context'),
      brandOptions: z
        .array(
          z.object({
            name: z.string().describe('The brand name'),
            tagline: z.string().describe('Brief tagline (5-8 words)'),
            concept: z.string().describe('Core concept description (2-3 sentences)'),
            targetAudience: z.string().describe('Primary target market hint'),
          }),
        )
        .length(3)
        .describe('Exactly 3 distinct brand foundation options'),
      nextStep: z.string().describe('Instructions for user to select a brand option'),
    })
    .optional(),
  phase2: z
    .object({
      phase: z.literal(2),
      selectedBrand: z.string().describe('User-selected brand name from Phase 1'),
      positioningOptions: z
        .array(
          z.object({
            demographics: z.string().describe('Primary target demographic'),
            positioning: z.string().describe('Market positioning approach'),
            differentiators: z.array(z.string()).describe('Key differentiating factors'),
            advantage: z.string().describe('Primary competitive advantage'),
          }),
        )
        .length(3)
        .describe('Exactly 3 distinct positioning strategies'),
      nextStep: z
        .string()
        .describe('Instructions for user to select a positioning strategy'),
    })
    .optional(),
  phase3: z
    .object({
      phase: z.literal(3),
      selectedPositioning: z.string().describe('User-selected positioning from Phase 2'),
      personalityOptions: z
        .array(
          z.object({
            voice: z.string().describe('Brand voice description'),
            tone: z.string().describe('Brand tone characteristics'),
            values: z.array(z.string()).length(3).describe('3 core brand values'),
            traits: z.array(z.string()).describe('Brand personality traits'),
            communicationStyle: z.string().describe('How the brand communicates'),
          }),
        )
        .length(3)
        .describe('Exactly 3 distinct personality directions'),
      nextStep: z
        .string()
        .describe('Instructions for user to select a personality direction'),
    })
    .optional(),
  phase4: z
    .object({
      phase: z.literal(4),
      selectedPersonality: z.string().describe('User-selected personality from Phase 3'),
      visualOptions: z
        .array(
          z.object({
            colorApproach: z.string().describe('Color palette approach and mood'),
            typography: z.string().describe('Typography style direction'),
            visualStyle: z.string().describe('Overall visual aesthetic description'),
            designPrinciples: z.array(z.string()).describe('Visual design principles'),
          }),
        )
        .length(3)
        .describe('Exactly 3 distinct visual identity directions'),
      nextStep: z.string().describe('Instructions for user to select a visual direction'),
    })
    .optional(),
  phase5: z
    .object({
      phase: z.literal(5),
      selectedVisual: z.string().describe('User-selected visual direction from Phase 4'),
      comprehensiveStrategy: z.object({
        brandFoundation: z.object({
          name: z.string(),
          tagline: z.string(),
          mission: z.string().describe('Brand mission statement'),
          vision: z.string().describe('Brand vision statement'),
        }),
        targetMarket: z.object({
          demographics: z.string(),
          psychographics: z.string(),
          painPoints: z.array(z.string()),
          needs: z.array(z.string()),
        }),
        brandPersonality: z.object({
          voice: z.string(),
          tone: z.string(),
          personality: z.array(z.string()),
          communicationStyle: z.string(),
          brandArchetype: z.string(),
        }),
        positioning: z.object({
          category: z.string(),
          differentiation: z.string(),
          competitiveAdvantages: z.array(z.string()),
          pricePoint: z.enum(['luxury', 'premium', 'mid-market', 'value', 'budget']),
          marketPosition: z.string(),
        }),
        visualIdentity: z.object({
          logoDescription: z.string(),
          colorScheme: z.array(z.string()).describe('Primary color palette'),
          typography: z.object({
            primary: z.string(),
            secondary: z.string(),
          }),
          imagery: z.object({
            style: z.string(),
            mood: z.string(),
            guidelines: z.array(z.string()),
          }),
          designPrinciples: z.array(z.string()),
        }),
      }),
      isComplete: z.boolean().describe('Whether the brand strategy is complete'),
    })
    .optional(),
})
