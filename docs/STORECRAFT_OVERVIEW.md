# StoreCraft – AI-Generated Demo Storefronts in Minutes

> **Tagline:** *Realistic catalogs. Zero busywork.*

## Elevator Pitch
StoreCraft lets developers, agencies, and commerce teams generate complete, on-brand storefront data—products, images, customers, and orders—in one click. Export to Shopify CSV (with more targets coming) or pipe directly into your CI pipeline. Stop copying lorem-ipsum and start testing real-world scenarios instantly.

## Core Value
| Pain Point | StoreCraft Remedy |
|------------|------------------|
| Manual seeding is slow | One-click bulk generation with contextual AI |
| Sample data looks fake | Photoreal images & rich copy tailored to each brand |
| Platform silos | Multi-export: Shopify (today), Woo/Magento/BigCommerce (roadmap) |
| Hard to demo edge cases | Generates variants, low-stock items, subscriptions, etc. |

## Feature Highlights
- **Brand Forge** – deep brand identity generator (palette, voice, imagery).
- **Catalog Builder** – hierarchical categories & sub-categories with SEO-ready slugs.
- **Product Crafter** – titles, rich descriptions, specs, variant matrices, pricing tiers.
- **Image Factory** – high-quality product hero shots + alt-angles (async bulk pipeline).
- **Dataset Exports** – Shopify CSV today; JSON schema & platform-specific imports tomorrow.
- **Auth & Workspace** – Supabase email/social login, team workspaces, history.

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router, RSC) |
| Hosting | Vercel (Edge Functions for long-running tasks) |
| Database | Supabase (Postgres + storage + auth) |
| AI | OpenAI (GPT-4o + DALL·E 3) via Vercel AI SDK, replicate fallback |
| Background Jobs | Vercel Cron → Supabase Edge Functions |
| CI / CD | Turborepo; preview deploys per branch |

## Roadmap Snapshot
1. **MVP GA** – Shopify export + WooCommerce JSON.
2. **Asset Variants** – lifestyle & close-up image sets.
3. **Order Simulator** – dummy orders with timelines & statuses.
4. **Team Collaboration** – shareable links, role-based access.
5. **Marketplace** – save & share catalog templates (community vertical packs).

---

*© 2025 StoreCraft*

