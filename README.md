# Storefront Tools

> **⚠️ Work in Progress**: This project is currently in active development and not ready for production use. We're in Phase 2 of development with Phase 3 (AI integration) planned next.

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

### AI Integration (Phase 3)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/) with OpenAI integration
- **Models**: GPT-4.1 for content generation, GPT-Image-1 for visual assets
- **Interaction Patterns**: `useChat`, `useObject`, `useCompletion` hooks

## 🚧 Current Development Status

### ✅ Phase 2 Completed (Current)
**Complete Backend Infrastructure:**
- ✅ Full database schema with Row Level Security (RLS)
- ✅ Comprehensive server action system for all entities
- ✅ Auto-generated TypeScript types from database
- ✅ Complete file storage system with validation

**Complete Frontend System:**
- ✅ **Project Management**: Full dashboard with statistics
- ✅ **Brand Management**: CRUD interface with logo upload
- ✅ **Product Catalog System**: Full catalog management
- ✅ **Product Management**: Comprehensive system with variants and attributes
- ✅ **Navigation System**: Project-based navigation with breadcrumbs
- ✅ **Responsive Design**: Mobile-first layouts using PandaCSS

**Modern React Patterns:**
- ✅ React 19 `useActionState` for all forms
- ✅ Server Actions with proper error handling
- ✅ Type-safe form submissions

### 🎯 Phase 3 Direction: AI Agent Integration

**Primary Focus:** Transform manual workflows into AI-assisted generation

**Planned AI Agents:**
- **Brand Inventor**: AI-guided brand identity creation
- **Product Designer**: Intelligent product catalog generation
- **Image Generator**: AI-powered product photography
- **Marketing Designer**: Automated design systems and assets
- **Catalog Generator**: Smart multi-platform exports

## 🏗️ Architecture Overview

### Database Schema
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

### Security Model
- **Row Level Security (RLS)** on all tables
- **Ownership Chain Security**: Users → Projects → Brands → Catalogs → Products
- **Type Safety**: Auto-generated types from database schema
- **Server-Side Validation**: All operations validated on server

### Product System
- **Master + Variants Model**: Flexible product management
- **Dynamic Attributes**: Color, size, material with validation
- **Image Organization**: Type-based with attribute filtering
- **JSONB Support**: Flexible data storage for complex attributes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm
- Supabase CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/storefront-tools.git
cd storefront-tools

# Install dependencies
pnpm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Set up the database
supabase start
supabase db reset

# Generate TypeScript types
pnpm generate:types

# Start the development server
pnpm dev
```

### Development Scripts

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Database
pnpm generate:types         # Generate TypeScript types from database
pnpm db:reset               # Reset local database

# Code Quality
pnpm lint                   # Run Biome linter
pnpm checktypes            # TypeScript type checking
```

## 📁 Project Structure

```
storefront-tools/
├── app/                    # Next.js app directory
│   ├── dashboard/          # Main application dashboard
│   ├── auth/              # Authentication pages
│   └── api/               # API routes (AI agents)
├── actions/               # Server actions (all CRUD operations)
├── components/            # React components
├── lib/                   # Core utilities and types
│   ├── supabase/          # Database client and types
│   └── constants.ts       # Business rules and AI agent configs
├── styled-system/         # PandaCSS generated files
├── supabase/              # Database schemas and migrations
└── docs/                  # Documentation
```

## 🔑 Key Features

### Current Features (Phase 2)
- **Multi-Project Management**: Organize work across multiple projects
- **Brand Identity System**: Create and manage brand guidelines
- **Product Catalog Management**: Organize products into catalogs
- **Advanced Product System**: Master products with variants and attributes
- **Image Management**: Upload and organize product photography
- **Type-Safe Operations**: Generated TypeScript types throughout
- **Mobile-Responsive**: Works on all devices

### Planned Features (Phase 3+)
- **AI Brand Generation**: Multi-step AI-guided brand creation
- **Intelligent Product Creation**: AI-powered product catalog generation
- **Smart Image Generation**: AI-created product photography
- **Automated Design Systems**: AI-generated marketing assets
- **Multi-Platform Export**: Shopify, WooCommerce, Magento support
- **Collaborative Features**: Team-based brand and product development

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

## 🤝 Contributing

This project is currently in active development. If you're interested in contributing:

1. **Check Current Status**: Review the Phase 2 completion status above
2. **Focus Areas**: Phase 3 AI integration is the next major milestone
3. **Development Rules**: Follow patterns established in existing codebase
4. **Documentation**: Comprehensive docs available in `/docs` directory

### Development Workflow
1. Database changes: Modify `supabase/schemas/` files
2. Apply changes: `supabase db reset`
3. Generate types: `pnpm generate:types`
4. Update server actions if needed
5. Test with `pnpm checktypes` and `pnpm lint`

## 📚 Documentation

- **[Project Overview](docs/PROJECT_OVERVIEW.md)**: Detailed architecture and implementation guide
- **[PRD](docs/PRD.md)**: Complete product requirements and roadmap
- **[Supabase Types](docs/SUPABASE_TYPES.md)**: Type generation system guide
- **[Storage Guide](docs/SUPABASE_STORAGE.md)**: File storage implementation

## 🔮 Roadmap

- **Phase 2** (✅ Complete): Full backend/frontend foundation
- **Phase 3** (🎯 Next): AI agent integration and intelligent workflows
- **Phase 4** (📋 Planned): Multi-platform export and team collaboration
- **Phase 5** (🚀 Future): Advanced AI features and enterprise capabilities

## ⚖️ License

[Add your license here]

## 🙋‍♂️ Support

This project is in active development. For questions or support:
- Check the documentation in `/docs`
- Review existing issues
- Contact the development team

---

**Note**: This project is not yet ready for production use. It's a comprehensive foundation for AI-powered e-commerce tools with significant development remaining for Phase 3 AI integration. 