# Supabase Type Generation

This project uses automatically generated TypeScript types from the Supabase database schema to ensure type safety and reduce manual type definitions.

## Overview

Instead of manually defining database types, we use the Supabase CLI to generate types directly from the database schema. This approach provides:

- **Type Safety**: Automatic TypeScript types that match your database schema exactly
- **Reduced Redundancy**: No need to manually maintain duplicate type definitions
- **Schema Sync**: Types automatically reflect database changes
- **Better DX**: IntelliSense and autocomplete for database operations

## File Structure

```
lib/supabase/
├── types.ts              # Auto-generated types from Supabase CLI
├── database-types.ts     # Convenience type exports and helpers
├── server.ts             # Typed server client
└── session.ts            # Typed session client

app/actions/
├── projects.ts           # Uses generated Project types
├── brands.ts             # Uses generated Brand types
├── categories.ts         # Uses generated Category types
├── products.ts           # Uses generated Product types
└── product-catalogs.ts   # Uses generated ProductCatalog types
```

## Generated Types

The `lib/supabase/types.ts` file contains:

- **Database**: Complete database schema type
- **Tables**: Row types for each table
- **TablesInsert**: Insert types for creating records
- **TablesUpdate**: Update types for modifying records
- **Enums**: Database enum types

## Convenience Types

The `lib/supabase/database-types.ts` file exports convenient aliases:

```typescript
// Table row types
export type Profile = Tables<'profiles'>
export type Project = Tables<'projects'>
export type Brand = Tables<'brands'>
export type ProductCatalog = Tables<'product_catalogs'>
export type Category = Tables<'categories'>
export type Product = Tables<'products'>

// Insert types for creating new records
export type ProfileInsert = TablesInsert<'profiles'>
export type ProjectInsert = TablesInsert<'projects'>
// ... etc

// Update types for modifying existing records
export type ProfileUpdate = TablesUpdate<'profiles'>
export type ProjectUpdate = TablesUpdate<'projects'>
// ... etc

// Enum types
export type BrandStatus = Enums<'brand_status'>
export type SessionStatus = Enums<'session_status'>
```

## Usage in Server Actions

Server actions use the generated types for type-safe database operations:

```typescript
import type { Brand, BrandInsert, BrandUpdate } from '@/lib/supabase/database-types'

// Create and update data types
export type CreateBrandData = Omit<BrandInsert, 'id' | 'created_at' | 'updated_at'>
export type UpdateBrandData = Omit<BrandUpdate, 'id' | 'created_at' | 'updated_at'>

export const createBrandAction = async (brandData: CreateBrandData): Promise<Brand> => {
  // Type-safe database operations
}
```

## Type Generation Commands

### Local Development

Generate types from your local Supabase instance:

```bash
# Using npm script
npm run generate:types

# Using pnpm script
pnpm generate:types

# Direct command
supabase gen types --lang=typescript --local > lib/supabase/types.ts

# Using the shell script
./scripts/generate-types.sh
```

### Production/Remote

Generate types from a remote Supabase project:

```bash
# Using npm script (requires SUPABASE_PROJECT_ID env var)
npm run generate:types:remote

# Direct command
supabase gen types --lang=typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```

## When to Regenerate Types

Regenerate types whenever you:

1. **Add new tables** to your database schema
2. **Modify existing tables** (add/remove/change columns)
3. **Add or modify enums**
4. **Change column types or constraints**
5. **Add or remove foreign key relationships**

## Integration with Development Workflow

### After Schema Changes

1. Make changes to your database schema files in `supabase/schemas/`
2. Apply migrations: `supabase db reset` or `supabase migration up`
3. Regenerate types: `npm run generate:types`
4. Commit both schema changes and updated types

### CI/CD Integration

Consider adding type generation to your CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Generate Supabase Types
  run: |
    supabase gen types --lang=typescript --project-id ${{ secrets.SUPABASE_PROJECT_ID }} > lib/supabase/types.ts
    git diff --exit-code lib/supabase/types.ts || (echo "Types are out of sync!" && exit 1)
```

## Benefits Over Manual Types

### Before (Manual Types)
```typescript
// Manually maintained - prone to drift
export interface Brand {
  id: number
  project_id: number
  name: string
  tagline?: string
  // ... 20+ more fields to maintain manually
}
```

### After (Generated Types)
```typescript
// Automatically generated and always in sync
import type { Brand } from '@/lib/supabase/database-types'
```

## Troubleshooting

### Types Out of Sync

If you get TypeScript errors after schema changes:

1. Ensure your local database is up to date: `supabase db reset`
2. Regenerate types: `npm run generate:types`
3. Check for any breaking changes in the generated types

### Missing Types

If types are missing for new tables:

1. Verify the table exists in your database
2. Check that RLS policies are properly configured
3. Ensure the table is in the `public` schema (or adjust the generation command)

### Type Conflicts

If you have conflicts between generated and manual types:

1. Remove manual type definitions
2. Use the generated types from `database-types.ts`
3. Create type aliases if needed for specific use cases

## Best Practices

1. **Always use generated types** instead of manual definitions
2. **Regenerate types immediately** after schema changes
3. **Commit generated types** to version control
4. **Use convenience exports** from `database-types.ts`
5. **Create type aliases** for complex derived types
6. **Document custom type helpers** when needed

## Related Documentation

- [Supabase CLI Type Generation](https://supabase.com/docs/reference/cli/supabase-gen)
- [TypeScript with Supabase](https://supabase.com/docs/guides/api/generating-types)
- [Database Schema Documentation](./DATABASE_SCHEMA.md) 