import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useClients, useCreateClient, useUpdateClient } from '@/hooks/useClients'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ImageUpload from '@/components/admin/ImageUpload'
import { useToast } from '@/components/ui/toast'

const emptyClient = {
  name: '',
  logo_url: '',
  website_url: '',
  is_active: true,
  display_order: 0
}

export default function ClientFormDrawer({ open, onOpenChange, editId, onSave }) {
  const { data: clients } = useClients()
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const { toast } = useToast()
  
  const [form, setForm] = useState(emptyClient)

  useEffect(() => {
    if (editId && clients) {
      const client = clients.find(c => c.id === editId)
      if (client) {
        setForm(client)
      }
    } else if (open) {
      setForm(emptyClient)
    }
  }, [editId, clients, open])

  const handleSave = async () => {
    try {
      if (editId) {
        await updateClient.mutateAsync({ id: editId, ...form })
        toast({ title: 'Client updated successfully' })
      } else {
        await createClient.mutateAsync(form)
        toast({ title: 'Client added successfully' })
      }
      onSave()
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save client',
        variant: 'destructive' 
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl right-0 h-full sm:max-w-[480px] sm:h-auto sm:max-h-[90vh] sm:overflow-y-auto">
        <div className="flex h-full flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
            <h2 className="font-['Syne', 'sans-serif'] text-[20px] font-bold text-[#0E0E0E]">
              {editId ? 'Edit Client' : 'Add Client'}
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Logo Upload */}
            <div>
              <Label className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E] mb-3 block">
                Logo
              </Label>
              <ImageUpload 
                bucket={STORAGE_BUCKETS.clients}
                value={form.logo_url || ''}
                onChange={(url) => setForm({ ...form, logo_url: url })}
              />
              <p className="font-['DM Sans', 'sans-serif'] text-xs text-gray-500 mt-2">
                Recommended: Transparent PNG, 200x80px
              </p>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Information
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Company Name <span className="text-[#D42B2B]">*</span></Label>
                <Input
                  id="name"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter company name"
                  className="focus:border-[#D42B2B]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  value={form.website_url || ''}
                  onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                  placeholder="https://www.example.com"
                  className="focus:border-[#D42B2B]"
                />
              </div>
            </div>

            {/* Visibility */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Visibility
              </h3>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Visible on website</span>
              </label>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] px-6 py-4">
            <Button variant="admin-ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="admin-primary" onClick={handleSave} className="px-8">
              {editId ? 'Save Changes' : 'Add Client'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}