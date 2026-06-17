import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Plus, ArrowLeft, Save, ExternalLink, ChevronDown, MoreVertical, Edit, Trash2, FileText, Clock, User, Calendar } from 'lucide-react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import DataTable from '@/components/admin/DataTable'
import RichEditor from '@/components/admin/RichEditor'
import ImageUpload from '@/components/admin/ImageUpload'
import { useBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog } from '@/hooks/useBlogs'
import { slugify, formatDate } from '@/lib/utils'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'

const emptyBlog = { 
  title: '', 
  slug: '', 
  category: '', 
  tags: [], 
  content: '', 
  cover_image: '', 
  excerpt: '',
  is_published: false, 
  seo_title: '', 
  seo_description: '',
  author_id: null
}

export default function BlogAdminPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const { data: blogs = [], isLoading } = useBlogs()
  const createBlog = useCreateBlog()
  const updateBlog = useUpdateBlog()
  const deleteBlog = useDeleteBlog()
  const [deleteId, setDeleteId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [publishMenuOpen, setPublishMenuOpen] = useState(false)

  const [form, setForm] = useState(emptyBlog)

  const isEditor = id === 'new' || (id && id !== 'new')
  const filtered = filter === 'all' ? blogs : blogs.filter((b) => 
    filter === 'published' ? b.is_published : !b.is_published
  )

  const columns = [
    { 
      accessorKey: 'cover_image', 
      header: 'COVER', 
      cell: ({ row }) => row.original.cover_image ? (
        <img 
          src={row.original.cover_image} 
          alt="" 
          className="h-10 w-16 rounded object-cover"
        />
      ) : (
        <div className="h-10 w-16 rounded bg-gray-200 flex items-center justify-center">
          <FileText className="h-4 w-4 text-gray-400" />
        </div>
      )
    },
    { 
      accessorKey: 'title', 
      header: 'TITLE', 
      cell: ({ row }) => (
        <div className="max-w-md">
          <p className="font-['DM Sans', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E] mb-1">
            {row.original.title}
          </p>
          {row.original.excerpt && (
            <p className="font-['DM Sans', 'sans-serif'] text-[12px] text-gray-500 line-clamp-2">
              {row.original.excerpt.substring(0, 100)}
            </p>
          )}
        </div>
      )
    },
    { 
      accessorKey: 'category', 
      header: 'CATEGORY', 
      cell: ({ row }) => (
        <Badge variant="admin-draft" className="capitalize">
          {row.original.category || 'Uncategorized'}
        </Badge>
      )
    },
    { 
      accessorKey: 'author', 
      header: 'AUTHOR', 
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={row.original.author?.avatar_url} />
            <AvatarFallback className="text-[10px] bg-[#D42B2B] text-white">
              {row.original.author?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="font-['DM Sans', 'sans-serif'] text-sm">
            {row.original.author?.full_name || 'Unknown'}
          </span>
        </div>
      )
    },
    { 
      accessorKey: 'is_published', 
      header: 'STATUS', 
      cell: ({ row }) => (
        <Badge variant={row.original.is_published ? 'admin-published' : 'admin-draft'}>
          {row.original.is_published ? 'Published' : 'Draft'}
        </Badge>
      )
    },
    { 
      accessorKey: 'published_at', 
      header: 'DATE', 
      cell: ({ row }) => (
        <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-600">
          {row.original.published_at ? formatDate(row.original.published_at) : '-'}
        </span>
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
            <DropdownMenuItem asChild>
              <Link to={`/admin/blog/${row.original.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
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

  const handleSave = async (publish = false) => {
    try {
      const payload = { 
        ...form, 
        is_published: publish || form.is_published,
        published_at: (publish || form.is_published) ? new Date().toISOString() : null,
        author_id: form.author_id || user?.id
      }
      
      if (id === 'new') {
        await createBlog.mutateAsync(payload)
        toast({ title: 'Article created successfully' })
      } else {
        await updateBlog.mutateAsync({ id, ...payload })
        toast({ title: 'Article updated successfully' })
      }
      
      if (publish) {
        navigate('/admin/blog')
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save article',
        variant: 'destructive' 
      })
    }
  }

  const handleUnpublish = async () => {
    try {
      await updateBlog.mutateAsync({ 
        id, 
        ...form, 
        is_published: false,
        published_at: null
      })
      toast({ title: 'Article unpublished' })
      setPublishMenuOpen(false)
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message,
        variant: 'destructive' 
      })
    }
  }

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  if (isEditor) {
    const blog = id === 'new' ? form : blogs.find((b) => b.id === id) || form
    const current = id === 'new' ? { ...emptyBlog, author_id: user?.id } : { ...blog, ...form }
    const readTime = calculateReadTime(current.content || '')

    return (
      <div className="h-full flex flex-col">
        {/* Editor Topbar */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] bg-white px-6 py-3">
          <div className="flex items-center gap-4">
            <Button 
              variant="admin-ghost" 
              size="admin-sm"
              onClick={() => navigate('/admin/blog')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
            <h1 className="font-['Syne', 'sans-serif'] text-[18px] font-bold text-[#0E0E0E]">
              {id === 'new' ? 'Write Article' : 'Edit Article'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="admin-ghost" 
              size="admin-sm"
              onClick={() => handleSave(false)}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <DropdownMenu open={publishMenuOpen} onOpenChange={setPublishMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="admin-primary" size="admin-sm">
                  {current.is_published ? 'Published ▾' : 'Publish ▾'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!current.is_published && (
                  <DropdownMenuItem onClick={() => handleSave(true)}>
                    Publish Now
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  Schedule...
                </DropdownMenuItem>
                {current.is_published && (
                  <DropdownMenuItem onClick={handleUnpublish} className="text-[#D42B2B]">
                    Unpublish
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="admin-ghost" 
              size="admin-sm"
              onClick={() => window.open(`/blog/${current.slug}`, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Writing Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="p-6 pb-0">
              {/* Category Input */}
              <Input
                placeholder="Enter category (e.g. Technology, Industry News)"
                value={current.category}
                onChange={(e) => setForm({ ...current, category: e.target.value })}
                className="mb-4 text-sm bg-transparent border-none focus:ring-0 px-0 placeholder-gray-400"
              />
              
              {/* Title Input */}
              <Input
                placeholder="Article headline..."
                value={current.title}
                onChange={(e) => setForm({ ...current, title: e.target.value, slug: slugify(e.target.value) })}
                className="text-[32px] font-bold font-['Syne', 'sans-serif'] text-[#0E0E0E] border-none focus:ring-0 px-0 placeholder-gray-300"
              />
              
              {/* Tags Input */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {(current.tags || []).map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-[#F7F7F7] text-gray-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    #{tag}
                    <button 
                      onClick={() => setForm({ ...current, tags: current.tags.filter((_, i) => i !== index) })}
                      className="text-[#D42B2B] hover:text-[#B01F1F]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            {/* Rich Editor */}
            <div className="flex-1 overflow-y-auto px-6">
              <RichEditor
                content={current.content}
                onChange={(content) => setForm({ ...current, content })}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-[320px] border-l border-[#E5E5E5] bg-white p-6 overflow-y-auto">
            {/* Cover Image */}
            <div className="mb-6">
              <Label className="font-['DM Sans', 'sans-serif'] text-[13px] font-semibold text-[#0E0E0E] mb-2 block">
                Cover Image
              </Label>
              <ImageUpload 
                bucket={STORAGE_BUCKETS.blogs} 
                value={current.cover_image} 
                onChange={(url) => setForm({ ...current, cover_image: url })} 
              />
            </div>

            <hr className="border-[#E5E5E5] mb-6" />

            {/* SEO */}
            <div className="mb-6">
              <Label className="font-['DM Sans', 'sans-serif'] text-[13px] font-semibold text-[#0E0E0E] mb-2 block">
                SEO
              </Label>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Title ({current.seo_title?.length || 0}/60)</Label>
                  <Input
                    value={current.seo_title}
                    onChange={(e) => setForm({ ...current, seo_title: e.target.value })}
                    placeholder="SEO title"
                    maxLength={60}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Description ({current.seo_description?.length || 0}/160)</Label>
                  <Input
                    value={current.seo_description}
                    onChange={(e) => setForm({ ...current, seo_description: e.target.value })}
                    placeholder="Meta description"
                    maxLength={160}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            <hr className="border-[#E5E5E5] mb-6" />

            {/* Details */}
            <div className="space-y-3">
              <Label className="font-['DM Sans', 'sans-serif'] text-[13px] font-semibold text-[#0E0E0E] mb-2 block">
                Details
              </Label>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{readTime} min read</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  {current.published_at ? formatDate(current.published_at) : 'Not published'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{user?.full_name || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
              Blog
            </h1>
            <p className="font-['DM Sans', 'sans-serif'] text-[13px] text-gray-500">
              {blogs.length} total · {blogs.filter(b => b.is_published).length} published
            </p>
          </div>
          <Button variant="admin-primary" asChild>
            <Link to="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" /> Write Article
            </Link>
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-6 mb-4">
        {['all', 'published', 'drafts'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative py-2 font-['DM Sans', 'sans-serif'] text-sm capitalize transition-colors ${
              filter === f 
                ? 'text-[#D42B2B]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f}
            {filter === f && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D42B2B]" />
            )}
          </button>
        ))}
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filtered} 
          isLoading={isLoading}
          emptyMessage="No articles found."
        />
      </div>

      <ConfirmDialog 
        open={!!deleteId} 
        onOpenChange={() => setDeleteId(null)} 
        title="Delete Article"
        description="This action cannot be undone. The article will be permanently removed from the database."
        onConfirm={async () => { 
          await deleteBlog.mutateAsync(deleteId); 
          setDeleteId(null); 
          toast({ title: 'Article deleted' }) 
        }} 
      />
    </div>
  )
}