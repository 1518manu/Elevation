import { Link } from 'react-router-dom'
import { FileText, Mail, Briefcase, BookOpen, Plus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import AdminTopbar from '@/components/admin/AdminTopbar'
import StatusBadge from '@/components/admin/StatusBadge'
import { useQuoteInquiries } from '@/hooks/useQuoteInquiries'
import { useContactInquiries } from '@/hooks/useContactInquiries'
import { useJobs } from '@/hooks/useJobs'
import { useBlogs } from '@/hooks/useBlogs'
import { useRealtimeLeads } from '@/hooks/useRealtimeLeads'
import { timeAgo } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { data: quotes = [] } = useQuoteInquiries()
  const { data: contacts = [] } = useContactInquiries()
  const { data: jobs = [] } = useJobs({ is_active: true })
  const { data: blogs = [] } = useBlogs({ is_published: true })
  const { newLeadCount } = useRealtimeLeads()

  const thisMonth = new Date().getMonth()
  const quotesThisMonth = quotes.filter((q) => new Date(q.created_at).getMonth() === thisMonth)
  const newContacts = contacts.filter((c) => c.status === 'new')

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
    { label: 'Quote Inquiries (This Month)', value: quotesThisMonth.length, icon: FileText, color: 'border-blue-500', live: true },
    { label: 'New Unread Contacts', value: newContacts.length, icon: Mail, color: 'border-amber-500' },
    { label: 'Active Job Openings', value: jobs.length, icon: Briefcase, color: 'border-green-500' },
    { label: 'Published Blog Posts', value: blogs.length, icon: BookOpen, color: 'border-purple-500' },
  ]

  return (
    <div>
      <AdminTopbar title="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className={`rounded-xl border-l-4 bg-white p-5 shadow-card ${kpi.color}`}>
              <div className="flex items-center justify-between">
                <kpi.icon className="h-5 w-5 text-gray-400" />
                {kpi.live && newLeadCount > 0 && <span className="text-xs font-medium text-green-600">● Live ({newLeadCount})</span>}
              </div>
              <p className="mt-3 text-3xl font-bold text-black">{kpi.value}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500">{kpi.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-card">
          <h2 className="mb-4 font-heading text-lg font-semibold text-black">Inquiries by Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quotes" fill="#1A3A5C" name="Quotes" />
              <Bar dataKey="contacts" fill="#E8B84B" name="Contacts" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-card">
          <h2 className="mb-4 font-heading text-lg font-semibold text-black">Recent Quote Inquiries</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-gray-500"><th className="pb-2">Name</th><th className="pb-2">Type</th><th className="pb-2">City</th><th className="pb-2">Status</th><th className="pb-2">Time</th></tr></thead>
              <tbody>
                {quotes.slice(0, 10).map((q) => (
                  <tr key={q.id} className="border-b last:border-0">
                    <td className="py-3">{q.full_name}</td>
                    <td>{q.elevator_type}</td>
                    <td>{q.city}</td>
                    <td><StatusBadge status={q.status} /></td>
                    <td className="text-gray-500">{timeAgo(q.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-red-600"><Link to="/admin/products"><Plus className="mr-2 h-4 w-4" />Add Product</Link></Button>
          <Button asChild variant="outline"><Link to="/admin/blog"><Plus className="mr-2 h-4 w-4" />Write Blog</Link></Button>
          <Button asChild variant="outline"><Link to="/admin/careers"><Plus className="mr-2 h-4 w-4" />Post Job Opening</Link></Button>
        </div>
      </div>
    </div>
  )
}
