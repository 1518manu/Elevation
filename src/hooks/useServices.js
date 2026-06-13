import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { STALE_TIME } from '@/lib/queryClient'

export const serviceKeys = {
  all: ['services'],
  lists: () => [...serviceKeys.all, 'list'],
  list: (filters) => [...serviceKeys.lists(), filters ?? {}],
  details: () => [...serviceKeys.all, 'detail'],
  detail: (slug) => [...serviceKeys.details(), slug],
}

function applyServiceFilters(query, filters = {}) {
  let q = query

  if (filters.is_active !== undefined) {
    q = q.eq('is_active', filters.is_active)
  }
  if (filters.search) {
    q = q.or(`title.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`)
  }

  return q.order('display_order', { ascending: true }).order('created_at', { ascending: false })
}

export function useServices(filters) {
  return useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: async () => {
      const query = supabase.from('services').select('*')
      const { data, error } = await applyServiceFilters(query, filters)
      if (error) throw error
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useService(slug) {
  return useQuery({
    queryKey: serviceKeys.detail(slug),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
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

export function useCreateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (service) => {
      const { data, error } = await supabase.from('services').insert(service).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all })
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all })
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: serviceKeys.detail(data.slug) })
      }
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from('services')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all })
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: serviceKeys.detail(data.slug) })
      }
    },
  })
}
