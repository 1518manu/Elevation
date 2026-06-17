import { useState, useEffect } from 'react'
import { X, Building } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useProjects, useCreateProject, useUpdateProject } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import RichEditor from '@/components/admin/RichEditor'
import MultiImageUpload from '@/components/admin/MultiImageUpload'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { useToast } from '@/components/ui/toast'

const emptyProject = { 
  title: '', 
  slug: '', 
  client_name: '', 
  city: '', 
  state: '', 
  short_description: '', 
  description: '', 
  images: [], 
  is_featured: false, 
  is_active: true 
}

export default function ProjectFormDrawer({ open, onOpenChange, editId, onSave }) {
  const { data: projects } = useProjects()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const { toast } = useToast()
  
  const [form, setForm] = useState(emptyProject)

  useEffect(() => {
    if (editId && projects) {
      const project = projects.find(p => p.id === editId)
      if (project) {
        setForm(project)
      }
    } else if (open) {
      setForm(emptyProject)
    }
  }, [editId, projects, open])

  const handleSave = async () => {
    try {
      if (editId) {
        await updateProject.mutateAsync({ id: editId, ...form })
        toast({ title: 'Project updated successfully' })
      } else {
        await createProject.mutateAsync(form)
        toast({ title: 'Project added successfully' })
      }
      onSave()
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save project',
        variant: 'destructive' 
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl right-0 h-full sm:max-w-[680px] sm:h-auto sm:max-h-[90vh] sm:overflow-y-auto">
        <div className="flex h-full flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
            <h2 className="font-['Syne', 'sans-serif'] text-[20px] font-bold text-[#0E0E0E]">
              {editId ? 'Edit Project' : 'Add Project'}
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
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Basic Information
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Project Title <span className="text-[#D42B2B]">*</span></Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter project title"
                  className="focus:border-[#D42B2B]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client Name</Label>
                <Input
                  id="client"
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  placeholder="Enter client company name"
                  className="focus:border-[#D42B2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className="focus:border-[#D42B2B]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="e.g. Karnataka"
                    className="focus:border-[#D42B2B]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Input
                  id="short_description"
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  placeholder="Brief description for cards"
                  className="focus:border-[#D42B2B]"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Project Description
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <RichEditor
                  content={form.description}
                  onChange={(content) => setForm({ ...form, description: content })}
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Project Images
              </h3>
              
              <MultiImageUpload 
                bucket={STORAGE_BUCKETS.projects} 
                value={form.images || []} 
                onChange={(images) => setForm({ ...form, images })} 
              />
              <p className="font-['DM Sans', 'sans-serif'] text-xs text-gray-500">
                Upload multiple project images. First image will be used as the cover.
              </p>
            </div>

            {/* Visibility */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Visibility
              </h3>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Featured on homepage</span>
              </label>

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
              {editId ? 'Save Changes' : 'Add Project'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}