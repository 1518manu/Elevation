import { useState } from 'react'
import { Plus } from 'lucide-react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import DataTable from '@/components/admin/DataTable'
import MultiImageUpload from '@/components/admin/MultiImageUpload'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/useProjects'
import { slugify, formatDate } from '@/lib/utils'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'

const empty = { title: '', slug: '', client_name: '', city: '', state: '', short_description: '', description: '', images: [], is_featured: false, is_active: true }

export default function ProjectsAdminPage() {
  const { data: projects = [], isLoading } = useProjects({ is_active: undefined })
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const columns = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'client_name', header: 'Client' },
    { accessorKey: 'city', header: 'City' },
    { accessorKey: 'is_featured', header: 'Featured', cell: ({ row }) => row.original.is_featured ? 'Yes' : 'No' },
    { accessorKey: 'updated_at', header: 'Updated', cell: ({ row }) => formatDate(row.original.updated_at) },
    { id: 'actions', header: 'Actions', cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => { setForm(row.original); setEditId(row.original.id); setModalOpen(true) }}>Edit</Button>
        <Button size="sm" variant="destructive" onClick={() => setDeleteId(row.original.id)}>Delete</Button>
      </div>
    )},
  ]

  return (
    <div>
      <AdminTopbar title="Projects" />
      <div className="p-6">
        <div className="mb-4 flex justify-end"><Button onClick={() => { setForm(empty); setEditId(null); setModalOpen(true) }} className="bg-primary"><Plus className="mr-2 h-4 w-4" />Add Project</Button></div>
        <DataTable columns={columns} data={projects} isLoading={isLoading} />
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Project</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} /></div>
            <div><Label>Client</Label><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              <div><Label>State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Images</Label><MultiImageUpload bucket={STORAGE_BUCKETS.projects} value={form.images || []} onChange={(images) => setForm({ ...form, images })} /></div>
            <Button onClick={async () => { if (editId) await updateProject.mutateAsync({ id: editId, ...form }); else await createProject.mutateAsync(form); setModalOpen(false); toast({ title: 'Saved' }) }} className="w-full bg-primary">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Project" onConfirm={async () => { await deleteProject.mutateAsync(deleteId); setDeleteId(null) }} />
    </div>
  )
}
