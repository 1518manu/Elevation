import { useState } from 'react'
import { Plus } from 'lucide-react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { useJobs, useCreateJob, useUpdateJob, useDeleteJob } from '@/hooks/useJobs'
import { JOB_DEPARTMENTS, JOB_TYPES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'

const empty = { title: '', department: 'technical', location: '', job_type: 'full_time', description: '', requirements: [], is_active: true }

export default function CareerAdminPage() {
  const { data: jobs = [], isLoading } = useJobs({ is_active: undefined })
  const createJob = useCreateJob()
  const updateJob = useUpdateJob()
  const deleteJob = useDeleteJob()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const columns = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'department', header: 'Department', cell: ({ row }) => <span className="capitalize">{row.original.department}</span> },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'is_active', header: 'Active', cell: ({ row }) => row.original.is_active ? 'Yes' : 'No' },
    { accessorKey: 'created_at', header: 'Posted', cell: ({ row }) => formatDate(row.original.created_at) },
    { id: 'actions', header: 'Actions', cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => { setForm(row.original); setEditId(row.original.id); setModalOpen(true) }}>Edit</Button>
        <Button size="sm" variant="destructive" onClick={() => setDeleteId(row.original.id)}>Delete</Button>
      </div>
    )},
  ]

  return (
    <div>
      <AdminTopbar title="Job Openings" />
      <div className="p-6">
        <div className="mb-4 flex justify-end"><Button onClick={() => { setForm(empty); setEditId(null); setModalOpen(true) }} className="bg-red-600"><Plus className="mr-2 h-4 w-4" />Post Job</Button></div>
        <DataTable columns={columns} data={jobs} isLoading={isLoading} />
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Post'} Job</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Department</Label>
              <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{JOB_DEPARTMENTS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <Button onClick={async () => { if (editId) await updateJob.mutateAsync({ id: editId, ...form }); else await createJob.mutateAsync(form); setModalOpen(false); toast({ title: 'Saved' }) }} className="w-full bg-red-600">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Job" onConfirm={async () => { await deleteJob.mutateAsync(deleteId); setDeleteId(null) }} />
    </div>
  )
}
