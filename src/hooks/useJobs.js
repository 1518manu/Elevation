import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { STALE_TIME } from '@/lib/queryClient'

export const jobKeys = {
  all: ['jobs'],
  lists: () => [...jobKeys.all, 'list'],
  list: (filters) => [...jobKeys.lists(), filters ?? {}],
  details: () => [...jobKeys.all, 'detail'],
  detail: (id) => [...jobKeys.details(), id],
}

function applyJobFilters(query, filters = {}) {
  let q = query

  if (filters.department) {
    q = q.eq('department', filters.department)
  }
  if (filters.job_type) {
    q = q.eq('job_type', filters.job_type)
  }
  if (filters.is_active !== undefined) {
    q = q.eq('is_active', filters.is_active)
  }
  if (filters.search) {
    q = q.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  return q.order('created_at', { ascending: false })
}

export function useJobs(filters) {
  return useQuery({
    queryKey: jobKeys.list(filters),
    queryFn: async () => {
      const query = supabase.from('jobs').select('*')
      const { data, error } = await applyJobFilters(query, filters)
      if (error) throw error
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useJob(id) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single()
      if (error) throw error
      return data
    },
    enabled: !!id,
    staleTime: STALE_TIME,
  })
}

export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (job) => {
      const { data, error } = await supabase.from('jobs').insert(job).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all })
    },
  })
}

export function useUpdateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: jobKeys.detail(data.id) })
      }
    },
  })
}

export function useDeleteJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from('jobs')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: jobKeys.detail(data.id) })
      }
    },
  })
}
