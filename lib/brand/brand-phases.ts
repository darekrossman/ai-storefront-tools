import type { BrandGenerationPhase, AIBrandData } from './brand-generator'

// ==============================================
// Brand Development Phase Definitions
// ==============================================

export interface PhaseDefinition {
  id: number
  name: string
  description: string
  systemPrompt: string
  expectedOutputs: string[]
  validationRules: ValidationRule[]
  nextPhaseConditions: string[]
}

export interface ValidationRule {
  field: string
  type: 'required' | 'minLength' | 'maxLength' | 'minItems' | 'maxItems'
  value?: number
  message: string
}

export interface PhaseResult {
  phaseId: number
  isValid: boolean
  errors: string[]
  data?: any
}

// ==============================================
// Phase Definitions
// ==============================================

export const BRAND_PHASES: PhaseDefinition[] = [
  {
    id: 1,
    name: 'Brand Foundation',
    description: 'Generate brand name options and core concepts',
    systemPrompt: `Focus on Phase 1: Brand Foundation. Generate exactly 3 compelling brand name options with taglines and concepts. Each option should be:
    - Memorable and distinctive
    - Appropriate for the target industry
    - Easy to pronounce and spell
    - Available for trademark (assume availability)
    - Culturally appropriate and positive

    Present 3 distinct options with different positioning approaches, then wait for user selection before proceeding.`,
    expectedOutputs: [
      'Industry context understanding',
      '3 brand name options',
      'Taglines for each option',
      'Core concept descriptions',
      'Target audience hints',
    ],
    validationRules: [
      {
        field: 'industry',
        type: 'required',
        message: 'Industry context is required',
      },
      {
        field: 'brandOptions',
        type: 'minItems',
        value: 3,
        message: 'Exactly 3 brand options are required',
      },
      {
        field: 'brandOptions',
        type: 'maxItems',
        value: 3,
        message: 'No more than 3 brand options allowed',
      },
    ],
    nextPhaseConditions: [
      'User has selected a preferred brand name',
      'Brand foundation data is complete',
      'Industry context is established',
    ],
  },
  {
    id: 2,
    name: 'Market Positioning',
    description: 'Define target market and competitive positioning',
    systemPrompt: `Focus on Phase 2: Market Positioning. Based on the selected brand name from Phase 1, generate exactly 3 positioning strategy options. Each strategy should:
    - Define clear target demographics
    - Establish market positioning approach
    - Identify key differentiators
    - Present competitive advantages
    - Be commercially viable and distinctive

    Present 3 distinct positioning strategies, then wait for user selection before proceeding.`,
    expectedOutputs: [
      'Target demographic definitions',
      'Market positioning approaches',
      'Key differentiating factors',
      'Competitive advantages',
      'Market segment focus',
    ],
    validationRules: [
      {
        field: 'selectedBrand',
        type: 'required',
        message: 'Selected brand from Phase 1 is required',
      },
      {
        field: 'positioningOptions',
        type: 'minItems',
        value: 3,
        message: 'Exactly 3 positioning options are required',
      },
      {
        field: 'positioningOptions',
        type: 'maxItems',
        value: 3,
        message: 'No more than 3 positioning options allowed',
      },
    ],
    nextPhaseConditions: [
      'User has selected a positioning strategy',
      'Target market is defined',
      'Competitive advantages are established',
    ],
  },
  {
    id: 3,
    name: 'Brand Personality',
    description: 'Establish brand voice, tone, and values',
    systemPrompt: `Focus on Phase 3: Brand Personality. Based on the selected positioning from Phase 2, generate exactly 3 brand personality directions. Each direction should:
    - Define distinct brand voice and tone
    - Establish 3 core brand values
    - Identify personality traits
    - Describe communication style
    - Align with the chosen market positioning

    Present 3 distinct personality directions, then wait for user selection before proceeding.`,
    expectedOutputs: [
      'Brand voice descriptions',
      'Brand tone characteristics',
      'Core brand values (3 each)',
      'Personality traits',
      'Communication styles',
    ],
    validationRules: [
      {
        field: 'selectedPositioning',
        type: 'required',
        message: 'Selected positioning from Phase 2 is required',
      },
      {
        field: 'personalityOptions',
        type: 'minItems',
        value: 3,
        message: 'Exactly 3 personality options are required',
      },
      {
        field: 'personalityOptions',
        type: 'maxItems',
        value: 3,
        message: 'No more than 3 personality options allowed',
      },
    ],
    nextPhaseConditions: [
      'User has selected a brand personality',
      'Brand voice and tone are defined',
      'Core values are established',
    ],
  },
  {
    id: 4,
    name: 'Visual Identity',
    description: 'Design visual framework and aesthetic direction',
    systemPrompt: `Focus on Phase 4: Visual Identity. Based on the selected personality from Phase 3, generate exactly 3 visual identity frameworks. Each framework should:
    - Define color palette approach and mood
    - Describe typography style direction
    - Establish overall visual aesthetic
    - Present design principles
    - Align with brand personality and positioning

    Present 3 distinct visual directions, then wait for user selection before proceeding.`,
    expectedOutputs: [
      'Color palette approaches',
      'Typography style directions',
      'Visual aesthetic descriptions',
      'Design principles',
      'Brand-aligned visual frameworks',
    ],
    validationRules: [
      {
        field: 'selectedPersonality',
        type: 'required',
        message: 'Selected personality from Phase 3 is required',
      },
      {
        field: 'visualOptions',
        type: 'minItems',
        value: 3,
        message: 'Exactly 3 visual identity options are required',
      },
      {
        field: 'visualOptions',
        type: 'maxItems',
        value: 3,
        message: 'No more than 3 visual identity options allowed',
      },
    ],
    nextPhaseConditions: [
      'User has selected a visual direction',
      'Color approach is defined',
      'Typography direction is established',
    ],
  },
  {
    id: 5,
    name: 'Strategy Synthesis',
    description: 'Compile comprehensive brand strategy',
    systemPrompt: `Focus on Phase 5: Strategy Synthesis. Compile all user selections from Phases 1-4 into a comprehensive brand strategy. This is the final phase that creates:
    - Complete brand foundation with mission and vision
    - Detailed target market analysis
    - Full brand personality definition
    - Comprehensive positioning strategy
    - Complete visual identity framework

    Present the unified brand strategy for final review and approval.`,
    expectedOutputs: [
      'Complete brand foundation',
      'Comprehensive target market definition',
      'Full brand personality framework',
      'Detailed positioning strategy',
      'Complete visual identity system',
    ],
    validationRules: [
      {
        field: 'selectedVisual',
        type: 'required',
        message: 'Selected visual direction from Phase 4 is required',
      },
      {
        field: 'comprehensiveStrategy',
        type: 'required',
        message: 'Comprehensive strategy is required',
      },
    ],
    nextPhaseConditions: [
      'Complete brand strategy is generated',
      'User approves the final strategy',
      'Brand is ready for database storage',
    ],
  },
]

// ==============================================
// Phase Management Utilities (Stateless)
// ==============================================

export class BrandPhaseManager {
  // Get phase definition by ID
  public static getPhase(phaseId: number): PhaseDefinition | null {
    return BRAND_PHASES.find((p) => p.id === phaseId) || null
  }

  // Get all phases
  public static getAllPhases(): PhaseDefinition[] {
    return [...BRAND_PHASES]
  }

  // Get next phase
  public static getNextPhase(currentPhaseId: number): PhaseDefinition | null {
    const nextPhaseId = currentPhaseId + 1
    return BrandPhaseManager.getPhase(nextPhaseId)
  }

  // Get previous phase
  public static getPreviousPhase(currentPhaseId: number): PhaseDefinition | null {
    const previousPhaseId = currentPhaseId - 1
    if (previousPhaseId < 1) return null
    return BrandPhaseManager.getPhase(previousPhaseId)
  }

  // Check if phase exists
  public static phaseExists(phaseId: number): boolean {
    return BRAND_PHASES.some((p) => p.id === phaseId)
  }

  // Get total number of phases
  public static getTotalPhases(): number {
    return BRAND_PHASES.length
  }

  // Check if it's the last phase
  public static isLastPhase(phaseId: number): boolean {
    return phaseId === BRAND_PHASES.length
  }

  // Check if it's the first phase
  public static isFirstPhase(phaseId: number): boolean {
    return phaseId === 1
  }
}

// ==============================================
// Phase Validation (Stateless)
// ==============================================

export class BrandPhaseValidator {
  // Validate phase completion
  public static validatePhase(phaseId: number, data: any): PhaseResult {
    const phase = BrandPhaseManager.getPhase(phaseId)
    if (!phase) {
      return {
        phaseId,
        isValid: false,
        errors: [`Phase ${phaseId} not found`],
      }
    }

    const errors: string[] = []

    // Apply validation rules
    for (const rule of phase.validationRules) {
      const fieldValue = BrandPhaseValidator.getFieldValue(data, rule.field)
      const validation = BrandPhaseValidator.applyValidationRule(fieldValue, rule)

      if (!validation.isValid) {
        errors.push(validation.message)
      }
    }

    return {
      phaseId,
      isValid: errors.length === 0,
      errors,
      data,
    }
  }

  // Validate all phases up to current
  public static validateUpToPhase(
    phaseId: number,
    brandData: Partial<AIBrandData>,
  ): PhaseResult[] {
    const results: PhaseResult[] = []

    for (let i = 1; i <= phaseId; i++) {
      const phaseData = BrandPhaseValidator.extractPhaseData(i, brandData)
      const result = BrandPhaseValidator.validatePhase(i, phaseData)
      results.push(result)
    }

    return results
  }

  // Check if brand generation is complete
  public static isBrandComplete(brandData: Partial<AIBrandData>): boolean {
    const results = BrandPhaseValidator.validateUpToPhase(5, brandData)
    return results.every((r) => r.isValid)
  }

  // Get field value from nested object
  private static getFieldValue(data: any, fieldPath: string): any {
    const paths = fieldPath.split('.')
    let value = data

    for (const path of paths) {
      if (value && typeof value === 'object') {
        value = value[path]
      } else {
        return undefined
      }
    }

    return value
  }

  // Apply individual validation rule
  private static applyValidationRule(
    value: any,
    rule: ValidationRule,
  ): { isValid: boolean; message: string } {
    switch (rule.type) {
      case 'required':
        return {
          isValid: value !== undefined && value !== null && value !== '',
          message: rule.message,
        }

      case 'minLength':
        return {
          isValid: typeof value === 'string' && value.length >= (rule.value || 0),
          message: rule.message,
        }

      case 'maxLength':
        return {
          isValid: typeof value === 'string' && value.length <= (rule.value || Infinity),
          message: rule.message,
        }

      case 'minItems':
        return {
          isValid: Array.isArray(value) && value.length >= (rule.value || 0),
          message: rule.message,
        }

      case 'maxItems':
        return {
          isValid: Array.isArray(value) && value.length <= (rule.value || Infinity),
          message: rule.message,
        }

      default:
        return {
          isValid: true,
          message: '',
        }
    }
  }

  // Extract data for specific phase
  private static extractPhaseData(phaseId: number, brandData: Partial<AIBrandData>): any {
    switch (phaseId) {
      case 1:
        return {
          industry: brandData.brandFoundation?.industry,
          brandOptions: brandData.brandFoundation ? [brandData.brandFoundation] : [],
        }

      case 2:
        return {
          selectedBrand: brandData.brandFoundation?.name,
          positioningOptions: brandData.marketPositioning
            ? [brandData.marketPositioning]
            : [],
        }

      case 3:
        return {
          selectedPositioning: brandData.marketPositioning?.positioning,
          personalityOptions: brandData.brandPersonality
            ? [brandData.brandPersonality]
            : [],
        }

      case 4:
        return {
          selectedPersonality: brandData.brandPersonality?.voice,
          visualOptions: brandData.visualIdentity ? [brandData.visualIdentity] : [],
        }

      case 5:
        return {
          selectedVisual: brandData.visualIdentity?.visualStyle,
          comprehensiveStrategy: brandData.completeStrategy,
        }

      default:
        return {}
    }
  }
}

// ==============================================
// Utility Functions
// ==============================================

// Get phase progress as percentage
export function getPhaseProgress(currentPhase: number, totalPhases: number = 5): number {
  return Math.round(((currentPhase - 1) / totalPhases) * 100)
}

// Get human-readable phase status
export function getPhaseStatus(phase: BrandGenerationPhase): string {
  if (phase.completed) {
    return 'Completed'
  }
  return 'In Progress'
}

// Get phase display name with status
export function getPhaseDisplayName(phase: BrandGenerationPhase): string {
  const status = getPhaseStatus(phase)
  return `${phase.name} (${status})`
}

// Create initial phase state
export function createInitialPhases(): BrandGenerationPhase[] {
  return BRAND_PHASES.map((phaseDef) => ({
    id: phaseDef.id,
    name: phaseDef.name,
    description: phaseDef.description,
    completed: false,
  }))
}
