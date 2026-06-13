import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { STALE_TIME } from '@/lib/queryClient'

export const siteSettingsKeys = {
  all: ['site_settings'],
}

export function useSiteSettings() {
  return useQuery({
    queryKey: siteSettingsKeys.all,
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single()
      if (error) throw error
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteSettingsKeys.all })
    },
  })
}
