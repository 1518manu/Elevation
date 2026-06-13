import { useState } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import { useContactInquiries, useUpdateContactInquiry } from '@/hooks/useContactInquiries'
import { CONTACT_STATUSES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { exportToCSV } from '@/components/admin/CSVExport'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

export default function ContactInquiriesPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const { data: contacts = [], isLoading } = useContactInquiries(statusFilter !== 'all' ? { status: statusFilter } : {})
  const updateContact = useUpdateContactInquiry()
  const { toast } = useToast()

  const columns = [
    { accessorKey: 'full_name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'subject', header: 'Subject' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'created_at', header: 'Date', cell: ({ row }) => formatDate(row.original.created_at) },
    { id: 'actions', header: 'Actions', cell: ({ row }) => (
      <div className="flex gap-1">
        {CONTACT_STATUSES.filter((s) => s.value !== row.original.status).map((s) => (
          <Button key={s.value} size="sm" variant="outline" onClick={async () => { await updateContact.mutateAsync({ id: row.original.id, status: s.value }); toast({ title: 'Updated' }) }}>{s.label}</Button>
        ))}
      </div>
    )},
  ]

  return (
    <div>
      <AdminTopbar title="Contact Inquiries" />
      <div className="p-6">
        <div className="mb-4 flex gap-2">
          {[{ value: 'all', label: 'All' }, ...CONTACT_STATUSES].map((s) => (
            <button key={s.value} onClick={() => setStatusFilter(s.value)} className={`rounded-full px-4 py-1.5 text-sm ${statusFilter === s.value ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{s.label}</button>
          ))}
          <Button variant="outline" className="ml-auto" onClick={() => exportToCSV(contacts, 'contacts.csv')}>Export CSV</Button>
        </div>
        <DataTable columns={columns} data={contacts} isLoading={isLoading} />
      </div>
    </div>
  )
}
