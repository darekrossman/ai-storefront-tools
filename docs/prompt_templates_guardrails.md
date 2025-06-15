# Prompt Templates & Guardrails
_Date: 2025-06-15_

(Brand Forge / Product Copy / Image prompts templates.)

## Prompt Templates & Guardrails

This document is the **single source-of-truth** for any agent that invokes GPT-4 / FAL or other LLMs.  It standardises:

1. Prompt skeletons and required sections.
2. The exact JSON **result schema** that must be produced (validated with Zod in code).
3. Model hyper-parameters (model name, temperature, max tokens).
4. Safety & moderation rules that every invocation **must** obey.

> If you add a new agent route, update this file in the same PR.

---

### 1 · Current Agent Catalogue

| Agent (API Route) | Purpose | Model & Params | Prompt Skeleton | Expected JSON Schema | Safety / Moderation |
| ----------------- | ------- | -------------- | --------------- | ------------------- | ------------------- |
| **BrandForge** <br>`POST /api/agents/brand` | Interactive wizard that incrementally builds a brand strategy in five phases. | • `openai:gpt-4.1`<br>• `temperature`: **0.7** (default)<br>• `maxTokens`: *implicit* (8 k) | See Section 2.1 | `brandStructuredOutputSchemas` (`lib/brand/schemas.ts`) | • Rely on OpenAI built-in moderation.<br>• No disallowed content in brand names/taglines.<br>• Must not leak policy text. |
| **CatalogBuilder** <br>`POST /api/agents/catalog` | Generates a full catalog + category tree for a brand. | • `openai:gpt-4.1`<br>• `temperature`: **0.5**<br>• `maxTokens`: *implicit* (8 k) | Section 2.2 (dynamic) | Return generated object that satisfies the Zod schema returned by `createCatalogStructuredOutputSchemas(parentCount, subCount)` | Same as BrandForge. |
| **ProductCreator** <br>`POST /api/agents/products` | Creates X products per sub-category with variants. | • `openai:gpt-4.1`<br>• `temperature`: **0.4**<br>• `maxTokens`: **32 k** | Section 2.3 | `createFullProductSchema(totalCount)` (`lib/products/schemas.ts`) | • OpenAI moderation.<br>• No explicit/sexual/hateful content.<br>• Must honour exact count requirement or request will be rejected. |
| **ImagePrompt → FalGenerate** <br>`POST /api/agents/images` | Two-step chain: (1) GPT-4.1 crafts a detailed SDXL prompt, (2) FAL generates/edits the image. | • GPT-4.1: `temperature` 0.8, `maxTokens` 2048. <br>• Fal Model: `fal-ai/flux-pro/kontext/max` (gen or edit). | Section 2.4 | N/A – returns FAL response JSON | • `enable_safety_checker` is currently **false** in FAL payload; **must be set to `true` for production**.<br>• Negative prompt may be injected to remove NSFW content.<br>• Add content filter on GPT output to remove URLs or user PII. |

---

### 2 · Prompt Skeletons (canonical form)

All prompts follow a consistent structure:

```
<system>
  … preamble that sets role & constraints …
  … enumerated guidelines …
</system>

<user>
  # <TITLE>
  … structured user input (JSON or markdown) …
</user>
```

The sections below list the immutable parts of each template.  Dynamic values (passed in from the handler) are wrapped in **double-braces** (Handlebars style) for illustrative purposes – in code they are string-interpolated.

#### 2.1 BrandForge
```txt
You are a world-class brand strategist…

**PROCESS OVERVIEW**
… (phases 1-5 overview) …

**PHASE 1: Brand Foundation**
Present 3 compelling brand name options …
…
**PHASE 5: Brand Strategy Synthesis** …

**INTERACTION RULES**
- Always return the structured output in the format of the schema with the phase number key …
- Exactly 3 options …
- Wait for explicit user selection …
```
The code passes `brandStructuredOutputSchemas` to `streamObject()` which enforces JSON validity.

#### 2.2 CatalogBuilder
Skeleton is generated via `createSystemPrompt(parentCt, subCt, existingNames[])` with the following constant blocks:
* *Brand Analysis Framework*
* *Catalog Creation Guidelines* – exact counts.
* *Quality Standards*
* *Industry-Specific Considerations*
* *Your Task* – instructs model to output JSON per schema.

#### 2.3 ProductCreator
Fixed `systemPrompt` (≈230 lines) that covers:
* **CRITICAL REQUIREMENT: EXACT COUNT COMPLIANCE**
* Detailed field-by-field spec for products / attributes / variants.
* Validation checklist + quality standards.

Handler supplies a "PRODUCT GENERATION REQUEST" message that spells out parent_category_id list and required counts.

#### 2.4 Image Generation Chain
1. **PromptEngineer** (GPT-4.1)
   *System role*: `You are an expert prompt generator that specialises in creating extremely detailed prompts for e-commerce image generation given product information.`
   *Photo Guidelines* bullet list (no cropping, white BG, etc.).
2. **FAL Invocation** – The GPT output text is injected into `prompt` input field.  For **edits**, `image_url` is forwarded and the edit model is chosen.

---

### 3 · Global Guardrails

1. **Disallowed content** – All agents must refuse or sanitise prompts that request generation of:
   * Sexual content involving minors, gratuitous violence, hate speech, extremist propaganda.
   * Real personally-identifiable customer data.
   * Images that violate trademarked/celebrity likeness unless explicitly provided by user.
2. **Token Budget** – Never exceed the `maxTokens` specified in Section 1.  If additional space is required, summarise less-critical sections instead of truncating JSON.
3. **Output Validation** – Every response must parse against its Zod schema.  Parsing errors ⇒ respond with `{ error: "INVALID_SCHEMA" }` and log the issue.
4. **Moderation Workflow** –
   * All OpenAI calls implicitly go through automatic moderation; if flagged `safe == false`, the request is retried with a milder prompt or rejected.
   * FAL `enable_safety_checker` **MUST** be `true` in production; staging can disable for debugging.
5. **Prompt Injection Defence** – When embedding user-supplied strings, escape triple backticks and ensure they appear *after* the system rules to keep higher priority.
6. **Rate-Limit Handling** – If OpenAI returns `429` or `RateLimitError`, back-off with exponential delay up to 30 s; after three failures surface error to client.

---

### 4 · Adding New Agents

1. Create a Zod schema describing the exact JSON shape to be returned.
2. Place prompt skeleton in `app/api/agents/<name>/route.ts` using the pattern above.
3. Update **Section 1** of this doc with:
   * Route path
   * Purpose
   * Model/params
   * Skeleton section reference
   * Schema file
   * Safety notes
4. If model choice differs (e.g., Claude, Gemini), record any capability/safety implications.

---

_Last updated: 2025-06-15_
