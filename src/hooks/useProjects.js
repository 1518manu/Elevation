import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { STALE_TIME } from '@/lib/queryClient'

export const projectKeys = {
  all: ['projects'],
  lists: () => [...projectKeys.all, 'list'],
  list: (filters) => [...projectKeys.lists(), filters ?? {}],
  details: () => [...projectKeys.all, 'detail'],
  detail: (slug) => [...projectKeys.details(), slug],
}

function applyProjectFilters(query, filters = {}) {
  let q = query

  if (filters.city) {
    q = q.eq('city', filters.city)
  }
  if (filters.state) {
    q = q.eq('state', filters.state)
  }
  if (filters.is_featured !== undefined) {
    q = q.eq('is_featured', filters.is_featured)
  }
  if (filters.is_active !== undefined) {
    q = q.eq('is_active', filters.is_active)
  }
  if (filters.search) {
    q = q.or(`title.ilike.%${filters.search}%,client_name.ilike.%${filters.search}%`)
  }

  return q.order('created_at', { ascending: false })
}

export function useProjects(filters) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: async () => {
      const query = supabase.from('projects').select('*')
      const { data, error } = await applyProjectFilters(query, filters)
      if (error) throw error
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useProject(slug) {
  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!slug,
    staleTime: STALE_TIME,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (project) => {
      const { data, error } = await supabase.from('projects').insert(project).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(data.slug) })
      }
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from('projects')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(data.slug) })
      }
    },
  })
}
