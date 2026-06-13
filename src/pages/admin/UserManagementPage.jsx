import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import DataTable from '@/components/admin/DataTable'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import { USER_ROLES } from '@/lib/constants'
import PageLoader from '@/components/common/PageLoader'

export default function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    supabase.from('users').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!error) setUsers(data || [])
      setLoading(false)
    })
  }, [])

  const updateRole = async (id, role) => {
    const { error } = await supabase.from('users').update({ role }).eq('id', id)
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' })
    else {
      setUsers(users.map((u) => u.id === id ? { ...u, role } : u))
      toast({ title: 'Role updated' })
    }
  }

  const columns = [
    { accessorKey: 'full_name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role', cell: ({ row }) => (
      <Select value={row.original.role} onValueChange={(v) => updateRole(row.original.id, v)}>
        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
        <SelectContent>{USER_ROLES.map((r) => <SelectItem key={r} value={r} className="capitalize">{r.replace('_', ' ')}</SelectItem>)}</SelectContent>
      </Select>
    )},
    { accessorKey: 'is_active', header: 'Status', cell: ({ row }) => <Badge>{row.original.is_active ? 'Active' : 'Inactive'}</Badge> },
  ]

  if (loading) return <PageLoader />

  return (
    <div>
      <AdminTopbar title="User Management" />
      <div className="p-6"><DataTable columns={columns} data={users} isLoading={loading} /></div>
    </div>
  )
}
