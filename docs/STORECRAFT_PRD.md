# Product Requirements Document – StoreCraft MVP

| Version | 0.9 (MVP definition) |
|---------|----------------------|
| Author  | Darek Rossman |
| Date    | 2025-06-14 |

---

## 1 Purpose
Deliver a web-based tool that auto-generates complete, visually rich e-commerce catalogs for staging, demos, and experimentation—starting with Shopify CSV export.

## 2 Problem Statement
Developers waste hours faking products and images; agencies struggle to impress clients with placeholder data; sales engineers need realistic edge-case scenarios. Current sample datasets are static, shallow, or platform-locked.

## 3 Goals & Success Metrics
| Goal | Metric | Target |
|------|--------|--------|
| Time to first catalog | Minutes from signup to export | **< 5 min** |
| Catalog realism | User survey realism score | **≥ 4 / 5** |
| Export reliability | Successful CSV imports | **99%** pass |
| Retention | Users creating ≥ 3 catalogs in 30 days | **40%** |

## 4 User Personas
1. **Dev Dan** – freelance theme developer (Shopify & Woo).  
2. **Agency Ada** – PM at a boutique e-commerce agency demoing to clients.  
3. **Sales Sam** – solutions engineer at a SaaS checkout provider.  

## 5 Scope (MVP)
### 5.1 Functional Requirements
| ID | Requirement |
|----|-------------|
| F-01 | User can create a “Brand” (name, palette, tone, logo placeholder). |
| F-02 | System generates category tree (3 depths) based on brand vertical. |
| F-03 | System generates N products per sub-category with: title, description, bullet specs, variants, SKU, price, compare-at, tags, metafields. |
| F-04 | System queues image generation per product → primary hero image URL stored. |
| F-05 | User can preview catalog in web UI (paginated grid). |
| F-06 | User can export catalog as Shopify-compatible CSV + zip of images. |
| F-07 | Auth via Supabase (email + GitHub OAuth). |
| F-08 | Usage metering & quota (e.g., 100 products / month free). |

### 5.2 Non-Functional Requirements
| Category | Detail |
|----------|--------|
| Performance | Generate 100 products ≤ 90 sec (async allowed). |
| Scalability | Handle 500 concurrent generation jobs. |
| Reliability | 99.5% uptime; retries for failed image jobs. |
| Security | Row-level security in Supabase; encrypted API keys. |
| Accessibility | WCAG 2.1 AA for UI. |

### 5.3 Out of Scope (MVP)
- Direct write to live Shopify store via Admin API.
- Multi-language copy generation (future epic).
- Lifestyle image shoots / mockup scenes.

## 6 User Flows (high-level)
1. **Signup → New Brand Wizard → Generate Catalog → Export CSV → Import to Shopify Dev Store.**  
2. “Regenerate Images” bulk action if user dislikes the first batch.

## 7 Open Questions
- Preferred default verticals? (fashion, electronics, beauty, etc.)  
- How granular should variation attributes be (size + color vs. unlimited)?  
- Offer headless-friendly JSON schema export in MVP or phase 2?

## 8 Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| API cost spikes | High | Tiered quotas + batch concurrency limits |
| Image policy violations | Medium | Automated content filters + human review flags |
| CSV schema drift | Low | Schema tests against Shopify importer on CI |

## 9 Timeline (tentative)
| Phase | Duration | Milestones |
|-------|----------|-----------|
| Spec & Design | 1 wk | Finalize PRD, UI wireframes |
| Core Gen Engine | 2 wks | Brand → Category → Product chain functional |
| Image Pipeline | 1 wk | Bulk generation + storage upload |
| CSV Export | 1 wk | Shopify parity tests pass |
| Beta & Feedback | 2 wks | 10 pilot users, polish |
| Launch | — | Public MVP on Product Hunt |

---

*End of Document*
