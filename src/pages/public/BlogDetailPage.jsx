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
      <SEOHead
        title={blog.seo_title || blog.title}
        description={blog.seo_description}
        image={blog.cover_image}
        url={`${APP_URL}/blog/${slug}`}
        type="article"
        jsonLd={jsonLd}
      />

      {/* Black Breadcrumb Header */}
      <section className="bg-black py-12 text-white">
        <div className="mx-auto mt-16 py-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 text-sm text-white/70">
            <Link to="/" className="hover:text-white">
              Home
            </Link>

            <span>/</span>

            <Link to="/blog" className="hover:text-white">
              Blog
            </Link>

            <span>/</span>

            <span className="text-white">
              {blog.title}
            </span>
          </nav>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            {blog.category && (
              <Badge className="mb-4 bg-red-600 text-white">
                {blog.category}
              </Badge>
            )}

            <h1 className="font-heading text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              {blog.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {blog.read_time_mins} min read
              </span>

              {blog.published_at && (
                <span>{formatDate(blog.published_at)}</span>
              )}
            </div>
          </div>

          {blog.cover_image && (
            <img
              src={getImageUrl(blog.cover_image, 1200, 85)}
              alt={blog.title}
              className="mb-10 aspect-video w-full rounded-xl object-cover"
            />
          )}

          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content || '') }} />
        </div>
      </article>
    </>
  )
}
