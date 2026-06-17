import { useState } from 'react'
import { User, MoreVertical, FileText, Download, Eye } from 'lucide-react'
import { useApplications, useUpdateApplication } from '@/hooks/useApplications'
import { useJobs } from '@/hooks/useJobs'
import { APPLICATION_STATUSES } from '@/lib/constants'
import { timeAgo } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import ApplicationDetailDrawer from '@/components/admin/ApplicationDetailDrawer'
import { supabase } from '@/lib/supabase'

export default function ApplicationsAdminPage() {
  const { data: applications = [], isLoading } = useApplications()
  const { data: jobs = [] } = useJobs()
  const updateApplication = useUpdateApplication()
  const { toast } = useToast()
  const [selectedJobId, setSelectedJobId] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const filteredApplications = selectedJobId === 'all' 
    ? applications 
    : applications.filter(app => app.job_id === selectedJobId)

  const getAvatarColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-600',
      reviewed: 'bg-yellow-100 text-yellow-600',
      shortlisted: 'bg-green-100 text-green-600',
      interview: 'bg-purple-100 text-purple-600',
      hired: 'bg-emerald-100 text-emerald-600',
      rejected: 'bg-red-100 text-red-600'
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  const columns = [
    { 
      accessorKey: 'applicant', 
      header: 'APPLICANT', 
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className={`h-10 w-10 ${getAvatarColor(row.original.status)}`}>
            <AvatarFallback className="font-['DM Sans', 'sans-serif'] font-semibold">
              {row.original.full_name?.charAt(0) || row.original.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-['DM Sans', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
              {row.original.full_name}
            </p>
            <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
              {row.original.email}
            </p>
          </div>
        </div>
      )
    },
    { 
      accessorKey: 'job', 
      header: 'JOB APPLIED FOR', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm">
          {row.original.jobs?.title || 'Unknown position'}
        </span>
      )
    },
    { 
      accessorKey: 'phone', 
      header: 'PHONE', 
      cell: ({ row }) => (
        <a 
          href={`tel:${row.original.phone}`}
          className="font-['DM Sans', 'sans-serif'] text-sm text-[#D42B2B] hover:underline"
        >
          {row.original.phone}
        </a>
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
      header: 'APPLIED ON', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm text-[#9CA3AF]">
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
            <DropdownMenuItem onClick={() => setSelectedId(row.original.id)}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            {row.original.resume_url && (
              <DropdownMenuItem onClick={() => window.open(row.original.resume_url, '_blank')}>
                <Download className="mr-2 h-4 w-4" /> Download Resume
              </DropdownMenuItem>
            )}
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
              HR
            </p>
            <h1 className="font-['Syne', 'sans-serif'] text-[24px] font-bold text-[#0E0E0E] mb-1">
              Applications
            </h1>
            <p className="font-['DM Sans', 'sans-serif'] text-[13px] text-gray-500">
              {filteredApplications.length} total applications
            </p>
          </div>
        </div>
      </div>

      {/* Job Filter */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 mb-4 flex items-center gap-4">
        <span className="font-['DM Sans', 'sans-serif'] text-sm font-medium text-gray-600">
          Filter by Job:
        </span>
        <Select value={selectedJobId} onValueChange={setSelectedJobId} className="w-64">
          <SelectTrigger className="focus:border-[#D42B2B]">
            <SelectValue placeholder="All positions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All positions</SelectItem>
            {jobs?.filter(j => j.is_active).map(job => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Applications Table */}
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
                  Loading applications...
                </td>
              </tr>
            ) : filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <User className="h-10 w-10 text-[#D42B2B]" />
                    <p className="font-['Syne', 'sans-serif'] text-[18px] font-medium text-[#0E0E0E]">
                      No applications found
                    </p>
                    <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
                      Applications will appear here when candidates apply to job openings.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredApplications.map((application) => (
                <tr 
                  key={application.id} 
                  onClick={() => setSelectedId(application.id)}
                  className="hover:bg-[#FAFAFA] cursor-pointer"
                >
                  {columns.map(col => (
                    <td key={col.header} className="px-4 py-4 border-b border-[#F0F0F0]">
                      {col.cell ? col.cell({ row: { original: application } }) : application[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ApplicationDetailDrawer 
        applicationId={selectedId}
        open={!!selectedId}
        onOpenChange={() => setSelectedId(null)}
      />
    </div>
  )
}