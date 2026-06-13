import { Link } from 'react-router-dom'
import SEOHead from '@/components/common/SEOHead'
import ServicesGrid from '@/components/public/ServicesGrid'
import ProcessStepper from '@/components/public/ProcessStepper'
import CTABanner from '@/components/public/CTABanner'

export default function ServicesPage() {
  return (
    <>
      <SEOHead title="Our Services" description="Elevator installation, maintenance AMC, and modernization services across India." />
      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="mb-4 text-sm text-white/70">Home / Services</nav>
          <h1 className="font-heading text-4xl font-bold">Our Services</h1>
          <p className="mt-4 max-w-2xl text-white/80">Complete elevator lifecycle services from installation to modernization.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4"><ServicesGrid /></div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center font-heading text-3xl font-semibold text-primary">How We Work</h2>
          <ProcessStepper />
        </div>
      </section>
      <CTABanner />
    </>
  )
}
