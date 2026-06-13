import { Link } from 'react-router-dom'
import { MapPin, Building2 } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

export default function ProjectCard({ project }) {
  const image = project.images?.[0]

  return (
    <Link to={`/projects/${project.slug}`} className="group block overflow-hidden rounded-xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
      <div className="aspect-video overflow-hidden">
        {image ? (
          <img src={getImageUrl(image)} alt={project.title} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-black/10">
            <Building2 className="h-12 w-12 text-black/30" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-2 font-heading text-lg font-semibold text-black">{project.title}</h3>
        {project.client_name && <p className="mb-1 text-sm text-gray-600">{project.client_name}</p>}
        {(project.city || project.state) && (
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-3 w-3" />{project.city}{project.state ? `, ${project.state}` : ''}
          </p>
        )}
      </div>
    </Link>
  )
}
