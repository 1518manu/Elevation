import { useState } from 'react'
import { Plus } from 'lucide-react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import DataTable from '@/components/admin/DataTable'
import SortableList from '@/components/admin/SortableList'
import ImageUpload from '@/components/admin/ImageUpload'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '@/hooks/useTestimonials'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'

const empty = { name: '', company: '', role: '', rating: 5, content: '', is_featured: false, is_active: true, display_order: 0 }

export default function TestimonialsAdminPage() {
  const { data: testimonials = [], isLoading } = useTestimonials({ is_active: undefined })
  const createTestimonial = useCreateTestimonial()
  const updateTestimonial = useUpdateTestimonial()
  const deleteTestimonial = useDeleteTestimonial()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const handleReorder = async (items) => {
    for (let i = 0; i < items.length; i++) {
      await updateTestimonial.mutateAsync({ id: items[i].id, display_order: i })
    }
  }

  return (
    <div>
      <AdminTopbar title="Testimonials" />
      <div className="p-6 space-y-6">
        <div className="flex justify-end"><Button onClick={() => { setForm(empty); setEditId(null); setModalOpen(true) }} className="bg-primary"><Plus className="mr-2 h-4 w-4" />Add Testimonial</Button></div>
        <SortableList items={testimonials} onReorder={handleReorder} renderItem={(t) => (
          <div className="flex items-center justify-between w-full">
            <span className="font-medium">{t.name} — {t.company}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setForm(t); setEditId(t.id); setModalOpen(true) }}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => setDeleteId(t.id)}>Delete</Button>
            </div>
          </div>
        )} />
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Testimonial</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            <div><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
            <div><Label>Photo</Label><ImageUpload bucket={STORAGE_BUCKETS.testimonials} value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url })} /></div>
            <Button onClick={async () => { if (editId) await updateTestimonial.mutateAsync({ id: editId, ...form }); else await createTestimonial.mutateAsync(form); setModalOpen(false); toast({ title: 'Saved' }) }} className="w-full bg-primary">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Testimonial" onConfirm={async () => { await deleteTestimonial.mutateAsync(deleteId); setDeleteId(null) }} />
    </div>
  )
}
