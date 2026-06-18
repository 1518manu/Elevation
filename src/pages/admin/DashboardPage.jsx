import { Link } from 'react-router-dom'
import { FileText, Mail, Briefcase, BookOpen, Inbox, ArrowUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import StatusBadge from '@/components/admin/StatusBadge'
import { useQuoteInquiries } from '@/hooks/useQuoteInquiries'
import { useContactInquiries } from '@/hooks/useContactInquiries'
import { useJobs } from '@/hooks/useJobs'
import { useBlogs } from '@/hooks/useBlogs'
import { timeAgo } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { data: quotes = [], isLoading: quotesLoading, error: quotesError } = useQuoteInquiries()
  const { data: contacts = [], isLoading: contactsLoading, error: contactsError } = useContactInquiries()
  const { data: jobs = [], isLoading: jobsLoading, error: jobsError } = useJobs({ is_active: true })
  const { data: blogs = [], isLoading: blogsLoading, error: blogsError } = useBlogs({ is_published: true })

  const isLoading = quotesLoading || contactsLoading || jobsLoading || blogsLoading
  const error = quotesError || contactsError || jobsError || blogsError

  const thisMonth = new Date().getMonth()
  const quotesThisMonth = quotes.filter((q) => new Date(q.created_at).getMonth() === thisMonth)
  const newContacts = contacts.filter((c) => c.status === 'new')
  
  // Calculate trends (comparing with previous month)
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
  const quotesLastMonth = quotes.filter((q) => new Date(q.created_at).getMonth() === lastMonth)
  const quoteTrend = quotesThisMonth.length - quotesLastMonth.length

  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const month = d.toLocaleString('en-IN', { month: 'short' })
    const qCount = quotes.filter((q) => {
      const qd = new Date(q.created_at)
      return qd.getMonth() === d.getMonth() && qd.getFullYear() === d.getFullYear()
    }).length
    const cCount = contacts.filter((c) => {
      const cd = new Date(c.created_at)
      return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear()
    }).length
    return { month, quotes: qCount, contacts: cCount }
  })

  const kpis = [
    { 
      label: 'Quote Inquiries (This Month)', 
      value: quotesThisMonth.length, 
      icon: FileText, 
      bg: '#EFF6FF',
      color: '#2563EB',
      live: true,
      trend: quoteTrend 
    },
    { 
      label: 'New Unread Contacts', 
      value: newContacts.length, 
      icon: Mail, 
      bg: '#FFF7ED',
      color: '#C2410C',
      live: false 
    },
    { 
      label: 'Active Job Openings', 
      value: jobs.length, 
      icon: Briefcase, 
      bg: '#F0FDF4',
      color: '#15803D',
      live: false 
    },
    { 
      label: 'Published Blog Posts', 
      value: blogs.length, 
      icon: BookOpen, 
      bg: '#F5F3FF',
      color: '#6D28D9',
      live: false 
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D42B2B] mx-auto mb-4"></div>
          <p className="font-['DM Sans', 'sans-serif'] text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <p className="font-['DM Sans', 'sans-serif'] text-[#D42B2B] mb-2">Error loading dashboard</p>
          <p className="font-['DM Sans', 'sans-serif'] text-gray-500 text-sm">{error.message || 'Failed to fetch dashboard data'}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, _index) => (
          <div 
            key={kpi.label} 
            className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div 
                className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ background: kpi.bg }}
              >
                <kpi.icon size={22} style={{ color: kpi.color }} />
              </div>
              {kpi.live && (
                <span className="font-mono text-[10px] font-semibold text-[#D42B2B] animate-pulse">
                  ● LIVE
                </span>
              )}
            </div>
            <div className="font-['DM Sans', 'sans-serif'] font-bold text-[28px] text-[#0E0E0E]">
              {kpi.value}
            </div>
            <div className="font-['Syne', 'sans-serif'] text-[12px] uppercase tracking-wider text-[#6B6B6B]">
              {kpi.label}
            </div>
            {kpi.trend !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                <ArrowUp size={14} className={kpi.trend >= 0 ? 'text-[#16A34A]' : 'text-[#D42B2B]'} />
                <span className={kpi.trend >= 0 ? 'text-[#16A34A]' : 'text-[#D42B2B]'}>
                  {Math.abs(kpi.trend)} this week
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] h-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Syne', 'sans-serif'] text-[16px] font-bold text-[#0E0E0E]">
            Inquiries by Month
          </h2>
          <div className="flex gap-1">
            <Button variant="admin-ghost" size="admin-sm" className="rounded-r-none">
              6M
            </Button>
            <Button variant="admin-ghost" size="admin-sm" className="rounded-l-none border-l-0">
              1Y
            </Button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={true} vertical={false} />
            <XAxis 
              dataKey="month" 
              tick={{ fontFamily: 'DM Sans', fontSize: 12, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontFamily: 'DM Sans', fontSize: 12, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                fontFamily: 'DM Sans', 
                fontSize: 12, 
                color: '#6B6B6B'
              }}
              iconType="circle"
            />
            <Bar dataKey="quotes" fill="#D42B2B" name="Quotes" radius={[4, 4, 0, 0]} />
            <Bar dataKey="contacts" fill="#E5E5E5" name="Contacts" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Syne', 'sans-serif'] text-[16px] font-bold text-[#0E0E0E]">
            Recent Inquiries
          </h2>
          <Link to="/admin/quotes" className="font-['DM Sans', 'sans-serif'] text-sm text-[#D42B2B] hover:underline">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="font-['Syne', 'sans-serif'] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] bg-[#F7F7F7] pb-3 pl-4 pr-2">
                  Name
                </th>
                <th className="font-['Syne', 'sans-serif'] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] bg-[#F7F7F7] pb-3 px-2">
                  Elevator Type
                </th>
                <th className="font-['Syne', 'sans-serif'] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] bg-[#F7F7F7] pb-3 px-2">
                  City
                </th>
                <th className="font-['Syne', 'sans-serif'] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] bg-[#F7F7F7] pb-3 px-2">
                  Floors
                </th>
                <th className="font-['Syne', 'sans-serif'] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] bg-[#F7F7F7] pb-3 px-2">
                  Status
                </th>
                <th className="font-['Syne', 'sans-serif'] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] bg-[#F7F7F7] pb-3 px-2">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <Inbox size={40} className="text-[#D42B2B]" />
                      <p className="font-['Syne', 'sans-serif'] text-[18px] font-medium text-[#0E0E0E]">
                        No inquiries yet
                      </p>
                      <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
                        Quote requests will appear here in real time.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                quotes.slice(0, 10).map((q) => (
                  <tr key={q.id} className="hover:bg-[#FAFAFA]">
                    <td className="py-4 pl-4 pr-2">
                      <p className="font-['DM Sans', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                        {q.full_name}
                      </p>
                    </td>
                    <td className="py-4 px-2">
                      <StatusBadge status={q.elevator_type} />
                    </td>
                    <td className="py-4 px-2 font-['DM Sans', 'sans-serif'] text-sm text-gray-600">
                      {q.city}
                    </td>
                    <td className="py-4 px-2 font-['DM Sans', 'sans-serif'] text-sm text-gray-600">
                      {q.floors}fl
                    </td>
                    <td className="py-4 px-2">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="py-4 px-2 font-['DM Sans', 'sans-serif'] text-sm text-[#9CA3AF]">
                      {timeAgo(q.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}