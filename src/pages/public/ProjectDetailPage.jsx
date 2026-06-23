import { useParams, Link } from 'react-router-dom'
import SEOHead from '@/components/common/SEOHead'
import PageLoader from '@/components/common/PageLoader'
import { useProject } from '@/hooks/useProjects'
import { formatDate } from '@/lib/utils'
import { APP_URL } from '@/lib/constants'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const { data: project, isLoading } = useProject(slug)

  if (isLoading) return <PageLoader />
  if (!project) return <div className="py-16 text-center">Project not found</div>

  return (
    <>
      <SEOHead title={project.seo_title || project.title} description={project.seo_description || project.short_description} url={`${APP_URL}/projects/${slug}`} />

      <section className="bg-black py-12 text-white">
        <div className="mx-auto mt-16 py-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 text-sm text-white/70">
            <Link to="/" className="hover:text-white">
              Home
            </Link>

            <span>/</span>

            <Link to="/projects" className="hover:text-white">
              Projects
            </Link>

            <span>/</span>

            <span className="text-white">
              {project.title}
            </span>
          </nav>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <h1 className="mb-4 font-heading text-3xl font-bold text-gray-900 md:text-4xl">
            {project.title}
          </h1>

          <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
            {project.client_name && (
              <span>
                Client: {project.client_name}
              </span>
            )}

            {project.city && (
              <span>
                {project.city}, {project.state}
              </span>
            )}

            {project.completion_date && (
              <span>
                Completed: {formatDate(project.completion_date)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Images (1/3) - Vertical Scroll */}
            <div className="lg:col-span-1">
              {project.images?.length > 0 && (
                <div className="space-y-10 max-h-[800px] overflow-y-auto p-4 scrollbar-hide">
                  {project.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border-b-8 border-red-600 "
                    >
                      <img
                        src={img}
                        alt={`${project.title} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Bottom black fade */}
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Descriptions (2/3) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Short Description */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="mb-3 font-heading text-xl font-bold text-gray-900">Overview</h3>
                <p className="leading-relaxed text-gray-600 font-semibold line-clamp-3">
                  {project.short_description }
                </p>
              </div>

              {/* Full Description */}
              <div className="prose prose-lg max-w-none px-4">
                <h3 className="mb-4 font-heading text-xl font-bold text-gray-900">Project Details</h3>
                <div className="mx-0 mb-4 h-1 w-32 bg-red-600" />

                <div 
                  className="leading-relaxed font-semibold text-gray-600"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
