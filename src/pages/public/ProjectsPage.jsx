import { Link } from 'react-router-dom'
import SEOHead from '@/components/common/SEOHead'
import ProjectCard from '@/components/public/ProjectCard'
import PageLoader from '@/components/common/PageLoader'
import { useProjects } from '@/hooks/useProjects'

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects()

  return (
    <>
      <SEOHead title="Our Projects" description="Explore Alfa Elevator installations across India — commercial towers, hospitals, malls and more." />
      <section className="bg-black py-20  text-white">
        <div className="mx-auto mt-10 max-w-7xl px-4 py-8 md:ml-32 md:mt-12 md:py-4">
          <nav className="mb-4 text-sm text-white/70">
            <Link to="/" className="hover:text-white/90">Home</Link> / Projects
          </nav>
          <h1 className="font-heading text-4xl font-bold">Our Projects</h1>
        </div>
      </section>
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 lg:mx-52">
          <div className="inline-block -left-12 relative mb-6">
            <h2 className="mb-2 mx-12 font-heading text-2xl font-bold text-black">Showcasing infrastructure that moves people and places.</h2>
            <div className="absolute mx-1 top-full mt-2 mx-12 h-1 w-32 bg-red-600" />
          </div>
          <div className="space-y-4 text-gray-700">
            <p className="text-base font-semibold leading-8">
              Our projects portfolio highlights a broad range of vertical transportation solutions delivered across residential, commercial, healthcare, hospitality, and industrial environments. Each project is executed with precision, ensuring seamless integration, operational reliability, and strong design alignment with the building&apos;s identity.
            </p>
            <p className="text-base font-semibold leading-8">
              From modern high-rise developments to specialized institutional facilities, we provide tailored elevator and escalator systems backed by best-in-class engineering, compliance, and ongoing maintenance support. Our approach focuses on optimizing performance, safety, and occupant comfort throughout the lifecycle of every installation.
            </p>
          </div>
        </div>
      </section>
      <section className="py-1 mb-16">
        <div className="mx-auto max-w-7xl px-4 lg:mx-40">
          <div className="mx-0 mb-16 ">
            <h2 className="mb-3 font-heading text-2xl font-bold text-black">Featured work across markets and building types.</h2>
            <div className="absolute mx-1  mb-4 h-1 w-32 bg-red-600" />

          </div>
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
