import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { STALE_TIME } from '@/lib/queryClient'

export const blogKeys = {
  all: ['blogs'],
  lists: () => [...blogKeys.all, 'list'],
  list: (filters) => [...blogKeys.lists(), filters ?? {}],
  details: () => [...blogKeys.all, 'detail'],
  detail: (slug) => [...blogKeys.details(), slug],
}

function applyBlogFilters(query, filters = {}) {
  let q = query

  if (filters.is_published !== undefined) {
    q = q.eq('is_published', filters.is_published)
  }
  if (filters.category) {
    q = q.eq('category', filters.category)
  }
  if (filters.tag) {
    q = q.contains('tags', [filters.tag])
  }
  if (filters.search) {
    q = q.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
  }

  return q.order('published_at', { ascending: false, nullsFirst: false }).order('created_at', {
    ascending: false,
  })
}

export function useBlogs(filters) {
  return useQuery({
    queryKey: blogKeys.list(filters),
    queryFn: async () => {
      const query = supabase.from('blogs').select('*')
      const { data, error } = await applyBlogFilters(query, filters)
      if (error) throw error
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useBlog(slug) {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: async () => {
      const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single()
      if (error) throw error
      return data
    },
    enabled: !!slug,
    staleTime: STALE_TIME,
  })
}

export function useCreateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (blog) => {
      const payload = {
        ...blog,
        published_at: blog.is_published ? blog.published_at ?? new Date().toISOString() : null,
      }
      const { data, error } = await supabase.from('blogs').insert(payload).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all })
    },
  })
}

export function useUpdateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const payload = { ...updates }
      if (updates.is_published === true && !updates.published_at) {
        payload.published_at = new Date().toISOString()
      }
      if (updates.is_published === false) {
        payload.published_at = null
      }

      const { data, error } = await supabase
        .from('blogs')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all })
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: blogKeys.detail(data.slug) })
      }
    },
  })
}

export function useDeleteBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase.from('blogs').delete().eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all })
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: blogKeys.detail(data.slug) })
      }
    },
  })
}
