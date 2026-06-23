import { useParams, Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import SEOHead from '@/components/common/SEOHead'
import PageLoader from '@/components/common/PageLoader'
import { useBlog } from '@/hooks/useBlogs'
import { formatDate } from '@/lib/utils'
import { APP_URL } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const { data: blog, isLoading } = useBlog(slug)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (isLoading) return <PageLoader />
  if (!blog) return <div className="py-16 text-center">Article not found</div>

  // Extract images from content
  const extractImages = (html) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    const images = Array.from(tempDiv.querySelectorAll('img')).map(img => img.src)
    // Remove images from content
    tempDiv.querySelectorAll('img').forEach(img => img.remove())
    const cleanContent = tempDiv.innerHTML
    return { images, cleanContent }
  }

  const { images: contentImages, cleanContent } = extractImages(blog.content || '')

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Images (1/3) */}
            <div className="lg:col-span-1 space-y-4">
              {/* Cover Image */}
              {blog.cover_image && (
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content Images Carousel */}
              {contentImages.length > 0 && (
                <div className="relative">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={contentImages[currentImageIndex]}
                      alt={`Content image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Navigation Buttons */}
                  {contentImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? contentImages.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev === contentImages.length - 1 ? 0 : prev + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {contentImages.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                      {currentImageIndex + 1} / {contentImages.length}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Content (2/3) */}
            <div className="lg:col-span-2">
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cleanContent) }} 
              />
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
