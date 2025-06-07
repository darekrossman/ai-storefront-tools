# Storefront Tools - Detailed Execution Plan

## Overview

This execution plan provides concrete implementation steps for building the Storefront Tools application. Each phase includes specific tasks, code examples, and technical specifications to guide AI coding assistants through the development process.

## Prerequisites

- Next.js 15 project setup with TypeScript ✅
- PandaCSS configuration ✅
- OpenAI integration ✅
- Basic project structure ✅

## Phase 1: Foundation & Architecture (Weeks 1-2)

### 1.1 Project Structure Setup

**Goal**: Create a scalable application architecture with proper routing and shared components.

**Tasks**:

#### 1.1.1 Create Core Directory Structure
```
app/
├── (dashboard)/
│   ├── brand-inventor/
│   │   └── page.tsx
│   ├── product-designer/
│   │   └── page.tsx
│   ├── image-generator/
│   │   └── page.tsx
│   ├── marketing-designer/
│   │   └── page.tsx
│   ├── catalog-generator/
│   │   └── page.tsx
│   └── layout.tsx
├── api/
│   ├── agents/
│   │   ├── brand/route.ts
│   │   ├── products/route.ts
│   │   ├── images/route.ts
│   │   ├── marketing/route.ts
│   │   └── export/route.ts
│   ├── storage/
│   │   ├── read/route.ts
│   │   ├── write/route.ts
│   │   └── session/route.ts
│   └── files/
│       ├── upload/route.ts
│       └── delete/route.ts
├── components/
│   ├── ui/
│   ├── agents/
│   └── shared/
├── lib/
│   ├── types.ts
│   ├── storage.ts
│   ├── ai.ts
│   └── utils.ts
├── data/
│   ├── sessions/
│   │   └── [sessionId]/
│   │       ├── brand.json
│   │       ├── products.json
│   │       ├── images.json
│   │       └── design-system.json
│   └── templates/
└── public/
    └── generated-assets/
        └── [sessionId]/
            ├── images/
            ├── exports/
            └── temp/
```

#### 1.1.2 Define TypeScript Interfaces
**File**: `lib/types.ts`
```typescript
// Brand Types
export interface Brand {
  id: string
  name: string
  tagline: string
  mission: string
  values: string[]
  personality: BrandPersonality
  targetMarkets: TargetMarket[]
  customerPersonas: CustomerPersona[]
  visualIdentity: VisualIdentity
  story: string
  competitivePosition: string
  createdAt: Date
  updatedAt: Date
}

export interface BrandPersonality {
  traits: string[]
  toneOfVoice: string[]
  communicationStyle: string
}

export interface TargetMarket {
  name: string
  demographics: string
  psychographics: string
  painPoints: string[]
  interests: string[]
}

export interface CustomerPersona {
  name: string
  age: string
  occupation: string
  background: string
  goals: string[]
  frustrations: string[]
  behaviors: string[]
}

export interface VisualIdentity {
  colorScheme: string[]
  aesthetic: string[]
  imagery: string[]
  mood: string
}

// Product Types
export interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  sku: string
  handle: string
  category: ProductCategory
  subcategories: string[]
  specifications: ProductSpecification[]
  variations: ProductVariation[]
  pricing: PricingStructure
  tags: string[]
  seoData: SEOData
  brandAlignment: BrandAlignment
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductCategory {
  name: string
  description: string
  parentCategory?: string
}

export interface ProductSpecification {
  name: string
  value: string
  unit?: string
}

export interface ProductVariation {
  optionName: string
  value: string
  sku: string
  price?: number
  compareAtPrice?: number
  inventory?: number
}

export interface PricingStructure {
  basePrice: number
  compareAtPrice?: number
  costPrice?: number
  margin?: number
  currency: string
}

export interface SEOData {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  slug: string
}

export interface BrandAlignment {
  alignmentScore: number
  alignmentNotes: string
  brandValues: string[]
}

// Image Types
export interface ProductImage {
  id: string
  productId: string
  url: string
  localPath: string
  type: ImageType
  style: ImageStyle
  aspectRatio: string
  backgroundColor: string
  generationPrompt: string
  model: string
  metadata: ImageMetadata
  approved: boolean
  createdAt: Date
}

export type ImageType = 'hero' | 'lifestyle' | 'detail' | 'studio' | 'transparent'
export type ImageStyle = 'minimal' | 'lifestyle' | 'dramatic' | 'natural' | 'artistic'

export interface ImageMetadata {
  width: number
  height: number
  fileSize: number
  format: string
  generationTime: number
  prompt: string
}

// Marketing Types
export interface BrandDesignSystem {
  id: string
  brandId: string
  colorPalette: ColorPalette
  typography: TypographySystem
  logos: LogoAssets
  patterns: DesignPattern[]
  templates: MarketingTemplate[]
  guidelines: BrandGuideline[]
  assets: DesignAsset[]
  createdAt: Date
  updatedAt: Date
}

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string[]
  neutral: string[]
  success: string
  warning: string
  error: string
}

export interface TypographySystem {
  headings: FontDefinition
  body: FontDefinition
  caption: FontDefinition
  fontPairs: FontPair[]
}

export interface FontDefinition {
  fontFamily: string
  fontWeight: number[]
  lineHeight: number
  letterSpacing?: number
}

export interface FontPair {
  name: string
  heading: string
  body: string
  description: string
}

// Chat Types
export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface AgentContext {
  agent: 'brand' | 'product' | 'image' | 'marketing' | 'export'
  currentData: any
  sessionId: string
}

// Export Types
export interface CatalogExport {
  id: string
  platform: EcommercePlatform
  format: ExportFormat
  products: Product[]
  brand: Brand
  configuration: ExportConfiguration
  validation: ValidationResult
  downloadUrl: string
  createdAt: Date
}

export type EcommercePlatform = 'shopify' | 'woocommerce' | 'magento' | 'custom'
export type ExportFormat = 'csv' | 'json' | 'xml'

export interface ExportConfiguration {
  includeImages: boolean
  imageBaseUrl: string
  currencyCode: string
  weightUnit: string
  dimensionUnit: string
  customFields: Record<string, string>
}
```

#### 1.1.3 AI SDK UI Hook Setup
**File**: `lib/schemas.ts`
```typescript
import { z } from 'zod'

// Schema definitions for AI SDK UI useObject hooks
export const BrandSchema = z.object({
  name: z.string().describe('Brand name'),
  tagline: z.string().describe('Brand tagline'),
  mission: z.string().describe('Brand mission statement'),
  values: z.array(z.string()).describe('Core brand values'),
  targetMarket: z.string().describe('Primary target market description'),
  personality: z.array(z.string()).describe('Brand personality traits'),
  colorScheme: z.array(z.string()).describe('Suggested brand colors'),
  aesthetic: z.string().describe('Visual aesthetic description'),
})

export const ProductCatalogSchema = z.object({
  products: z.array(z.object({
    name: z.string().describe('Product name'),
    description: z.string().describe('Detailed product description'),
    shortDescription: z.string().describe('Brief product summary'),
    category: z.string().describe('Product category'),
    specifications: z.array(z.object({
      name: z.string(),
      value: z.string(),
    })).describe('Product specifications'),
    pricing: z.object({
      basePrice: z.number().describe('Base price in USD'),
      compareAtPrice: z.number().optional().describe('Compare at price'),
    }),
    tags: z.array(z.string()).describe('Product tags'),
  }))
})

export const MarketingSystemSchema = z.object({
  colorPalette: z.object({
    primary: z.string().describe('Primary brand color'),
    secondary: z.string().describe('Secondary brand color'),
    accent: z.array(z.string()).describe('Accent colors'),
    neutral: z.array(z.string()).describe('Neutral colors'),
  }),
  typography: z.object({
    headingFont: z.string().describe('Heading font recommendation'),
    bodyFont: z.string().describe('Body text font recommendation'),
    fontPairs: z.array(z.string()).describe('Font pairing suggestions'),
  }),
  marketingCopy: z.object({
    heroHeadline: z.string().describe('Main hero section headline'),
    heroSubtext: z.string().describe('Hero section supporting text'),
    aboutSection: z.string().describe('About the brand section'),
    valueProposition: z.string().describe('Key value proposition'),
  }),
})
```

#### 1.1.4 AI SDK UI Components
**File**: `components/ai/agent-chat.tsx`
```typescript
'use client'

import { useChat } from '@ai-sdk/react'
import { useState } from 'react'

interface AgentChatProps {
  agentType: 'brand' | 'product' | 'image' | 'marketing' | 'export'
  onDataGenerated?: (data: any) => void
  initialContext?: any
}

export function AgentChat({ agentType, onDataGenerated, initialContext }: AgentChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/agents/${agentType}`,
    initialMessages: initialContext ? [
      { role: 'system', content: `Context: ${JSON.stringify(initialContext)}` }
    ] : [],
    onFinish: (message) => {
      if (onDataGenerated) {
        onDataGenerated(message.content)
      }
    }
  })

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            {m.content}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Ask me anything..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
```

#### 1.1.5 AI SDK UI Object Generation
**File**: `components/ai/object-generator.tsx`
```typescript
'use client'

import { useObject } from '@ai-sdk/react'
import { z } from 'zod'

interface ObjectGeneratorProps<T> {
  schema: z.ZodSchema<T>
  api: string
  prompt: string
  onComplete?: (object: T) => void
}

export function ObjectGenerator<T>({ 
  schema, 
  api, 
  prompt, 
  onComplete 
}: ObjectGeneratorProps<T>) {
  const { object, submit, isLoading, error } = useObject({
    api,
    schema,
    onFinish: ({ object }) => {
      if (object && onComplete) {
        onComplete(object)
      }
    }
  })

  const handleGenerate = () => {
    submit(prompt)
  }

  return (
    <div className="object-generator">
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
      
      {error && (
        <div className="error">
          Error: {error.message}
        </div>
      )}
      
      {object && (
        <div className="result">
          <pre>{JSON.stringify(object, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
```

#### 1.1.4 Data Storage Utilities
**File**: `lib/storage.ts`
```typescript
import { Brand, Product, ProductImage, BrandDesignSystem } from './types'

export class FileStorageManager {
  private sessionId: string

  constructor(sessionId?: string) {
    this.sessionId = sessionId || this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getSessionPath(): string {
    return `/data/sessions/${this.sessionId}`
  }

  private getAssetPath(): string {
    return `/generated-assets/${this.sessionId}`
  }

  // File operation utilities
  private async readJsonFile<T>(filename: string): Promise<T | null> {
    try {
      const response = await fetch(`/api/storage/read?session=${this.sessionId}&file=${filename}`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error(`Failed to read ${filename}:`, error)
      return null
    }
  }

  private async writeJsonFile<T>(filename: string, data: T): Promise<void> {
    try {
      const response = await fetch('/api/storage/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          filename,
          data
        })
      })
      if (!response.ok) throw new Error('Failed to write file')
    } catch (error) {
      console.error(`Failed to write ${filename}:`, error)
      throw error
    }
  }

  // Session management
  getSessionId(): string {
    return this.sessionId
  }

  async initializeSession(): Promise<void> {
    try {
      const response = await fetch('/api/storage/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: this.sessionId })
      })
      if (!response.ok) throw new Error('Failed to initialize session')
    } catch (error) {
      console.error('Session initialization failed:', error)
      throw error
    }
  }

  // Brand methods
  async saveBrand(brand: Brand): Promise<void> {
    await this.writeJsonFile('brand.json', brand)
  }

  async getBrand(): Promise<Brand | null> {
    return await this.readJsonFile<Brand>('brand.json')
  }

  // Product methods
  async saveProducts(products: Product[]): Promise<void> {
    await this.writeJsonFile('products.json', products)
  }

  async getProducts(): Promise<Product[]> {
    const products = await this.readJsonFile<Product[]>('products.json')
    return products || []
  }

  async addProduct(product: Product): Promise<void> {
    const products = await this.getProducts()
    products.push(product)
    await this.saveProducts(products)
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    const products = await this.getProducts()
    const index = products.findIndex(p => p.id === productId)
    if (index !== -1) {
      products[index] = { ...products[index], ...updates, updatedAt: new Date() }
      await this.saveProducts(products)
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const products = await this.getProducts()
    const filtered = products.filter(p => p.id !== productId)
    await this.saveProducts(filtered)
  }

  // Image methods
  async saveImages(images: ProductImage[]): Promise<void> {
    await this.writeJsonFile('images.json', images)
  }

  async getImages(): Promise<ProductImage[]> {
    const images = await this.readJsonFile<ProductImage[]>('images.json')
    return images || []
  }

  async getImagesByProductId(productId: string): Promise<ProductImage[]> {
    const images = await this.getImages()
    return images.filter(img => img.productId === productId)
  }

  async addImage(image: ProductImage): Promise<void> {
    const images = await this.getImages()
    images.push(image)
    await this.saveImages(images)
  }

  // Design system methods
  async saveDesignSystem(designSystem: BrandDesignSystem): Promise<void> {
    await this.writeJsonFile('design-system.json', designSystem)
  }

  async getDesignSystem(): Promise<BrandDesignSystem | null> {
    return await this.readJsonFile<BrandDesignSystem>('design-system.json')
  }

  // File management
  async saveImageFile(imageBlob: Blob, filename: string): Promise<string> {
    const formData = new FormData()
    formData.append('file', imageBlob, filename)
    formData.append('sessionId', this.sessionId)
    formData.append('type', 'image')

    const response = await fetch('/api/files/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) throw new Error('Failed to save image file')
    const result = await response.json()
    return result.url
  }

  async deleteImageFile(filename: string): Promise<void> {
    const response = await fetch('/api/files/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        filename,
        type: 'image'
      })
    })

    if (!response.ok) throw new Error('Failed to delete image file')
  }

  // Export methods
  async exportAllData(): Promise<string> {
    const [brand, products, images, designSystem] = await Promise.all([
      this.getBrand(),
      this.getProducts(),
      this.getImages(),
      this.getDesignSystem()
    ])

    return JSON.stringify({
      sessionId: this.sessionId,
      brand,
      products,
      images,
      designSystem,
      exportedAt: new Date()
    }, null, 2)
  }

  async importData(data: string): Promise<void> {
    try {
      const parsed = JSON.parse(data)
      
      if (parsed.brand) await this.saveBrand(parsed.brand)
      if (parsed.products) await this.saveProducts(parsed.products)
      if (parsed.images) await this.saveImages(parsed.images)
      if (parsed.designSystem) await this.saveDesignSystem(parsed.designSystem)
    } catch (error) {
      console.error('Failed to import data:', error)
      throw new Error('Invalid data format')
    }
  }

  // Cleanup
  async clearSession(): Promise<void> {
    try {
      const response = await fetch('/api/storage/session', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: this.sessionId })
      })
      if (!response.ok) throw new Error('Failed to clear session')
    } catch (error) {
      console.error('Session cleanup failed:', error)
      throw error
    }
  }
}

// Client-side storage manager with session handling
export class ClientStorageManager extends FileStorageManager {
  private static instance: ClientStorageManager

  constructor() {
    const sessionId = typeof window !== 'undefined' 
      ? sessionStorage.getItem('storefront_tools_session') || undefined
      : undefined
    
    super(sessionId)
    
    if (typeof window !== 'undefined' && !sessionStorage.getItem('storefront_tools_session')) {
      sessionStorage.setItem('storefront_tools_session', this.getSessionId())
      this.initializeSession()
    }
  }

  static getInstance(): ClientStorageManager {
    if (!ClientStorageManager.instance) {
      ClientStorageManager.instance = new ClientStorageManager()
    }
    return ClientStorageManager.instance
  }
}

export const storage = ClientStorageManager.getInstance()
```

### 1.2 UI Component Library

#### 1.2.1 Base UI Components
**File**: `components/ui/button.tsx`
```typescript
import { css } from '../../../styled-system/css'
import { type ReactNode, type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className,
  ...props 
}: ButtonProps) => {
  const buttonStyles = css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'md',
    fontWeight: 'medium',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none',
    
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },

    _variants: {
      variant: {
        primary: {
          bg: 'blue.600',
          color: 'white',
          _hover: { bg: 'blue.700' }
        },
        secondary: {
          bg: 'gray.100',
          color: 'gray.900',
          _hover: { bg: 'gray.200' }
        },
        outline: {
          bg: 'transparent',
          color: 'blue.600',
          border: '1px solid',
          borderColor: 'blue.600',
          _hover: { bg: 'blue.50' }
        },
        ghost: {
          bg: 'transparent',
          color: 'gray.600',
          _hover: { bg: 'gray.100' }
        }
      },
      size: {
        sm: {
          px: 3,
          py: 1.5,
          fontSize: 'sm'
        },
        md: {
          px: 4,
          py: 2,
          fontSize: 'md'
        },
        lg: {
          px: 6,
          py: 3,
          fontSize: 'lg'
        }
      }
    }
  })

  return (
    <button 
      className={`${buttonStyles} ${className || ''}`} 
      {...props}
    >
      {children}
    </button>
  )
}
```

**File**: `components/ui/input.tsx`
```typescript
import { css } from '../../../styled-system/css'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, ...props }, ref) => {
    const inputStyles = css({
      w: 'full',
      px: 3,
      py: 2,
      border: '1px solid',
      borderColor: error ? 'red.300' : 'gray.300',
      borderRadius: 'md',
      fontSize: 'md',
      transition: 'border-color 0.2s',
      
      _focus: {
        outline: 'none',
        borderColor: error ? 'red.500' : 'blue.500',
        ring: '2px',
        ringColor: error ? 'red.200' : 'blue.200'
      },

      _disabled: {
        bg: 'gray.50',
        cursor: 'not-allowed'
      }
    })

    return (
      <div className={css({ w: 'full' })}>
        {label && (
          <label className={css({ 
            display: 'block', 
            fontSize: 'sm', 
            fontWeight: 'medium', 
            color: 'gray.700',
            mb: 1
          })}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${inputStyles} ${className || ''}`}
          {...props}
        />
        {error && (
          <p className={css({ 
            mt: 1, 
            fontSize: 'sm', 
            color: 'red.600' 
          })}>
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className={css({ 
            mt: 1, 
            fontSize: 'sm', 
            color: 'gray.500' 
          })}>
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

#### 1.2.2 Chat Interface Component
**File**: `components/shared/chat-interface.tsx`
```typescript
'use client'

import { useState, useRef, useEffect } from 'react'
import { css } from '../../../styled-system/css'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Send, Bot, User } from 'lucide-react'
import { type Message, type AgentContext } from '../../lib/types'

interface ChatInterfaceProps {
  agent: AgentContext['agent']
  onMessage: (message: string) => Promise<void>
  messages: Message[]
  isLoading: boolean
  placeholder?: string
}

export const ChatInterface = ({ 
  agent, 
  onMessage, 
  messages, 
  isLoading,
  placeholder = "Type your message..."
}: ChatInterfaceProps) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    await onMessage(userMessage)
  }

  const containerStyles = css({
    display: 'flex',
    flexDirection: 'column',
    h: 'full',
    maxH: '600px',
    border: '1px solid',
    borderColor: 'gray.200',
    borderRadius: 'lg',
    overflow: 'hidden'
  })

  const messagesStyles = css({
    flex: 1,
    overflowY: 'auto',
    p: 4,
    space: 4
  })

  const messageStyles = css({
    display: 'flex',
    gap: 3,
    mb: 4,
    _last: { mb: 0 }
  })

  const avatarStyles = css({
    w: 8,
    h: 8,
    borderRadius: 'full',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  })

  const userAvatarStyles = css({
    bg: 'blue.100',
    color: 'blue.600'
  })

  const botAvatarStyles = css({
    bg: 'gray.100',
    color: 'gray.600'
  })

  const messageContentStyles = css({
    flex: 1,
    bg: 'white',
    p: 3,
    borderRadius: 'lg',
    border: '1px solid',
    borderColor: 'gray.100'
  })

  const inputContainerStyles = css({
    p: 4,
    borderTop: '1px solid',
    borderColor: 'gray.200',
    bg: 'gray.50'
  })

  const inputFormStyles = css({
    display: 'flex',
    gap: 2
  })

  return (
    <div className={containerStyles}>
      <div className={messagesStyles}>
        {messages.length === 0 && (
          <div className={css({
            textAlign: 'center',
            color: 'gray.500',
            py: 8
          })}>
            <Bot className={css({ mx: 'auto', mb: 2 })} size={48} />
            <p>Start a conversation with the {agent} agent</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={messageStyles}>
            <div className={`${avatarStyles} ${
              message.role === 'user' ? userAvatarStyles : botAvatarStyles
            }`}>
              {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={messageContentStyles}>
              <div className={css({
                fontSize: 'xs',
                color: 'gray.500',
                mb: 1,
                textTransform: 'capitalize'
              })}>
                {message.role === 'user' ? 'You' : `${agent} Agent`}
              </div>
              <div className={css({ 
                fontSize: 'sm',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              })}>
                {message.content}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className={messageStyles}>
            <div className={`${avatarStyles} ${botAvatarStyles}`}>
              <Bot size={16} />
            </div>
            <div className={messageContentStyles}>
              <div className={css({
                display: 'flex',
                gap: 1,
                alignItems: 'center'
              })}>
                <div className={css({
                  w: 2,
                  h: 2,
                  bg: 'gray.400',
                  borderRadius: 'full',
                  animation: 'pulse 1.5s ease-in-out infinite'
                })} />
                <div className={css({
                  w: 2,
                  h: 2,
                  bg: 'gray.400',
                  borderRadius: 'full',
                  animation: 'pulse 1.5s ease-in-out infinite 0.5s'
                })} />
                <div className={css({
                  w: 2,
                  h: 2,
                  bg: 'gray.400',
                  borderRadius: 'full',
                  animation: 'pulse 1.5s ease-in-out infinite 1s'
                })} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className={inputContainerStyles}>
        <form onSubmit={handleSubmit} className={inputFormStyles}>
          <div className={css({ flex: 1 })}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            size="md"
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  )
}
```

### 1.3 Navigation Layout

#### 1.3.1 Dashboard Layout
**File**: `app/(dashboard)/layout.tsx`
```typescript
'use client'

import { css } from '../../../styled-system/css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Lightbulb, 
  Package, 
  Image, 
  Palette, 
  Download,
  ChevronRight 
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Brand Inventor',
    href: '/brand-inventor',
    icon: Lightbulb,
    description: 'Create brand identity'
  },
  {
    name: 'Product Designer',
    href: '/product-designer',
    icon: Package,
    description: 'Generate product catalog'
  },
  {
    name: 'Image Generator',
    href: '/image-generator',
    icon: Image,
    description: 'Create product images'
  },
  {
    name: 'Marketing Designer',
    href: '/marketing-designer',
    icon: Palette,
    description: 'Build brand assets'
  },
  {
    name: 'Catalog Generator',
    href: '/catalog-generator',
    icon: Download,
    description: 'Export for platforms'
  }
]

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const layoutStyles = css({
    minH: 'screen',
    bg: 'gray.50'
  })

  const sidebarStyles = css({
    w: '280px',
    bg: 'white',
    borderRight: '1px solid',
    borderColor: 'gray.200',
    p: 6,
    position: 'fixed',
    h: 'full',
    overflowY: 'auto'
  })

  const contentStyles = css({
    ml: '280px',
    p: 6
  })

  const logoStyles = css({
    fontSize: 'xl',
    fontWeight: 'bold',
    color: 'gray.900',
    mb: 8
  })

  const navStyles = css({
    space: 2
  })

  const navItemStyles = css({
    display: 'flex',
    alignItems: 'center',
    w: 'full',
    p: 3,
    borderRadius: 'md',
    transition: 'all 0.2s',
    textDecoration: 'none',
    color: 'gray.600',
    
    _hover: {
      bg: 'gray.50',
      color: 'gray.900'
    }
  })

  const activeNavItemStyles = css({
    bg: 'blue.50',
    color: 'blue.700',
    borderLeft: '3px solid',
    borderColor: 'blue.500'
  })

  return (
    <div className={layoutStyles}>
      <aside className={sidebarStyles}>
        <div className={logoStyles}>
          Storefront Tools
        </div>
        
        <nav className={navStyles}>
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${navItemStyles} ${isActive ? activeNavItemStyles : ''}`}
              >
                <Icon size={20} className={css({ mr: 3, flexShrink: 0 })} />
                <div className={css({ flex: 1 })}>
                  <div className={css({ 
                    fontSize: 'sm', 
                    fontWeight: 'medium',
                    mb: 0.5
                  })}>
                    {item.name}
                  </div>
                  <div className={css({ 
                    fontSize: 'xs', 
                    color: 'gray.500' 
                  })}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <ChevronRight size={16} className={css({ color: 'blue.500' })} />
                )}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className={contentStyles}>
        {children}
      </main>
    </div>
  )
}
```

### 1.4 AI Integration Setup

#### 1.4.1 AI Utilities
**File**: `lib/ai.ts`
```typescript
import { openai } from '@ai-sdk/openai'
import { streamText, generateObject } from 'ai'
import { z } from 'zod'
import { type Brand, type Product, type AgentContext } from './types'

// Brand generation schema
const BrandSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  mission: z.string(),
  values: z.array(z.string()),
  personality: z.object({
    traits: z.array(z.string()),
    toneOfVoice: z.array(z.string()),
    communicationStyle: z.string()
  }),
  targetMarkets: z.array(z.object({
    name: z.string(),
    demographics: z.string(),
    psychographics: z.string(),
    painPoints: z.array(z.string()),
    interests: z.array(z.string())
  })),
  customerPersonas: z.array(z.object({
    name: z.string(),
    age: z.string(),
    occupation: z.string(),
    background: z.string(),
    goals: z.array(z.string()),
    frustrations: z.array(z.string()),
    behaviors: z.array(z.string())
  })),
  visualIdentity: z.object({
    colorScheme: z.array(z.string()),
    aesthetic: z.array(z.string()),
    imagery: z.array(z.string()),
    mood: z.string()
  }),
  story: z.string(),
  competitivePosition: z.string()
})

// Product generation schema  
const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  shortDescription: z.string(),
  category: z.object({
    name: z.string(),
    description: z.string()
  }),
  subcategories: z.array(z.string()),
  specifications: z.array(z.object({
    name: z.string(),
    value: z.string(),
    unit: z.string().optional()
  })),
  variations: z.array(z.object({
    optionName: z.string(),
    value: z.string(),
    sku: z.string(),
    price: z.number().optional()
  })),
  pricing: z.object({
    basePrice: z.number(),
    compareAtPrice: z.number().optional(),
    currency: z.string()
  }),
  tags: z.array(z.string()),
  seoData: z.object({
    metaTitle: z.string(),
    metaDescription: z.string(),
    keywords: z.array(z.string()),
    slug: z.string()
  })
})

export class AIService {
  private model = openai('gpt-4')

  async generateBrand(prompt: string): Promise<Partial<Brand>> {
    const systemPrompt = `You are a brand strategist and creative director. Generate a comprehensive brand identity based on the user's prompt. Create a cohesive, realistic brand that could exist in the market.

Focus on creating:
- A memorable, trademark-appropriate brand name
- Clear brand personality and positioning
- Realistic target markets and customer personas
- Cohesive visual identity direction
- Authentic brand story and mission

Ensure all elements work together cohesively and reflect current market trends and consumer psychology.`

    try {
      const result = await generateObject({
        model: this.model,
        system: systemPrompt,
        prompt: `Create a brand based on this concept: ${prompt}`,
        schema: BrandSchema
      })

      return {
        ...result.object,
        id: `brand_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    } catch (error) {
      console.error('Brand generation failed:', error)
      throw new Error('Failed to generate brand. Please try again.')
    }
  }

  async generateProducts(brand: Brand, count: number = 10): Promise<Partial<Product>[]> {
    const systemPrompt = `You are a product designer and strategist. Create realistic products for the given brand that align with their identity, target market, and brand values.

Consider:
- Brand aesthetic and values alignment
- Target market needs and preferences  
- Market-appropriate pricing
- Realistic product specifications
- SEO-optimized content
- Logical product variations

Create products that feel authentic to the brand and could realistically exist in the market.`

    const brandContext = `
Brand: ${brand.name}
Mission: ${brand.mission}
Values: ${brand.values.join(', ')}
Target Markets: ${brand.targetMarkets.map(tm => tm.name).join(', ')}
Aesthetic: ${brand.visualIdentity.aesthetic.join(', ')}
Personality: ${brand.personality.traits.join(', ')}
`

    try {
      const products: Partial<Product>[] = []
      
      // Generate products in batches to avoid token limits
      const batchSize = 3
      const batches = Math.ceil(count / batchSize)
      
      for (let i = 0; i < batches; i++) {
        const remainingCount = Math.min(batchSize, count - (i * batchSize))
        
        const result = await generateObject({
          model: this.model,
          system: systemPrompt,
          prompt: `Generate ${remainingCount} products for this brand:\n${brandContext}`,
          schema: z.object({
            products: z.array(ProductSchema)
          })
        })

        const batchProducts = result.object.products.map(product => ({
          ...product,
          id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          handle: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          sku: `${brand.name.substring(0, 3).toUpperCase()}-${product.name.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          images: [],
          brandAlignment: {
            alignmentScore: 0.95,
            alignmentNotes: 'Generated to align with brand identity',
            brandValues: brand.values
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }))

        products.push(...batchProducts)
      }

      return products
    } catch (error) {
      console.error('Product generation failed:', error)
      throw new Error('Failed to generate products. Please try again.')
    }
  }

  async chatWithAgent(
    agent: AgentContext['agent'],
    messages: { role: 'user' | 'assistant'; content: string }[],
    context?: any
  ) {
    const systemPrompts = {
      brand: `You are a brand strategist and creative director. Help users refine and iterate on their brand identity. You can suggest changes to brand names, mission statements, values, target markets, and visual identity. Always maintain brand coherence and market viability.`,
      
      product: `You are a product designer and strategist. Help users refine their product catalog, add new products, modify existing ones, and ensure brand alignment. Consider market fit, pricing strategy, and customer needs.`,
      
      image: `You are a creative director specializing in product photography and visual content. Help users plan and refine product imagery, suggest photo styles, compositions, and visual treatments that align with their brand.`,
      
      marketing: `You are a brand and marketing designer. Help users develop comprehensive brand guidelines, color palettes, typography, and marketing materials that create a cohesive brand experience.`,
      
      export: `You are an ecommerce platform specialist. Help users prepare their product data for export to various platforms, ensuring data quality, compliance, and optimization for their chosen platform.`
    }

    const contextPrompt = context ? `\n\nCurrent context: ${JSON.stringify(context, null, 2)}` : ''

    return streamText({
      model: this.model,
      system: systemPrompts[agent] + contextPrompt,
      messages
    })
  }
}

export const aiService = new AIService()
```

### 1.5 File Storage API Routes

#### 1.5.1 Storage Read API
**File**: `app/api/storage/read/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session')
    const filename = searchParams.get('file')

    if (!sessionId || !filename) {
      return NextResponse.json({ error: 'Missing session or file parameter' }, { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'data', 'sessions', sessionId, filename)
    
    try {
      const data = await fs.readFile(filePath, 'utf8')
      return NextResponse.json(JSON.parse(data))
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }
      throw error
    }
  } catch (error) {
    console.error('Storage read error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

#### 1.5.2 Storage Write API
**File**: `app/api/storage/write/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, filename, data } = await request.json()

    if (!sessionId || !filename || data === undefined) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const sessionDir = path.join(process.cwd(), 'data', 'sessions', sessionId)
    const filePath = path.join(sessionDir, filename)

    // Ensure directory exists
    await fs.mkdir(sessionDir, { recursive: true })

    // Write file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Storage write error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

#### 1.5.3 Session Management API
**File**: `app/api/storage/session/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const sessionDir = path.join(process.cwd(), 'data', 'sessions', sessionId)
    const assetsDir = path.join(process.cwd(), 'public', 'generated-assets', sessionId)

    // Create session directories
    await fs.mkdir(sessionDir, { recursive: true })
    await fs.mkdir(path.join(assetsDir, 'images'), { recursive: true })
    await fs.mkdir(path.join(assetsDir, 'exports'), { recursive: true })
    await fs.mkdir(path.join(assetsDir, 'temp'), { recursive: true })

    return NextResponse.json({ success: true, sessionId })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const sessionDir = path.join(process.cwd(), 'data', 'sessions', sessionId)
    const assetsDir = path.join(process.cwd(), 'public', 'generated-assets', sessionId)

    // Remove session directories
    await fs.rm(sessionDir, { recursive: true, force: true })
    await fs.rm(assetsDir, { recursive: true, force: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Session deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

#### 1.5.4 File Upload API
**File**: `app/api/files/upload/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const sessionId = formData.get('sessionId') as string
    const type = formData.get('type') as string

    if (!file || !sessionId || !type) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}_${file.name}`
    const uploadDir = path.join(process.cwd(), 'public', 'generated-assets', sessionId, type + 's')
    const filePath = path.join(uploadDir, filename)

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true })

    // Write file
    await fs.writeFile(filePath, buffer)

    const publicUrl = `/generated-assets/${sessionId}/${type}s/${filename}`

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename 
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

This execution plan provides the foundational architecture for Phase 1 with file-based storage. Each subsequent phase will build upon this foundation with specific agent implementations, advanced features, and integrations. The plan emphasizes modularity, type safety, and scalability to ensure the application can grow with additional features and requirements.

## Next Steps

1. Implement the foundation components and utilities with file-based storage
2. Create the file storage API endpoints for data persistence
3. Create the Brand Inventor agent interface and API
4. Build the Product Designer agent with catalog management
5. Develop the Image Generator with AI integration
6. Complete the Marketing Designer and Catalog Generator agents

Each phase includes detailed implementation tasks, code examples, and architectural decisions to guide AI coding assistants through the development process. 