// ==============================================
// Session-Based File Storage Utilities
// ==============================================
// Manages persistent data storage using file system
// All data is organized by session ID for isolation

import { promises as fs } from 'fs'
import path from 'path'
import type {
  APIResponse,
  AgentType,
  Brand,
  DesignSystem,
  ExportConfig,
  Product,
  ProductImage,
  ProjectData,
  Session,
} from './types'

// ==============================================
// STORAGE CONFIGURATION
// ==============================================

export const STORAGE_CONFIG = {
  baseDir: 'data',
  sessionsDir: 'data/sessions',
  templatesDir: 'data/templates',
  assetsDir: 'public/generated-assets',
  tempDir: 'data/temp',
  backupDir: 'data/backups',
}

export const SESSION_FILES = {
  session: 'session.json',
  brand: 'brand.json',
  products: 'products.json',
  images: 'images.json',
  designSystem: 'design-system.json',
  exports: 'exports.json',
} as const

// ==============================================
// STORAGE MANAGER CLASS
// ==============================================

export class StorageManager {
  private sessionId: string
  private sessionDir: string
  private assetsDir: string

  constructor(sessionId?: string) {
    this.sessionId = sessionId || this.generateSessionId()
    this.sessionDir = path.join(STORAGE_CONFIG.sessionsDir, this.sessionId)
    this.assetsDir = path.join(STORAGE_CONFIG.assetsDir, this.sessionId)
  }

  // ==============================================
  // SESSION MANAGEMENT
  // ==============================================

  /**
   * Initialize a new session with directory structure
   */
  async initializeSession(name: string, description?: string): Promise<Session> {
    try {
      // Create session directories
      await this.ensureDirectoryExists(this.sessionDir)
      await this.ensureDirectoryExists(this.assetsDir)
      await this.ensureDirectoryExists(path.join(this.assetsDir, 'images'))
      await this.ensureDirectoryExists(path.join(this.assetsDir, 'exports'))
      await this.ensureDirectoryExists(path.join(this.assetsDir, 'temp'))

      const session: Session = {
        id: this.sessionId,
        name: name.trim(),
        description: description?.trim(),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedSteps: [],
        metadata: {
          totalProducts: 0,
          totalImages: 0,
          lastActiveAgent: null,
        },
      }

      await this.saveSession(session)
      return session
    } catch (error) {
      throw new StorageError(`Failed to initialize session: ${error}`)
    }
  }

  /**
   * Load existing session data
   */
  async loadSession(): Promise<Session | null> {
    return await this.readJsonFile<Session>(SESSION_FILES.session)
  }

  /**
   * Save session metadata
   */
  async saveSession(session: Session): Promise<void> {
    session.updatedAt = new Date().toISOString()
    await this.writeJsonFile(SESSION_FILES.session, session)
  }

  /**
   * Update session with completed agent step
   */
  async markStepCompleted(agentType: AgentType): Promise<Session> {
    const session = await this.loadSession()
    if (!session) {
      throw new StorageError('Session not found')
    }

    if (!session.completedSteps.includes(agentType)) {
      session.completedSteps.push(agentType)
    }
    session.metadata.lastActiveAgent = agentType
    session.updatedAt = new Date().toISOString()

    await this.saveSession(session)
    return session
  }

  // ==============================================
  // DATA PERSISTENCE METHODS
  // ==============================================

  /**
   * Save brand data
   */
  async saveBrand(brand: Brand): Promise<void> {
    try {
      brand.updatedAt = new Date().toISOString()
      await this.writeJsonFile(SESSION_FILES.brand, brand)

      // Update session metadata
      await this.markStepCompleted('brand')
    } catch (error) {
      throw new StorageError(`Failed to save brand: ${error}`)
    }
  }

  /**
   * Load brand data
   */
  async loadBrand(): Promise<Brand | null> {
    return await this.readJsonFile<Brand>(SESSION_FILES.brand)
  }

  /**
   * Save product catalog
   */
  async saveProducts(products: Product[]): Promise<void> {
    try {
      const updatedProducts = products.map((product) => ({
        ...product,
        updatedAt: new Date().toISOString(),
      }))

      await this.writeJsonFile(SESSION_FILES.products, updatedProducts)

      // Update session metadata
      const session = await this.loadSession()
      if (session) {
        session.metadata.totalProducts = products.length
        await this.saveSession(session)
      }

      await this.markStepCompleted('product')
    } catch (error) {
      throw new StorageError(`Failed to save products: ${error}`)
    }
  }

  /**
   * Load product catalog
   */
  async loadProducts(): Promise<Product[]> {
    const products = await this.readJsonFile<Product[]>(SESSION_FILES.products)
    return products || []
  }

  /**
   * Save single product
   */
  async saveProduct(product: Product): Promise<void> {
    const products = await this.loadProducts()
    const existingIndex = products.findIndex((p) => p.id === product.id)

    product.updatedAt = new Date().toISOString()

    if (existingIndex >= 0) {
      products[existingIndex] = product
    } else {
      products.push(product)
    }

    await this.saveProducts(products)
  }

  /**
   * Save product images
   */
  async saveImages(images: ProductImage[]): Promise<void> {
    try {
      const updatedImages = images.map((image) => ({
        ...image,
        updatedAt: new Date().toISOString(),
      }))

      await this.writeJsonFile(SESSION_FILES.images, updatedImages)

      // Update session metadata
      const session = await this.loadSession()
      if (session) {
        session.metadata.totalImages = images.length
        await this.saveSession(session)
      }

      await this.markStepCompleted('image')
    } catch (error) {
      throw new StorageError(`Failed to save images: ${error}`)
    }
  }

  /**
   * Load product images
   */
  async loadImages(): Promise<ProductImage[]> {
    const images = await this.readJsonFile<ProductImage[]>(SESSION_FILES.images)
    return images || []
  }

  /**
   * Save design system
   */
  async saveDesignSystem(designSystem: DesignSystem): Promise<void> {
    try {
      designSystem.updatedAt = new Date().toISOString()
      await this.writeJsonFile(SESSION_FILES.designSystem, designSystem)
      await this.markStepCompleted('marketing')
    } catch (error) {
      throw new StorageError(`Failed to save design system: ${error}`)
    }
  }

  /**
   * Load design system
   */
  async loadDesignSystem(): Promise<DesignSystem | null> {
    return await this.readJsonFile<DesignSystem>(SESSION_FILES.designSystem)
  }

  /**
   * Save export configurations
   */
  async saveExports(exports: ExportConfig[]): Promise<void> {
    try {
      const updatedExports = exports.map((exp) => ({
        ...exp,
        updatedAt: new Date().toISOString(),
      }))

      await this.writeJsonFile(SESSION_FILES.exports, updatedExports)
      await this.markStepCompleted('export')
    } catch (error) {
      throw new StorageError(`Failed to save exports: ${error}`)
    }
  }

  /**
   * Load export configurations
   */
  async loadExports(): Promise<ExportConfig[]> {
    const exports = await this.readJsonFile<ExportConfig[]>(SESSION_FILES.exports)
    return exports || []
  }

  /**
   * Load complete project data
   */
  async loadProjectData(): Promise<ProjectData | null> {
    try {
      const [session, brand, products, images, designSystem, exports] = await Promise.all([
        this.loadSession(),
        this.loadBrand(),
        this.loadProducts(),
        this.loadImages(),
        this.loadDesignSystem(),
        this.loadExports(),
      ])

      if (!session) {
        return null
      }

      return {
        session,
        brand: brand || undefined,
        products: products.length > 0 ? products : undefined,
        images: images.length > 0 ? images : undefined,
        designSystem: designSystem || undefined,
        exports: exports.length > 0 ? exports : undefined,
      }
    } catch (error) {
      throw new StorageError(`Failed to load project data: ${error}`)
    }
  }

  // ==============================================
  // FILE SYSTEM UTILITIES
  // ==============================================

  /**
   * Generic JSON file reader with type safety
   */
  private async readJsonFile<T>(filename: string): Promise<T | null> {
    try {
      const filePath = path.join(this.sessionDir, filename)
      const content = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(content) as T
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null // File doesn't exist
      }
      throw new StorageError(`Failed to read ${filename}: ${error}`)
    }
  }

  /**
   * Generic JSON file writer with atomic writes
   */
  private async writeJsonFile<T>(filename: string, data: T): Promise<void> {
    try {
      await this.ensureDirectoryExists(this.sessionDir)

      const filePath = path.join(this.sessionDir, filename)
      const tempPath = `${filePath}.tmp`

      // Write to temporary file first (atomic write)
      const jsonContent = JSON.stringify(data, null, 2)
      await fs.writeFile(tempPath, jsonContent, 'utf-8')

      // Rename to final location
      await fs.rename(tempPath, filePath)
    } catch (error) {
      throw new StorageError(`Failed to write ${filename}: ${error}`)
    }
  }

  /**
   * Ensure directory exists, create if it doesn't
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath)
    } catch {
      await fs.mkdir(dirPath, { recursive: true })
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `session-${timestamp}-${randomStr}`
  }

  // ==============================================
  // ASSET MANAGEMENT
  // ==============================================

  /**
   * Save image file to assets directory
   */
  async saveImageFile(filename: string, buffer: Buffer): Promise<string> {
    try {
      const imageDir = path.join(this.assetsDir, 'images')
      await this.ensureDirectoryExists(imageDir)

      const filePath = path.join(imageDir, filename)
      await fs.writeFile(filePath, buffer)

      return path.join('generated-assets', this.sessionId, 'images', filename)
    } catch (error) {
      throw new StorageError(`Failed to save image file: ${error}`)
    }
  }

  /**
   * Save export file to assets directory
   */
  async saveExportFile(filename: string, content: string | Buffer): Promise<string> {
    try {
      const exportDir = path.join(this.assetsDir, 'exports')
      await this.ensureDirectoryExists(exportDir)

      const filePath = path.join(exportDir, filename)
      await fs.writeFile(filePath, content)

      return path.join('generated-assets', this.sessionId, 'exports', filename)
    } catch (error) {
      throw new StorageError(`Failed to save export file: ${error}`)
    }
  }

  /**
   * Delete asset file
   */
  async deleteAssetFile(relativePath: string): Promise<void> {
    try {
      const filePath = path.join(process.cwd(), 'public', relativePath)
      await fs.unlink(filePath)
    } catch (error) {
      // File might not exist, which is okay
      console.warn(`Could not delete asset: ${relativePath}`)
    }
  }

  // ==============================================
  // CLEANUP AND MAINTENANCE
  // ==============================================

  /**
   * Delete entire session and all associated data
   */
  async deleteSession(): Promise<void> {
    try {
      await fs.rm(this.sessionDir, { recursive: true, force: true })
      await fs.rm(this.assetsDir, { recursive: true, force: true })
    } catch (error) {
      throw new StorageError(`Failed to delete session: ${error}`)
    }
  }

  /**
   * Get session directory size in bytes
   */
  async getSessionSize(): Promise<number> {
    try {
      const stats = await this.calculateDirectorySize(this.sessionDir)
      const assetStats = await this.calculateDirectorySize(this.assetsDir)
      return stats + assetStats
    } catch (error) {
      return 0
    }
  }

  /**
   * Calculate directory size recursively
   */
  private async calculateDirectorySize(dirPath: string): Promise<number> {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true })
      let size = 0

      for (const item of items) {
        const itemPath = path.join(dirPath, item.name)
        if (item.isDirectory()) {
          size += await this.calculateDirectorySize(itemPath)
        } else {
          const stats = await fs.stat(itemPath)
          size += stats.size
        }
      }

      return size
    } catch {
      return 0
    }
  }

  // ==============================================
  // GETTERS
  // ==============================================

  getSessionId(): string {
    return this.sessionId
  }

  getSessionDir(): string {
    return this.sessionDir
  }

  getAssetsDir(): string {
    return this.assetsDir
  }
}

// ==============================================
// GLOBAL STORAGE FUNCTIONS
// ==============================================

/**
 * Initialize storage directories on app startup
 */
export async function initializeStorage(): Promise<void> {
  try {
    const directories = [
      STORAGE_CONFIG.baseDir,
      STORAGE_CONFIG.sessionsDir,
      STORAGE_CONFIG.templatesDir,
      STORAGE_CONFIG.tempDir,
      STORAGE_CONFIG.backupDir,
    ]

    await Promise.all(
      directories.map(async (dir) => {
        try {
          await fs.access(dir)
        } catch {
          await fs.mkdir(dir, { recursive: true })
        }
      }),
    )

    // Ensure public assets directory exists
    try {
      await fs.access(STORAGE_CONFIG.assetsDir)
    } catch {
      await fs.mkdir(STORAGE_CONFIG.assetsDir, { recursive: true })
    }
  } catch (error) {
    throw new StorageError(`Failed to initialize storage: ${error}`)
  }
}

/**
 * List all available sessions
 */
export async function listSessions(): Promise<Session[]> {
  try {
    const sessionDirs = await fs.readdir(STORAGE_CONFIG.sessionsDir)
    const sessions: Session[] = []

    for (const sessionDir of sessionDirs) {
      try {
        const storage = new StorageManager(sessionDir)
        const session = await storage.loadSession()
        if (session) {
          sessions.push(session)
        }
      } catch (error) {
        console.warn(`Could not load session ${sessionDir}:`, error)
      }
    }

    return sessions.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  } catch (error) {
    throw new StorageError(`Failed to list sessions: ${error}`)
  }
}

/**
 * Create new storage manager instance
 */
export function createStorageManager(sessionId?: string): StorageManager {
  return new StorageManager(sessionId)
}

// ==============================================
// ERROR HANDLING
// ==============================================

export class StorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StorageError'
  }
}

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'

  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)

  return `${size.toFixed(1)} ${sizes[i]}`
}

/**
 * Validate session ID format
 */
export function isValidSessionId(sessionId: string): boolean {
  return /^session-[a-z0-9]+-[a-z0-9]+$/.test(sessionId)
}

/**
 * Clean filename for safe file system usage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
}
