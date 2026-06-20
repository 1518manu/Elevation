import { supabase } from './supabase'

export async function ensureSiteSettingsExists() {
  try {
    const { data, error } = await supabase.from('site_settings').select('id').limit(1)

    if (error) {
      console.error('Error checking site_settings:', error)
      return false
    }

    if (!data || data.length === 0) {
      const defaultSettings = {
        company_name: 'Your Company Name',
        tagline: 'Your tagline here',
        whatsapp_number: '',
        phones: [],
        emails: [],
        google_maps_embed: '',
        social_links: {
          facebook: '',
          instagram: '',
          linkedin: '',
          youtube: '',
          twitter: '',
        },
        hero_content: {
          headline: 'Welcome to our website',
          subheadline: 'Your subheadline here',
        },
        stats: {
          years: 0,
          projects: 0,
          clients: 0,
          cities: 0,
        },
        seo_defaults: {
          title: 'Your Company - Default Title',
          description: 'Default meta description',
          og_image: '',
        },
        careers_visible: true,
      }

      const { error: insertError } = await supabase
        .from('site_settings')
        .insert([defaultSettings])

      if (insertError) {
        console.error('Error creating default site_settings:', insertError)
        return false
      }

      return true
    }

    return true
  } catch (err) {
    console.error('Failed to ensure site settings exists:', err)
    return false
  }
}
