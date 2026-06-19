import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEOHead from '@/components/common/SEOHead'
import HeroSection from '@/components/public/HeroSection'
import StatsCounter from '@/components/public/StatsCounter'
import ServicesGrid from '@/components/public/ServicesGrid'
import ProductCard from '@/components/public/ProductCard'
import ProcessStepper from '@/components/public/ProcessStepper'
import TestimonialsCarousel from '@/components/public/TestimonialsCarousel'
import ClientLogoMarquee from '@/components/public/ClientLogoMarquee'
import BlogCard from '@/components/public/BlogCard'
import CTABanner from '@/components/public/CTABanner'
import { useProducts } from '@/hooks/useProducts'
import { useBlogs } from '@/hooks/useBlogs'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { APP_URL } from '@/lib/constants'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { data: products = [] } = useProducts({ is_featured: true, is_active: true })
  const { data: blogs = [] } = useBlogs({ is_published: true })
  const { data: settings } = useSiteSettings()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: settings?.company_name || 'ALFAFUJI Elevator India Pvt Ltd.',
        url: APP_URL,
        logo: `${APP_URL}/og-image.jpg`,
        description: settings?.tagline,
      },
      {
        '@type': 'LocalBusiness',
        name: settings?.company_name || 'ALFAFUJI Elevator India Pvt Ltd.',
        url: APP_URL,
        telephone: settings?.phones?.[0],
        address: settings?.addresses?.[0],
      },
    ],
  }

  return (
    <>
      <SEOHead
        title="ALFAFUJI Elevator India Pvt Ltd"
        description={settings?.seo_defaults?.description || 'Leading elevator manufacturer in India. Passenger lifts, home elevators, freight lifts, escalators.'}
        jsonLd={jsonLd}
      />
      <HeroSection />
      <StatsCounter />

      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
           <div
              className="absolute inset-0 "
              style={{
                background:
                  'linear-gradient(1deg, rgba(158, 152, 152, 0.88) 0%, rgba(171, 160, 160, 0.7) 60%, rgba(158, 152, 152, 0.88) 100%)',
              }}
            />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 font-heading text-3xl font-semibold text-black md:text-4xl">
              Our Services
            </h2>
            <div className="mx-auto mb-8 h-1 w-10 bg-red-500" />
            <p className="mb-4 text-base font-bold text-black md:text-lg">
              Built to Last. Maintained to Perform. Modernized to Transform.
            </p>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-Black/80 md:text-base">
              From expert elevator installation and proactive maintenance to complete
              modernization solutions, ALFAFUJI delivers reliable performance at every
              stage of your elevator&apos;s journey. We ensure safety, efficiency, and
              seamless mobility for residential, commercial, and industrial buildings.
            </p>
          </motion.div>
          <ServicesGrid />
        </div>

      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-3 font-heading text-3xl font-semibold text-black md:text-4xl">Featured Products</h2>
              <div className="h-1 w-10 bg-red-600" />
            </div>
            <Button asChild variant="outline"><Link to="/products">View All</Link></Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

     <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
            style={{ aspectRatio: '16/9' }}
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(139,0,0,0.75) 60%, rgba(0,0,0,0.92) 100%)',
            }}
          />
        </div>

        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-heading text-3xl font-semibold text-white md:text-4xl">
              Our Process
            </h2>
            <div className="mx-auto mb-8 h-1 w-10 bg-red-500" />
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
              At ALFAFUJI Elevator India Pvt Ltd, we believe that every project deserves
              meticulous attention, expert guidance, and seamless execution. Here&apos;s how
              we efficiently manage every lift enquiry — from initial consultation to
              project handover:
            </p>
          </div>
          <ProcessStepper />
        </div>

      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-heading text-3xl font-semibold text-black md:text-4xl">What Our Clients Say</h2>
            <div className="mx-auto h-1 w-10 bg-red-600" />
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-6 text-center text-lg font-bold uppercase tracking-wide text-gray-900">Trusted by leading brands</p>
          <ClientLogoMarquee />
        </div>
      </section>

      {blogs.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="mb-3 font-heading text-3xl font-semibold text-black md:text-4xl">Latest from Blog</h2>
                <div className="h-1 w-10 bg-red-600" />
              </div>
              <Button asChild variant="outline"><Link to="/blog">View All</Link></Button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {blogs.slice(0, 3).map((b) => <BlogCard key={b.id} blog={b} />)}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  )
}
