import { useState } from 'react'
import SEOHead from '@/components/common/SEOHead'
import JobCard from '@/components/public/JobCard'
import PageLoader from '@/components/common/PageLoader'
import { useJobs } from '@/hooks/useJobs'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { JOB_DEPARTMENTS } from '@/lib/constants'

export default function CareersPage() {
  const [dept, setDept] = useState('all')
  const { data: jobs = [], isLoading } = useJobs({ is_active: true })
  const { data: settings, isLoading: settingsLoading } = useSiteSettings()
  
  const careersVisible = settings?.careers_visible ?? true

  const filtered = dept === 'all' ? jobs : jobs.filter((j) => j.department === dept)
  const tabs = [{ value: 'all', label: 'All' }, ...JOB_DEPARTMENTS]

  if (settingsLoading) return <PageLoader />

  if (!careersVisible) {
    return (
      <>
        <SEOHead title="Careers" description="Join ALFAFUJI ELEVATOR INDIA PVT LTD team. Open positions in technical, sales, HR and operations across India." />
        <section className="bg-black py-16 text-white">
          <div className="mx-auto mt-10 max-w-7xl px-4 py-10 md:ml-32 md:mt-12 md:py-4">
            <nav className="mb-4 text-sm text-white/70">Home / Careers</nav>
            <h1 className="font-heading text-4xl font-bold">Join Our Team</h1>
            <p className="mt-4 text-white/80">Build your career with India&apos;s leading elevator company.</p>
          </div>
        </section>
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-12">
              <p className="font-['DM Sans', 'sans-serif'] text-xl text-gray-600 mb-2">
                Careers section is currently unavailable
              </p>
              <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
                Please check back later for open positions
              </p>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <SEOHead title="Careers" description="Join Alfa Elevator team. Open positions in technical, sales, HR and operations across India." />
      <section className="bg-black py-16 text-white">
        <div className="mx-auto mt-10 max-w-7xl px-4 py-10 md:ml-32 md:mt-12 md:py-4">
          <nav className="mb-4 text-sm text-white/70">Home / Careers</nav>
          <h1 className="font-heading text-4xl font-bold">Join Our Team</h1>
          <p className="mt-4 text-white/80">Build your career with India&apos;s leading elevator company.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button key={t.value} onClick={() => setDept(t.value)} className={`rounded-full px-4 py-2 text-sm font-medium ${dept === t.value ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>{t.label}</button>
            ))}
          </div>
          {isLoading ? <PageLoader /> : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-500">No openings right now. Send your CV to careers@ALFAFUJIelevator.in</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((j) => <JobCard key={j.id} job={j} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
