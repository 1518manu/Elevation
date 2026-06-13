import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getImageUrl, formatDate } from '@/lib/utils'

export default function BlogCard({ blog }) {
  return (
    <Link to={`/blog/${blog.slug}`} className="group block overflow-hidden rounded-xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
      <div className="aspect-video overflow-hidden">
        {blog.cover_image ? (
          <img src={getImageUrl(blog.cover_image)} alt={blog.title} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">No cover</div>
        )}
      </div>
      <div className="p-5">
        {blog.category && <Badge variant="secondary" className="mb-2">{blog.category}</Badge>}
        <h3 className="mb-2 font-heading text-lg font-semibold text-black group-hover:text-red-700">{blog.title}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{blog.read_time_mins || 5} min read</span>
          {blog.published_at && <span>{formatDate(blog.published_at)}</span>}
        </div>
      </div>
    </Link>
  )
}
