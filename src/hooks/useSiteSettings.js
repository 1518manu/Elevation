import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { STALE_TIME } from '@/lib/queryClient'

export const siteSettingsKeys = {
  all: ['site_settings'],
}

export function useSiteSettings() {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Create a unique channel name per hook instance to avoid adding
    // callbacks to an already-subscribed channel (supabase client restriction).
    const channel = supabase
      .channel('site_settings_changes_' + Math.random().toString(36).slice(2))
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: siteSettingsKeys.all })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return useQuery({
    queryKey: siteSettingsKeys.all,
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1)
      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('No site settings found. Please create a site_settings record in your database.')
      }
      return data[0]
    },
    staleTime: STALE_TIME,
  })
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const cleanUpdates = { ...updates }
      delete cleanUpdates.created_at
      delete cleanUpdates.updated_at
      const { data, error } = await supabase
        .from('site_settings')
        .update(cleanUpdates)
        .eq('id', id)
        .select()

      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }

      if (data && data.length > 0) {
        return data[0]
      }

      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteSettingsKeys.all })
    },
  })
}

export function useAutoSaveSiteSettings() {
  const updateSettings = useUpdateSiteSettings()
  const debounceTimer = useRef(null)

  const autoSave = (settings) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      if (settings?.id) {
        const cleanSettings = { ...settings }
        delete cleanSettings.created_at
        delete cleanSettings.updated_at
        updateSettings.mutate({ id: settings.id, ...cleanSettings })
      }
    }, 1500)
  }

  return { autoSave, isAutoSaving: updateSettings.isPending }
}
