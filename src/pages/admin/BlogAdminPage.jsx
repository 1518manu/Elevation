import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import DataTable from '@/components/admin/DataTable'
import RichEditor from '@/components/admin/RichEditor'
import ImageUpload from '@/components/admin/ImageUpload'
import { useBlogs, useBlog, useCreateBlog, useUpdateBlog, useDeleteBlog } from '@/hooks/useBlogs'
import { slugify, formatDate } from '@/lib/utils'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function BlogAdminPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: blogs = [], isLoading } = useBlogs()
  const { data: editBlog } = useBlog(id === 'new' ? null : blogs.find((b) => b.id === id)?.slug)
  const createBlog = useCreateBlog()
  const updateBlog = useUpdateBlog()
  const deleteBlog = useDeleteBlog()
  const [deleteId, setDeleteId] = useState(null)
  const [filter, setFilter] = useState('all')

  const [form, setForm] = useState({ title: '', slug: '', category: '', tags: [], content: '', cover_image: '', is_published: false, seo_title: '', seo_description: '' })

  const isEditor = id === 'new' || (id && id !== 'new')
  const filtered = filter === 'all' ? blogs : blogs.filter((b) => filter === 'published' ? b.is_published : !b.is_published)

  const columns = [
    { accessorKey: 'cover_image', header: 'Cover', cell: ({ row }) => row.original.cover_image ? <img src={row.original.cover_image} alt="" className="h-10 w-10 rounded object-cover" /> : '-' },
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'is_published', header: 'Status', cell: ({ row }) => <Badge>{row.original.is_published ? 'Published' : 'Draft'}</Badge> },
    { accessorKey: 'published_at', header: 'Published', cell: ({ row }) => row.original.published_at ? formatDate(row.original.published_at) : '-' },
    { id: 'actions', header: 'Actions', cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" asChild><Link to={`/admin/blog/${row.original.id}`}>Edit</Link></Button>
        <Button size="sm" variant="destructive" onClick={() => setDeleteId(row.original.id)}>Delete</Button>
      </div>
    )},
  ]

  if (isEditor) {
    const blog = id === 'new' ? form : blogs.find((b) => b.id === id) || form
    const current = id === 'new' ? form : { ...blog, ...form }

    return (
      <div>
        <AdminTopbar title={id === 'new' ? 'Write Article' : 'Edit Article'} />
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-4">
              <Input placeholder="Article title..." className="text-2xl font-bold" value={current.title} onChange={(e) => setForm({ ...current, title: e.target.value, slug: slugify(e.target.value) })} />
              <Input placeholder="slug" value={current.slug} onChange={(e) => setForm({ ...current, slug: e.target.value })} />
              <RichEditor value={current.content} onChange={(content) => setForm({ ...current, content })} />
            </div>
            <div className="space-y-4">
              <div><Label>Cover Image</Label><ImageUpload bucket={STORAGE_BUCKETS.blogs} value={current.cover_image} onChange={(url) => setForm({ ...current, cover_image: url })} /></div>
              <div><Label>Category</Label><Input value={current.category} onChange={(e) => setForm({ ...current, category: e.target.value })} /></div>
              <div><Label>SEO Title</Label><Input value={current.seo_title} onChange={(e) => setForm({ ...current, seo_title: e.target.value })} /></div>
              <div><Label>SEO Description</Label><Input value={current.seo_description} onChange={(e) => setForm({ ...current, seo_description: e.target.value })} /></div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={current.is_published} onChange={(e) => setForm({ ...current, is_published: e.target.checked })} />Published</label>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/admin/blog')}>Cancel</Button>
                <Button className="bg-primary" onClick={async () => {
                  const payload = { ...current, published_at: current.is_published ? new Date().toISOString() : null }
                  if (id === 'new') await createBlog.mutateAsync(payload)
                  else await updateBlog.mutateAsync({ id, ...payload })
                  toast({ title: 'Saved' }); navigate('/admin/blog')
                }}>Save</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminTopbar title="Blog" />
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            {['all', 'published', 'drafts'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm capitalize ${filter === f ? 'bg-primary text-white' : 'bg-gray-100'}`}>{f}</button>
            ))}
          </div>
          <Button asChild className="bg-primary"><Link to="/admin/blog/new"><Plus className="mr-2 h-4 w-4" />Write Article</Link></Button>
        </div>
        <DataTable columns={columns} data={filtered} isLoading={isLoading} />
      </div>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Article" onConfirm={async () => { await deleteBlog.mutateAsync(deleteId); setDeleteId(null) }} />
    </div>
  )
}
