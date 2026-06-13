import { useState } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import { useQuoteInquiries, useUpdateQuoteInquiry } from '@/hooks/useQuoteInquiries'
import { QUOTE_STATUSES } from '@/lib/constants'
import { formatDate, timeAgo } from '@/lib/utils'
import { exportToCSV } from '@/components/admin/CSVExport'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'

export default function QuoteInquiriesPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const { data: quotes = [], isLoading } = useQuoteInquiries(statusFilter !== 'all' ? { status: statusFilter } : {})
  const updateQuote = useUpdateQuoteInquiry()
  const { toast } = useToast()

  const columns = [
    { accessorKey: 'full_name', header: 'Name' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'city', header: 'City' },
    { accessorKey: 'elevator_type', header: 'Type' },
    { accessorKey: 'num_floors', header: 'Floors' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'created_at', header: 'Date', cell: ({ row }) => formatDate(row.original.created_at) },
  ]

  const handleUpdate = async (updates) => {
    try {
      await updateQuote.mutateAsync({ id: selected.id, ...updates })
      setSelected({ ...selected, ...updates })
      toast({ title: 'Updated' })
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <div>
      <AdminTopbar title="Quote Inquiries" />
      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {[{ value: 'all', label: 'All' }, ...QUOTE_STATUSES].map((s) => (
            <button key={s.value} onClick={() => setStatusFilter(s.value)} className={`rounded-full px-4 py-1.5 text-sm ${statusFilter === s.value ? 'bg-primary text-white' : 'bg-gray-100'}`}>{s.label}</button>
          ))}
          <Button variant="outline" className="ml-auto" onClick={() => exportToCSV(quotes, 'quotes.csv')}>Export CSV</Button>
        </div>
        <DataTable columns={columns} data={quotes} isLoading={isLoading} onRowClick={setSelected} />
      </div>

      {selected && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l bg-white p-6 shadow-xl overflow-y-auto">
          <button onClick={() => setSelected(null)} className="mb-4 text-sm text-gray-500">← Close</button>
          <h2 className="mb-4 font-heading text-xl font-semibold text-primary">{selected.full_name}</h2>
          <div className="space-y-3 text-sm">
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Phone:</strong> {selected.phone}</p>
            <p><strong>City:</strong> {selected.city}</p>
            <p><strong>Type:</strong> {selected.elevator_type}</p>
            <p><strong>Floors:</strong> {selected.num_floors}</p>
            <p><strong>Building:</strong> {selected.building_type}</p>
            {selected.message && <p><strong>Message:</strong> {selected.message}</p>}
          </div>
          <div className="mt-6 space-y-4">
            <div><label className="text-sm font-medium">Status</label>
              <Select value={selected.status} onValueChange={(v) => handleUpdate({ status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{QUOTE_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-sm font-medium">Sales Notes</label>
              <Textarea value={selected.sales_notes || ''} onChange={(e) => setSelected({ ...selected, sales_notes: e.target.value })} />
              <Button className="mt-2" onClick={() => handleUpdate({ sales_notes: selected.sales_notes })}>Save Notes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
