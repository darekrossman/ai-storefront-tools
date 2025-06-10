import type { Brand } from '@/lib/types'
import type { Brand as DBBrand } from '@/lib/supabase/database-types'

// ==============================================
// Brand Generation Types
// ==============================================

export interface BrandGenerationPhase {
  id: number
  name: string
  description: string
  completed: boolean
  data?: any
}

export interface BrandGenerationState {
  currentPhase: number
  phases: BrandGenerationPhase[]
  userData: Partial<AIBrandData>
  isComplete: boolean
  errors: string[]
}

export interface AIBrandData {
  // Phase 1: Brand Foundation
  brandFoundation: {
    name: string
    tagline: string
    concept: string
    targetAudience: string
    industry: string
  }

  // Phase 2: Market Positioning
  marketPositioning: {
    demographics: string
    positioning: string
    differentiators: string[]
    advantage: string
  }

  // Phase 3: Brand Personality
  brandPersonality: {
    voice: string
    tone: string
    values: string[]
    traits: string[]
    communicationStyle: string
  }

  // Phase 4: Visual Identity
  visualIdentity: {
    colorApproach: string
    typography: string
    visualStyle: string
    designPrinciples: string[]
  }

  // Phase 5: Complete Strategy
  completeStrategy?: {
    brandFoundation: {
      name: string
      tagline: string
      mission: string
      vision: string
    }
    targetMarket: {
      demographics: string
      psychographics: string
      painPoints: string[]
      needs: string[]
    }
    brandPersonality: {
      voice: string
      tone: string
      personality: string[]
      communicationStyle: string
      brandArchetype: string
    }
    positioning: {
      category: string
      differentiation: string
      competitiveAdvantages: string[]
      pricePoint: 'luxury' | 'premium' | 'mid-market' | 'value' | 'budget'
      marketPosition: string
    }
    visualIdentity: {
      logoDescription: string
      colorScheme: string[]
      typography: {
        primary: string
        secondary: string
      }
      imagery: {
        style: string
        mood: string
        guidelines: string[]
      }
      designPrinciples: string[]
    }
  }
}

// ==============================================
// Brand Generator Service (Stateless)
// ==============================================

export class BrandGeneratorService {
  // ==============================================
  // State Initialization
  // ==============================================

  public createInitialState(): BrandGenerationState {
    return {
      currentPhase: 1,
      phases: [
        {
          id: 1,
          name: 'Brand Foundation',
          description: 'Generate brand name options and core concepts',
          completed: false,
        },
        {
          id: 2,
          name: 'Market Positioning',
          description: 'Define target market and competitive positioning',
          completed: false,
        },
        {
          id: 3,
          name: 'Brand Personality',
          description: 'Establish brand voice, tone, and values',
          completed: false,
        },
        {
          id: 4,
          name: 'Visual Identity',
          description: 'Design visual framework and aesthetic direction',
          completed: false,
        },
        {
          id: 5,
          name: 'Strategy Synthesis',
          description: 'Compile comprehensive brand strategy',
          completed: false,
        },
      ],
      userData: {},
      isComplete: false,
      errors: [],
    }
  }

  // ==============================================
  // Phase Management
  // ==============================================

  public getCurrentPhase(state: BrandGenerationState): BrandGenerationPhase {
    const phase = state.phases.find((p) => p.id === state.currentPhase)
    if (!phase) {
      throw new Error(`Phase ${state.currentPhase} not found`)
    }
    return phase
  }

  public advancePhase(state: BrandGenerationState): {
    newState: BrandGenerationState
    canAdvance: boolean
  } {
    const newState = { ...state }

    if (newState.currentPhase < newState.phases.length) {
      // Mark current phase as completed
      const currentPhase = newState.phases.find((p) => p.id === newState.currentPhase)
      if (currentPhase) {
        currentPhase.completed = true
      }

      newState.currentPhase += 1

      // Check if all phases are complete
      if (newState.currentPhase > newState.phases.length) {
        newState.isComplete = true
        return { newState, canAdvance: false }
      }

      return { newState, canAdvance: true }
    }
    return { newState, canAdvance: false }
  }

  public getProgress(state: BrandGenerationState): {
    current: number
    total: number
    percentage: number
  } {
    const completedPhases = state.phases.filter((p) => p.completed).length
    const totalPhases = state.phases.length
    return {
      current: completedPhases,
      total: totalPhases,
      percentage: Math.round((completedPhases / totalPhases) * 100),
    }
  }

  // ==============================================
  // Data Management
  // ==============================================

  public updatePhaseData(
    state: BrandGenerationState,
    phaseId: number,
    data: any,
  ): BrandGenerationState {
    const newState = { ...state, userData: { ...state.userData } }

    // Update phase data
    const phase = newState.phases.find((p) => p.id === phaseId)
    if (phase) {
      phase.data = data
    }

    // Update userData based on phase
    switch (phaseId) {
      case 1:
        newState.userData.brandFoundation = data
        break
      case 2:
        newState.userData.marketPositioning = data
        break
      case 3:
        newState.userData.brandPersonality = data
        break
      case 4:
        newState.userData.visualIdentity = data
        break
      case 5:
        newState.userData.completeStrategy = data
        break
    }

    return newState
  }

  // ==============================================
  // Data Conversion
  // ==============================================

  public convertToDBFormat(
    state: BrandGenerationState,
    projectId: number,
  ): Omit<DBBrand, 'id' | 'created_at' | 'updated_at'> {
    const data = state.userData
    const strategy = data.completeStrategy

    if (!strategy) {
      throw new Error(
        'Brand strategy is not complete. Cannot convert to database format.',
      )
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

  // ==============================================
  // Validation
  // ==============================================

  public validatePhaseCompletion(
    state: BrandGenerationState,
    phaseId: number,
  ): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    switch (phaseId) {
      case 1:
        if (!state.userData.brandFoundation?.name) {
          errors.push('Brand name is required')
        }
        if (!state.userData.brandFoundation?.tagline) {
          errors.push('Brand tagline is required')
        }
        break

      case 2:
        if (!state.userData.marketPositioning?.demographics) {
          errors.push('Target demographics are required')
        }
        if (!state.userData.marketPositioning?.positioning) {
          errors.push('Market positioning is required')
        }
        break

      case 3:
        if (!state.userData.brandPersonality?.voice) {
          errors.push('Brand voice is required')
        }
        if (!state.userData.brandPersonality?.values?.length) {
          errors.push('Brand values are required')
        }
        break

      case 4:
        if (!state.userData.visualIdentity?.colorApproach) {
          errors.push('Color approach is required')
        }
        if (!state.userData.visualIdentity?.typography) {
          errors.push('Typography direction is required')
        }
        break

      case 5:
        if (!state.userData.completeStrategy) {
          errors.push('Complete strategy is required')
        }
        break
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  // ==============================================
  // Error Handling
  // ==============================================

  public addError(state: BrandGenerationState, error: string): BrandGenerationState {
    return {
      ...state,
      errors: [...state.errors, error],
    }
  }

  public clearErrors(state: BrandGenerationState): BrandGenerationState {
    return {
      ...state,
      errors: [],
    }
  }

  public hasErrors(state: BrandGenerationState): boolean {
    return state.errors.length > 0
  }

  // ==============================================
  // Reset and Recovery
  // ==============================================

  public resetFromPhase(
    state: BrandGenerationState,
    phaseId: number,
  ): BrandGenerationState {
    const newState = { ...state, userData: { ...state.userData } }

    // Reset all phases from the specified phase onwards
    for (let i = phaseId; i <= newState.phases.length; i++) {
      const phase = newState.phases.find((p) => p.id === i)
      if (phase) {
        phase.completed = false
        phase.data = undefined
      }
    }

    // Clear corresponding user data
    if (phaseId <= 1) newState.userData.brandFoundation = undefined
    if (phaseId <= 2) newState.userData.marketPositioning = undefined
    if (phaseId <= 3) newState.userData.brandPersonality = undefined
    if (phaseId <= 4) newState.userData.visualIdentity = undefined
    if (phaseId <= 5) newState.userData.completeStrategy = undefined

    // Set current phase
    newState.currentPhase = phaseId
    newState.isComplete = false
    newState.errors = []

    return newState
  }
}
