import { useState } from 'react'
import { MessageSquare, MoreVertical } from 'lucide-react'
import { useContactInquiries, useUpdateContactInquiry } from '@/hooks/useContactInquiries'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { exportToCSV } from '@/components/admin/CSVExport'
import { CONTACT_STATUSES } from '@/lib/constants'
import { timeAgo } from '@/lib/utils'

export default function ContactInquiriesPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const { data: contacts = [], isLoading } = useContactInquiries(statusFilter !== 'all' ? { status: statusFilter } : {})
  const updateContact = useUpdateContactInquiry()
  const { toast } = useToast()

  const filteredContacts = statusFilter === 'all' ? contacts : contacts.filter(c => c.status === statusFilter)

  const columns = [
    { 
      accessorKey: 'contact', 
      header: 'CONTACT', 
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
    { 
      accessorKey: 'subject', 
      header: 'SUBJECT', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-600 line-clamp-1">
          {row.original.subject}
        </span>
      )
    },
    { 
      accessorKey: 'status', 
      header: 'STATUS', 
      cell: ({ row }) => (
        <Badge variant={`admin-${row.original.status}`}>
          {row.original.status}
        </Badge>
      )
    },
    { 
      accessorKey: 'created_at', 
      header: 'RECEIVED', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
          {timeAgo(row.original.created_at)}
        </span>
      )
    },
    { 
      id: 'actions', 
      header: 'ACTIONS', 
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            <div className="font-['DM Sans', 'sans-serif'] text-xs text-gray-500 px-3 py-1">
              Update Status
            </div>
            {CONTACT_STATUSES.filter((s) => s.value !== row.original.status).map((s) => (
              <DropdownMenuItem 
                key={s.value}
                onClick={async () => { 
                  await updateContact.mutateAsync({ id: row.original.id, status: s.value }); 
                  toast({ title: `Status updated to ${s.label}` }) 
                }}
              >
                {s.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
              Contact Inquiries
            </h1>
            <p className="font-['DM Sans', 'sans-serif'] text-[13px] text-gray-500">
              {filteredContacts.length} total inquiries
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="admin-ghost" onClick={() => exportToCSV(filteredContacts, 'alfa-contacts.csv')}>
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-6 mb-4">
        {[{ value: 'all', label: 'All' }, ...CONTACT_STATUSES].map((s) => (
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

      {/* Contact Inquiries Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
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
                  Loading contact inquiries...
                </td>
              </tr>
            ) : filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <MessageSquare className="h-10 w-10 text-[#D42B2B]" />
                    <p className="font-['Syne', 'sans-serif'] text-[18px] font-medium text-[#0E0E0E]">
                      No inquiries yet
                    </p>
                    <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
                      Contact form submissions will appear here.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr 
                  key={contact.id} 
                  className="hover:bg-[#FAFAFA] cursor-pointer"
                >
                  {columns.map(col => (
                    <td key={col.header} className="px-4 py-4 border-b border-[#F0F0F0]">
                      {col.cell ? col.cell({ row: { original: contact } }) : contact[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}