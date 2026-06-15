import AdminTopbar from '@/components/admin/AdminTopbar'
import DataTable from '@/components/admin/DataTable'
import { useApplications, useUpdateApplication } from '@/hooks/useApplications'
import { APPLICATION_STATUSES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'

export default function ApplicationsAdminPage() {
  const { data: applications = [], isLoading } = useApplications()
  const updateApplication = useUpdateApplication()
  const { toast } = useToast()

  const columns = [
    { accessorKey: 'full_name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'jobs', header: 'Job', cell: ({ row }) => row.original.jobs?.title || '-' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => (
      <Select value={row.original.status} onValueChange={async (v) => { await updateApplication.mutateAsync({ id: row.original.id, status: v }); toast({ title: 'Updated' }) }}>
        <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
        <SelectContent>{APPLICATION_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
      </Select>
    )},
    { accessorKey: 'created_at', header: 'Applied', cell: ({ row }) => formatDate(row.original.created_at) },
    { id: 'resume', header: 'Resume', cell: ({ row }) => row.original.resume_url ? <a href={row.original.resume_url} target="_blank" rel="noopener noreferrer" className="text-red-600 underline">View</a> : '-' },
  ]

  return (
    <div>
      <AdminTopbar title="Applications" />
      <div className="p-6"><DataTable columns={columns} data={applications} isLoading={isLoading} /></div>
    </div>
  )
}
