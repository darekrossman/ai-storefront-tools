# Core Foundation Infrastructure

This directory contains the essential foundation infrastructure for the Storefront Tools project. All other components depend on these core utilities and data models.

## Files Overview

### 📋 `types.ts` - TypeScript Interfaces
Complete TypeScript interface definitions for all data models:

- **Session Management**: `Session`, `ProjectData`
- **Brand Identity**: `Brand`, `BrandTargetMarket`, `BrandPersonality`
- **Product Catalog**: `Product`, `ProductCatalog`, `ProductCategory`
- **Image Generation**: `ProductImage`, `ImageGenerationRequest`, `ImageGenerationBatch`
- **Design System**: `DesignSystem`, `ColorPalette`, `FontFamily`, `TypographyStyle`
- **Export System**: `ExportConfig`, `ExportResult`
- **AI Integration**: `ChatMessage`, `AIStreamingState`, `AgentContext`
- **API Responses**: `APIResponse`, `PaginatedResponse`

### 🔍 `schemas.ts` - Zod Validation Schemas
Zod schemas for AI SDK UI hooks and data validation:

- **BrandSchema** - For `useObject` hook in Brand Inventor Agent
- **ProductCatalogSchema** - For `useObject` hook in Product Designer Agent  
- **MarketingSystemSchema** - For `useObject` hook in Marketing Designer Agent
- **ExportConfigSchema** - For export configuration validation
- **Validation Helpers** - Safe parsing functions and partial schemas

### 💾 `storage.ts` - Session-Based File Storage
Comprehensive file storage system with session isolation:

- **StorageManager Class** - Main storage interface
- **Session Management** - Create, load, update, delete sessions
- **Data Persistence** - Type-safe JSON file operations
- **Asset Management** - Image and export file handling
- **Error Handling** - Robust error handling with custom `StorageError`
- **Utility Functions** - File size formatting, validation, cleanup

### 🛠️ `utils.ts` - Common Utilities
Shared utility functions used throughout the application:

- **Styling Utilities** - CSS class combination, color generation
- **String Utilities** - Case conversion, slug generation, truncation
- **Validation Utilities** - Email, URL, price, SKU validation
- **Data Transformation** - Deep cloning, array manipulation, sorting
- **Formatting Utilities** - Price, date, number, file size formatting
- **Agent Utilities** - Agent names, descriptions, colors, completion tracking
- **ID Generation** - Unique IDs, SKUs, export filenames
- **Error Handling** - Standardized error handling and API responses

### ⚙️ `constants.ts` - Application Constants
Centralized configuration and constants:

- **AI Agents** - Complete agent configurations with APIs, hooks, schemas
- **Export Platforms** - Platform-specific configurations for Shopify, WooCommerce, etc.
- **UI Configuration** - Navigation, layout, animations, breakpoints
- **Business Rules** - Validation constraints and limits
- **API Configuration** - Rate limits, timeouts, retry settings
- **Error Messages** - Standardized error and success messages
- **Default Values** - Default configurations for all components

## Directory Structure Created

```
data/
├── sessions/          # Session-based data storage
├── templates/         # Template files for AI agents
├── temp/             # Temporary processing files
└── backups/          # Session backups

public/
└── generated-assets/ # Generated images and export files
```

## Usage Examples

### Creating a Storage Manager
```typescript
import { createStorageManager } from '@/lib/storage'

const storage = createStorageManager() // Auto-generates session ID
// or
const storage = createStorageManager('existing-session-id')
```

### Using Zod Schemas with AI SDK UI
```typescript
import { useObject } from '@ai-sdk/react'
import { BrandSchema } from '@/lib/schemas'

const { object, submit, isLoading } = useObject({
  api: '/api/agents/brand',
  schema: BrandSchema
})
```

### Using Utility Functions
```typescript
import { formatPrice, generateSKU, getAgentColor } from '@/lib/utils'

const price = formatPrice(29.99, 'USD') // "$29.99"
const sku = generateSKU('Cool T-Shirt', 'BRAND') // "BRA-COO-T5F"
const color = getAgentColor('brand') // "purple.600"
```

### Using Constants
```typescript
import { AI_AGENTS, BUSINESS_RULES } from '@/lib/constants'

const brandAgent = AI_AGENTS.brand
const maxProducts = BUSINESS_RULES.products.maxProductsPerCatalog
```

## Key Features

### ✅ Type Safety
- Complete TypeScript coverage
- Strict typing for all data models
- AI SDK UI compatible schemas

### ✅ Session-Based Storage
- Isolated data storage per session
- Atomic file operations
- Comprehensive error handling

### ✅ AI SDK UI Integration
- Schemas optimized for `useObject`, `useChat`, `useCompletion`
- Real-time streaming support
- Progressive object building

### ✅ Robust Error Handling
- Custom error classes
- Standardized error messages
- Retry mechanisms with exponential backoff

### ✅ Performance Optimized
- Efficient file operations
- Proper memory management
- Optimized data structures

## Next Steps

With this foundation in place, you can now:

1. **Create AI Agent API Routes** - Build `/api/agents/*` endpoints using the schemas
2. **Build Component Library** - Create React components using the types and utilities
3. **Implement Agent Interfaces** - Build AI chat and object generation interfaces
4. **Add Storage Integration** - Connect components to the storage system
5. **Create Export Functionality** - Build export generation using the constants and schemas

All components built on top of this foundation will automatically have:
- Type safety through shared interfaces
- Consistent data validation through Zod schemas  
- Reliable data persistence through the storage system
- Standardized utilities and configurations 