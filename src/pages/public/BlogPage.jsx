import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '@/components/common/SEOHead'
import BlogCard from '@/components/public/BlogCard'
import PageLoader from '@/components/common/PageLoader'
import { useBlogs } from '@/hooks/useBlogs'

export default function BlogPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 9

  const { data: blogs = [], isLoading, isError, error, refetch } = useBlogs({ is_published: true, search: debouncedSearch })

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => setPage(1), [debouncedSearch])

  const totalPages = useMemo(() => Math.max(1, Math.ceil((blogs?.length ?? 0) / pageSize)), [blogs])

  const visible = useMemo(() => {
    if (!blogs) return []
    const start = (page - 1) * pageSize
    return blogs.slice(start, start + pageSize)
  }, [blogs, page])

  return (
    <>
      <SEOHead title="Blog" description="Elevator industry insights, buying guides, and company news from Alfa Elevator." />
      <section className="bg-black py-20  text-white">
        <div className="mx-auto mt-10 max-w-7xl px-4 py-8 md:ml-32 md:mt-12 md:py-4">
          <nav className="mb-4 text-sm text-white/70">
            <Link to="/" className="hover:text-white/90">Home</Link> / Blog
          </nav>
          <h1 className="font-heading text-4xl font-bold">Blog & Insights</h1>
        </div>
      </section>
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 lg:mx-52">
          <div className="inline-block -left-12 relative mb-6">
            <h2 className="mb-2 mx-12 font-heading text-2xl font-bold text-black">Industry insights, buying guides, and company news.</h2>
            <div className="absolute mx-1 mx-12 top-full mt-2 h-1 w-32 bg-red-600" />
          </div>
          <div className="space-y-4 text-gray-700">
            <p className="text-base font-semibold leading-8">
              We publish practical guidance, technical deep-dives, and updates from across the elevator and vertical-transportation industry. Our articles help designers, building owners, and facility managers make informed decisions.
            Explore case studies, product features, maintenance best practices, and regulatory insights to keep your buildings moving safely and efficiently.
            </p>
          </div>
        </div>
      </section>
      <section className="py-0 pb-8 px-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-end mb-6">
            <input
              aria-label="Search blogs"
              placeholder="Search articles"
              className="rounded-md border px-3 py-2 text-sm shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading ? (
            <PageLoader />
          ) : isError ? (
            <div className="rounded-md border border-red-200 p-6 text-center text-red-700">
              <p className="mb-3">Failed to load blog posts: {error?.message || 'Unknown error'}</p>
              <button className="rounded bg-red-600 px-4 py-2 text-white" onClick={() => refetch()}>Retry</button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="rounded-md border border-gray-100 p-6 text-center text-gray-700">
              <p className="mb-2 font-semibold">No posts found.</p>
              <p className="text-sm">Try adjusting your search or check back later.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visible.map((b) => <BlogCard key={b.id} blog={b} />)}
              </div>

              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  className="rounded border px-3 py-1 disabled:opacity-50"
                  onClick={() => setPage((s) => Math.max(1, s - 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <span className="px-3 text-sm">Page {page} of {totalPages}</span>
                <button
                  className="rounded border px-3 py-1 disabled:opacity-50"
                  onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
