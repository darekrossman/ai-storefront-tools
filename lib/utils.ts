// ==============================================
// Common Utility Functions
// ==============================================
// Shared utilities used across the application
// Includes string manipulation, data transformation,
// validation helpers, and formatting functions

// Removed clsx and tailwind-merge dependencies
import type {
  APIResponse,
  AgentType,
  Brand,
  DesignSystem,
  ExportFormat,
  Product,
  ProductImage,
} from './types'

// ==============================================
// STYLING UTILITIES
// ==============================================

/**
 * Combine CSS classes for PandaCSS
 * Simple class name combiner without external dependencies
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Generate color variants from a base color
 */
export function generateColorVariants(baseColor: string): Record<string, string> {
  // This would typically use a color manipulation library
  // For now, returning a basic structure
  const hue = extractHue(baseColor)

  return {
    50: adjustLightness(baseColor, 95),
    100: adjustLightness(baseColor, 90),
    200: adjustLightness(baseColor, 80),
    300: adjustLightness(baseColor, 70),
    400: adjustLightness(baseColor, 60),
    500: baseColor, // Base color
    600: adjustLightness(baseColor, 40),
    700: adjustLightness(baseColor, 30),
    800: adjustLightness(baseColor, 20),
    900: adjustLightness(baseColor, 10),
    950: adjustLightness(baseColor, 5),
  }
}

/**
 * Extract hue from hex color (simplified)
 */
function extractHue(hexColor: string): number {
  // Basic implementation - would use proper color library in production
  return 200 // Default hue
}

/**
 * Adjust lightness of a color (simplified)
 */
function adjustLightness(hexColor: string, lightness: number): string {
  // Basic implementation - would use proper color library in production
  return hexColor // For now, return original color
}

// ==============================================
// STRING UTILITIES
// ==============================================

/**
 * Convert string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/\s+/g, '-')
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/^-+/, '')
    .replace(/-+/g, '-')
    .toLowerCase()
}

/**
 * Convert string to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toUpperCase())
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

/**
 * Generate URL-friendly slug from string
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Truncate string with ellipsis
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength - 3) + '...'
}

/**
 * Capitalize first letter of each word
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

/**
 * Extract initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// ==============================================
// VALIDATION UTILITIES
// ==============================================

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexRegex.test(color)
}

/**
 * Validate price format
 */
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && price >= 0 && Number.isFinite(price)
}

/**
 * Validate SKU format (letters, numbers, hyphens, underscores)
 */
export function isValidSKU(sku: string): boolean {
  const skuRegex = /^[A-Za-z0-9_-]+$/
  return skuRegex.test(sku) && sku.length >= 3 && sku.length <= 50
}

// ==============================================
// DATA TRANSFORMATION UTILITIES
// ==============================================

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map(deepClone) as T

  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

/**
 * Remove undefined values from object
 */
export function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {}
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Convert array to object with specified key
 */
export function arrayToObject<T extends Record<string, any>>(
  array: T[],
  keyField: keyof T,
): Record<string, T> {
  return array.reduce(
    (acc, item) => {
      acc[String(item[keyField])] = item
      return acc
    },
    {} as Record<string, T>,
  )
}

/**
 * Group array by specified key
 */
export function groupBy<T extends Record<string, any>>(
  array: T[],
  keyField: keyof T,
): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const key = String(item[keyField])
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    },
    {} as Record<string, T[]>,
  )
}

/**
 * Sort array by multiple criteria
 */
export function sortBy<T>(array: T[], ...criteria: Array<(item: T) => any>): T[] {
  return [...array].sort((a, b) => {
    for (const criterion of criteria) {
      const aVal = criterion(a)
      const bVal = criterion(b)

      if (aVal < bVal) return -1
      if (aVal > bVal) return 1
    }
    return 0
  })
}

// ==============================================
// FORMATTING UTILITIES
// ==============================================

/**
 * Format price with currency
 */
export function formatPrice(
  price: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price)
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Format date in relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`

  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

/**
 * Format date for display
 */
export function formatDate(
  date: string | Date,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {},
): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }

  return new Intl.DateTimeFormat(locale, defaultOptions).format(targetDate)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'

  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)

  return `${size.toFixed(1)} ${sizes[i]}`
}

// ==============================================
// AGENT UTILITIES
// ==============================================

/**
 * Get agent display name
 */
export function getAgentDisplayName(agentType: AgentType): string {
  const names: Record<AgentType, string> = {
    brand: 'Brand Inventor',
    product: 'Product Designer',
    image: 'Image Generator',
    marketing: 'Marketing Designer',
    export: 'Catalog Generator',
  }
  return names[agentType]
}

/**
 * Get agent description
 */
export function getAgentDescription(agentType: AgentType): string {
  const descriptions: Record<AgentType, string> = {
    brand: 'Creates comprehensive brand identities with positioning, values, and visual guidelines',
    product: 'Generates detailed product catalogs with specifications, pricing, and marketing copy',
    image: 'Creates high-quality product images using AI image generation',
    marketing: 'Builds complete design systems with colors, typography, and component styles',
    export: 'Generates platform-ready exports for Shopify, WooCommerce, and other platforms',
  }
  return descriptions[agentType]
}

/**
 * Get agent color theme
 */
export function getAgentColor(agentType: AgentType): string {
  const colors: Record<AgentType, string> = {
    brand: 'purple.600',
    product: 'blue.600',
    image: 'green.600',
    marketing: 'pink.600',
    export: 'orange.600',
  }
  return colors[agentType]
}

/**
 * Calculate completion percentage for a project
 */
export function calculateProjectCompletion(completedSteps: AgentType[]): number {
  const totalSteps = 5 // Total number of agents
  return Math.round((completedSteps.length / totalSteps) * 100)
}

// ==============================================
// ID GENERATION UTILITIES
// ==============================================

/**
 * Generate unique ID with prefix
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return prefix ? `${prefix}-${timestamp}-${randomStr}` : `${timestamp}-${randomStr}`
}

/**
 * Generate SKU from product name
 */
export function generateSKU(productName: string, brandPrefix?: string): string {
  const cleanName = productName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(' ')
    .slice(0, 3)
    .map((word) => word.substring(0, 3).toUpperCase())
    .join('')

  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase()
  const prefix = brandPrefix ? brandPrefix.substring(0, 3).toUpperCase() : 'PRD'

  return `${prefix}-${cleanName}-${randomSuffix}`
}

/**
 * Generate filename for exports
 */
export function generateExportFilename(
  brandName: string,
  format: ExportFormat,
  timestamp?: Date,
): string {
  const date = timestamp || new Date()
  const dateStr = date.toISOString().split('T')[0]
  const sanitizedBrand = generateSlug(brandName)

  const extensions: Record<ExportFormat, string> = {
    'shopify-csv': 'csv',
    'woocommerce-xml': 'xml',
    'magento-csv': 'csv',
    json: 'json',
    xml: 'xml',
  }

  const extension = extensions[format]
  return `${sanitizedBrand}-catalog-${dateStr}.${extension}`
}

// ==============================================
// ERROR HANDLING UTILITIES
// ==============================================

/**
 * Create standardized API response
 */
export function createAPIResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string,
): APIResponse<T> {
  return {
    success,
    data,
    error,
    message,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Handle and format errors consistently
 */
export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000,
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxAttempts) {
        throw lastError
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }

  throw lastError!
}

// ==============================================
// DEBOUNCE AND THROTTLE
// ==============================================

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// ==============================================
// LOCAL STORAGE UTILITIES
// ==============================================

/**
 * Safe localStorage getter with fallback
 */
export function getFromLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

/**
 * Safe localStorage setter
 */
export function setInLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

/**
 * Remove item from localStorage
 */
export function removeFromLocalStorage(key: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error)
  }
}
