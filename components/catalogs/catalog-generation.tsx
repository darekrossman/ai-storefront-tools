'use client'

import type { Project } from '@/lib/supabase/database-types'
import { useChat, experimental_useObject as useObject } from '@ai-sdk/react'

export default function CatalogGeneration({ project }: { project: Project }) {
  return <div>CatalogGeneration</div>
}
