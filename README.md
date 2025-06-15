# StoreCraft 

A comprehensive AI-powered platform for generating and managing complete e-commerce storefronts, including brand identities, product catalogs, marketing assets, and multi-platform exports.

## 🎯 Purpose

Storefront Tools is designed to help businesses and developers create complete e-commerce storefronts through AI-powered generation of:

- **🎨 Brand Identity**: Mission, vision, values, target market analysis, visual identity
- **📦 Product Catalogs**: Detailed product specifications, variants, pricing, marketing copy
- **🏷️ Product Management**: SKU-level management with attributes, pricing, and inventory
- **📸 Product Images**: AI-generated product photography with attribute-based filtering
- **🎨 Design Systems**: Complete marketing and branding guidelines
- **📤 Export Capabilities**: Multi-platform export (Shopify, WooCommerce, Magento, etc.)

Perfect for developers, designers, and e-commerce professionals who need realistic, cohesive product catalogs for testing, development, demos, and rapid storefront creation.

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions, React 19)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
- **Storage**: Supabase Storage (File upload and management)
- **Authentication**: Supabase Auth
- **Styling**: [PandaCSS](https://panda-css.com/) (CSS-in-JS with pattern system)
- **Language**: TypeScript with auto-generated database types
- **Package Manager**: pnpm
- **Linting**: [Biome](https://biomejs.dev/)

## 🧪 Development Philosophy

### Core Principles
1. **Type Safety First**: All database operations use auto-generated types
2. **Security by Design**: Row Level Security (RLS) on all tables
3. **Server-Side Validation**: All operations validated on server
4. **Atomic Operations**: Database integrity through proper relationships
5. **Modern React Patterns**: React 19 with `useActionState` and Server Actions

### Code Standards
- **PandaCSS Patterns**: Use predefined layout components (`Box`, `Stack`, `Flex`)
- **Server Actions**: Located in root `actions/` directory
- **Type Generation**: Auto-generated from database schema
- **HTML Semantics**: Proper interactive element usage (no nested buttons/links)

### Development Workflow
1. Database changes: Modify `supabase/schemas/` files
2. Apply changes: `supabase db reset`
3. Generate types: `pnpm generate:types`
4. Update server actions if needed
5. Test with `pnpm checktypes` and `pnpm lint`

## 📚 Documentation

All project documentation is in the `docs/` directory.

## ⚖️ License

[Add your license here]

## 🙋‍♂️ Support

This project is in active development. For questions or support:
- Check the documentation in `/docs`
- Review existing issues
- Contact the development team