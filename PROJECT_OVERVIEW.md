# Storefront Tools - Project Overview

A comprehensive AI-powered platform for generating and managing e-commerce product catalogs, brand identities, and marketing assets.

## 🎯 Project Purpose

Storefront Tools is designed to help businesses create complete e-commerce storefronts through AI-powered generation of:
- **Brand Identity**: Mission, vision, values, target market analysis, visual identity
- **Product Catalogs**: Detailed product specifications, pricing, marketing copy
- **Product Variants**: SKU-level management with attributes, pricing, and inventory
- **Product Images**: AI-generated product photography with attribute-based filtering
- **Design Systems**: Complete marketing and branding guidelines
- **Export Capabilities**: Multi-platform export (Shopify, WooCommerce, Magento, etc.)

## 🏗️ Architecture Overview

### Technology Stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Database**: Supabase (PostgreSQL with RLS)
- **Storage**: Supabase Storage (File upload and management)
- **Authentication**: Supabase Auth
- **Styling**: Panda CSS
- **Type Safety**: TypeScript with auto-generated database types
- **Validation**: Database constraints and custom validation logic
- **Package Manager**: pnpm
- **Linting**: Biome

### Core Architecture Principles

1. **Type Safety First**: All database operations use auto-generated types
2. **Security by Design**: Row Level Security (RLS) on all tables
3. **Server-Side Validation**: All operations validated on server
4. **Atomic Operations**: Database integrity through proper relationships
5. **Scalable Structure**: Organized by projects → brands → catalogs → products → variants

### ⚠️ Important Development Notes

- **`lib/schemas.ts` is EXCLUDED**: This file contains legacy Zod schemas kept for reference only. Do not use or reference these schemas in active development. The project has moved to database-generated types and custom validation approaches.
- **Actions Location**: All server actions are located in the root `actions/` directory, not in `app/actions/` (which is deprecated).

## 📊 Database Schema

### Entity Relationships

```
User (Supabase Auth)
├── Profile (user details, avatar)
└── Projects (user's projects)
    └── Brands (brand identity per project)
        └── Product Catalogs (organized product collections)
            ├── Categories (catalog-specific categorization)
            └── Products (master products with metadata)
                ├── Product Variants (SKUs, prices, inventory)
                ├── Product Attributes (attribute definitions & options)
                └── Product Images (photos with filtering)
```

### Key Tables

#### Core Entity Tables
- **`profiles`**: User profile information and avatars
- **`projects`**: Top-level organization unit for users
- **`brands`**: Brand identity and guidelines per project
- **`product_catalogs`**: Product collections within brands
- **`categories`**: Hierarchical categorization system (catalog-scoped)

#### Product System Tables
- **`products`**: Master products with metadata, descriptions, and shared attributes
- **`product_variants`**: Individual SKUs with specific pricing, inventory, and attribute combinations
- **`product_attributes`**: Attribute definitions (color, size, material) with available options
- **`product_images`**: Product photography with type classification and attribute-based filtering

### Product Data Model

The new product system uses a **master product with variants** approach:

#### Master Products (`products`)
- Contains shared information (name, description, category)
- Defines available attributes through `product_attributes`
- Houses marketing metadata (SEO, tags)
- Calculated fields: `min_price`, `max_price`, `total_inventory`

#### Product Variants (`product_variants`)
- Each variant represents a purchasable SKU
- Contains specific attribute combinations (e.g., "Red, Large")
- Individual pricing, inventory, and orderability
- Linked to master product via `product_id`

#### Product Attributes (`product_attributes`)
- Defines available attributes for a product (color, size, material)
- Each attribute has multiple options (Red, Blue, Green)
- Controls variant generation and validation
- Supports required vs optional attributes

#### Product Images (`product_images`)
- Organized by type (hero, gallery, thumbnail, lifestyle, detail)
- Supports attribute-based filtering (show only red product images)
- Automatic path generation for storage organization

### JSONB Structure

Products use JSONB columns for flexible data storage:
- **Products**: `attributes` (default values), `meta_title`, `meta_description`, `tags`
- **Product Variants**: `attributes` (specific combination like `{"color": "red", "size": "large"}`)
- **Product Attributes**: `options` (available choices like `[{"id": "red", "label": "Red"}]`)
- **Product Images**: `attribute_filters` (show image only for specific attributes)

## 🔐 Security Implementation

### Row Level Security (RLS)

All tables implement RLS policies ensuring users can only access their own data through ownership chains:

```sql
-- Example: Users can only view their own products through project ownership
CREATE POLICY "Users can view their own products"
  ON products FOR SELECT
  USING (
    catalog_id IN (
      SELECT pc.id FROM product_catalogs pc
      JOIN brands b ON b.id = pc.brand_id
      JOIN projects p ON p.id = b.project_id
      WHERE p.user_id = auth.uid()
    )
  );
```

### Ownership Chain Security

The security model follows strict ownership chains:
- **Users** own **Projects**
- **Projects** own **Brands** 
- **Brands** own **Product Catalogs**
- **Product Catalogs** own **Categories** and **Products**
- **Products** own **Product Variants**, **Product Attributes**, and **Product Images**

### Storage Security

- **Avatar Storage**: Users can only upload/modify their own avatars
- **Product Images**: Project-based access control via ownership chain
- **File Validation**: Server-side type and size validation
- **Automatic Cleanup**: Old files automatically removed

## 📁 File Structure

```
storefront-tools/
├── app/                          # Next.js app directory
│   ├── account/                  # User account management
│   ├── auth/                     # Authentication pages
│   └── api/                      # API routes for AI agents
├── actions/                      # Server actions (current location)
│   ├── account.ts               # Profile management
│   ├── projects.ts              # Project CRUD
│   ├── brands.ts                # Brand CRUD
│   ├── categories.ts            # Category CRUD (catalog-scoped)
│   ├── products.ts              # Master product CRUD
│   ├── product-catalogs.ts      # Catalog CRUD
│   ├── product-variants.ts      # Product variant CRUD
│   ├── product-attributes.ts    # Product attribute CRUD
│   ├── storage.ts               # File upload/management
│   └── index.ts                 # Action exports
├── components/                   # React components
│   └── account/                 # Account-related components
├── lib/                         # Core utilities and types
│   ├── supabase/                # Supabase configuration
│   │   ├── types.ts            # Auto-generated database types
│   │   ├── database-types.ts   # Convenience type exports
│   │   ├── server.ts           # Server client
│   │   └── session.ts          # Session management
│   ├── schemas.ts              # Legacy Zod schemas (reference only - EXCLUDED from active development)
│   ├── types.ts                # Manual types (AI agents, etc.)
│   ├── constants.ts            # Business rules and constants
│   ├── utils.ts                # Utility functions
│   └── supabase-storage.ts     # Supabase Storage utilities
├── supabase/                    # Database configuration
│   ├── migrations/              # Database migrations
│   └── schemas/                 # Declarative schema files
├── docs/                        # Documentation
│   ├── SUPABASE_TYPES.md       # Type generation guide
│   └── SUPABASE_STORAGE.md     # Storage implementation guide
└── scripts/                     # Utility scripts
    └── generate-types.sh       # Type generation script
```

## 🔄 Type Generation System

### Auto-Generated Types

The project uses Supabase CLI to generate TypeScript types from the database schema:

```bash
# Generate types from local database
pnpm generate:types

# Generate types from remote database  
pnpm generate:types:remote
```

### Product System Types

The type system includes all product-related entities:

```typescript
// Generated base types
export type Product = Tables<'products'>
export type ProductVariant = Tables<'product_variants'>
export type ProductAttribute = Tables<'product_attributes'>
export type ProductImage = Tables<'product_images'>

// Insert/Update types for operations
export type ProductInsert = TablesInsert<'products'>
export type ProductVariantInsert = TablesInsert<'product_variants'>
export type ProductAttributeInsert = TablesInsert<'product_attributes'>
export type ProductImageInsert = TablesInsert<'product_images'>
```

### Type Integration

- **Database Operations**: All queries use generated types
- **Server Actions**: Use generated Insert/Update types  
- **Convenience Exports**: `lib/supabase/database-types.ts` provides easy imports
- **Schema Sync**: Types automatically reflect database changes
- **Product Relations**: Types support complex product queries with joins

### Generated Type Usage

```typescript
import type { 
  Product, 
  ProductInsert, 
  ProductVariant,
  ProductAttribute 
} from '@/lib/supabase/database-types'

export type CreateProductData = Omit<ProductInsert, 'id' | 'created_at' | 'updated_at' | 'min_price' | 'max_price' | 'total_inventory'>
```

## 🗄️ Storage System

### Bucket Organization

- **`avatars`**: User profile pictures (`{user_id}/avatar.{ext}`)
- **`product-images`**: Product photos (`{project_id}/products/{product_id}/{type}_{timestamp}_{name}.{ext}`)

### File Constraints

- **Avatars**: 5MB max, 1024x1024px, JPEG/PNG/WebP
- **Product Images**: 10MB max, 2048x2048px, JPEG/PNG/WebP

### Product Image Organization

Product images support comprehensive organization:
- **`hero`** - Main product image (primary showcase)
- **`gallery`** - Additional product photos  
- **`thumbnail`** - Preview images for listings
- **`lifestyle`** - Context/lifestyle images
- **`detail`** - Close-up detail shots
- **`variant`** - Attribute-specific images (color variants, etc.)

### Attribute-Based Image Filtering

Images can be filtered by product attributes:
```typescript
{
  "url": "path/to/red-shirt-hero.jpg",
  "type": "hero", 
  "attribute_filters": {"color": "red"}, // Only show for red variants
  "sort_order": 1
}
```

## 🛠️ Development Workflow

### Product System Development

1. **Master Product**: Create the base product with metadata
2. **Define Attributes**: Set up available attributes (color, size, etc.)
3. **Generate Variants**: Create all possible attribute combinations
4. **Add Images**: Upload and organize product photography
5. **Set Pricing**: Configure variant-specific pricing and inventory

### Schema Changes

1. Modify schema files in `supabase/schemas/`
2. Apply changes: `supabase db reset`
3. Generate types: `pnpm generate:types`
4. Update server actions if needed
5. Commit schema changes and updated types

### Type Checking

```bash
pnpm checktypes  # Verify TypeScript compilation
pnpm lint        # Run Biome linter
```

### Database Operations

- **Migrations**: Automatic from schema files
- **RLS Policies**: Implemented for all tables including product system
- **Relationships**: Foreign keys with proper cascading deletion
- **Validation**: Server-side with database constraints and custom logic

## 🤖 AI Integration Ready

### Agent System Structure

The project includes AI agent types and interfaces:
- **Brand Agent**: Generates brand identity and guidelines
- **Product Agent**: Creates detailed product catalogs with variants
- **Attribute Agent**: Defines product attributes and generates combinations
- **Image Agent**: Generates product photography with attribute filtering
- **Marketing Agent**: Develops design systems and product copy
- **Export Agent**: Handles multi-platform exports with variant support

### Product-Specific AI Context

```typescript
export interface ProductAgentContext extends AgentContext {
  productType: string
  targetMarket: string
  brandGuidelines: BrandData
  attributeRequirements: AttributeDefinition[]
  variantPreferences: VariantPreferences
}
```

## 📋 Business Rules & Constants

### Product System Validation Rules

Defined in `lib/constants.ts`:
- Maximum products per catalog
- Maximum variants per product
- Required vs optional attributes
- Image type requirements per product
- SKU generation patterns
- Inventory management rules

### Variant Generation Rules

- **Attribute Combinations**: Automatic generation from attribute options
- **SKU Patterns**: Configurable SKU generation based on attributes
- **Pricing Logic**: Support for variant-specific pricing strategies
- **Inventory Tracking**: Per-variant inventory management

### Legacy Schemas (Reference Only)

**Note**: `lib/schemas.ts` is kept for historical reference but is **EXCLUDED from active development**. 

The project has moved beyond the original Zod schema approach and now uses:
- Database-generated types as the primary source of truth
- Server-side validation through database constraints  
- Custom validation logic developed per feature requirements
- Product-specific validation for attributes and variants

## 🔧 Server Actions

### Product System Actions

The product system includes comprehensive CRUD operations:

#### Master Products (`actions/products.ts`)
- `createProduct()` - Create master product
- `updateProduct()` - Update product metadata
- `deleteProduct()` - Delete product and all variants
- `getProductsByCatalog()` - List products with relations
- `getProductById()` - Get single product with full data
- `duplicateProduct()` - Copy product with variants and attributes

#### Product Variants (`actions/product-variants.ts`)  
- `createProductVariant()` - Create new variant
- `updateProductVariant()` - Update variant details
- `deleteProductVariant()` - Remove variant
- `getProductVariants()` - List variants for product
- `getVariantsByAttributes()` - Filter variants by attributes
- `generateSKU()` - Auto-generate SKU patterns
- `validateVariantAttributes()` - Ensure valid attribute combinations

#### Product Attributes (`actions/product-attributes.ts`)
- `createProductAttribute()` - Define new attribute
- `updateProductAttribute()` - Modify attribute definition
- `deleteProductAttribute()` - Remove attribute (with validation)
- `addAttributeOption()` - Add new attribute option
- `removeAttributeOption()` - Remove option (with variant validation)
- `generateVariantCombinations()` - Create all possible combinations

### Action Pattern

All CRUD operations follow consistent patterns:
- Authentication verification
- Ownership validation through RLS chain
- Data validation (attributes, relationships)
- Database operation with proper error handling
- Path revalidation for cache invalidation
- Comprehensive error responses

### Example Product Action

```typescript
export async function createProductVariant(data: CreateVariantData) {
  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  
  // 2. Verify ownership through product → catalog → brand → project chain
  const { data: product } = await supabase
    .from('products')
    .select(`
      id,
      product_catalogs (
        brands (
          projects (
            user_id
          )
        )
      )
    `)
    .eq('id', data.product_id)
    .single()
    
  // 3. Validate variant attributes against product attribute definitions
  const validation = await validateVariantAttributes(data.product_id, data.attributes)
  
  // 4. Perform operation
  const { data: variant, error } = await supabase
    .from('product_variants')
    .insert(data)
    .select()
    .single()
    
  // 5. Revalidate and return
  revalidatePath('/')
  return { success: true, data: variant }
}
```

## 📚 Documentation

### Available Guides

- **`docs/SUPABASE_TYPES.md`**: Complete guide to type generation system
- **`docs/SUPABASE_STORAGE.md`**: Storage implementation and usage
- **Individual schema files**: Well-documented SQL with comments
- **Product system documentation**: Comprehensive guides for product, variant, and attribute management

### Supabase Development Rules

- **`supabase-create-migration`**: Guidelines for writing Postgres migrations
- **`supabase-declarative-schema`**: For when modifying the Supabase database schema
- **`supabase-rls-policies`**: Guidelines for writing Postgres Row Level Security policies
- **`supabase-postgres-sql-styleguide`**: Guidelines for writing Postgres SQL

### Cursor Rules Integration

The project includes Cursor-specific rules for Supabase development:
- Database migration patterns and best practices
- Schema modification workflows
- RLS policy implementation guidelines
- SQL style guide for consistent database code
- Product system specific development patterns

### Code Documentation

- All server actions include comprehensive JSDoc comments
- Database schemas include detailed column descriptions
- Type definitions include usage examples
- Migration files include step-by-step explanations
- Product system includes workflow documentation

## 🎛️ Configuration

### Environment Variables

Required for Supabase integration:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_PROJECT_ID` (for remote type generation)

### Package Scripts

```json
{
  "dev": "next dev --turbopack",
  "build": "next build", 
  "checktypes": "tsc --noEmit",
  "lint": "biome check --fix --unsafe",
  "generate:types": "supabase gen types --lang=typescript --local > lib/supabase/types.ts",
  "generate:types:remote": "supabase gen types --lang=typescript --project-id $SUPABASE_PROJECT_ID > lib/supabase/types.ts"
}
```

## 🗂️ Key Design Decisions

### Product Data Model

- **Master + Variants**: Separates shared metadata from variant-specific data
- **Attribute System**: Flexible attribute definitions with validation
- **Image Organization**: Type-based organization with attribute filtering
- **SKU Management**: Automatic generation with customizable patterns
- **Inventory Tracking**: Variant-level inventory with aggregation to product level

### Schema Relationships

- **Categories → Product Catalogs**: Changed from brand-scoped to catalog-scoped for better flexibility
- **Product Hierarchy**: Master products contain variants, attributes, and images
- **Attribute Validation**: Variants must conform to defined attribute options
- **Cascading Deletion**: Proper cleanup when products or attributes are removed

### Type Safety

- **Generated Types**: Prioritize generated over manual types
- **Product Relations**: Complex queries with proper type inference
- **Server Validation**: Never trust client-side validation
- **Type Imports**: Centralized through `database-types.ts`

### Security

- **RLS Everywhere**: Every table has comprehensive RLS policies
- **Ownership Chains**: Users → Projects → Brands → Catalogs → Products → Variants/Attributes/Images
- **Attribute Validation**: Server-side validation of variant attribute combinations
- **File Security**: Project-based access for product images, user-based for avatars

## 🚀 Current Status

### Implemented Features

✅ **Database Schema**: Complete with RLS policies for all product tables  
✅ **Type Generation**: Auto-generated types for entire product system  
✅ **Server Actions**: Full CRUD for products, variants, attributes, and images  
✅ **Storage System**: Secure file upload with product image organization  
✅ **Authentication**: Supabase Auth integration  
✅ **Product System**: Master products with variants, attributes, and images  
✅ **Attribute Management**: Flexible attribute definitions with validation  
✅ **Variant Generation**: Automatic variant creation from attribute combinations  
✅ **Image Management**: Type-based organization with attribute filtering  

### Ready for Development

- **AI Agent Integration**: Schema and types ready for AI generation
- **Frontend Development**: Server actions and types available
- **File Upload**: Complete storage system with validation
- **Multi-tenant**: Proper user isolation and security
- **Product Management**: Full product lifecycle management
- **Variant Operations**: Complete variant CRUD with validation
- **Attribute System**: Flexible attribute management

### Next Steps

- Frontend UI development for product management
- AI agent implementation for product generation
- Export system development with variant support
- Image generation integration with attribute filtering
- Testing and validation of product workflows
- E-commerce platform integration

## 🔍 Usage Patterns

### Typical Product Creation Flow

1. **Create Master Product**: Define basic product information and category
2. **Define Attributes**: Set up available attributes (color, size, material, etc.)
3. **Generate Variants**: Create all possible attribute combinations automatically
4. **Set Variant Details**: Configure pricing, SKUs, and inventory per variant
5. **Upload Images**: Add product photography with attribute-based filtering
6. **Organize Content**: Arrange images by type (hero, gallery, lifestyle, etc.)

### Typical User Flow

1. **Create Project**: User creates a new project
2. **Define Brand**: AI generates or user defines brand identity
3. **Create Catalog**: Set up product catalog with categories
4. **Add Products**: Create master products with attributes
5. **Generate Variants**: Automatically create all attribute combinations
6. **Upload/Generate Images**: Add product photography with filtering
7. **Export**: Generate platform-specific exports with full variant data

### Development Flow

1. **Schema First**: Define database schema for product system
2. **Generate Types**: Auto-generate TypeScript types for all tables
3. **Server Actions**: Implement CRUD operations for products, variants, attributes
4. **Frontend**: Build UI consuming server actions with proper types
5. **Validation**: Custom validation logic and database constraints
6. **Testing**: Validate product workflows and attribute combinations

This project provides a comprehensive foundation for building a sophisticated e-commerce platform with AI-powered content generation, flexible product management, proper security, and excellent developer experience. The product system supports complex product catalogs with variants, attributes, and organized imagery while maintaining type safety throughout. 