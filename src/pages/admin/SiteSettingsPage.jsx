import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import ImageUpload from '@/components/admin/ImageUpload'
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings'
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
  const { toast } = useToast()
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (settings) setForm(settings)
  }, [settings])

  if (isLoading || !form) return <PageLoader />

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({ id: form.id, ...form })
      toast({ title: 'Settings saved' })
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  }

  const updateList = (key, index, value) => {
    const list = [...(form[key] || [])]
    list[index] = value
    setForm({ ...form, [key]: list })
  }

  return (
    <div>
      <AdminTopbar title="Site Settings" />
      <div className="p-6">
        <Tabs defaultValue="company">
          <TabsList>
            <TabsTrigger value="company">Company Info</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="seo">SEO Defaults</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="mt-6 space-y-4 max-w-2xl">
            <div><Label>Company Name</Label><Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} /></div>
            <div><Label>Tagline</Label><Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
            <div><Label>WhatsApp Number</Label><Input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} /></div>
            {form.phones?.map((p, i) => (
              <div key={i}><Label>Phone {i + 1}</Label><Input value={p} onChange={(e) => updateList('phones', i, e.target.value)} /></div>
            ))}
            <Button variant="outline" onClick={() => setForm({ ...form, phones: [...(form.phones || []), ''] })}>Add Phone</Button>
            {form.emails?.map((e, i) => (
              <div key={i}><Label>Email {i + 1}</Label><Input value={e} onChange={(ev) => updateList('emails', i, ev.target.value)} /></div>
            ))}
            <Button variant="outline" onClick={() => setForm({ ...form, emails: [...(form.emails || []), ''] })}>Add Email</Button>
            <div><Label>Google Maps Embed</Label><Textarea value={form.google_maps_embed} onChange={(e) => setForm({ ...form, google_maps_embed: e.target.value })} /></div>
          </TabsContent>

          <TabsContent value="social" className="mt-6 space-y-4 max-w-2xl">
            {['facebook', 'instagram', 'linkedin', 'youtube', 'twitter'].map((key) => (
              <div key={key}><Label className="capitalize">{key}</Label><Input value={form.social_links?.[key] || ''} onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, [key]: e.target.value } })} /></div>
            ))}
          </TabsContent>

          <TabsContent value="homepage" className="mt-6 space-y-4 max-w-2xl">
            <div><Label>Hero Headline</Label><Input value={form.hero_content?.headline || ''} onChange={(e) => setForm({ ...form, hero_content: { ...form.hero_content, headline: e.target.value } })} /></div>
            <div><Label>Hero Sub-headline</Label><Textarea value={form.hero_content?.subheadline || ''} onChange={(e) => setForm({ ...form, hero_content: { ...form.hero_content, subheadline: e.target.value } })} /></div>
            {['years', 'projects', 'clients', 'cities'].map((key) => (
              <div key={key}><Label className="capitalize">{key}</Label><Input type="number" value={form.stats?.[key] || ''} onChange={(e) => setForm({ ...form, stats: { ...form.stats, [key]: Number(e.target.value) } })} /></div>
            ))}
          </TabsContent>

          <TabsContent value="seo" className="mt-6 space-y-4 max-w-2xl">
            <div><Label>Default Site Title</Label><Input value={form.seo_defaults?.title || ''} onChange={(e) => setForm({ ...form, seo_defaults: { ...form.seo_defaults, title: e.target.value } })} /></div>
            <div><Label>Default Meta Description</Label><Textarea value={form.seo_defaults?.description || ''} onChange={(e) => setForm({ ...form, seo_defaults: { ...form.seo_defaults, description: e.target.value } })} /></div>
            <div><Label>Default OG Image</Label><ImageUpload bucket={STORAGE_BUCKETS.companyAssets} value={form.seo_defaults?.og_image} onChange={(url) => setForm({ ...form, seo_defaults: { ...form.seo_defaults, og_image: url } })} /></div>
          </TabsContent>
        </Tabs>
        <Button onClick={handleSave} className="mt-6 bg-red-600">Save Settings</Button>
      </div>
    </div>
  )
}
