import SEOHead from '@/components/common/SEOHead'
import BlogCard from '@/components/public/BlogCard'
import PageLoader from '@/components/common/PageLoader'
import { useBlogs } from '@/hooks/useBlogs'

export default function BlogPage() {
  const { data: blogs = [], isLoading } = useBlogs({ is_published: true })

  return (
    <>
      <SEOHead title="Blog" description="Elevator industry insights, buying guides, and company news from Alfa Elevator." />
      <section className="bg-black py-16 text-white">
        <div className="mx-auto mt-10 max-w-7xl px-4 py-10 md:ml-32 md:mt-12 md:py-4">
          <nav className="mb-4 text-sm text-white/70">Home / Blog</nav>
          <h1 className="font-heading text-4xl font-bold">Blog & Insights</h1>
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          {isLoading ? <PageLoader /> : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((b) => <BlogCard key={b.id} blog={b} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
