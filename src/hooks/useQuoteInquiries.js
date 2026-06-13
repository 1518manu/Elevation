import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { STALE_TIME } from '@/lib/queryClient'

export const quoteInquiryKeys = {
  all: ['quote_inquiries'],
  lists: () => [...quoteInquiryKeys.all, 'list'],
  list: (filters) => [...quoteInquiryKeys.lists(), filters ?? {}],
}

function applyQuoteInquiryFilters(query, filters = {}) {
  let q = query

  if (filters.status) {
    q = q.eq('status', filters.status)
  }
  if (filters.assigned_to) {
    q = q.eq('assigned_to', filters.assigned_to)
  }
  if (filters.search) {
    q = q.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,city.ilike.%${filters.search}%`)
  }

  return q.order('created_at', { ascending: false })
}

export function useQuoteInquiries(filters) {
  return useQuery({
    queryKey: quoteInquiryKeys.list(filters),
    queryFn: async () => {
      const query = supabase.from('quote_inquiries').select('*')
      const { data, error } = await applyQuoteInquiryFilters(query, filters)
      if (error) throw error
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useCreateQuoteInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inquiry) => {
      const { data, error } = await supabase
        .from('quote_inquiries')
        .insert(inquiry)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteInquiryKeys.all })
    },
  })
}

export function useUpdateQuoteInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('quote_inquiries')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteInquiryKeys.all })
    },
  })
}
