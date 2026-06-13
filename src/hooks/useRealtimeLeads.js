import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useRealtimeLeads() {
  const [newLeadCount, setNewLeadCount] = useState(0)

  useEffect(() => {
    const channel = supabase
      .channel('quote_inquiries_inserts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quote_inquiries',
        },
        () => {
          setNewLeadCount((count) => count + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { newLeadCount }
}
