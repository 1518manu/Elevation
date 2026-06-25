import { useState, useEffect } from 'react'
import { Bell, Search, ChevronDown, LogOut, Settings, User as UserIcon, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'

export default function AdminTopbar({ title, breadcrumb, mobileMenuOpen, setMobileMenuOpen }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [notificationCount, setNotificationCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  // Fetch unread notifications count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const { count } = await supabase
          .from('notifications')
          .select('id')
          .eq('is_read', false)
        
        if (count !== null) {
          setNotificationCount(count)
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      }
    }

    fetchNotificationCount()

    // Subscribe to notifications for realtime updates
    const subscription = supabase
      .channel('notifications')
      .on('INSERT', (_payload) => {
        setNotificationCount(prev => prev + 1)
      })
      .on('UPDATE', (payload) => {
        if (payload.new.is_read && !payload.old.is_read) {
          setNotificationCount(prev => Math.max(0, prev - 1))
        }
      })

    return () => {
      subscription.unsubscribe()
    }
  })

  const markAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false)
      
      setNotificationCount(0)
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const navigateToPage = (path) => {
    navigate(path)
  }

  return (
    <header className="flex h-[60px] items-center justify-between border-b border-[#E5E5E5] bg-white px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setMobileMenuOpen && setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
        {breadcrumb && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="hover:text-[#D42B2B] cursor-pointer" onClick={() => navigateToPage('/admin')}>
              Dashboard
            </span>
            <span>/</span>
            <span className="text-[#0E0E0E]">{breadcrumb}</span>
          </div>
        )}
        <h1 className="font-['Syne', 'sans-serif'] text-[22px] font-bold text-[#0E0E0E]">
          {title || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 w-64 bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg text-sm focus:border-[#D42B2B] focus:ring-2 focus:ring-[#D42B2B20]"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <button 
                className="relative rounded-lg p-2 hover:bg-[#F7F7F7] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-[#D42B2B] text-white text-xs font-bold">
                    {notificationCount}
                  </Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[360px] max-h-[480px] overflow-y-auto">
              {notificationCount === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No unread notifications</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5E5]">
                    <span className="text-sm font-semibold">Unread Notifications</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-[#D42B2B]"
                      onClick={markAsRead}
                    >
                      Mark all as read
                    </Button>
                  </div>
                  {/* Sample notifications - would be fetched from database */}
                  <div className="p-2">
                    <div className="flex items-start gap-3 p-3 hover:bg-[#F7F7F7] rounded-lg cursor-pointer">
                      <div className="w-2 h-2 rounded-full bg-[#D42B2B] mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#0E0E0E]">New Quote from John Doe</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="border-t border-[#E5E5E5] p-2">
                <Button variant="ghost" size="sm" className="w-full text-sm">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-[#E5E5E5]" />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg hover:bg-[#F7F7F7] transition-colors p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="bg-[#D42B2B] text-white font-['DM Sans', 'sans-serif'] font-medium">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-[#0E0E0E] leading-none">
                  {user?.full_name || user?.email}
                </span>
                <span className="text-[10px] text-gray-500 capitalize">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center gap-2 text-[#D42B2B]"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}