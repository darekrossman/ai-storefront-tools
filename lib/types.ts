// ==============================================
// Core Data Models for Storefront Tools
// ==============================================
// These interfaces define the complete data structure
// for all AI agents and their generated content

// Base types
export type AgentType = 'brand' | 'product' | 'image' | 'marketing' | 'export'
export type ExportFormat = 'shopify-csv' | 'json' | 'xml'
export type ImageGenerationStatus = 'pending' | 'generating' | 'completed' | 'failed'
export type SessionStatus = 'active' | 'completed' | 'archived'

// ==============================================
// SESSION & PROJECT MANAGEMENT
// ==============================================

export interface Session {
  id: string
  name: string
  description?: string
  status: SessionStatus
  createdAt: string
  updatedAt: string
  completedSteps: AgentType[]
  metadata: {
    totalProducts: number
    totalImages: number
    lastActiveAgent: AgentType | null
    estimatedCompletionTime?: number
  }
}

export interface ProjectData {
  session: Session
  brand?: Brand
  products?: Product[]
  images?: ProductImage[]
  designSystem?: DesignSystem
  exports?: ExportConfig[]
}

// ==============================================
// BRAND IDENTITY DATA MODEL
// ==============================================

export interface Brand {
  id: string
  sessionId: string

  // Core Brand Identity
  name: string
  tagline: string
  mission: string
  vision: string
  values: string[]

  // Target Market
  targetMarket: {
    demographics: {
      ageRange: string
      income: string
      education: string
      location: string
    }
    psychographics: {
      lifestyle: string
      interests: string[]
      values: string[]
      personalityTraits: string[]
    }
    painPoints: string[]
    needs: string[]
  }

  // Brand Voice & Personality
  brandPersonality: {
    voice: string
    tone: string
    personality: string[]
    communicationStyle: string
    brandArchetype: string
  }

  // Competitive Positioning
  positioning: {
    category: string
    differentiation: string
    competitiveAdvantages: string[]
    pricePoint: 'luxury' | 'premium' | 'mid-market' | 'value' | 'budget'
    marketPosition: string
  }

  // Visual Identity Guidelines
  visualIdentity: {
    logoDescription: string
    colorScheme: string[]
    typography: {
      primary: string
      secondary: string
      accent?: string
    }
    imagery: {
      style: string
      mood: string
      guidelines: string[]
    }
    designPrinciples: string[]
  }

  // Metadata
  createdAt: string
  updatedAt: string
  version: number
}

// ==============================================
// PRODUCT CATALOG DATA MODEL
// ==============================================

export interface Product {
  id: string
  sessionId: string
  brandId: string

  // Core Product Information
  name: string
  description: string
  shortDescription: string
  category: string
  subcategory?: string
  tags: string[]

  // Product Details
  specifications: {
    dimensions?: {
      length?: number
      width?: number
      height?: number
      weight?: number
      unit: 'in' | 'cm' | 'ft' | 'm'
    }
    materials: string[]
    colors: string[]
    sizes?: string[]
    features: string[]
    technicalSpecs?: Record<string, string>
  }

  // Pricing & Availability
  pricing: {
    basePrice: number
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
    compareAtPrice?: number
    costPrice?: number
    margin?: number
    priceVariants?: Array<{
      name: string
      price: number
      sku?: string
    }>
  }

  // Inventory & SKU
  inventory: {
    sku: string
    barcode?: string
    inventoryTracked: boolean
    stockQuantity?: number
    lowStockThreshold?: number
    variants?: Array<{
      name: string
      sku: string
      price?: number
      stockQuantity?: number
    }>
  }

  // Marketing & SEO
  marketing: {
    metaTitle: string
    metaDescription: string
    searchKeywords: string[]
    marketingCopy: {
      headline: string
      bulletPoints: string[]
      callToAction: string
      benefits: string[]
      useCases: string[]
    }
  }

  // Product Relations
  relations: {
    relatedProducts?: string[]
    crossSells?: string[]
    upSells?: string[]
    bundleProducts?: string[]
    collections?: string[]
  }

  // Metadata
  status: 'draft' | 'active' | 'archived'
  imageIds: string[]
  createdAt: string
  updatedAt: string
  version: number
}

export interface ProductCatalog {
  sessionId: string
  brandId: string
  products: Product[]
  categories: ProductCategory[]
  collections: ProductCollection[]
  totalProducts: number
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: string
  name: string
  description: string
  parentId?: string
  slug: string
  sortOrder: number
  isActive: boolean
  seoData: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}

export interface ProductCollection {
  id: string
  name: string
  description: string
  slug: string
  rules?: {
    type: 'manual' | 'automatic'
    conditions?: Array<{
      field: string
      operator: string
      value: string
    }>
  }
  productIds: string[]
  isActive: boolean
  sortOrder: number
}

// ==============================================
// IMAGE GENERATION DATA MODEL
// ==============================================

export interface ProductImage {
  id: string
  sessionId: string
  productId: string

  // Image Details
  filename: string
  originalFilename: string
  url: string
  thumbnailUrl?: string

  // Image Properties
  properties: {
    width: number
    height: number
    fileSize: number
    format: 'jpg' | 'png' | 'webp' | 'svg'
    aspectRatio: string
    dpi?: number
  }

  // AI Generation Data
  generation: {
    prompt: string
    model: 'gpt-image-1'
    parameters: {
      style?: string
      mood?: string
      lighting?: string
      angle?: string
      background?: string
      quality?: 'standard' | 'hd'
    }
    revisedPrompt?: string
    generationTime?: number
    tokensUsed?: number
  }

  // Image Metadata
  metadata: {
    alt: string
    caption?: string
    purpose: 'hero' | 'gallery' | 'thumbnail' | 'lifestyle' | 'detail' | 'variant'
    tags: string[]
    isApproved: boolean
    approvedAt?: string
    approvedBy?: string
    rejectionReason?: string
  }

  // Processing Status
  status: ImageGenerationStatus
  errorMessage?: string
  retryCount: number

  // Metadata
  createdAt: string
  updatedAt: string
}

export interface ImageGenerationRequest {
  productId: string
  purpose: ProductImage['metadata']['purpose']
  count: number
  style?: string
  parameters?: ProductImage['generation']['parameters']
  customPrompt?: string
}

export interface ImageGenerationBatch {
  id: string
  sessionId: string
  requests: ImageGenerationRequest[]
  status: 'pending' | 'processing' | 'completed' | 'failed'
  completedCount: number
  totalCount: number
  results: ProductImage[]
  createdAt: string
  completedAt?: string
}

// ==============================================
// DESIGN SYSTEM DATA MODEL
// ==============================================

export interface DesignSystem {
  id: string
  sessionId: string
  brandId: string

  // Color System
  colors: {
    primary: ColorPalette
    secondary: ColorPalette
    accent: ColorPalette
    neutral: ColorPalette
    semantic: {
      success: ColorPalette
      warning: ColorPalette
      error: ColorPalette
      info: ColorPalette
    }
    gradients?: Array<{
      name: string
      stops: Array<{
        color: string
        position: number
      }>
      direction: number
    }>
  }

  // Typography System
  typography: {
    fontFamilies: {
      primary: FontFamily
      secondary: FontFamily
      accent?: FontFamily
      monospace?: FontFamily
    }
    typeScale: {
      h1: TypographyStyle
      h2: TypographyStyle
      h3: TypographyStyle
      h4: TypographyStyle
      h5: TypographyStyle
      h6: TypographyStyle
      body: TypographyStyle
      bodyLarge: TypographyStyle
      caption: TypographyStyle
      overline: TypographyStyle
    }
    fontWeights: Record<string, number>
    lineHeights: Record<string, number>
  }

  // Spacing System
  spacing: {
    scale: Record<string, number>
    components: {
      containerPadding: number
      sectionSpacing: number
      componentGap: number
    }
  }

  // Layout System
  layout: {
    breakpoints: Record<string, number>
    containers: Record<string, number>
    grid: {
      columns: number
      gap: number
      margins: Record<string, number>
    }
  }

  // Component Styles
  components: {
    buttons: ComponentStyle[]
    inputs: ComponentStyle[]
    cards: ComponentStyle[]
    navigation: ComponentStyle[]
    badges: ComponentStyle[]
  }

  // Brand Assets
  assets: {
    logos: Array<{
      name: string
      url: string
      usage: string
      variants: string[]
    }>
    patterns: Array<{
      name: string
      url: string
      usage: string
    }>
    icons: Array<{
      name: string
      url: string
      category: string
    }>
  }

  // Usage Guidelines
  guidelines: {
    principles: string[]
    doAndDonts: Array<{
      category: string
      dos: string[]
      donts: string[]
    }>
    accessibility: {
      colorContrast: number
      minimumTextSize: number
      focusIndicators: boolean
      keyboardNavigation: boolean
    }
  }

  // Metadata
  createdAt: string
  updatedAt: string
  version: number
}

export interface ColorPalette {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export interface FontFamily {
  name: string
  fallbacks: string[]
  source: 'google' | 'adobe' | 'custom' | 'system'
  variants: Array<{
    weight: number
    style: 'normal' | 'italic'
  }>
  previewText: string
}

export interface TypographyStyle {
  fontSize: number
  lineHeight: number
  fontWeight: number
  letterSpacing?: number
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
}

export interface ComponentStyle {
  name: string
  variants: Array<{
    name: string
    description: string
    styles: Record<string, any>
    usage: string[]
  }>
  states: Array<{
    name: string
    styles: Record<string, any>
  }>
}

// ==============================================
// EXPORT & INTEGRATION DATA MODEL
// ==============================================

export interface ExportConfig {
  id: string
  sessionId: string

  // Export Settings
  format: ExportFormat
  platform: {
    name: string
    version?: string
    requirements?: Record<string, any>
  }

  // Data Selection
  dataSelection: {
    includeBrand: boolean
    includeProducts: boolean
    includeImages: boolean
    includeDesignSystem: boolean
    productFilters?: {
      categories?: string[]
      tags?: string[]
      priceRange?: {
        min: number
        max: number
      }
      status?: string[]
    }
  }

  // Field Mapping
  fieldMapping?: Record<string, string>
  customFields?: Array<{
    name: string
    value: string
    type: 'static' | 'dynamic'
  }>

  // Output Settings
  outputSettings: {
    filename: string
    compression?: boolean
    encoding?: 'utf-8' | 'ascii' | 'latin1'
    delimiter?: string
    includeHeaders?: boolean
    imageHandling?: 'urls' | 'base64' | 'separate'
  }

  // Export Status
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  errorMessage?: string
  downloadUrl?: string
  fileSize?: number

  // Metadata
  createdAt: string
  completedAt?: string
  downloadCount: number
}

export interface ExportResult {
  config: ExportConfig
  files: Array<{
    name: string
    url: string
    size: number
    type: string
  }>
  summary: {
    totalRecords: number
    exportedRecords: number
    skippedRecords: number
    errors: Array<{
      record: string
      error: string
    }>
  }
}

// ==============================================
// AI INTEGRATION TYPES
// ==============================================

// AI SDK UI Hook Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface AIStreamingState {
  isLoading: boolean
  error?: Error
  messages?: ChatMessage[]
  object?: any
  completion?: string
}

export interface AgentContext {
  sessionId: string
  agentType: AgentType
  previousData?: Partial<ProjectData>
  userPreferences?: Record<string, any>
}

// ==============================================
// API RESPONSE TYPES
// ==============================================

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasMore: boolean
  }
}

// ==============================================
// UTILITY TYPES
// ==============================================

export type Partial<T> = {
  [P in keyof T]?: T[P]
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Brand creation helper type
export type BrandCreationData = OptionalFields<
  Brand,
  'id' | 'sessionId' | 'createdAt' | 'updatedAt' | 'version'
>

// Product creation helper type
export type ProductCreationData = OptionalFields<
  Product,
  'id' | 'sessionId' | 'createdAt' | 'updatedAt' | 'version' | 'imageIds'
>

// Export helper types
export type ExportableData = Pick<
  ProjectData,
  'brand' | 'products' | 'images' | 'designSystem'
>
