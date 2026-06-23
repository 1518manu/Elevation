import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, Navigation, FreeMode } from 'swiper/modules'
import { Check, Download, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react'
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
    brand: { '@type': 'Brand', name: 'ALFAFUJI ELEVATOR INDIA PVT LTD' },
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

      <section className="bg-black py-8 text-white">
        <div className="mx-auto mt-20 py-4  max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center pb-4 gap-1 text-sm text-white/70"
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
          <h1 className="font-heading text-4xl font-bold">Product Details</h1>
        </div>
        
      </section> 

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-14">

            <div className="md:col-span-1 lg:col-span-3">
              {hasImages ? (
                <div className="space-y-3">
                  
                  <div className="relative">
                    <Swiper
                      modules={[Navigation, Thumbs, FreeMode]}
                      navigation={{
                        nextEl: '.product-swiper-button-next',
                        prevEl: '.product-swiper-button-prev',
                      }}
                      thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                      spaceBetween={10}
                      className="rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-gray-100"
                    >
                      {product.images.map((img, i) => {
                        const imageUrl = typeof img === 'string' ? img : img?.url || img
                        return (
                          <SwiperSlide key={i}>
                            <div className="relative w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: '16/9' }}>
                              <img
                                src={imgUrl(imageUrl, 1200, 85)}
                                alt={`${product.name} — view ${i + 1}`}
                                className="w-full h-full object-contain"
                                loading={i === 0 ? 'eager' : 'lazy'}
                                onError={(e) => {
                                  e.target.src = imageUrl
                                }}
                              />
                            </div>
                          </SwiperSlide>
                        )
                      })}
                    </Swiper>
                    
                    {/* Custom Navigation Buttons - Inside the image */}
                    {hasMultipleImages && (
                      <>
                        <button className="product-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 text-red-600 transition-all hover:scale-110">
                          <ChevronLeft className="h-8 w-8" />
                        </button>
                        <button className="product-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 text-red-600 transition-all hover:scale-110">
                          <ChevronRight className="h-8 w-8" />
                        </button>
                      </>
                    )}
                  </div>

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
                      {product.images.map((img, i) => {
                        const imageUrl = typeof img === 'string' ? img : img?.url || img
                        return (
                          <SwiperSlide key={i} className="cursor-pointer">
                            <div className="overflow-hidden rounded-lg border-2 border-transparent hover:border-red-400 transition-all duration-200 bg-gray-100 aspect-video flex items-center justify-center">
                              <img
                                src={imgUrl(imageUrl, 200, 70)}
                                alt={`Thumbnail ${i + 1}`}
                                className="h-full w-full object-contain p-2
                                           opacity-60 transition-all duration-150
                                           [.swiper-slide-thumb-active>&]:opacity-100
                                           [.swiper-slide-thumb-active>&]:border-red-600"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.src = imageUrl
                                }}
                              />
                            </div>
                          </SwiperSlide>
                        )
                      })}
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

                {product.description && (
                  <div className="mt-6 prose prose-sm max-w-none">
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>
                )}
              </div>
              <div className="mb-7 flex flex-wrap gap-3">
                <Button
                  onClick={openModal}
                  className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 font-semibold px-6 py-2.5 text-base shadow-md"
                >
                  Get Free Quote
                </Button>

                {product.brochure_url && (
                  <a
                    href={product.brochure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-base font-semibold border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    Download Brochure
                  </a>
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