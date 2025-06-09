# Supabase Schema Management

This project uses **organized schema files** with consistent SQL style guidelines for maintainable database schemas.

## Current Approach

### Schema-First Organization
- **Schema files** in `./schemas/` define the complete database structure
- **Consistent naming**: `00_profiles.sql` through `08_product_images.sql` 
- **SQL Style Compliance**: All files follow PostgreSQL style guidelines
- **Minimal migrations**: Handle only setup and functions

### File Structure
```
supabase/
├── schemas/                    # Organized schema definitions
│   ├── 00_profiles.sql        # User profiles
│   ├── 01_projects.sql        # Projects table
│   ├── 02_brands.sql          # Brands table
│   ├── 03_product_catalogs.sql # Product catalogs
│   ├── 04_categories.sql      # Categories
│   ├── 05_products.sql        # Master products
│   ├── 06_product_variants.sql # Product variants
│   ├── 07_product_attributes.sql # Product attributes
│   └── 08_product_images.sql  # Product images
├── migrations/                 # Generated + manual migrations
│   └── 20250609000000_enable_declarative_schemas.sql
└── migrations_archive/         # Old migrations (for reference)
```

## Schema File Standards

### ✅ SQL Style Guide Compliance
All schema files follow the **PostgreSQL SQL Style Guide**:

- **Lowercase keywords**: `create table`, `select`, `insert`
- **Snake_case naming**: `product_variants`, `user_id`
- **Consistent formatting**: Proper indentation and spacing
- **Table comments**: Every table has descriptive comments
- **Column documentation**: Important columns have explanatory comments

### Schema File Structure
Each schema file includes:
- Table creation with all columns and constraints
- Indexes for performance optimization
- Row Level Security (RLS) policies
- Triggers for automated functionality
- Comprehensive comments and documentation

### Example Schema File
```sql
-- Create table with proper naming and structure
create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamptz not null default now()
);

comment on table public.products is 'Master products containing shared information';

-- Indexes for performance
create index if not exists idx_products_name on public.products(name);

-- Row Level Security
alter table public.products enable row level security;

create policy "Users can view their own products"
  on public.products for select to authenticated
  using (user_id = auth.uid());

-- Triggers for automation
create trigger trigger_products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();
```

## Development Workflow

### Making Schema Changes
1. **Edit schema files** directly (e.g., `schemas/05_products.sql`)
2. **Test locally**: Use migration-based approach 
3. **Generate migration**: `supabase db diff -f my_changes`
4. **Apply to remote**: `supabase db push`

### Working with the Current Setup

```bash
# Reset local database (applies base migration)
supabase db reset

# Generate migration from schema changes
supabase db diff -f my_schema_changes

# Apply to production
supabase db push
```

## Benefits of This Approach

### ✅ Advantages
- **Organized structure**: Clear, numbered schema files
- **SQL style compliance**: Consistent, readable SQL
- **Self-documenting**: Each file shows complete table structure
- **Version controlled**: Full history of schema changes
- **Maintainable**: Easy to understand and modify

### 🎯 Database Design
- **Hierarchical structure**: `projects` → `brands` → `catalogs` → `products` → `variants`
- **Row Level Security**: All tables have proper RLS policies
- **Performance optimized**: Strategic indexes on all tables
- **Master/variant pattern**: Flexible product management system

## Schema Overview

### Core Tables
- **`profiles`**: User profiles linked to auth.users
- **`projects`**: Top-level containers for user work
- **`brands`**: Brand identity and positioning data
- **`product_catalogs`**: Organized product collections
- **`categories`**: Hierarchical product categorization

### Product System
- **`products`**: Master products with shared information
- **`product_variants`**: Specific SKUs with pricing and attributes
- **`product_attributes`**: Configurable product attributes
- **`product_images`**: Organized product imagery

### Key Features
- **JSONB columns**: Flexible data storage with indexing
- **Audit trails**: Created/updated timestamps on all tables
- **Data integrity**: Foreign key constraints and validation
- **Performance**: GIN indexes for JSONB and array columns

## Next Steps

1. **Continue development**: Schema files are ready for use
2. **Generate migrations**: Use `supabase db diff` for changes
3. **Consider automation**: Future implementation of declarative schemas
4. **Maintain standards**: Keep following SQL style guidelines

The schema files provide a solid foundation that's both maintainable and performant! 🚀 