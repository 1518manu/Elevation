import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { STALE_TIME } from '@/lib/queryClient'

export const testimonialKeys = {
  all: ['testimonials'],
  lists: () => [...testimonialKeys.all, 'list'],
  list: (filters) => [...testimonialKeys.lists(), filters ?? {}],
}

function applyTestimonialFilters(query, filters = {}) {
  let q = query

  if (filters.is_featured !== undefined) {
    q = q.eq('is_featured', filters.is_featured)
  }
  if (filters.is_active !== undefined) {
    q = q.eq('is_active', filters.is_active)
  }

  return q.order('display_order', { ascending: true }).order('created_at', { ascending: false })
}

export function useTestimonials(filters) {
  return useQuery({
    queryKey: testimonialKeys.list(filters),
    queryFn: async () => {
      const query = supabase.from('testimonials').select('*')
      const { data, error } = await applyTestimonialFilters(query, filters)
      if (error) throw error
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (testimonial) => {
      const { data, error } = await supabase
        .from('testimonials')
        .insert(testimonial)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all })
    },
  })
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all })
    },
  })
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from('testimonials')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all })
    },
  })
}
