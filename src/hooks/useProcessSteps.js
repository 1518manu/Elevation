import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { STALE_TIME } from '@/lib/queryClient'

export const processStepKeys = {
  all: ['process_steps'],
  lists: () => [...processStepKeys.all, 'list'],
  list: (filters) => [...processStepKeys.lists(), filters ?? {}],
}

function applyProcessStepFilters(query, filters = {}) {
  let q = query

  if (filters.is_active !== undefined) {
    q = q.eq('is_active', filters.is_active)
  }

  return q.order('step_number', { ascending: true })
}

export function useProcessSteps(filters) {
  return useQuery({
    queryKey: processStepKeys.list(filters),
    queryFn: async () => {
      const query = supabase.from('process_steps').select('*')
      const { data, error } = await applyProcessStepFilters(query, filters)
      if (error) throw error
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useCreateProcessStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (step) => {
      const { data, error } = await supabase.from('process_steps').insert(step).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: processStepKeys.all })
    },
  })
}

export function useUpdateProcessStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('process_steps')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: processStepKeys.all })
    },
  })
}

export function useDeleteProcessStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from('process_steps')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: processStepKeys.all })
    },
  })
}
