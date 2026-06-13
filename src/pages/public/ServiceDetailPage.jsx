import { useParams, Link } from 'react-router-dom'
import SEOHead from '@/components/common/SEOHead'
import PageLoader from '@/components/common/PageLoader'
import CTABanner from '@/components/public/CTABanner'
import { useService } from '@/hooks/useServices'
import { useQuoteModal } from '@/components/common/QuoteModal'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { APP_URL } from '@/lib/constants'

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const { data: service, isLoading } = useService(slug)
  const { openModal } = useQuoteModal()

  if (isLoading) return <PageLoader />
  if (!service) return <div className="py-16 text-center">Service not found</div>

  return (
    <>
      <SEOHead title={service.seo_title || service.title} description={service.seo_description || service.short_description} url={`${APP_URL}/services/${slug}`} />
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="mb-4 text-sm text-white/70"><Link to="/services" className="hover:underline">Services</Link> / {service.title}</nav>
          <h1 className="font-heading text-4xl font-bold">{service.title}</h1>
          <p className="mt-4 max-w-2xl text-white/80">{service.short_description}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: service.description || '' }} />
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
          <Button onClick={openModal} className="mt-8 bg-red-600 text-black hover:bg-red-700">Get Free Quote</Button>
        </div>
      </section>
      <CTABanner />
    </>
  )
}
