# Catalog Image Settings Implementation Plan

## Overview

This document outlines the comprehensive implementation plan for adding catalog image settings functionality to the storefront-tools platform. This feature will allow users to configure image generation parameters at the catalog level, including dimensions, quality, and custom prompts.

## 📋 Implementation Phases

### Phase 1: Database Schema Design & Migration

#### 1.1 Create Catalog Image Settings Table

**Approach**: Create a dedicated table rather than using the existing JSONB `settings` field for better type safety, indexing, and querying performance.

**New Table Structure**:
```sql
catalog_image_settings (
  id: bigint (primary key, generated always as identity)
  catalog_id: text (references product_catalogs.catalog_id on delete cascade)
  
  -- Image Generation Settings
  default_width: integer (default: 1024)
  default_height: integer (default: 1024) 
  default_quality: text (default: 'standard') -- 'standard' | 'hd'
  default_format: text (default: 'webp') -- 'webp' | 'png' | 'jpg'
  
  -- Prompt Configuration
  default_generation_prompt: text
  alternate_prompts: jsonb (array of named prompts)
  
  -- Advanced Settings
  background_style: text (default: 'auto')
  lighting_style: text (default: 'studio')
  image_style: text (default: 'product')
  
  -- Metadata
  created_at: timestamptz (default: now())
  updated_at: timestamptz (default: now())
)
```

**Migration Requirements**:
- Create migration file: `supabase/migrations/[timestamp]_create_catalog_image_settings.sql`
- Add RLS policies following existing patterns
- Add indexes for performance optimization
- Include proper foreign key constraints and cascading deletes
- Add updated_at trigger

#### 1.2 Migration Strategy

**RLS Policies Required**:
```sql
-- Users can view image settings from their own catalogs
CREATE POLICY "Users can view image settings from their own catalogs"
  ON catalog_image_settings FOR SELECT
  TO authenticated
  USING (
    catalog_id IN (
      SELECT pc.catalog_id FROM product_catalogs pc
      JOIN brands b ON pc.brand_id = b.id
      JOIN projects p ON b.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Similar policies for INSERT, UPDATE, DELETE
```

**Indexes**:
```sql
CREATE INDEX idx_catalog_image_settings_catalog_id ON catalog_image_settings (catalog_id);
CREATE INDEX idx_catalog_image_settings_created_at ON catalog_image_settings (created_at DESC);
CREATE INDEX idx_catalog_image_settings_alternate_prompts_gin ON catalog_image_settings USING gin (alternate_prompts);
```

### Phase 2: Backend API Development

#### 2.1 Server Actions for Image Settings

**Files to create/modify**:

**New File**: `actions/catalog-image-settings.ts`
```typescript
export interface CatalogImageSettingsData {
  catalog_id: string
  default_width: number
  default_height: number
  default_quality: 'standard' | 'hd'
  default_format: 'webp' | 'png' | 'jpg'
  default_generation_prompt?: string
  alternate_prompts?: Array<{
    name: string
    prompt: string
    description?: string
  }>
  background_style: string
  lighting_style: string
  image_style: string
}

export async function getCatalogImageSettingsAction(catalogId: string)
export async function updateCatalogImageSettingsAction(catalogId: string, settings: Partial<CatalogImageSettingsData>)
export async function createDefaultImageSettingsAction(catalogId: string)
export async function deleteCatalogImageSettingsAction(catalogId: string)
```

**Update**: `lib/supabase/database-types.ts`
- Add `CatalogImageSettings` type definitions
- Add `CatalogImageSettingsInsert` and `CatalogImageSettingsUpdate` types

#### 2.2 Integration with Image Generation API

**Modify**: `app/api/agents/images/route.ts`
- Accept catalog-specific settings as parameters
- Use catalog defaults when no override provided
- Support custom prompts from catalog settings
- Maintain backward compatibility with existing API

**Enhanced Request Interface**:
```typescript
interface ImageGenerationRequest {
  prompt?: string
  promptOverride?: string
  image_url?: string
  catalogId?: string // New: Use catalog settings as defaults
  settingsOverride?: Partial<CatalogImageSettingsData> // New: Override specific settings
}
```

### Phase 3: Frontend Components Development

#### 3.1 Create Catalog Settings Page Structure

**New Route**: `app/dashboard/projects/[id]/catalogs/[catalogId]/settings/page.tsx`

```typescript
export default async function CatalogSettingsPage({
  params,
}: {
  params: { id: string; catalogId: string }
}) {
  // Fetch catalog and image settings
  // Render settings interface
}
```

**Component Architecture**:
```
CatalogSettingsPage
├── CatalogSettingsLayout
├── CatalogSettingsTabs
│   ├── GeneralSettingsTab (existing catalog info)
│   ├── ImageSettingsTab (new image configuration)
│   └── [Future expansion tabs]
└── SettingsActions (Save/Cancel/Reset)
```

#### 3.2 Image Settings Form Component

**New Component**: `components/catalogs/image-settings-form.tsx`

**Form Sections Structure**:

1. **Image Dimensions & Quality Section**
   - Width/Height inputs with validation
   - Aspect ratio presets (1:1, 4:3, 16:9, custom)
   - Quality dropdown (standard/hd)
   - Format selection (webp/png/jpg)
   - File size estimation display

2. **Generation Prompts Section**
   - Default prompt textarea with character count
   - Alternate prompts manager:
     - Add new named prompts
     - Edit existing prompts
     - Delete prompts
     - Reorder prompts
   - Prompt preview/testing functionality
   - Import/export prompt templates

3. **Style Settings Section**
   - Background style selector (auto/white/transparent/custom color)
   - Lighting presets (studio/natural/dramatic/soft)
   - Image style (product/lifestyle/detail/hero)
   - Custom style parameters

4. **Advanced Options Section**
   - Batch processing settings
   - Output optimization settings
   - Integration preferences

#### 3.3 Enhanced Catalog Detail Page

**Modify**: `components/catalogs/catalog-detail-tabs.tsx`
- Add "Settings" tab to existing tab navigation
- Update routing to include settings functionality
- Maintain consistent styling with existing tabs

**Update**: `app/dashboard/projects/[id]/catalogs/[catalogId]/page.tsx`
- Add settings tab to the catalog detail view
- Ensure proper navigation between tabs

### Phase 4: Integration & Enhancement

#### 4.1 Modify Product Image Generation

**Update**: `components/products/product-image-generator.tsx`
- Fetch catalog image settings on component mount
- Apply catalog defaults to generation parameters
- Show catalog settings as defaults in UI
- Allow per-product overrides while maintaining visibility of catalog defaults
- Add "Use Catalog Settings" reset button

**Enhanced Product Image Generation Flow**:
```typescript
// Fetch catalog settings
const catalogSettings = await getCatalogImageSettingsAction(catalogId)

// Merge with product-specific overrides
const effectiveSettings = {
  ...catalogSettings,
  ...productOverrides,
}

// Use in image generation API call
```

#### 4.2 Catalog Creation Flow Enhancement

**Update**: `components/catalogs/create-catalog-form.tsx`
- Auto-create default image settings after successful catalog creation
- Optional: Add basic image settings section to creation form
- Provide template selection for common catalog types

**Update**: `actions/product-catalogs.ts`
- Modify `createProductCatalogAction` to create default image settings
- Ensure proper cleanup of image settings on catalog deletion

#### 4.3 Settings Management Integration

**New Utility Functions**:
```typescript
// utils/catalog-image-settings.ts
export const DEFAULT_IMAGE_SETTINGS: CatalogImageSettingsData
export const PRESET_TEMPLATES: Record<string, Partial<CatalogImageSettingsData>>
export const validateImageSettings(settings: Partial<CatalogImageSettingsData>): ValidationResult
export const estimateImageFileSize(width: number, height: number, format: string, quality: string): number
```

### Phase 5: User Experience Enhancements

#### 5.1 Settings Validation & Feedback

**Form Validation**:
- Real-time validation with helpful error messages
- Dimension constraints based on AI model limitations
- Prompt length validation and optimization suggestions
- File size impact warnings

**User Feedback**:
- Auto-save functionality with visual indicators
- Settings change impact preview
- Batch update progress tracking
- Success/error toast notifications

#### 5.2 Preset Management System

**Preset Features**:
- Common presets for different catalog types:
  - Fashion & Apparel
  - Electronics & Tech
  - Home & Garden
  - Food & Beverage
  - Beauty & Cosmetics
- Import/export settings between catalogs
- Template system for new catalog creation
- Community preset sharing (future enhancement)

#### 5.3 Integration with Existing Workflows

**Bulk Operations**:
- Apply settings to all existing products in catalog
- Batch regenerate images with new settings
- Settings migration between catalogs
- Bulk prompt testing and optimization

**Inheritance System**:
- Clear hierarchy: Catalog defaults → Product overrides → Generation-time overrides
- Visual indicators showing which settings are inherited vs. customized
- Easy reset to catalog defaults functionality

### Phase 6: Testing & Quality Assurance

#### 6.1 Database Testing

**Migration Testing**:
- Test migrations on development environment
- Verify data integrity during schema changes
- Test rollback procedures
- Performance impact assessment

**RLS Policy Testing**:
- Verify users can only access their own catalog settings
- Test edge cases for shared catalogs (future feature)
- Security audit for data isolation

#### 6.2 Component Testing

**Unit Tests**:
- Form validation logic
- Settings persistence and retrieval
- Image generation parameter merging
- Preset loading and application

**Integration Tests**:
- End-to-end catalog creation with image settings
- Settings modification workflow
- Image generation with catalog settings
- Multi-user access patterns

#### 6.3 User Acceptance Testing

**Test Scenarios**:
- New user creating first catalog with custom image settings
- Experienced user migrating settings between catalogs
- Bulk image regeneration with new settings
- Settings modification impact on existing products

---

## 🔧 Technical Implementation Details

### Database Design Decisions

**Dedicated Table vs. JSONB Approach**:
- **Choice**: Dedicated `catalog_image_settings` table
- **Rationale**: 
  - Better query performance for complex filtering
  - Type safety and validation
  - Easier indexing for frequently accessed settings
  - Clear schema evolution path

**Data Relationships**:
- One-to-one relationship with `product_catalogs`
- Cascading deletes to maintain data integrity
- Foreign key constraints with proper indexing

### API Design Principles

**RESTful Actions**:
- Follow existing server action patterns using `useActionState`
- Consistent error handling and validation
- Optimistic updates where appropriate
- Proper loading states and user feedback

**Backward Compatibility**:
- Existing image generation API remains functional
- Gradual migration path for existing catalogs
- Default settings ensure no breaking changes

### UI/UX Design Standards

**Design System Consistency**:
- Uses PandaCSS styling patterns from existing components
- Follows established form component structure
- Maintains consistent spacing, typography, and color scheme
- React 19 form patterns with `useActionState`

**Accessibility Requirements**:
- Proper ARIA labels for all form controls
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

### Performance Considerations

**Database Optimization**:
- Strategic indexing on frequently queried fields
- Efficient RLS policy design
- Connection pooling considerations
- Query optimization for settings retrieval

**Frontend Optimization**:
- Lazy loading of settings components
- Debounced form validation
- Optimistic updates for better UX
- Efficient re-rendering strategies

---

## 📅 Implementation Timeline

### Week 1-2: Foundation
- [ ] Database schema design and migration creation
- [ ] Basic server actions implementation
- [ ] Type definitions and database integration
- [ ] Unit tests for core functionality

### Week 3-4: Core Components
- [ ] Image settings form component development
- [ ] Settings page routing and layout
- [ ] Integration with catalog detail tabs
- [ ] Form validation and user feedback

### Week 5-6: Integration
- [ ] Product image generation integration
- [ ] Catalog creation flow enhancement
- [ ] Preset system implementation
- [ ] Bulk operations functionality

### Week 7-8: Polish & Testing
- [ ] Comprehensive testing suite
- [ ] User experience refinements
- [ ] Performance optimization
- [ ] Documentation and deployment preparation

---

## 🚀 Future Enhancements

### Phase 2 Features (Post-MVP)
- Advanced AI model selection per catalog
- Custom style training from uploaded images
- A/B testing for different image settings
- Analytics for image performance metrics
- Integration with external image optimization services

### Phase 3 Features (Long-term)
- Community preset marketplace
- AI-powered settings optimization recommendations
- Multi-brand template management
- Advanced batch processing with queuing
- Integration with content management systems

---

## 📋 Success Metrics

### Technical Metrics
- [ ] Zero breaking changes to existing functionality
- [ ] Sub-200ms response time for settings retrieval
- [ ] 99.9% uptime for image generation with new settings
- [ ] Complete test coverage for new components

### User Experience Metrics
- [ ] Intuitive settings configuration (< 5 minutes for new users)
- [ ] Successful image generation rate > 95%
- [ ] User satisfaction with generated image quality
- [ ] Adoption rate of custom settings vs. defaults

---

## 📖 Documentation Requirements

### Developer Documentation
- [ ] API reference for new endpoints
- [ ] Database schema documentation
- [ ] Component usage examples
- [ ] Migration and deployment guides

### User Documentation
- [ ] Settings configuration guide
- [ ] Image generation best practices
- [ ] Troubleshooting common issues
- [ ] Video tutorials for complex workflows

---

*This document serves as the master implementation plan and will be updated as development progresses.* 