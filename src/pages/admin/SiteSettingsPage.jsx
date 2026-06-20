import { useState, useEffect } from 'react'
import { Save, Building2, Share2, Home, Search, Eye, CheckCircle2 } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import { useSiteSettings, useUpdateSiteSettings, useAutoSaveSiteSettings } from '@/hooks/useSiteSettings'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import PageLoader from '@/components/common/PageLoader'

export default function SiteSettingsPage() {
  const { data: settings, isLoading } = useSiteSettings()
  const updateSettings = useUpdateSiteSettings()
  const { autoSave, isAutoSaving } = useAutoSaveSiteSettings()
  const { toast } = useToast()
  const [form, setForm] = useState(null)
  const [lastSavedTime, setLastSavedTime] = useState(null)

  useEffect(() => {
    if (settings) setForm(settings)
  }, [settings])

  useEffect(() => {
    if (form && form.id && settings) {
      const formData = { ...form }
      delete formData.created_at
      delete formData.updated_at

      const settingsData = { ...settings }
      delete settingsData.created_at
      delete settingsData.updated_at

      const isChanged = JSON.stringify(formData) !== JSON.stringify(settingsData)
      if (isChanged) {
        autoSave(form)
      }
    }
  }, [form, autoSave, settings])

  if (isLoading || !form) return <PageLoader />

  const handleSave = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { created_at, updated_at, ...cleanForm } = form
      await updateSettings.mutateAsync({ id: form.id, ...cleanForm })
      setLastSavedTime(new Date())
      toast({ title: 'Settings saved successfully' })
    } catch (err) {
      console.error('Save error:', err)
      toast({
        title: 'Error saving settings',
        description: err?.message || 'Please try again',
        variant: 'destructive'
      })
    }
  }

  const updateList = (key, index, value) => {
    const list = [...(form[key] || [])]
    list[index] = value
    setForm({ ...form, [key]: list })
  }

  const addToList = (key) => {
    setForm({ ...form, [key]: [...(form[key] || []), ''] })
  }

  const removeFromList = (key, index) => {
    setForm({ ...form, [key]: form[key].filter((_, i) => i !== index) })
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-['Syne', 'sans-serif'] text-[11px] uppercase tracking-wider text-[#9CA3AF] mb-1">
              SETTINGS
            </p>
            <h1 className="font-['Syne', 'sans-serif'] text-[24px] font-bold text-[#0E0E0E] mb-1">
              Site Settings
            </h1>
            <p className="font-['DM Sans', 'sans-serif'] text-[13px] text-gray-500">
              Manage company information and website configuration
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAutoSaving && (
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-[#D42B2B] border-t-transparent rounded-full"></div>
                Auto-saving...
              </span>
            )}
            {lastSavedTime && !isAutoSaving && (
              <span className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </span>
            )}
            <Button variant="admin-primary" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg p-1">
          <TabsTrigger
            value="company"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#D42B2B]"
          >
            <Building2 className="mr-2 h-4 w-4" /> Company Info
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#D42B2B]"
          >
            <Share2 className="mr-2 h-4 w-4" /> Social Media
          </TabsTrigger>
          <TabsTrigger
            value="homepage"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#D42B2B]"
          >
            <Home className="mr-2 h-4 w-4" /> Homepage
          </TabsTrigger>
          <TabsTrigger
            value="seo"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#D42B2B]"
          >
            <Search className="mr-2 h-4 w-4" /> SEO Defaults
          </TabsTrigger>
          <TabsTrigger
            value="visibility"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#D42B2B]"
          >
            <Eye className="mr-2 h-4 w-4" /> Visibility
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
            <h3 className="font-['Syne', 'sans-serif'] text-[16px] font-semibold text-[#0E0E0E] mb-4">
              Company Information
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={form.company_name || ''}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  className="focus:border-[#D42B2B]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={form.tagline || ''}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="focus:border-[#D42B2B]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  value={form.whatsapp_number || ''}
                  onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                  className="focus:border-[#D42B2B]"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Numbers</Label>
                {form.phones?.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={p || ''}
                      onChange={(e) => updateList('phones', i, e.target.value)}
                      className="focus:border-[#D42B2B]"
                    />
                    <Button variant="admin-danger" size="admin-sm" onClick={() => removeFromList('phones', i)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button variant="admin-ghost" onClick={() => addToList('phones')}>
                  Add Phone
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Email Addresses</Label>
                {form.emails?.map((e, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={e || ''}
                      onChange={(ev) => updateList('emails', i, ev.target.value)}
                      className="focus:border-[#D42B2B]"
                    />
                    <Button variant="admin-danger" size="admin-sm" onClick={() => removeFromList('emails', i)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button variant="admin-ghost" onClick={() => addToList('emails')}>
                  Add Email
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maps">Google Maps Embed Code</Label>
                <Textarea
                  id="maps"
                  value={form.google_maps_embed || ''}
                  onChange={(e) => setForm({ ...form, google_maps_embed: e.target.value })}
                  rows={3}
                  className="focus:border-[#D42B2B]"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
            <h3 className="font-['Syne', 'sans-serif'] text-[16px] font-semibold text-[#0E0E0E] mb-4">
              Social Media Links
            </h3>
            <div className="space-y-4">
              {['facebook', 'instagram', 'linkedin', 'youtube', 'twitter'].map((key) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key}</Label>
                  <Input
                    value={form.social_links?.[key] || ''}
                    onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, [key]: e.target.value } })}
                    placeholder={`https://${key}.com/your-handle`}
                    className="focus:border-[#D42B2B]"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="homepage" className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
            <h3 className="font-['Syne', 'sans-serif'] text-[16px] font-semibold text-[#0E0E0E] mb-4">
              Homepage Hero Section
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headline">Hero Headline</Label>
                <Input
                  id="headline"
                  value={form.hero_content?.headline || ''}
                  onChange={(e) => setForm({ ...form, hero_content: { ...form.hero_content, headline: e.target.value } })}
                  className="focus:border-[#D42B2B]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subheadline">Hero Sub-headline</Label>
                <Textarea
                  id="subheadline"
                  value={form.hero_content?.subheadline || ''}
                  onChange={(e) => setForm({ ...form, hero_content: { ...form.hero_content, subheadline: e.target.value } })}
                  rows={2}
                  className="focus:border-[#D42B2B]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
            <h3 className="font-['Syne', 'sans-serif'] text-[16px] font-semibold text-[#0E0E0E] mb-4">
              Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {['years', 'projects', 'clients', 'cities'].map((key) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key}</Label>
                  <Input
                    type="number"
                    value={form.stats?.[key] || ''}
                    onChange={(e) => setForm({ ...form, stats: { ...form.stats, [key]: Number(e.target.value) } })}
                    className="focus:border-[#D42B2B]"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
            <h3 className="font-['Syne', 'sans-serif'] text-[16px] font-semibold text-[#0E0E0E] mb-4">
              SEO Defaults
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">Default Site Title</Label>
                <Input
                  id="seo_title"
                  value={form.seo_defaults?.title || ''}
                  onChange={(e) => setForm({ ...form, seo_defaults: { ...form.seo_defaults, title: e.target.value } })}
                  className="focus:border-[#D42B2B]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_description">Default Meta Description</Label>
                <Textarea
                  id="seo_description"
                  value={form.seo_defaults?.description || ''}
                  onChange={(e) => setForm({ ...form, seo_defaults: { ...form.seo_defaults, description: e.target.value } })}
                  rows={3}
                  className="focus:border-[#D42B2B]"
                />
              </div>
              <div className="space-y-2">
                <Label>Default OG Image</Label>
                <ImageUpload
                  bucket={STORAGE_BUCKETS.companyAssets}
                  value={form.seo_defaults?.og_image}
                  onChange={(url) => setForm({ ...form, seo_defaults: { ...form.seo_defaults, og_image: url } })}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="visibility" className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
            <h3 className="font-['Syne', 'sans-serif'] text-[16px] font-semibold text-[#0E0E0E] mb-4">
              Section Visibility
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-[#F0F0F0]">
                <div>
                  <Label htmlFor="careers_visible" className="font-['DM Sans', 'sans-serif'] font-medium cursor-pointer">
                    Careers Section
                  </Label>
                  <p className="text-sm text-gray-500">
                    Show/hide the careers section on the public website
                  </p>
                </div>
                <input
                  id="careers_visible"
                  type="checkbox"
                  checked={form.careers_visible ?? true}
                  onChange={(e) => setForm({ ...form, careers_visible: e.target.checked })}
                  className="w-5 h-5 rounded focus:ring-2 focus:ring-[#D42B2B]"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
