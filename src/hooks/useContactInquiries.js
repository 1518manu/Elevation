import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { STALE_TIME } from '@/lib/queryClient'
import { sendContactEmail } from '@/lib/email'

export const contactInquiryKeys = {
  all: ['contact_inquiries'],
  lists: () => [...contactInquiryKeys.all, 'list'],
  list: (filters) => [...contactInquiryKeys.lists(), filters ?? {}],
}

function applyContactInquiryFilters(query, filters = {}) {
  let q = query

  if (filters.status) {
    q = q.eq('status', filters.status)
  }
  if (filters.search) {
    q = q.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`)
  }

  return q.order('created_at', { ascending: false })
}

export function useContactInquiries(filters) {
  return useQuery({
    queryKey: contactInquiryKeys.list(filters),
    queryFn: async () => {
      const query = supabase.from('contact_inquiries').select('*')
      const { data, error } = await applyContactInquiryFilters(query, filters ?? {})
      if (error) throw error
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useCreateContactInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inquiry) => {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .insert(inquiry)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: contactInquiryKeys.all })
      try {
        await sendContactEmail(data)
      } catch (emailError) {
        console.error('Email sending failed, but inquiry was saved:', emailError)
      }
    },
  })
}

export function useUpdateContactInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactInquiryKeys.all })
    },
  })
}
