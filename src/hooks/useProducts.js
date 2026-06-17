import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { STALE_TIME } from '@/lib/queryClient'

export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), filters ?? {}],
  details: () => [...productKeys.all, 'detail'],
  detail: (slug) => [...productKeys.details(), slug],
}

function applyProductFilters(query, filters = {}) {
  let q = query

  if (filters.category) {
    q = q.eq('category', filters.category)
  }
  if (filters.is_featured !== undefined) {
    q = q.eq('is_featured', filters.is_featured)
  }
  if (filters.is_active !== undefined) {
    q = q.eq('is_active', filters.is_active)
  }
  if (filters.search) {
    q = q.or(`name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`)
  }

  return q.order('display_order', { ascending: true }).order('created_at', { ascending: false })
}

export function useProducts(filters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      const query = supabase.from('products').select('*')
      const { data, error } = await applyProductFilters(query, filters)
      if (error) throw error
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useProduct(slug) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
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

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (product) => {
      const { data, error } = await supabase.from('products').insert(product).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: productKeys.detail(data.slug) })
      }
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: productKeys.detail(data.slug) })
      }
    },
  })
}
