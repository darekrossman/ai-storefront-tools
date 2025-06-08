// ==============================================
// Zod Validation Schemas for AI SDK UI
// ==============================================
// These schemas validate AI-generated structured output
// and ensure type safety across all agents

import { z } from 'zod'

// ==============================================
// BASE SCHEMAS
// ==============================================

export const AgentTypeSchema = z.enum([
  'brand',
  'product',
  'image',
  'marketing',
  'export',
])

export const ExportFormatSchema = z.enum(['shopify-csv'])

export const ImageGenerationStatusSchema = z.enum([
  'pending',
  'generating',
  'completed',
  'failed',
])

export const SessionStatusSchema = z.enum(['active', 'completed', 'archived'])

export const CurrencySchema = z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])

export const PricePointSchema = z.enum([
  'luxury',
  'premium',
  'mid-market',
  'value',
  'budget',
])

export const ImageFormatSchema = z.enum(['jpg', 'png', 'webp', 'svg'])

export const ImagePurposeSchema = z.enum([
  'hero',
  'gallery',
  'thumbnail',
  'lifestyle',
  'detail',
  'variant',
])

export const ProductStatusSchema = z.enum(['draft', 'active', 'archived'])

export const UnitSchema = z.enum(['in', 'cm', 'ft', 'm'])

// ==============================================
// BRAND IDENTITY SCHEMAS
// ==============================================

export const BrandTargetMarketSchema = z.object({
  demographics: z.object({
    ageRange: z
      .string()
      .describe('Primary age range of target customers (e.g., "25-40 years")'),
    income: z
      .string()
      .describe('Income level of target market (e.g., "$50,000-$100,000")'),
    education: z
      .string()
      .describe('Education level (e.g., "College-educated professionals")'),
    location: z
      .string()
      .describe('Geographic location (e.g., "Urban areas in North America")'),
  }),
  psychographics: z.object({
    lifestyle: z.string().describe('Lifestyle characteristics of target customers'),
    interests: z.array(z.string()).describe('Key interests and hobbies'),
    values: z.array(z.string()).describe('Core values that resonate with target market'),
    personalityTraits: z
      .array(z.string())
      .describe('Personality traits of ideal customers'),
  }),
  painPoints: z.array(z.string()).describe('Problems and challenges this brand solves'),
  needs: z.array(z.string()).describe('Unmet needs this brand addresses'),
})

export const BrandPersonalitySchema = z.object({
  voice: z.string().describe('Brand voice (e.g., "Professional yet approachable")'),
  tone: z.string().describe('Communication tone (e.g., "Confident and inspiring")'),
  personality: z
    .array(z.string())
    .describe('Brand personality traits (e.g., ["innovative", "trustworthy"])'),
  communicationStyle: z.string().describe('How the brand communicates'),
  brandArchetype: z
    .string()
    .describe('Brand archetype (e.g., "The Innovator", "The Caregiver")'),
})

export const BrandPositioningSchema = z.object({
  category: z.string().describe('Product/service category'),
  differentiation: z.string().describe('Key differentiator from competitors'),
  competitiveAdvantages: z.array(z.string()).describe('Unique competitive advantages'),
  pricePoint: PricePointSchema.describe('Pricing tier in the market'),
  marketPosition: z.string().describe('Position in the competitive landscape'),
})

export const BrandVisualIdentitySchema = z.object({
  logoDescription: z.string().describe('Detailed description of logo concept and design'),
  colorScheme: z.array(z.string()).describe('Primary brand colors with hex codes'),
  typography: z.object({
    primary: z.string().describe('Primary font family'),
    secondary: z.string().describe('Secondary font family'),
    accent: z.string().optional().describe('Accent font family (optional)'),
  }),
  imagery: z.object({
    style: z.string().describe('Visual style (e.g., "minimalist", "bold and vibrant")'),
    mood: z.string().describe('Overall mood and feeling'),
    guidelines: z.array(z.string()).describe('Image usage guidelines'),
  }),
  designPrinciples: z.array(z.string()).describe('Core design principles'),
})

// Complete Brand Schema for useObject hook
export const BrandSchema = z
  .object({
    name: z.string().describe('Brand name - should be memorable and relevant'),
    tagline: z.string().describe('Compelling tagline that captures brand essence'),
    mission: z.string().describe('Brand mission statement - why the brand exists'),
    vision: z.string().describe('Brand vision - aspirational future state'),
    values: z.array(z.string()).describe('Core brand values (3-5 key values)'),
    targetMarket: BrandTargetMarketSchema,
    brandPersonality: BrandPersonalitySchema,
    positioning: BrandPositioningSchema,
    visualIdentity: BrandVisualIdentitySchema,
  })
  .describe('Complete brand identity with all essential elements')

// ==============================================
// PRODUCT CATALOG SCHEMAS
// ==============================================

export const ProductDimensionsSchema = z
  .object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    unit: UnitSchema,
  })
  .optional()

export const ProductSpecificationsSchema = z.object({
  dimensions: ProductDimensionsSchema,
  materials: z.array(z.string()).describe('Materials used in the product'),
  colors: z.array(z.string()).describe('Available colors'),
  sizes: z.array(z.string()).optional().describe('Available sizes (if applicable)'),
  features: z.array(z.string()).describe('Key product features'),
  technicalSpecs: z
    .record(z.string())
    .optional()
    .describe('Technical specifications as key-value pairs'),
})

export const ProductPricingSchema = z.object({
  basePrice: z.number().describe('Base price of the product'),
  currency: CurrencySchema,
  compareAtPrice: z.number().optional().describe('Original price for comparison'),
  costPrice: z.number().optional().describe('Cost to produce/acquire'),
  margin: z.number().optional().describe('Profit margin percentage'),
  priceVariants: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
        sku: z.string().optional(),
      }),
    )
    .optional(),
})

export const ProductInventorySchema = z.object({
  sku: z.string().describe('Stock Keeping Unit identifier'),
  barcode: z.string().optional(),
  inventoryTracked: z.boolean().describe('Whether inventory is tracked'),
  stockQuantity: z.number().optional(),
  lowStockThreshold: z.number().optional(),
  variants: z
    .array(
      z.object({
        name: z.string(),
        sku: z.string(),
        price: z.number().optional(),
        stockQuantity: z.number().optional(),
      }),
    )
    .optional(),
})

export const ProductMarketingSchema = z.object({
  metaTitle: z.string().describe('SEO meta title'),
  metaDescription: z.string().describe('SEO meta description'),
  searchKeywords: z.array(z.string()).describe('SEO keywords'),
  marketingCopy: z.object({
    headline: z.string().describe('Compelling product headline'),
    bulletPoints: z.array(z.string()).describe('Key selling points'),
    callToAction: z.string().describe('Primary call-to-action'),
    benefits: z.array(z.string()).describe('Customer benefits'),
    useCases: z.array(z.string()).describe('Use cases and applications'),
  }),
})

export const ProductRelationsSchema = z.object({
  relatedProducts: z.array(z.string()).optional(),
  crossSells: z.array(z.string()).optional(),
  upSells: z.array(z.string()).optional(),
  bundleProducts: z.array(z.string()).optional(),
  collections: z.array(z.string()).optional(),
})

// Individual Product Schema
export const ProductSchema = z
  .object({
    name: z.string().describe('Product name - clear and descriptive'),
    description: z.string().describe('Detailed product description'),
    shortDescription: z.string().describe('Brief product summary'),
    category: z.string().describe('Primary product category'),
    subcategory: z.string().optional().describe('Product subcategory'),
    tags: z.array(z.string()).describe('Product tags for organization'),
    specifications: ProductSpecificationsSchema,
    pricing: ProductPricingSchema,
    inventory: ProductInventorySchema,
    marketing: ProductMarketingSchema,
    relations: ProductRelationsSchema,
    status: ProductStatusSchema.default('draft'),
  })
  .describe('Complete product with all specifications and marketing data')

// Product Catalog Schema for useObject hook
export const ProductCatalogSchema = z
  .object({
    products: z.array(ProductSchema).describe('Array of products in the catalog'),
    categories: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
          slug: z.string(),
        }),
      )
      .describe('Product categories'),
    totalProducts: z.number().describe('Total number of products generated'),
  })
  .describe('Complete product catalog with categories and products')

// ==============================================
// IMAGE GENERATION SCHEMAS
// ==============================================

export const ImageGenerationParametersSchema = z.object({
  style: z
    .string()
    .optional()
    .describe('Visual style (e.g., "photorealistic", "minimalist")'),
  mood: z.string().optional().describe('Mood and atmosphere'),
  lighting: z.string().optional().describe('Lighting conditions'),
  angle: z.string().optional().describe('Camera angle or perspective'),
  background: z.string().optional().describe('Background setting'),
  quality: z.enum(['standard', 'hd']).optional().default('standard'),
})

export const ImageGenerationRequestSchema = z.object({
  productId: z.string().describe('ID of the product to generate images for'),
  purpose: ImagePurposeSchema.describe('Purpose of the image'),
  count: z.number().min(1).max(10).describe('Number of images to generate'),
  style: z.string().optional(),
  parameters: ImageGenerationParametersSchema.optional(),
  customPrompt: z.string().optional().describe('Custom prompt override'),
})

// ==============================================
// DESIGN SYSTEM SCHEMAS
// ==============================================

export const ColorPaletteSchema = z
  .object({
    50: z.string().describe('Lightest shade'),
    100: z.string(),
    200: z.string(),
    300: z.string(),
    400: z.string(),
    500: z.string().describe('Base/primary color'),
    600: z.string(),
    700: z.string(),
    800: z.string(),
    900: z.string(),
    950: z.string().describe('Darkest shade'),
  })
  .describe('Complete color palette with all shades')

export const FontFamilySchema = z.object({
  name: z.string().describe('Font family name'),
  fallbacks: z.array(z.string()).describe('Fallback fonts'),
  source: z.enum(['google', 'adobe', 'custom', 'system']),
  variants: z.array(
    z.object({
      weight: z.number(),
      style: z.enum(['normal', 'italic']),
    }),
  ),
  previewText: z.string().describe('Text to preview the font'),
})

export const TypographyStyleSchema = z.object({
  fontSize: z.number().describe('Font size in pixels'),
  lineHeight: z.number().describe('Line height multiplier'),
  fontWeight: z.number().describe('Font weight (100-900)'),
  letterSpacing: z.number().optional().describe('Letter spacing in em'),
  textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
})

export const ComponentStyleSchema = z.object({
  name: z.string().describe('Component name'),
  variants: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      styles: z.record(z.any()),
      usage: z.array(z.string()),
    }),
  ),
  states: z.array(
    z.object({
      name: z.string(),
      styles: z.record(z.any()),
    }),
  ),
})

// Marketing/Design System Schema for useObject hook
export const MarketingSystemSchema = z
  .object({
    colors: z.object({
      primary: ColorPaletteSchema.describe('Primary brand color palette'),
      secondary: ColorPaletteSchema.describe('Secondary color palette'),
      accent: ColorPaletteSchema.describe('Accent color palette'),
      neutral: ColorPaletteSchema.describe('Neutral/gray color palette'),
      semantic: z
        .object({
          success: ColorPaletteSchema,
          warning: ColorPaletteSchema,
          error: ColorPaletteSchema,
          info: ColorPaletteSchema,
        })
        .describe('Semantic colors for UI states'),
    }),
    typography: z.object({
      fontFamilies: z.object({
        primary: FontFamilySchema.describe('Primary heading font'),
        secondary: FontFamilySchema.describe('Body text font'),
        accent: FontFamilySchema.optional().describe('Accent/display font'),
        monospace: FontFamilySchema.optional().describe('Code/monospace font'),
      }),
      typeScale: z.object({
        h1: TypographyStyleSchema,
        h2: TypographyStyleSchema,
        h3: TypographyStyleSchema,
        h4: TypographyStyleSchema,
        h5: TypographyStyleSchema,
        h6: TypographyStyleSchema,
        body: TypographyStyleSchema,
        bodyLarge: TypographyStyleSchema,
        caption: TypographyStyleSchema,
        overline: TypographyStyleSchema,
      }),
    }),
    spacing: z.object({
      scale: z.record(z.number()).describe('Spacing scale values'),
      components: z.object({
        containerPadding: z.number(),
        sectionSpacing: z.number(),
        componentGap: z.number(),
      }),
    }),
    components: z.object({
      buttons: z.array(ComponentStyleSchema),
      inputs: z.array(ComponentStyleSchema),
      cards: z.array(ComponentStyleSchema),
    }),
    guidelines: z.object({
      principles: z.array(z.string()).describe('Design principles'),
      accessibility: z.object({
        colorContrast: z.number().describe('Minimum color contrast ratio'),
        minimumTextSize: z.number().describe('Minimum text size in pixels'),
        focusIndicators: z.boolean(),
        keyboardNavigation: z.boolean(),
      }),
    }),
  })
  .describe('Complete design system with colors, typography, and component styles')

// ==============================================
// EXPORT CONFIGURATION SCHEMAS
// ==============================================

export const ExportDataSelectionSchema = z.object({
  includeBrand: z.boolean().describe('Include brand data in export'),
  includeProducts: z.boolean().describe('Include product catalog'),
  includeImages: z.boolean().describe('Include product images'),
  includeDesignSystem: z.boolean().describe('Include design system'),
  productFilters: z
    .object({
      categories: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      priceRange: z
        .object({
          min: z.number(),
          max: z.number(),
        })
        .optional(),
      status: z.array(z.string()).optional(),
    })
    .optional(),
})

export const ExportOutputSettingsSchema = z.object({
  filename: z.string().describe('Output filename'),
  compression: z.boolean().optional().default(false),
  encoding: z.enum(['utf-8', 'ascii', 'latin1']).optional().default('utf-8'),
  delimiter: z.string().optional().describe('CSV delimiter character'),
  includeHeaders: z.boolean().optional().default(true),
  imageHandling: z.enum(['urls', 'base64', 'separate']).optional().default('urls'),
})

// Export Configuration Schema for useObject hook
export const ExportConfigSchema = z
  .object({
    format: ExportFormatSchema.describe('Export format for the target platform'),
    platform: z.object({
      name: z.string().describe('Target platform name'),
      version: z.string().optional(),
      requirements: z.record(z.any()).optional(),
    }),
    dataSelection: ExportDataSelectionSchema,
    fieldMapping: z.record(z.string()).optional().describe('Custom field mappings'),
    customFields: z
      .array(
        z.object({
          name: z.string(),
          value: z.string(),
          type: z.enum(['static', 'dynamic']),
        }),
      )
      .optional(),
    outputSettings: ExportOutputSettingsSchema,
  })
  .describe('Complete export configuration for platform integration')

// ==============================================
// AI AGENT CONTEXT SCHEMAS
// ==============================================

export const AgentContextSchema = z.object({
  sessionId: z.string(),
  agentType: AgentTypeSchema,
  previousData: z
    .object({
      brand: BrandSchema.optional(),
      products: z.array(ProductSchema).optional(),
      designSystem: MarketingSystemSchema.partial().optional(),
    })
    .optional(),
  userPreferences: z.record(z.any()).optional(),
})

// ==============================================
// API RESPONSE SCHEMAS
// ==============================================

export const APIResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  timestamp: z.string(),
})

export const PaginatedResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
    hasMore: z.boolean(),
  }),
  error: z.string().optional(),
  timestamp: z.string(),
})

// ==============================================
// VALIDATION HELPERS
// ==============================================

export const validateBrand = (data: unknown) => BrandSchema.parse(data)
export const validateProduct = (data: unknown) => ProductSchema.parse(data)
export const validateProductCatalog = (data: unknown) => ProductCatalogSchema.parse(data)
export const validateMarketingSystem = (data: unknown) =>
  MarketingSystemSchema.parse(data)
export const validateExportConfig = (data: unknown) => ExportConfigSchema.parse(data)

// Safe parsing helpers that return results with errors
export const safeParseBrand = (data: unknown) => BrandSchema.safeParse(data)
export const safeParseProduct = (data: unknown) => ProductSchema.safeParse(data)
export const safeParseProductCatalog = (data: unknown) =>
  ProductCatalogSchema.safeParse(data)
export const safeParseMarketingSystem = (data: unknown) =>
  MarketingSystemSchema.safeParse(data)
export const safeParseExportConfig = (data: unknown) => ExportConfigSchema.safeParse(data)

// ==============================================
// PARTIAL SCHEMAS FOR PROGRESSIVE BUILDING
// ==============================================

// For AI agents to build objects progressively
export const PartialBrandSchema = BrandSchema.partial()
export const PartialProductSchema = ProductSchema.partial()
export const PartialMarketingSystemSchema = MarketingSystemSchema.partial()

// Essential fields only (for quick validation)
export const BrandEssentialsSchema = BrandSchema.pick({
  name: true,
  tagline: true,
  mission: true,
  values: true,
})

export const ProductEssentialsSchema = ProductSchema.pick({
  name: true,
  description: true,
  category: true,
  pricing: true,
})
