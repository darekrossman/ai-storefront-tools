# StoreCraft API Contracts
_Date: 2025-06-15_

## OpenAPI 3.1 Specification (draft)

```yaml
openapi: 3.1.0
info:
  title: StoreCraft HTTP API
  version: 0.1.0
  description: |
    REST contract that enables parallel work between UI and backend agents.
    All endpoints are served from `/api` in the Next.js app router.
    Every request requires an `Authorization: Bearer <jwt>` header containing a valid Supabase session token.

servers:
  - url: https://storecraft.app/api
    description: Production
  - url: http://localhost:3000/api
    description: Local dev

security:
  - supabaseToken: []

components:
  securitySchemes:
    supabaseToken:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Brand:
      type: object
      required: [id, name, slug, status, created_at, updated_at]
      properties:
        id:
          type: integer
          format: int64
        user_id:
          type: string
          format: uuid
        name:
          type: string
        slug:
          type: string
          description: URL-friendly slug, generated from name and made unique per user.
        tagline:
          type: string
          nullable: true
        category:
          type: string
          nullable: true
        status:
          $ref: '#/components/schemas/BrandStatus'
        logo_url:
          type: string
          format: uri
          nullable: true
        mission:
          type: string
          nullable: true
        vision:
          type: string
          nullable: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    BrandCreateInput:
      type: object
      required: [name]
      properties:
        name:
          type: string
        tagline:
          type: string
        category:
          type: string

    BrandUpdateInput:
      allOf:
        - $ref: '#/components/schemas/BrandCreateInput'
        - type: object
          properties:
            status:
              $ref: '#/components/schemas/BrandStatus'
            logo_url:
              type: string
              format: uri

    BrandStatus:
      type: string
      enum: [draft, active, inactive, archived]

    Catalog:
      type: object
      required: [catalog_id, brand_id, name, slug, status, created_at, updated_at]
      properties:
        catalog_id:
          type: string
          description: Stable external identifier (UUID-v4 string)
        brand_id:
          type: integer
        name:
          type: string
        slug:
          type: string
        description:
          type: string
          nullable: true
        status:
          $ref: '#/components/schemas/BrandStatus'
        total_products:
          type: integer
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    CatalogCreateInput:
      type: object
      required: [brand_id, name]
      properties:
        brand_id:
          type: integer
        name:
          type: string
        description:
          type: string

    CatalogUpdateInput:
      allOf:
        - $ref: '#/components/schemas/CatalogCreateInput'
        - type: object
          properties:
            status:
              $ref: '#/components/schemas/BrandStatus'
            slug:
              type: string

    ExportJob:
      type: object
      required: [id, catalog_id, type, status, created_at, updated_at]
      properties:
        id:
          type: string
          description: ULID identifier
        catalog_id:
          type: string
        type:
          type: string
          enum: [shopify_csv]
        status:
          type: string
          enum: [pending, running, success, failed]
        output_url:
          type: string
          format: uri
          nullable: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    ExportJobCreateInput:
      type: object
      required: [catalog_id, type]
      properties:
        catalog_id:
          type: string
        type:
          type: string
          enum: [shopify_csv]

    GenerationJob:
      type: object
      required: [id, catalog_id, kind, status, created_at, updated_at]
      properties:
        id: { type: string }
        catalog_id: { type: string }
        kind:
          type: string
          enum: [image_generation]
        status:
          type: string
          enum: [pending, running, success, failed]
        progress:
          type: integer
          minimum: 0
          maximum: 100
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

  parameters:
    BrandId:
      name: brandId
      in: path
      required: true
      schema: { type: integer }
    CatalogId:
      name: catalogId
      in: path
      required: true
      schema: { type: string }
    ExportId:
      name: exportId
      in: path
      required: true
      schema: { type: string }
    JobId:
      name: jobId
      in: path
      required: true
      schema: { type: string }

paths:
  /brands:
    get:
      summary: List brands owned by the current user
      tags: [Brands]
      responses:
        '200':
          description: Array of Brand objects
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/Brand' }
    post:
      summary: Create a new brand
      tags: [Brands]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/BrandCreateInput' }
      responses:
        '201':
          description: Brand created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Brand' }

  /brands/{brandId}:
    parameters: [ { $ref: '#/components/parameters/BrandId' } ]
    get:
      summary: Retrieve a single brand
      tags: [Brands]
      responses:
        '200':
          description: Brand object
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Brand' }
        '404': { description: Not Found }
    patch:
      summary: Update a brand
      tags: [Brands]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/BrandUpdateInput' }
      responses:
        '200':
          description: Updated brand
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Brand' }
    delete:
      summary: Delete a brand (soft-delete ⇒ status = archived)
      tags: [Brands]
      responses:
        '204': { description: Deleted }

  /catalogs:
    get:
      summary: List catalogs visible to the user
      tags: [Catalogs]
      parameters:
        - name: brandId
          in: query
          schema: { type: integer }
          description: Optional filter – only catalogs for this brand
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/Catalog' }
    post:
      summary: Create a catalog (manual or AI-generated later)
      tags: [Catalogs]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CatalogCreateInput' }
      responses:
        '201':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Catalog' }

  /catalogs/{catalogId}:
    parameters: [ { $ref: '#/components/parameters/CatalogId' } ]
    get:
      tags: [Catalogs]
      summary: Retrieve catalog details (with counts)
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Catalog' }
        '404': { description: Not Found }
    patch:
      tags: [Catalogs]
      summary: Update catalog metadata
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CatalogUpdateInput' }
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Catalog' }
    delete:
      tags: [Catalogs]
      summary: Delete catalog (hard delete cascades children)
      responses:
        '204': { description: Deleted }

  /exports:
    post:
      tags: [Exports]
      summary: Create a catalog export job (e.g. Shopify CSV)
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ExportJobCreateInput' }
      responses:
        '202':
          description: Export job accepted
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ExportJob' }
    get:
      tags: [Exports]
      summary: List export jobs for the current user
      parameters:
        - name: catalogId
          in: query
          schema: { type: string }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/ExportJob' }

  /exports/{exportId}:
    parameters: [ { $ref: '#/components/parameters/ExportId' } ]
    get:
      tags: [Exports]
      summary: Get status/details of an export job
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ExportJob' }
        '404': { description: Not Found }

  /jobs:
    get:
      tags: [Jobs]
      summary: List generation jobs (images, etc.)
      parameters:
        - name: catalogId
          in: query
          schema: { type: string }
        - name: status
          in: query
          schema: { type: string, enum: [pending, running, success, failed] }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/GenerationJob' }

  /jobs/{jobId}:
    parameters: [ { $ref: '#/components/parameters/JobId' } ]
    get:
      tags: [Jobs]
      summary: Get individual job status
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/GenerationJob' }
        '404': { description: Not Found }

  /jobs/stream:
    get:
      tags: [Jobs]
      summary: Server-Sent Events stream for live job updates
      responses:
        '200':
          description: text/event-stream response
          content:
            text/event-stream:
              schema:
                type: string
```

---

#### Usage Conventions
1. All timestamps are ISO-8601 strings in UTC.
2. Any 4xx/5xx response MAY include `{ error: string }` JSON body.
3. PATCH semantics are **partial update** – only the provided fields change.
4. DELETE operations return 204 with empty body on success.
5. The `output_url` in an ExportJob is a signed, time-limited Supabase Storage URL.

_This contract is a living document. Submit a PR to propose changes._
