import { useParams, Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import SEOHead from '@/components/common/SEOHead'
import PageLoader from '@/components/common/PageLoader'
import { useBlog } from '@/hooks/useBlogs'
import { getImageUrl, formatDate } from '@/lib/utils'
import { APP_URL } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const { data: blog, isLoading } = useBlog(slug)

  if (isLoading) return <PageLoader />
  if (!blog) return <div className="py-16 text-center">Article not found</div>

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    datePublished: blog.published_at,
    image: blog.cover_image,
    author: { '@type': 'Organization', name: 'Alfa Elevator' },
  }

  return (
    <>
      <SEOHead title={blog.seo_title || blog.title} description={blog.seo_description} image={blog.cover_image} url={`${APP_URL}/blog/${slug}`} type="article" jsonLd={jsonLd} />
      <article className="mx-16 max-w-4xl px-4 py-32">
        <nav className="mb-6 text-sm text-gray-500"><Link to="/blog">Blog</Link> / {blog.title}</nav>
        {blog.cover_image && <img src={getImageUrl(blog.cover_image, 1200, 85)} alt={blog.title} className="mb-8 aspect-video w-full rounded-xl object-cover" />}
        {blog.category && <Badge className="mb-4">{blog.category}</Badge>}
        <h1 className="mb-4 font-heading text-3xl font-bold text-black md:text-4xl">{blog.title}</h1>
        <div className="mb-8 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{blog.read_time_mins} min read</span>
          {blog.published_at && <span>{formatDate(blog.published_at)}</span>}
        </div>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content || '') }} />
      </article>
    </>
  )
}
