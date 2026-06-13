import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'
import { ChevronLeft, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ADMIN_NAV } from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = ADMIN_NAV[user?.role] || ADMIN_NAV.editor

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <aside className={cn('flex h-screen flex-col bg-gray-900 text-white transition-all duration-300', collapsed ? 'w-[60px]' : 'w-60')}>
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && <span className="font-heading font-bold text-red-600">Alfa Admin</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="rounded p-1 hover:bg-white/10" aria-label="Toggle sidebar">
          <ChevronLeft className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = LucideIcons[item.icon] || LucideIcons.Circle
          const active = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5',
                active && 'border-l-[3px] border-red-600 bg-red-600/10 text-red-600'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="bg-red-600 text-white">{user?.full_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user?.full_name || user?.email}</p>
              <Badge variant="secondary" className="mt-1 text-xs capitalize">{user?.role?.replace('_', ' ')}</Badge>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button onClick={handleLogout} variant="ghost" className="mt-3 w-full justify-start text-gray-400 hover:text-white">
            <LogOut className="mr-2 h-4 w-4" />Logout
          </Button>
        )}
      </div>
    </aside>
  )
}
