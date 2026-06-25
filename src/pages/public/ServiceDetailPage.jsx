import { useParams, Link } from 'react-router-dom'
import SEOHead from '@/components/common/SEOHead'
import PageLoader from '@/components/common/PageLoader'
import CTABanner from '@/components/public/CTABanner'
import { useService } from '@/hooks/useServices'
import { useQuoteModal } from '@/components/common/QuoteModal'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { APP_URL } from '@/lib/constants'

const serviceImages = {
  installation: '/assets/images/installation.png',
  maintenance: '/assets/images/maintenance.png',
  modernization: '/assets/images/modernization.png',
}

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const { data: service, isLoading } = useService(slug)
  const { openModal } = useQuoteModal()

  if (isLoading) return <PageLoader />
  if (!service) return <div className="py-16 text-center">Service not found</div>

  const serviceImage = serviceImages[slug] || serviceImages.installation

  return (
    <>
      <SEOHead title={service.seo_title || service.title} description={service.seo_description || service.short_description} url={`${APP_URL}/services/${slug}`} />
          <section className="bg-black py-12 text-white">
              <div className="mx-auto mt-16 py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center gap-1 text-sm text-white/70">
                  <Link to="/" className="hover:text-white">
                    Home
                  </Link>
                  <span>/</span>
                  <Link to="/services" className="hover:text-white">
                    Services
                  </Link>
                  <span>/</span>
                  <span className="text-white">
                    {service.title}
                  </span>
                </nav>
              </div>
          </section>
          <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/detail_page.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-white/30" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-heading text-3xl font-bold text-red-800 md:text-4xl mb-4">
                {service.title}
              </h1>

              {service.short_description && (
                <p className="mb-8 font-semibold max-w-3xl text-lg leading-relaxed text-gray-900">
                  {service.short_description}
                </p>
              )}

              <div className="prose font-semibold  text-justify prose-lg max-w-none mb-8 whitespace-pre-wrap prose-headings:font-semibold prose-p:font-semibold prose-p:text-justify" dangerouslySetInnerHTML={{ __html: service.description || '' }} />
              
              {service.key_features?.length > 0 && (
                <div>
                  <h2 className="mb-4 font-heading text-2xl font-semibold text-black">Key Features</h2>
                  <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {service.key_features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2"><Check className="h-5 w-5 text-red-600" />{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              <img
                src={serviceImage}
                alt={service.title}
                className="w-full h-auto rounded-xl shadow-lg mb-6 object-cover border-b-4 border-black"
              />
              <Button onClick={openModal} className="bg-red-600 text-white hover:bg-red-700 px-8">
                Get Free Quote
              </Button>
            </div>
          </div>
        </div>
      </section>
      <CTABanner />
    </>
  )
}
