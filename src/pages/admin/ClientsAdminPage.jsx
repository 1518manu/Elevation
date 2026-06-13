import { useState } from 'react'
import { Plus } from 'lucide-react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import SortableList from '@/components/admin/SortableList'
import ImageUpload from '@/components/admin/ImageUpload'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '@/hooks/useClients'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'

const empty = { name: '', logo_url: '', website_url: '', is_active: true, display_order: 0 }

export default function ClientsAdminPage() {
  const { data: clients = [] } = useClients({ is_active: undefined })
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const deleteClient = useDeleteClient()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  return (
    <div>
      <AdminTopbar title="Clients" />
      <div className="p-6 space-y-6">
        <div className="flex justify-end"><Button onClick={() => { setForm(empty); setEditId(null); setModalOpen(true) }} className="bg-red-600"><Plus className="mr-2 h-4 w-4" />Add Client</Button></div>
        <SortableList items={clients} onReorder={async (items) => { for (let i = 0; i < items.length; i++) await updateClient.mutateAsync({ id: items[i].id, display_order: i }) }} renderItem={(c) => (
          <div className="flex items-center justify-between w-full">
            <span>{c.name}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setForm(c); setEditId(c.id); setModalOpen(true) }}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => setDeleteId(c.id)}>Delete</Button>
            </div>
          </div>
        )} />
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Client</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Logo</Label><ImageUpload bucket={STORAGE_BUCKETS.clients} value={form.logo_url} onChange={(url) => setForm({ ...form, logo_url: url })} /></div>
            <div><Label>Website</Label><Input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} /></div>
            <Button onClick={async () => { if (editId) await updateClient.mutateAsync({ id: editId, ...form }); else await createClient.mutateAsync(form); setModalOpen(false); toast({ title: 'Saved' }) }} className="w-full bg-red-600">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Client" onConfirm={async () => { await deleteClient.mutateAsync(deleteId); setDeleteId(null) }} />
    </div>
  )
}
