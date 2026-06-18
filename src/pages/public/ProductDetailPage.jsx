import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, Navigation, FreeMode } from 'swiper/modules'
import { Check, Download, ArrowLeft, ChevronRight } from 'lucide-react'
import SEOHead from '@/components/common/SEOHead'
import ProductCard from '@/components/public/ProductCard'
import PageLoader from '@/components/common/PageLoader'
import { useProduct, useProducts } from '@/hooks/useProducts'
import { useQuoteModal } from '@/components/common/QuoteModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getImageUrl as imgUrl } from '@/lib/utils'
import { APP_URL } from '@/lib/constants'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  const { data: product, isLoading, error } = useProduct(slug)
  const { data: allProducts = [] } = useProducts()
  const { openModal } = useQuoteModal()

  if (isLoading) return <PageLoader />
  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-xl font-semibold text-gray-800">Product not found</p>
        <Link to="/products" className="flex items-center gap-1 text-sm text-red-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
      </div>
    )
  }

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  const specs = product.specifications || {}
  const hasImages = product.images?.length > 0
  const hasMultipleImages = product.images?.length > 1

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description,
    image: product.images?.[0],
    brand: { '@type': 'Brand', name: 'Alfa Elevator' },
  }

  return (
    <>
      <SEOHead
        title={product.seo_title || product.name}
        description={product.seo_description || product.short_description}
        image={product.images?.[0]}
        url={`${APP_URL}/products/${slug}`}
        jsonLd={jsonLd}
      />

      <section className="bg-black py-12 text-white">
        <div className="mx-auto my-16 py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-sm text-white/70"
          >
            <Link to="/" className="hover:text-white">
              Home
            </Link>

            <ChevronRight className="h-3.5 w-3.5" />

            <Link to="/products" className="hover:text-white">
              Products
            </Link>

            <ChevronRight className="h-3.5 w-3.5" />

            <span className="text-white">{product.name}</span>
          </nav>
        </div>
      </section> 

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14">

            <div className="lg:col-span-3">
              {hasImages ? (
                <div className="space-y-3">
                  
                  <Swiper
                    modules={[Navigation, Thumbs, FreeMode]}
                    navigation
                    thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                    spaceBetween={10}
                    className="rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                  >
                    {product.images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <img
                          src={imgUrl(img, 1200, 85)}
                          alt={`${product.name} — view ${i + 1}`}
                          className="aspect-video w-full object-cover"
                          loading={i === 0 ? 'eager' : 'lazy'}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {hasMultipleImages && (
                    <Swiper
                      modules={[FreeMode, Thumbs]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={8}
                      slidesPerView={Math.min(product.images.length, 5)}
                      freeMode
                      watchSlidesProgress
                      className="thumbnail-swiper"
                    >
                      {product.images.map((img, i) => (
                        <SwiperSlide key={i} className="cursor-pointer">
                          <img
                            src={imgUrl(img, 200, 70)}
                            alt={`Thumbnail ${i + 1}`}
                            className="h-16 w-full rounded-md object-cover border-2 border-transparent
                                       opacity-60 transition-all duration-150
                                       [.swiper-slide-thumb-active>&]:border-red-600
                                       [.swiper-slide-thumb-active>&]:opacity-100"
                            loading="lazy"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                  No images available
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
            
              <div className="mb-10">
                <Badge className="mb-4 border-0 bg-red-600 capitalize text-white">
                  {product.category}
                </Badge>

                <h1 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                  {product.name}
                </h1>

                {product.short_description && (
                  <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
                    {product.short_description}
                  </p>
                )}
              </div>
              <div className="mb-7 flex flex-wrap gap-3">
                <Button
                  onClick={openModal}
                  className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500"
                >
                  Get Free Quote
                </Button>

                {product.brochure_url && (
                  <Button asChild variant="outline" className="border-gray-300 hover:border-red-600 hover:text-red-600">
                    <a href={product.brochure_url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download Brochure
                    </a>
                  </Button>
                )}
              </div>

              {/* Features list */}
              {product.features?.length > 0 && (
                <div className="mb-7">
                  <h2 className="mb-3 font-heading text-lg font-semibold text-gray-900">
                    Key Features
                  </h2>
                  <ul className="space-y-2.5">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-50">
                          <Check className="h-2.5 w-2.5 text-red-600" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications — condensed inline version */}
              {Object.keys(specs).length > 0 && (
                <div>
                  <h2 className="mb-3 font-heading text-lg font-semibold text-gray-900">
                    Specifications
                  </h2>
                  <dl className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden text-sm">
                    {Object.entries(specs).map(([key, val]) => (
                      <div key={key} className="grid grid-cols-2">
                        <dt className="bg-gray-50 px-4 py-2.5 font-medium text-gray-800">{key}</dt>
                        <dd className="px-4 py-2.5 text-gray-600">{String(val)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          {/* ── Specifications — full-width (when no inline specs shown) ── */}
          {/* This block is intentionally empty — specs are shown in the right panel above.
              If you need a standalone full-width specs section for long tables, un-comment:

          {Object.keys(specs).length > 6 && (
            <div className="mt-12">
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">Full Specifications</h2>
              ...
            </div>
          )}
          */}

          {/* ── Related products ──────────────────────────────── */}
          {related.length > 0 && (
            <div className="mt-16 border-t border-gray-100 pt-14">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-2xl font-semibold text-gray-900">
                  Related Products
                </h2>
                <Link
                  to={`/products?category=${product.category}`}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  View all {product.category} →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}