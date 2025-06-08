// ==============================================
// Application Constants and Configurations
// ==============================================
// Centralized constants used throughout the application
// Includes AI agent settings, UI configurations, and business logic constants

import type { AgentType, ExportFormat } from './types'

// ==============================================
// AI AGENT CONFIGURATIONS
// ==============================================

export const AI_AGENTS = {
  brand: {
    name: 'Brand Inventor',
    description:
      'Creates comprehensive brand identities with positioning, values, and visual guidelines',
    icon: 'Palette',
    color: 'purple.600',
    api: '/api/agents/brand',
    systemPrompt: `You are a world-class brand strategist and creative director who works collaboratively with users through a structured, step-by-step brand development process. Your expertise spans brand positioning, visual identity, target market analysis, and brand storytelling.

**PROCESS OVERVIEW:**
You guide users through brand development in distinct phases, presenting curated options at each step for user selection before proceeding. Always wait for user choice before moving to the next phase.

**PHASE 1: Brand Foundation**
Present 3 compelling brand name options with:
- Brand name
- Brief tagline (5-8 words)
- Core concept description (2-3 sentences)
- Target market hint

**PHASE 2: Market Positioning** (after user selects name)
Present 3 positioning strategy options:
- Primary target demographic
- Market positioning approach
- Key differentiators
- Competitive advantage

**PHASE 3: Brand Personality** (after user selects positioning)
Present 3 brand personality directions:
- Brand voice and tone
- Core brand values (3-4 key values)
- Brand personality traits
- Communication style

**PHASE 4: Visual Identity Framework** (after user selects personality)
Present 3 visual direction options:
- Color palette approach
- Typography style direction
- Visual style description
- Overall aesthetic feel

**PHASE 5: Brand Strategy Synthesis** (after user selects visual direction)
Compile comprehensive brand strategy combining all user choices.

**INTERACTION RULES:**
- Always present exactly 3 distinct options per phase
- Make each option meaningfully different from others
- Wait for explicit user selection before proceeding
- Ask clarifying questions if user input is unclear
- Be creative and commercially viable in all suggestions
- Maintain consistency with previous user choices

Start each brand project by asking about the industry/product type, then begin Phase 1 with brand name options.`,
    hooks: ['useChat', 'useObject'] as const,
    outputSchema: 'BrandSchema',
  },
  product: {
    name: 'Product Designer',
    description:
      'Generates detailed product catalogs with specifications, pricing, and marketing copy',
    icon: 'Package',
    color: 'blue.600',
    api: '/api/agents/products',
    systemPrompt: `You are an expert product developer and catalog specialist. You excel at creating detailed product specifications, competitive pricing strategies, and compelling marketing copy. Your products are well-researched, market-viable, and designed to appeal to specific target audiences.

Key Responsibilities:
- Generate comprehensive product catalogs with detailed specifications
- Create realistic pricing structures based on market research
- Develop compelling product descriptions and marketing copy
- Design product categorization and organization systems
- Establish inventory management parameters and SKU structures

Focus on creating products that align with the brand identity and target market while being commercially viable and competitively positioned.`,
    hooks: ['useObject', 'useChat'] as const,
    outputSchema: 'ProductCatalogSchema',
  },
  image: {
    name: 'Image Generator',
    description: 'Creates high-quality product images using AI image generation',
    icon: 'Camera',
    color: 'green.600',
    api: '/api/agents/images',
    systemPrompt: `You are a professional product photographer and image generation specialist. You create detailed prompts for AI image generation that produce high-quality, commercially viable product images. Your expertise includes lighting, composition, styling, and brand consistency.

Key Responsibilities:
- Generate detailed prompts for product image creation
- Ensure brand consistency across all generated images
- Create images for various purposes (hero, gallery, lifestyle, detail shots)
- Optimize images for e-commerce platforms
- Maintain consistent visual style and quality standards

Always create prompts that will result in professional, commercial-grade product photography that enhances the brand and drives sales.`,
    hooks: ['useCompletion'] as const,
    outputSchema: null,
    imageModel: 'gpt-image-1',
  },
  marketing: {
    name: 'Marketing Designer',
    description:
      'Builds complete design systems with colors, typography, and component styles',
    icon: 'Paintbrush',
    color: 'pink.600',
    api: '/api/agents/marketing',
    systemPrompt: `You are a senior design systems architect and brand designer. You create comprehensive design systems that ensure visual consistency across all brand touchpoints. Your expertise includes color theory, typography, accessibility, and scalable design frameworks.

Key Responsibilities:
- Develop complete color palettes with semantic meanings
- Create typography scales and font pairings
- Design component libraries and style guides
- Establish spacing, layout, and grid systems
- Ensure accessibility compliance and usability standards

Your design systems should be both beautiful and functional, providing clear guidelines for consistent brand expression across all mediums.`,
    hooks: ['useObject', 'useChat'] as const,
    outputSchema: 'MarketingSystemSchema',
  },
  export: {
    name: 'Catalog Generator',
    description:
      'Generates platform-ready exports for Shopify, WooCommerce, and other platforms',
    icon: 'Download',
    color: 'orange.600',
    api: '/api/agents/export',
    systemPrompt: `You are an e-commerce platform integration specialist. You excel at transforming product data into platform-specific formats for seamless import into various e-commerce systems. Your expertise includes data mapping, format conversion, and platform requirements.

Key Responsibilities:
- Generate platform-specific export configurations
- Map product data to platform field requirements
- Create optimized file formats (CSV, XML, JSON)
- Ensure data integrity and validation
- Provide import instructions and troubleshooting guidance

Focus on creating exports that integrate seamlessly with target platforms while maintaining data accuracy and completeness.`,
    hooks: ['useCompletion'] as const,
    outputSchema: 'ExportConfigSchema',
  },
} as const satisfies Record<
  AgentType,
  {
    name: string
    description: string
    icon: string
    color: string
    api: string
    systemPrompt: string
    hooks: readonly string[]
    outputSchema: string | null
    imageModel?: string
  }
>

// ==============================================
// EXPORT PLATFORM CONFIGURATIONS
// ==============================================

export const EXPORT_PLATFORMS = {
  'shopify-csv': {
    name: 'Shopify',
    description: 'Import products directly into Shopify stores',
    format: 'CSV',
    icon: 'ShoppingBag',
    color: 'green.600',
    fields: {
      required: [
        'Handle',
        'Title',
        'Body (HTML)',
        'Vendor',
        'Type',
        'Tags',
        'Published',
        'Variant Price',
        'Variant SKU',
      ],
      optional: [
        'SEO Title',
        'SEO Description',
        'Image Src',
        'Variant Weight',
        'Variant Inventory Qty',
      ],
    },
    documentation:
      'https://help.shopify.com/en/manual/products/import-export/import-products',
  },
  json: {
    name: 'Generic JSON',
    description: 'Universal JSON format for custom integrations',
    format: 'JSON',
    icon: 'Code',
    color: 'gray.600',
    fields: {
      required: ['id', 'name', 'description', 'price'],
      optional: ['category', 'tags', 'images', 'specifications'],
    },
    documentation: null,
  },
  xml: {
    name: 'Generic XML',
    description: 'Universal XML format for enterprise systems',
    format: 'XML',
    icon: 'FileText',
    color: 'gray.600',
    fields: {
      required: ['id', 'name', 'description', 'price'],
      optional: ['category', 'tags', 'images', 'specifications'],
    },
    documentation: null,
  },
} as const satisfies Record<
  ExportFormat,
  {
    name: string
    description: string
    format: string
    icon: string
    color: string
    fields: {
      required: string[]
      optional: string[]
    }
    documentation: string | null
  }
>

// ==============================================
// UI CONFIGURATION
// ==============================================

export const UI_CONFIG = {
  // Navigation
  navigation: {
    mainNavItems: [
      { name: 'Dashboard', href: '/', icon: 'Home' },
      { name: 'Brand Inventor', href: '/brand-inventor', icon: 'Palette' },
      { name: 'Product Designer', href: '/product-designer', icon: 'Package' },
      { name: 'Image Generator', href: '/image-generator', icon: 'Camera' },
      { name: 'Marketing Designer', href: '/marketing-designer', icon: 'Paintbrush' },
      { name: 'Catalog Generator', href: '/catalog-generator', icon: 'Download' },
    ],
  },

  // Layout
  layout: {
    sidebarWidth: '280px',
    headerHeight: '64px',
    maxContentWidth: '1200px',
    containerPadding: '24px',
  },

  // Animation durations (in milliseconds)
  animations: {
    fast: 150,
    normal: 250,
    slow: 350,
    pageTransition: 300,
  },

  // Breakpoints (in pixels)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const

// ==============================================
// BUSINESS LOGIC CONSTANTS
// ==============================================

export const BUSINESS_RULES = {
  // Product constraints
  products: {
    maxProductsPerCatalog: 500,
    maxImagesPerProduct: 10,
    maxTagsPerProduct: 20,
    minPriceValue: 0.01,
    maxPriceValue: 999999.99,
    skuMinLength: 3,
    skuMaxLength: 50,
  },

  // Brand constraints
  brand: {
    nameMinLength: 2,
    nameMaxLength: 50,
    taglineMaxLength: 100,
    missionMaxLength: 500,
    visionMaxLength: 500,
    maxValues: 10,
    maxPainPoints: 15,
  },

  // Image generation constraints
  images: {
    maxImagesPerRequest: 10,
    supportedFormats: ['jpg', 'png', 'webp'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    minDimensions: { width: 400, height: 400 },
    maxDimensions: { width: 2048, height: 2048 },
  },

  // Session constraints
  sessions: {
    maxSessions: 100, // Per user in Phase 1
    sessionNameMaxLength: 100,
    sessionDescriptionMaxLength: 500,
    maxSessionAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  },
} as const

// ==============================================
// API CONFIGURATION
// ==============================================

export const API_CONFIG = {
  // Rate limiting
  rateLimits: {
    brand: { requests: 10, window: 60 }, // 10 requests per minute
    product: { requests: 20, window: 60 }, // 20 requests per minute
    image: { requests: 5, window: 60 }, // 5 requests per minute
    marketing: { requests: 10, window: 60 }, // 10 requests per minute
    export: { requests: 5, window: 60 }, // 5 requests per minute
  },

  // Timeouts (in milliseconds)
  timeouts: {
    default: 30000, // 30 seconds
    imageGeneration: 120000, // 2 minutes
    export: 60000, // 1 minute
  },

  // Retry configuration
  retry: {
    maxAttempts: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
  },
} as const

// ==============================================
// VALIDATION PATTERNS
// ==============================================

export const VALIDATION_PATTERNS = {
  // Regular expressions
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    url: /^https?:\/\/.+/,
    hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    sku: /^[A-Za-z0-9_-]+$/,
    slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    sessionId: /^session-[a-z0-9]+-[a-z0-9]+$/,
  },

  // Currency codes
  currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY'],

  // Country codes
  countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'JP'],

  // Language codes
  languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'],
} as const

// ==============================================
// FILE SYSTEM CONSTANTS
// ==============================================

export const FILE_SYSTEM = {
  // Directory structure
  directories: {
    data: 'data',
    sessions: 'data/sessions',
    templates: 'data/templates',
    assets: 'public/generated-assets',
    temp: 'data/temp',
    backups: 'data/backups',
  },

  // File extensions
  extensions: {
    json: '.json',
    csv: '.csv',
    xml: '.xml',
    jpg: '.jpg',
    png: '.png',
    webp: '.webp',
  },

  // File size limits (in bytes)
  limits: {
    maxImageSize: 10 * 1024 * 1024, // 10MB
    maxExportSize: 50 * 1024 * 1024, // 50MB
    maxSessionSize: 100 * 1024 * 1024, // 100MB
  },
} as const

// ==============================================
// ERROR MESSAGES
// ==============================================

export const ERROR_MESSAGES = {
  // Generic errors
  generic: {
    unexpected: 'An unexpected error occurred. Please try again.',
    network: 'Network error. Please check your connection.',
    timeout: 'Request timed out. Please try again.',
    unauthorized: 'You are not authorized to perform this action.',
    forbidden: 'Access denied.',
    notFound: 'The requested resource was not found.',
    validation: 'Please check your input and try again.',
  },

  // Agent-specific errors
  agents: {
    brand: 'Failed to generate brand identity. Please try again.',
    product: 'Failed to generate product catalog. Please try again.',
    image: 'Failed to generate images. Please try again.',
    marketing: 'Failed to generate design system. Please try again.',
    export: 'Failed to generate export. Please try again.',
  },

  // Storage errors
  storage: {
    sessionNotFound: 'Session not found. Please create a new session.',
    saveFailed: 'Failed to save data. Please try again.',
    loadFailed: 'Failed to load data. Please try again.',
    deleteFailed: 'Failed to delete data. Please try again.',
  },

  // Validation errors
  validation: {
    required: 'This field is required.',
    email: 'Please enter a valid email address.',
    url: 'Please enter a valid URL.',
    price: 'Please enter a valid price.',
    sku: 'Please enter a valid SKU.',
    color: 'Please enter a valid hex color.',
    length: 'Input is too long.',
    range: 'Value is out of range.',
  },
} as const

// ==============================================
// SUCCESS MESSAGES
// ==============================================

export const SUCCESS_MESSAGES = {
  // Generic success
  generic: {
    saved: 'Successfully saved!',
    updated: 'Successfully updated!',
    deleted: 'Successfully deleted!',
    created: 'Successfully created!',
  },

  // Agent-specific success
  agents: {
    brand: 'Brand identity generated successfully!',
    product: 'Product catalog generated successfully!',
    image: 'Images generated successfully!',
    marketing: 'Design system generated successfully!',
    export: 'Export generated successfully!',
  },

  // Session management
  sessions: {
    created: 'New session created successfully!',
    loaded: 'Session loaded successfully!',
    updated: 'Session updated successfully!',
  },
} as const

// ==============================================
// DEFAULT VALUES
// ==============================================

export const DEFAULT_VALUES = {
  // Session defaults
  session: {
    name: 'New Project',
    description: 'AI-generated storefront catalog',
  },

  // Brand defaults
  brand: {
    currency: 'USD' as const,
    pricePoint: 'mid-market' as const,
  },

  // Product defaults
  product: {
    status: 'draft' as const,
    currency: 'USD' as const,
    inventoryTracked: true,
  },

  // Image defaults
  image: {
    format: 'jpg' as const,
    quality: 'standard' as const,
    count: 3,
  },

  // Export defaults
  export: {
    format: 'json' as const,
    compression: false,
    encoding: 'utf-8' as const,
    includeHeaders: true,
  },
} as const
