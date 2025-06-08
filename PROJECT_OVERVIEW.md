# Storefront Tools - Project Overview

A comprehensive AI-powered platform for generating and managing e-commerce product catalogs, brand identities, and marketing assets.

## 🎯 Project Purpose

Storefront Tools is designed to help businesses create complete e-commerce storefronts through AI-powered generation of:
- **Brand Identity**: Mission, vision, values, target market analysis, visual identity
- **Product Catalogs**: Detailed product specifications, pricing, marketing copy
- **Product Images**: AI-generated product photography and lifestyle images
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
- **Validation**: Zod schemas
- **Package Manager**: pnpm
- **Linting**: Biome

### Core Architecture Principles

1. **Type Safety First**: All database operations use auto-generated types
2. **Security by Design**: Row Level Security (RLS) on all tables
3. **Server-Side Validation**: All operations validated on server
4. **Atomic Operations**: Database integrity through proper relationships
5. **Scalable Structure**: Organized by projects → brands → catalogs → products

## 📊 Database Schema

### Entity Relationships

```
User (Supabase Auth)
├── Profile (user details, avatar)
└── Projects (user's projects)
    └── Brands (brand identity per project)
        └── Product Catalogs (organized product collections)
            ├── Categories (catalog-specific categorization)
            └── Products (individual products with full details)
```

### Key Tables

- **`profiles`**: User profile information and avatars
- **`projects`**: Top-level organization unit for users
- **`brands`**: Brand identity and guidelines per project
- **`product_catalogs`**: Product collections within brands
- **`categories`**: Hierarchical categorization system (catalog-scoped)
- **`products`**: Complete product information with JSONB fields

### JSONB Structure

Products use JSONB columns aligned with Zod schemas:
- `specifications`: Dimensions, materials, features
- `pricing`: Base price, variants, margins
- `inventory`: SKU, stock levels, variants
- `marketing`: SEO, copy, headlines
- `relations`: Related products, cross-sells, up-sells

## 🔐 Security Implementation

### Row Level Security (RLS)

All tables implement RLS policies ensuring users can only access their own data:

```sql
-- Example: Users can only view their own projects
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (user_id = auth.uid());
```

### Storage Security

- **Avatar Storage**: Users can only upload/modify their own avatars
- **Product Images**: Project-based access control
- **File Validation**: Server-side type and size validation
- **Automatic Cleanup**: Old files automatically removed

## 📁 File Structure

```
storefront-tools/
├── app/                          # Next.js app directory
│   ├── account/                  # User account management
│   ├── actions/                  # Server actions (DEPRECATED - moved to root)
│   ├── auth/                     # Authentication pages
│   └── api/                      # API routes for AI agents
├── actions/                      # Server actions (current location)
│   ├── account.ts               # Profile management
│   ├── projects.ts              # Project CRUD
│   ├── brands.ts                # Brand CRUD
│   ├── categories.ts            # Category CRUD (catalog-scoped)
│   ├── products.ts              # Product CRUD
│   ├── product-catalogs.ts      # Catalog CRUD
│   └── storage.ts               # File upload/management
├── components/                   # React components
│   └── account/                 # Account-related components
├── lib/                         # Core utilities and types
│   ├── supabase/                # Supabase configuration
│   │   ├── types.ts            # Auto-generated database types
│   │   ├── database-types.ts   # Convenience type exports
│   │   ├── server.ts           # Server client
│   │   └── session.ts          # Session management
│   ├── schemas.ts              # Zod validation schemas
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

### Type Integration

- **Database Operations**: All queries use generated types
- **Server Actions**: Use generated Insert/Update types
- **Convenience Exports**: `lib/supabase/database-types.ts` provides easy imports
- **Schema Sync**: Types automatically reflect database changes

### Generated Type Usage

```typescript
import type { Brand, BrandInsert, BrandUpdate } from '@/lib/supabase/database-types'

export type CreateBrandData = Omit<BrandInsert, 'id' | 'created_at' | 'updated_at'>
```

## 🗄️ Storage System

### Bucket Organization

- **`avatars`**: User profile pictures (`{user_id}/avatar.{ext}`)
- **`product-images`**: Product photos (`{project_id}/products/{product_id}/{type}_{timestamp}_{name}.{ext}`)

### File Constraints

- **Avatars**: 5MB max, 1024x1024px, JPEG/PNG/WebP
- **Product Images**: 10MB max, 2048x2048px, JPEG/PNG/WebP

### Image Types

Product images support organized types:
- `hero` - Main product image
- `gallery` - Additional photos
- `thumbnail` - Preview images
- `lifestyle` - Context images
- `detail` - Close-up shots
- `variant` - Color/style variants

## 🛠️ Development Workflow

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
- **RLS Policies**: Implemented for all tables
- **Relationships**: Foreign keys with proper cascading
- **Validation**: Server-side with database constraints

## 🤖 AI Integration Ready

### Agent System Structure

The project includes AI agent types and schemas:
- **Brand Agent**: Generates brand identity and guidelines
- **Product Agent**: Creates detailed product catalogs
- **Image Agent**: Generates product photography
- **Marketing Agent**: Develops design systems
- **Export Agent**: Handles multi-platform exports

### Agent Context

```typescript
export interface AgentContext {
  sessionId: string
  agentType: AgentType
  previousData?: Partial<ProjectData>
  userPreferences?: Record<string, any>
}
```

## 📋 Business Rules & Constants

### Validation Rules

Defined in `lib/constants.ts`:
- Maximum products per catalog
- Required fields for different entities
- File size and type restrictions
- Business logic constraints

### Zod Schemas

Comprehensive validation in `lib/schemas.ts`:
- Product specifications schema
- Brand identity schema
- Marketing data schema
- Export configuration schema

## 🔧 Server Actions

### Pattern

All CRUD operations follow consistent patterns:
- Authentication verification
- Ownership validation (RLS)
- Data validation
- Database operation
- Path revalidation
- Error handling

### Example Structure

```typescript
export async function createBrandAction(brandData: CreateBrandData): Promise<Brand> {
  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  
  // 2. Verify ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', brandData.project_id)
    .eq('user_id', user.id)
    .single()
    
  // 3. Perform operation
  const { data, error } = await supabase
    .from('brands')
    .insert(brandData)
    .select()
    .single()
    
  // 4. Revalidate and return
  revalidatePath(`/projects/${brandData.project_id}/brands`)
  return data
}
```

## 📚 Documentation

### Available Guides

- **`docs/SUPABASE_TYPES.md`**: Complete guide to type generation system
- **`docs/SUPABASE_STORAGE.md`**: Storage implementation and usage
- **Individual schema files**: Well-documented SQL with comments

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

### Code Documentation

- All server actions include comprehensive JSDoc comments
- Database schemas include detailed column descriptions
- Type definitions include usage examples
- Migration files include step-by-step explanations

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

### Schema Relationships

- **Categories → Product Catalogs**: Changed from brand-scoped to catalog-scoped for better flexibility
- **JSONB Usage**: Complex product data stored as JSONB for flexibility while maintaining type safety
- **Hierarchical Categories**: Support for parent-child category relationships

### Type Safety

- **Generated Types**: Prioritize generated over manual types
- **Server Validation**: Never trust client-side validation
- **Type Imports**: Centralized through `database-types.ts`

### Security

- **RLS Everywhere**: Every table has comprehensive RLS policies
- **Ownership Chains**: Users → Projects → Brands → Catalogs → Products
- **File Security**: Project-based access for product images, user-based for avatars

## 🚀 Current Status

### Implemented Features

✅ **Database Schema**: Complete with RLS policies  
✅ **Type Generation**: Auto-generated types integrated  
✅ **Server Actions**: Full CRUD for all entities  
✅ **Storage System**: Secure file upload and management  
✅ **Authentication**: Supabase Auth integration  
✅ **Categories**: Catalog-scoped categorization system  

### Ready for Development

- **AI Agent Integration**: Schema and types ready for AI generation
- **Frontend Development**: Server actions and types available
- **File Upload**: Complete storage system with validation
- **Multi-tenant**: Proper user isolation and security

### Next Steps

- Frontend UI development
- AI agent implementation  
- Export system development
- Image generation integration
- Testing and validation

## 🔍 Usage Patterns

### Typical User Flow

1. **Create Project**: User creates a new project
2. **Define Brand**: AI generates or user defines brand identity
3. **Create Catalog**: Set up product catalog with categories
4. **Add Products**: Create products with full specifications
5. **Upload/Generate Images**: Add product photography
6. **Export**: Generate platform-specific exports

### Development Flow

1. **Schema First**: Define database schema
2. **Generate Types**: Auto-generate TypeScript types
3. **Server Actions**: Implement CRUD operations
4. **Frontend**: Build UI consuming server actions
5. **Validation**: Zod schemas for client/server validation

This project provides a solid foundation for building a comprehensive e-commerce platform with AI-powered content generation, proper security, and excellent developer experience. 