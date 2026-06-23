import SEOHead from '@/components/common/SEOHead'
import CTABanner from '@/components/public/CTABanner'
import StatsCounter from '@/components/public/StatsCounter'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function AboutPage() {
  const { data: settings } = useSiteSettings()

  return (
    <>
      <SEOHead
        title="About Us"
        description="Learn about Alfa Elevator — India's trusted elevator manufacturer with 15+ years of experience."
      />

      <section className="bg-black py-16 text-white">
        <div className="mx-auto mt-10 max-w-7xl px-4 py-10 md:ml-32 md:mt-12 md:py-4">
          <nav className="mb-2 text-sm text-white/70">Home / About</nav>
          <h1 className="font-heading text-5xl font-bold">
            About Alfa Elevator
          </h1>
        </div>
      </section>

      <section className="py-16 ">
        <div className="mx-auto  max-w-4xl px-4">
          <h2 className="font-heading -left-10 text-3xl font-bold pb-4">
            {settings?.tagline || 'Elevating Standards Across India'}
          </h2>
          <div className="mx-1 mb-8 h-1 w-32 bg-red-600" />

          <p className="mb-6 text-lg leading-relaxed text-gray-600 font-semibold">
            At ALFAFUJI ELEVATOR INDIA PVT LTD, we believe that every journey
            upward should be safe, seamless, and inspiring. As a trusted provider
            of advanced elevator solutions, we are committed to transforming the
            way people move within modern buildings and communities.

          </p>
          <p className="mb-6 text-lg leading-relaxed  font-semibold text-gray-600"> With a focus on engineering excellence, innovative technology, and
            uncompromising quality, we design, manufacture, install, and maintain
            elevators that meet the evolving needs of residential, commercial,
            industrial, and institutional spaces across India. Every solution we
            deliver is built to combine performance, reliability, safety, and
            aesthetic appeal.</p>
          <p className="mb-6 text-lg leading-relaxed font-semibold text-gray-600">

            We understand that an elevator is more than a mode of
            transportation—it is an essential part of everyday life. That is why
            we approach every project with precision, professionalism, and a
            long-term commitment to customer satisfaction.
         </p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Mission */}
            <div className="group rounded-xl bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="mb-2 font-heading text-xl font-bold text-black">
                Our Mission
              </h3>
              <div className="mx-1 mb-8 h-1 w-12 bg-red-600 transition-all duration-500 ease-out group-hover:w-[110px]" />
              <p className="text-gray-600 font-semibold">
                To deliver elevators that combine innovation, reliability, and
                performance—supported by expert craftsmanship, responsive
                service, and a commitment that lasts beyond installation.
              </p>
            </div>

            {/* Vision */}
            <div className="group rounded-xl bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="mb-2 font-heading text-xl font-bold text-black">
                Our Vision
              </h3>
              <div className="mx-1 mb-8 h-1 w-12 bg-red-600 transition-all duration-500 ease-out group-hover:w-[95px]" />
              <p className="text-gray-600 font-semibold">
                To elevate lives, inspire confidence, and move people forward
                through safe, intelligent, and trusted mobility solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsCounter />

      <CTABanner
        title="Partner With Us"
        subtitle="Join 350+ satisfied clients who trust Alfa Elevator."
      />
    </>
  )
}