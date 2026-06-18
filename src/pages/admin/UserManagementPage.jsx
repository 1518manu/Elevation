import { useState, useEffect } from 'react'
import { Users, Shield, Check, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import { USER_ROLES } from '@/lib/constants'
import PageLoader from '@/components/common/PageLoader'
import { useAuth } from '@/hooks/useAuth'

export default function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user: currentUser } = useAuth()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setUsers(data || [])
    setLoading(false)
  }

  const updateRole = async (id, role) => {
    const { error } = await supabase.from('users').update({ role }).eq('id', id)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      setUsers(users.map((u) => u.id === id ? { ...u, role } : u))
      toast({ title: 'Role updated successfully' })
    }
  }

  const toggleUserStatus = async (id, isActive) => {
    const { error } = await supabase.from('users').update({ is_active: isActive }).eq('id', id)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      setUsers(users.map((u) => u.id === id ? { ...u, is_active: isActive } : u))
      toast({ title: `User ${isActive ? 'activated' : 'deactivated'} successfully` })
    }
  }

  const getAvatarColor = (role) => {
    const colors = {
      super_admin: 'bg-[#D42B2B] text-white',
      admin: 'bg-purple-100 text-purple-600',
    }
    return colors[role] || 'bg-gray-100 text-gray-600'
  }

  const columns = [
    { 
      accessorKey: 'user', 
      header: 'USER', 
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className={`h-10 w-10 ${getAvatarColor(row.original.role)}`}>
            <AvatarFallback className="font-['DM Sans', 'sans-serif'] font-semibold">
              {row.original.full_name?.charAt(0) || row.original.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-['DM Sans', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
              {row.original.full_name || 'Unknown'}
            </p>
            <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
              {row.original.email}
            </p>
          </div>
        </div>
      )
    },
    { 
      accessorKey: 'role', 
      header: 'ROLE', 
      cell: ({ row }) => (
        <Select 
          value={row.original.role} 
          onValueChange={(v) => updateRole(row.original.id, v)}
          disabled={row.original.id === currentUser?.id}
        >
          <SelectTrigger className="w-40 h-8 focus:border-[#D42B2B]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {USER_ROLES.map((r) => (
              <SelectItem key={r} value={r} className="capitalize">
                {r.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    { 
      accessorKey: 'status', 
      header: 'STATUS', 
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'admin-active' : 'admin-inactive'}>
          {row.original.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    { 
      accessorKey: 'last_sign_in', 
      header: 'LAST SIGN IN', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
          {row.original.last_sign_in_at ? new Date(row.original.last_sign_in_at).toLocaleDateString() : 'Never'}
        </span>
      )
    },
    { 
      accessorKey: 'created_at', 
      header: 'CREATED', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      )
    },
    { 
      id: 'actions', 
      header: 'ACTIONS', 
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.is_active ? (
            <Button
              variant="admin-ghost"
              size="admin-sm"
              onClick={() => toggleUserStatus(row.original.id, false)}
              disabled={row.original.id === currentUser?.id}
              title="Deactivate user"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          ) : (
            <Button
              variant="admin-ghost"
              size="admin-sm"
              onClick={() => toggleUserStatus(row.original.id, true)}
              title="Activate user"
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
          )}
        </div>
      )
    },
  ]

  // Only super admin should access this page
  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="h-16 w-16 text-[#D42B2B] mx-auto mb-4" />
          <h2 className="font-['Syne', 'sans-serif'] text-[20px] font-bold text-[#0E0E0E] mb-2">
            Access Denied
          </h2>
          <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
            You need super admin privileges to access this page.
          </p>
        </div>
      </div>
    )
  }

  if (loading) return <PageLoader />

  const activeCount = users.filter(u => u.is_active).length

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div>
          <p className="font-['Syne', 'sans-serif'] text-[11px] uppercase tracking-wider text-[#9CA3AF] mb-1">
            SETTINGS
          </p>
          <h1 className="font-['Syne', 'sans-serif'] text-[24px] font-bold text-[#0E0E0E] mb-1">
            User Management
          </h1>
          <p className="font-['DM Sans', 'sans-serif'] text-[13px] text-gray-500">
            {users.length} total users · {activeCount} active
          </p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-[#F9ECEC] border border-[#D42B2B20] rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-[#D42B2B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-['DM Sans', 'sans-serif'] text-sm font-medium text-[#0E0E0E] mb-1">
              Manage user access and roles
            </p>
            <p className="font-['DM Sans', 'sans-serif'] text-xs text-gray-600">
              You can change user roles and activate/deactivate accounts. Be careful when modifying permissions.
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
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
            {users.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Users className="h-10 w-10 text-[#D42B2B]" />
                    <p className="font-['Syne', 'sans-serif'] text-[18px] font-medium text-[#0E0E0E]">
                      No users yet
                    </p>
                    <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
                      Users will appear here when they sign up or are added.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-[#FAFAFA]">
                  {columns.map(col => (
                    <td key={col.header} className="px-4 py-4 border-b border-[#F0F0F0]">
                      {col.cell ? col.cell({ row: { original: user } }) : user[col.accessorKey]}
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