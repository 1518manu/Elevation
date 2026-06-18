import { useParams, Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import SEOHead from '@/components/common/SEOHead'
import PageLoader from '@/components/common/PageLoader'
import { useProject } from '@/hooks/useProjects'
import { getImageUrl, formatDate } from '@/lib/utils'
import { APP_URL } from '@/lib/constants'
import 'swiper/css'
import 'swiper/css/navigation'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const { data: project, isLoading } = useProject(slug)

  if (isLoading) return <PageLoader />
  if (!project) return <div className="py-16 text-center">Project not found</div>

  return (
    <>
      <SEOHead title={project.seo_title || project.title} description={project.seo_description || project.short_description} url={`${APP_URL}/projects/${slug}`} />
     <>
  <SEOHead
    title={project.seo_title || project.title}
    description={project.seo_description || project.short_description}
    url={`${APP_URL}/projects/${slug}`}
  />

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

          {project.images?.length > 0 && (
            <Swiper
              modules={[Navigation]}
              navigation
              className="mb-8 overflow-hidden rounded-xl"
            >
              {project.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={getImageUrl(img, 1200, 85)}
                    alt={`${project.title} ${i + 1}`}
                    className="aspect-video w-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <p className="leading-relaxed text-gray-600">
            {project.description || project.short_description}
          </p>

        </div>
      </section>
    </>   
    </>
  )
}
