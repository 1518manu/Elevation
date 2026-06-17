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
      <div className="mx-auto max-w-7xl px-4 py-32">
        <nav className="mb-6 text-sm text-gray-500"><Link to="/projects">Projects</Link> / {project.title}</nav>
        <h1 className="mb-4 font-heading text-3xl font-bold text-black">{project.title}</h1>
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
          {project.client_name && <span>Client: {project.client_name}</span>}
          {project.city && <span>{project.city}, {project.state}</span>}
          {project.completion_date && <span>Completed: {formatDate(project.completion_date)}</span>}
        </div>
        {project.images?.length > 0 && (
          <Swiper modules={[Navigation]} navigation className="mb-8 rounded-xl overflow-hidden">
            {project.images.map((img, i) => (
              <SwiperSlide key={i}><img src={getImageUrl(img, 1200, 85)} alt={`${project.title} ${i + 1}`} className="aspect-video w-full object-cover" /></SwiperSlide>
            ))}
          </Swiper>
        )}
        <p className="text-gray-600 leading-relaxed">{project.description || project.short_description}</p>
      </div>
    </>
  )
}
