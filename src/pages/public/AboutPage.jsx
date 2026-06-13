import { Link } from 'react-router-dom'
import SEOHead from '@/components/common/SEOHead'
import CTABanner from '@/components/public/CTABanner'
import StatsCounter from '@/components/public/StatsCounter'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function AboutPage() {
  const { data: settings } = useSiteSettings()

  return (
    <>
      <SEOHead title="About Us" description="Learn about Alfa Elevator — India's trusted elevator manufacturer with 15+ years of experience." />
      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="mb-4 text-sm text-white/70">Home / About</nav>
          <h1 className="font-heading text-4xl font-bold">About Alfa Elevator</h1>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <p className="mb-6 text-lg text-gray-600 leading-relaxed">
            {settings?.tagline || 'Elevating Standards Across India'} — Alfa Elevator has been at the forefront of
            elevator manufacturing and installation in India for over 15 years. We deliver premium passenger elevators,
            home lifts, freight elevators, and escalators engineered for Indian buildings.
          </p>
          <p className="mb-6 text-gray-600 leading-relaxed">
            Our team of certified engineers and technicians ensures every project meets BIS standards and ISO 9001:2015
            quality requirements. From initial consultation to handover and training, we provide end-to-end elevator solutions.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-12">
            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="font-heading text-xl font-semibold text-primary mb-2">Our Mission</h3>
              <p className="text-gray-600">To provide safe, reliable, and innovative vertical transportation solutions that elevate the quality of life and business across India.</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="font-heading text-xl font-semibold text-primary mb-2">Our Vision</h3>
              <p className="text-gray-600">To be India's most trusted elevator brand, known for engineering excellence, customer service, and sustainable practices.</p>
            </div>
          </div>
        </div>
      </section>
      <StatsCounter />
      <CTABanner title="Partner With Us" subtitle="Join 350+ satisfied clients who trust Alfa Elevator." />
    </>
  )
}
