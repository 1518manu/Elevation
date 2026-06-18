import { useState } from 'react'
import { Plus, Building, MoreVertical, Edit, Trash2, Star } from 'lucide-react'
import { useProjects, useDeleteProject } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ProjectFormDrawer from '@/components/admin/ProjectFormDrawer'

export default function ProjectsAdminPage() {
  const { data: projects = [], isLoading } = useProjects({ is_active: undefined })
  const deleteProject = useDeleteProject()
  const { toast } = useToast()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const openCreate = () => { setEditId(null); setDrawerOpen(true) }
  const openEdit = (id) => { setEditId(id); setDrawerOpen(true) }

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
      accessorKey: 'client_name', 
      header: 'CLIENT', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-600">
          {row.original.client_name}
        </span>
      )
    },
    { 
      accessorKey: 'location', 
      header: 'LOCATION', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
          {row.original.city}, {row.original.state}
        </span>
      )
    },
    { 
      accessorKey: 'is_featured', 
      header: 'FEATURED', 
      cell: ({ row }) => (
        row.original.is_featured ? (
          <Badge variant="admin-active" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            Featured
          </Badge>
        ) : (
          <Badge variant="admin-draft">Standard</Badge>
        )
      )
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

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-['Syne', 'sans-serif'] text-[11px] uppercase tracking-wider text-[#9CA3AF] mb-1">
              CONTENT
            </p>
            <h1 className="font-['Syne', 'sans-serif'] text-[24px] font-bold text-[#0E0E0E] mb-1">
              Projects
            </h1>
            <p className="font-['DM Sans', 'sans-serif'] text-[13px] text-gray-500">
              {projects.length} total · {projects.filter(p => p.is_active).length} active
            </p>
          </div>
          <Button variant="admin-primary" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>
      </div>

      {/* Projects Table */}
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
                  Loading projects...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Building className="h-10 w-10 text-[#D42B2B]" />
                    <p className="font-['Syne', 'sans-serif'] text-[18px] font-medium text-[#0E0E0E]">
                      No projects yet
                    </p>
                    <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
                      Add project case studies to showcase your work.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-[#FAFAFA]">
                  {columns.map(col => (
                    <td key={col.header} className="px-4 py-4 border-b border-[#F0F0F0]">
                      {col.cell ? col.cell({ row: { original: project } }) : project[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProjectFormDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
        editId={editId}
        onSave={() => setDrawerOpen(false)}
      />

      <ConfirmDialog 
        open={!!deleteId} 
        onOpenChange={() => setDeleteId(null)} 
        title="Delete Project"
        description="This action cannot be undone. The project will be permanently removed from the website."
        onConfirm={async () => { 
          await deleteProject.mutateAsync(deleteId); 
          setDeleteId(null); 
          toast({ title: 'Project deleted' }) 
        }} 
      />
    </div>
  )
}