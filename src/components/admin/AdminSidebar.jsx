import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'
import { ChevronLeft, ChevronRight, LogOut, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ADMIN_NAV } from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function AdminSidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = ADMIN_NAV[user?.role] || ADMIN_NAV.admin

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen, setMobileMenuOpen])

  // Group navigation items by category
  const navGroups = {
    OVERVIEW: [navItems?.find(item => item.href === '/admin')],
    CONTENT: navItems?.filter(item => 
      ['/admin/products', '/admin/projects', '/admin/blog', '/admin/testimonials', '/admin/clients'].includes(item.href)
    ) || [],
    LEADS: navItems?.filter(item => 
      ['/admin/quotes', '/admin/contacts'].includes(item.href)
    ) || [],
    HR: navItems?.filter(item => 
      ['/admin/careers', '/admin/applications'].includes(item.href)
    ) || [],
    SETTINGS: navItems?.filter(item => 
      ['/admin/settings', '/admin/users'].includes(item.href)
    ) || [],
  }

  return (
    <aside 
      className={cn(
        'admin-sidebar flex h-screen flex-col transition-all duration-200 fixed lg:static z-50',
        collapsed ? 'w-[64px]' : 'w-[240px]',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'bg-[#0E0E0E] text-white'
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#333333] px-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#D42B2B] rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['Syne', 'sans-serif'] font-bold text-sm leading-none tracking-wider">
                ALFA
              </span>
              <span className="font-['Syne', 'sans-serif'] font-medium text-[10px] leading-none text-gray-400 tracking-wider">
                ELEVATOR
              </span>
            </div>
          </div>
        )}
        <button 
          className="lg:hidden p-2 rounded hover:bg-[#333333]"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="rounded-md p-1.5 hover:bg-[#1A1A1A] transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {!navItems ? (
          <div className="px-4 py-8 text-center text-gray-500">
            Loading navigation...
          </div>
        ) : (
          Object.entries(navGroups).map(([groupName, items]) => {
            if (!items || items.length === 0) return null
            
            const groupLabels = {
              OVERVIEW: 'OVERVIEW',
              CONTENT: 'CONTENT',
              LEADS: 'LEADS',
              HR: 'HR',
              SETTINGS: 'SETTINGS',
            }

            return (
              <div key={groupName} className="mb-6">
                {!collapsed && (
                  <p className="px-4 mb-2 font-['Syne', 'sans-serif'] text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    {groupLabels[groupName]}
                  </p>
                )}
                {items.map((item) => {
                  const Icon = LucideIcons[item.icon] || LucideIcons.Circle
                  const active = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href))
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150',
                        'text-sm',
                        !active && 'text-gray-500 hover:bg-[#1A1A1A] hover:text-gray-300',
                        active && 'bg-[rgba(212,43,43,0.10)] text-white border-l-[3px] border-[#D42B2B] font-medium'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={cn('h-5 w-5 flex-shrink-0', !active && 'text-gray-400')} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            )
          })
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-[#333333] p-4">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="bg-[#D42B2B] text-white font-['DM Sans', 'sans-serif'] font-medium">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium font-['DM Sans', 'sans-serif']">
                {user?.full_name || user?.email}
              </p>
              <Badge 
                variant="secondary" 
                className="mt-1 text-xs capitalize bg-[#F9ECEC] text-[#B01F1F] border-none"
              >
                {user?.role?.replace('_', ' ')}
              </Badge>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            className="mt-3 w-full justify-start text-gray-500 hover:bg-[#1A1A1A] hover:text-gray-300"
          >
            <LogOut className="mr-2 h-4 w-4" /> 
            Logout
          </Button>
        )}
      </div>
    </aside>
  )
}