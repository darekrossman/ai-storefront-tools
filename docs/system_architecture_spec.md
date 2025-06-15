# StoreCraft System Architecture Specification
_Date: 2025-06-14_

---

## 1 — Overview
StoreCraft is a cloud-native platform that **automatically generates realistic e-commerce demo catalogs**—products, rich copy, and images—then exports them to the target platform (Shopify today, WooCommerce/Magento/BigCommerce soon).

The application follows a **service-oriented layout** with clear separation between presentation, API gateway, business services, data, background workers, and external AI providers.

```

┌─────────────────────────────────────────┐
│              Browser / UI              │
└───────▲───────────────────▲─────────────┘
│ RSC/tRPC         │ SSE (jobs)
┌───────┴──────────┐   ┌────┴────────────┐
│ Next.js 14 (UI)  │   │  TRPC Gateway   │
│  (Vercel Edge)   │   │ (API routes)    │
└───────▲──────────┘   └────┬────────────┘
│ RPC/HTTP          │
│                   ▼
│            ┌───────────────┐
│            │ App Services  │
│            │ • BrandForge  │
│            │ • CatalogSvc  │
│            │ • ExportSvc   │
│            └─────┬─────────┘
│                  │ (SQL/RPC)
│                  ▼
│            ┌───────────────┐
│            │  Supabase DB  │
│            └─────┬─────────┘
│                  │ NOTIFY
│                  ▼
│            ┌───────────────┐
│            │ Job Queue &   │
│            │  Edge Fn      │
│            └─────┬─────────┘
│                  │ HTTPS
│                  ▼
│            ┌───────────────┐
│            │  AI Engines   │
│            │ (OpenAI, Rep) │
│            └───────────────┘

```

---

## 2 — Component Details

| Layer | Technology | Responsibilities |
|-------|------------|------------------|
| **Frontend** | Next.js 14 (App Router, RSC), React Query, Tailwind, ShadCN | Auth, brand wizard, catalog preview, download center. |
| **API Gateway** | `@trpc/server` in Vercel Functions | Schema-validated endpoints; auth check; rate limiting; metrics. |
| **Application Services** | TypeScript services (in `packages/api`) | <br>• **BrandForge** – calls GPT-4o to craft mission, values, palette.<br>• **CatalogSvc** – constructs categories & product stubs, enqueues image tasks.<br>• **ExportSvc** – streams Shopify CSV to storage + thumbnails ZIP.<br>• (Post-MVP) **OrderSim** – synthetic orders & timelines. |
| **Data Layer** | Supabase Postgres + Storage | All normalized entities; RLS ensures tenant isolation; Storage holds generated assets & exports. |
| **Job Queue** | Supabase Edge Functions + cron topic | Polls `generation_jobs`, processes DALL·E / Stable-Diffusion calls, updates status row, emits `pg_notify` for SSE to UI. |
| **AI Engines** | OpenAI (GPT-4o, DALL·E 3); fall-back Replicate (SD-XL) | Text & image generation, moderated by content filter guardrails. |

---

## 3 — Key Data Flows

### 3.1 Catalog Generation  
1. UI → `catalog.generate` mutation (`brandId`, `size`).  
2. CatalogSvc inserts **category** and **product** stubs → one `generation_job` per image.  
3. Edge worker picks jobs FIFO, builds image prompt, calls DALL·E 3.  
4. On success: uploads image to Supabase Storage, updates `products.image_url`.  
5. When all images complete, job state flips to `success`; SSE notifies browser.

### 3.2 CSV Export  
1. UI → `export.shopify` mutation.  
2. ExportSvc streams rows with **proper column ordering + escapes**.  
3. File saved to `storage://exports/{brandId}/{timestamp}.csv`.  
4. Signed download URL returned (24 h expiry) → UI triggers browser download.

---

## 4 — Data Persistence Model (high-level)

* **brands** ← workspace-scoped brand identities.  
* **categories** ← tree via `parent_id`, depth ≤ 3.  
* **products** ← core catalog rows (`status`, `price`, `title`).  
* **variants** ← JSON attribute matrix (size/color).  
* **images** ← 1 :N to products (flag `is_primary`).  
* **generation_jobs** ← item-level tasks (`pending|running|done|failed`).  
* **export_jobs** ← catalog-level tasks; holds `output_url`.  

All tables enforce **row-level security** referencing `workspace_memberships`.

---

## 5 — Non-Functional Requirements

| Aspect | Target |
|--------|--------|
| **Latency (p99)** | < 250 ms for GET APIs, excluding large downloads |
| **Throughput** | ≥ 20 concurrent generation jobs without queue starvation |
| **Reliability** | 99.5 % uptime; auto-retry external failures (max 3) |
| **Scalability** | Horizontal Vercel Edge Functions per region; Supabase connection pooler |
| **Observability** | OTEL traces (`traceparent` header), JSON logs in Vercel; Grafana dashboards via Supabase open-telemetry |
| **Security** | All cookies = `SameSite=Lax; Secure`; secrets in Doppler; JWT expiry 15 min + refresh token; full CSP headers |
| **Compliance** | Images/text pass OpenAI moderation; user data sticks to US region (Supabase us-east-1) |

---

## 6 — Deployment Pipeline

1. **Build** → GitHub Actions runs `pnpm lint && pnpm test && pnpm build`.  
2. **Preview Deploy** → Vercel creates unique URL; Playwright smoke test.  
3. **PR Merge** → `main` branch auto-promotes build, runs Drizzle migrations on Supabase.  
4. **Canary** → Weighted 5 % traffic; auto-promote after 30 min (< 0.5 % error rate).  
5. **Cron Jobs** → Vercel Cron triggers `/api/cron/worker` every minute.

---

## 7 — Open Questions / Future Work
* **Real-time upload progress** – switch from SSE to WebSocket?  
* **Multi-tenant limits** – add per-workspace concurrency quota?  
* **Direct Admin-API pushes** – write products straight into a Shopify dev store.  
* **Edge image resize service** – CDN-side resizing instead of full-res uploads.

---

_© 2025 StoreCraft_  
