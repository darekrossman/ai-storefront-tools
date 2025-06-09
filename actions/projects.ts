'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Project, ProjectInsert, ProjectUpdate } from '@/lib/supabase/database-types'

// Create and update data types
export type CreateProjectData = Omit<
  ProjectInsert,
  'id' | 'created_at' | 'updated_at' | 'user_id'
>
export type UpdateProjectData = Omit<
  ProjectUpdate,
  'id' | 'created_at' | 'updated_at' | 'user_id'
>

// Get all projects for the current user
export const getProjectsAction = async (): Promise<Project[]> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    throw error
  }

  return data || []
}

// Get a single project by ID
export const getProjectAction = async (projectId: number): Promise<Project | null> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Project not found
    }
    console.error('Error fetching project:', error)
    throw error
  }

  return data
}

// Create a new project
export const createProjectAction = async (
  projectData: CreateProjectData,
): Promise<Project> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: projectData.name,
      description: projectData.description,
      status: projectData.status || 'active',
      settings: projectData.settings || {},
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    throw error
  }

  revalidatePath('/projects')
  return data
}

// Update an existing project
export const updateProjectAction = async (
  projectId: number,
  projectData: UpdateProjectData,
): Promise<Project> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('projects')
    .update({
      ...projectData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    throw error
  }

  revalidatePath('/projects')
  revalidatePath(`/projects/${projectId}`)
  return data
}

// Delete a project
export const deleteProjectAction = async (projectId: number): Promise<void> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting project:', error)
    throw error
  }

  revalidatePath('/projects')
}

// Project statistics type
export interface ProjectStats {
  brandsCount: number
  catalogsCount: number
  productsCount: number
}

// Get project statistics
export const getProjectStatsAction = async (projectId: number): Promise<ProjectStats> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // First verify user owns the project
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) {
    throw new Error('Project not found or access denied')
  }

  // Get brands count
  const { count: brandsCount } = await supabase
    .from('brands')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)

  // Get catalogs count (across all brands in the project)
  const { count: catalogsCount } = await supabase
    .from('product_catalogs')
    .select(
      `
      *,
      brands!inner(project_id)
    `,
      { count: 'exact', head: true },
    )
    .eq('brands.project_id', projectId)

  // Get products count (across all catalogs in the project)
  const { count: productsCount } = await supabase
    .from('products')
    .select(
      `
      *,
      product_catalogs!inner(
        brands!inner(project_id)
      )
    `,
      { count: 'exact', head: true },
    )
    .eq('product_catalogs.brands.project_id', projectId)

  return {
    brandsCount: brandsCount || 0,
    catalogsCount: catalogsCount || 0,
    productsCount: productsCount || 0,
  }
}
