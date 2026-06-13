import SEOHead from '@/components/common/SEOHead'
import ProjectCard from '@/components/public/ProjectCard'
import PageLoader from '@/components/common/PageLoader'
import { useProjects } from '@/hooks/useProjects'

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects()

  return (
    <>
      <SEOHead title="Our Projects" description="Explore Alfa Elevator installations across India — commercial towers, hospitals, malls and more." />
      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="mb-4 text-sm text-white/70">Home / Projects</nav>
          <h1 className="font-heading text-4xl font-bold">Our Projects</h1>
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          {isLoading ? <PageLoader /> : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
