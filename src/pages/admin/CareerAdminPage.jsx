import { useState } from 'react'
import { Plus, MoreVertical, Edit, Trash2, Briefcase } from 'lucide-react'
import { useJobs, useDeleteJob } from '@/hooks/useJobs'
import { useApplications } from '@/hooks/useApplications'
import { formatDate, getDaysUntilDeadline } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import JobFormDrawer from '@/components/admin/JobFormDrawer'

export default function CareerAdminPage() {
  const { data: jobs = [], isLoading } = useJobs({ is_active: undefined })
  const { data: applications = [] } = useApplications()
  const deleteJob = useDeleteJob()
  const { toast } = useToast()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editId, setEditId] = useState(null)

  const openCreate = () => { setEditId(null); setDrawerOpen(true) }
  const openEdit = (id) => { setEditId(id); setDrawerOpen(true) }

  const getApplicationCount = (jobId) => {
    return applications.filter(app => app.job_id === jobId).length
  }

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return 'normal'
    const daysUntil = getDaysUntilDeadline(deadline)
    if (daysUntil < 0) return 'past-due'
    if (daysUntil <= 7) return 'urgent'
    return 'normal'
  }

  const getDeadlineBadge = (deadline) => {
    const status = getDeadlineStatus(deadline)
    if (status === 'past-due') {
      return <Badge variant="admin-lost">Past Due</Badge>
    }
    if (status === 'urgent') {
      return <Badge variant="admin-contacted">Closing Soon</Badge>
    }
    return <Badge variant="admin-draft">{deadline ? formatDate(deadline) : 'No deadline'}</Badge>
  }

  const columns = [
    { 
      accessorKey: 'title', 
      header: 'TITLE', 
      cell: ({ row }) => (
        <div className="font-['DM Sans', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
          {row.original.title}
        </div>
      )
    },
    { 
      accessorKey: 'department', 
      header: 'DEPARTMENT', 
      cell: ({ row }) => (
        <Badge variant="admin-draft" className="capitalize">
          {row.original.department}
        </Badge>
      )
    },
    { 
      accessorKey: 'location', 
      header: 'LOCATION', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-600">
          {row.original.location}
        </span>
      )
    },
    { 
      accessorKey: 'job_type', 
      header: 'TYPE', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm capitalize">
          {row.original.job_type.replace('_', ' ')}
        </span>
      )
    },
    { 
      accessorKey: 'deadline', 
      header: 'DEADLINE', 
      cell: ({ row }) => getDeadlineBadge(row.original.deadline)
    },
    { 
      accessorKey: 'applications', 
      header: 'APPLICATIONS', 
      cell: ({ row }) => {
        const count = getApplicationCount(row.original.id)
        return count > 0 ? (
          <Badge variant="admin-new" className="font-['JetBrains Mono', 'monospace']">
            {count} new
          </Badge>
        ) : (
          <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
            0
          </span>
        )
      }
    },
    { 
      accessorKey: 'is_active', 
      header: 'STATUS', 
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'admin-active' : 'admin-inactive'}>
          {row.original.is_active ? 'Active' : 'Inactive'}
        </Badge>
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
            <DropdownMenuItem onClick={() => openEdit(row.original.id)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-[#D42B2B]"
              onClick={() => setDeleteId(row.original.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  ]

  const activeCount = jobs.filter(j => j.is_active).length

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
              Job Openings
            </h1>
            <p className="font-['DM Sans', 'sans-serif'] text-[13px] text-gray-500">
              {jobs.length} total · {activeCount} active · {applications.length} total applications
            </p>
          </div>
          <Button variant="admin-primary" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Post Job
          </Button>
        </div>
      </div>

      {/* Jobs Table */}
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
                  Loading job openings...
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Briefcase className="h-10 w-10 text-[#D42B2B]" />
                    <p className="font-['Syne', 'sans-serif'] text-[18px] font-medium text-[#0E0E0E]">
                      No job openings yet
                    </p>
                    <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
                      Create your first job opening to start hiring.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#FAFAFA]">
                  {columns.map(col => (
                    <td key={col.header} className="px-4 py-4 border-b border-[#F0F0F0]">
                      {col.cell ? col.cell({ row: { original: job } }) : job[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <JobFormDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
        editId={editId}
        onSave={() => setDrawerOpen(false)}
      />

      <ConfirmDialog 
        open={!!deleteId} 
        onOpenChange={() => setDeleteId(null)} 
        title="Delete Job Opening"
        description="This action cannot be undone. The job opening will be permanently removed from the website."
        onConfirm={async () => { 
          await deleteJob.mutateAsync(deleteId); 
          setDeleteId(null); 
          toast({ title: 'Job opening deleted' }) 
        }} 
      />
    </div>
  )
}