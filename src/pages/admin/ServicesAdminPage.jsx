import { useState } from 'react'
import { Plus } from 'lucide-react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { useServices, useCreateService, useUpdateService, useDeleteService } from '@/hooks/useServices'
import { slugify, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'

const empty = { title: '', slug: '', short_description: '', description: '', icon: 'Wrench', key_features: [], is_active: true, display_order: 0 }

export default function ServicesAdminPage() {
  const { data: services = [], isLoading } = useServices({ is_active: undefined })
  const createService = useCreateService()
  const updateService = useUpdateService()
  const deleteService = useDeleteService()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const columns = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'slug', header: 'Slug' },
    { accessorKey: 'is_active', header: 'Active', cell: ({ row }) => row.original.is_active ? 'Yes' : 'No' },
    { accessorKey: 'updated_at', header: 'Updated', cell: ({ row }) => formatDate(row.original.updated_at) },
    { id: 'actions', header: 'Actions', cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => { setForm(row.original); setEditId(row.original.id); setModalOpen(true) }}>Edit</Button>
        <Button size="sm" variant="destructive" onClick={() => setDeleteId(row.original.id)}>Delete</Button>
      </div>
    )},
  ]

  const handleSave = async () => {
    try {
      if (editId) await updateService.mutateAsync({ id: editId, ...form })
      else await createService.mutateAsync(form)
      toast({ title: 'Service saved' })
      setModalOpen(false)
    } catch (err) { toast({ title: 'Error', description: err.message, variant: 'destructive' }) }
  }

  return (
    <div>
      <AdminTopbar title="Services" />
      <div className="p-6">
        <div className="mb-4 flex justify-end"><Button onClick={() => { setForm(empty); setEditId(null); setModalOpen(true) }} className="bg-red-600"><Plus className="mr-2 h-4 w-4" />Add Service</Button></div>
        <DataTable columns={columns} data={services} isLoading={isLoading} />
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Service</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div><Label>Short Description</Label><Input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <Button onClick={handleSave} className="w-full bg-red-600">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Service" onConfirm={async () => { await deleteService.mutateAsync(deleteId); setDeleteId(null) }} />
    </div>
  )
}
