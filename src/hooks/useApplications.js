import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { STALE_TIME } from '@/lib/queryClient'

export const applicationKeys = {
  all: ['applications'],
  lists: () => [...applicationKeys.all, 'list'],
  list: (filters) => [...applicationKeys.lists(), filters ?? {}],
}

function applyApplicationFilters(query, filters = {}) {
  let q = query

  if (filters.job_id) {
    q = q.eq('job_id', filters.job_id)
  }
  if (filters.status) {
    q = q.eq('status', filters.status)
  }
  if (filters.search) {
    q = q.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
  }

  return q.order('created_at', { ascending: false })
}

export function useApplications(filters) {
  return useQuery({
    queryKey: applicationKeys.list(filters),
    queryFn: async () => {
      const query = supabase.from('applications').select('*, jobs(id, title, department)')
      const { data, error } = await applyApplicationFilters(query, filters)
      if (error) throw error
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useUpdateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select('*, jobs(id, title, department)')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all })
    },
  })
}
