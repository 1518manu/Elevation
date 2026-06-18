import { useState } from 'react'
import { Phone } from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import { useQuoteInquiries } from '@/hooks/useQuoteInquiries'
import { useRealtimeLeads } from '@/hooks/useRealtimeLeads'
import { QUOTE_STATUSES } from '@/lib/constants'
import { timeAgo } from '@/lib/utils'
import { exportToCSV } from '@/components/admin/CSVExport'
import { Button } from '@/components/ui/button'
import QuoteDetailDrawer from '@/components/admin/QuoteDetailDrawer'

export default function QuoteInquiriesPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const { data: quotes = [], isLoading } = useQuoteInquiries(statusFilter !== 'all' ? { status: statusFilter } : {})
  const { newLeadCount } = useRealtimeLeads()

  const filteredQuotes = statusFilter === 'all' ? quotes : quotes.filter(q => q.status === statusFilter)

  const columns = [
    { 
      accessorKey: 'name', 
      header: 'NAME + EMAIL', 
      cell: ({ row }) => (
        <div>
          <p className="font-['DM Sans', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
            {row.original.full_name}
          </p>
          <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
            {row.original.email}
          </p>
        </div>
      )
    },
    { accessorKey: 'phone', header: 'PHONE' },
    { 
      accessorKey: 'location', 
      header: 'CITY, STATE', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm">
          {row.original.city}, {row.original.state}
        </span>
      )
    },
    { 
      accessorKey: 'elevator_type', 
      header: 'TYPE', 
      cell: ({ row }) => (
        <StatusBadge status={row.original.elevator_type} />
      )
    },
    { 
      accessorKey: 'num_floors', 
      header: 'FLOORS', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm">
          {row.original.num_floors} fl
        </span>
      )
    },
    { 
      accessorKey: 'building_type', 
      header: 'BLDG TYPE' 
    },
    { 
      accessorKey: 'status', 
      header: 'STATUS', 
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      )
    },
    { 
      accessorKey: 'assigned_to', 
      header: 'ASSIGNED', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
          {row.original.assigned_to || '-'}
        </span>
      )
    },
    { 
      accessorKey: 'created_at', 
      header: 'DATE', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm text-[#9CA3AF]">
          {timeAgo(row.original.created_at)}
        </span>
      )
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-['Syne', 'sans-serif'] text-[11px] uppercase tracking-wider text-[#9CA3AF] mb-1">
              LEADS
            </p>
            <h1 className="font-['Syne', 'sans-serif'] text-[24px] font-bold text-[#0E0E0E] mb-1">
              Quote Inquiries
            </h1>
            <p className="font-['DM Sans', 'sans-serif'] text-[13px] text-gray-500">
              {filteredQuotes.length} total {newLeadCount > 0 && `· ${newLeadCount} new`}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="admin-ghost" onClick={() => exportToCSV(filteredQuotes, 'alfa-quotes.csv')}>
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-6 mb-4">
        {[{ value: 'all', label: 'All' }, ...QUOTE_STATUSES].map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`relative py-2 font-['DM Sans', 'sans-serif'] text-sm capitalize transition-colors ${
              statusFilter === s.value 
                ? 'text-[#D42B2B]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {s.label}
            {statusFilter === s.value && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D42B2B]" />
            )}
          </button>
        ))}
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
        {/* Table will be rendered here with new row animations */}
        <table className="w-full">
          <thead>
            <tr className="bg-[#F7F7F7] border-b border-[#E5E5E5]">
              {columns.map(col => (
                <th key={col.header} className="font-['Syne', 'sans-serif'] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] px-4 py-3 text-left">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredQuotes.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Phone className="h-10 w-10 text-[#D42B2B]" />
                    <p className="font-['Syne', 'sans-serif'] text-[18px] font-medium text-[#0E0E0E]">
                      No inquiries found
                    </p>
                    <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
                      Quote requests will appear here when they come in.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredQuotes.map((quote, _index) => (
                <tr 
                  key={quote.id} 
                  onClick={() => setSelectedId(quote.id)}
                  className="hover:bg-[#FAFAFA] cursor-pointer transition-colors"
                >
                  {columns.map(col => (
                    <td key={col.header} className="px-4 py-4 border-b border-[#F0F0F0]">
                      {col.cell ? col.cell({ row: { original: quote } }) : quote[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Quote Detail Drawer */}
      <QuoteDetailDrawer 
        quoteId={selectedId}
        open={!!selectedId}
        onOpenChange={() => setSelectedId(null)}
      />
    </div>
  )
}