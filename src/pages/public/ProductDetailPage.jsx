import { useParams, Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, Navigation } from 'swiper/modules'
import { Check, Download } from 'lucide-react'
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

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { data: product, isLoading, error } = useProduct(slug)
  const { data: allProducts = [] } = useProducts()
  const { openModal } = useQuoteModal()

  if (isLoading) return <PageLoader />
  if (error || !product) return <div className="py-16 text-center">Product not found</div>

  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)
  const specs = product.specifications || {}

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
      <SEOHead title={product.seo_title || product.name} description={product.seo_description || product.short_description} image={product.images?.[0]} url={`${APP_URL}/products/${slug}`} jsonLd={jsonLd} />
      <div className="mx-auto mt-10 max-w-7xl px-4 py-10 md:ml-32 md:mt-12 md:py-4">
        <nav className="mb-6 text-sm text-gray-500"><Link to="/products">Products</Link> / {product.name}</nav>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {product.images?.length > 0 ? (
              <Swiper modules={[Navigation, Thumbs]} navigation spaceBetween={10} className="rounded-xl overflow-hidden">
                {product.images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img src={imgUrl(img, 1200, 85)} alt={`${product.name} ${i + 1}`} className="aspect-video w-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100">No images</div>
            )}
          </div>
          <div className="lg:col-span-2">
            <Badge className="mb-3 capitalize">{product.category}</Badge>
            <h1 className="mb-4 font-heading text-3xl font-bold text-black">{product.name}</h1>
            <p className="mb-6 text-gray-600">{product.short_description}</p>
            <div className="mb-6 flex gap-3">
              <Button onClick={openModal} className="bg-red-600 text-black hover:bg-red-700">Get Free Quote</Button>
              {product.brochure_url && (
                <Button asChild variant="outline"><a href={product.brochure_url} target="_blank" rel="noopener noreferrer"><Download className="mr-2 h-4 w-4" />Download Brochure</a></Button>
              )}
            </div>
            {product.features?.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-black">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 text-red-600" />{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {Object.keys(specs).length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-black">Specifications</h2>
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full">
                <tbody>
                  {Object.entries(specs).map(([key, val]) => (
                    <tr key={key} className="border-b last:border-0">
                      <td className="bg-gray-50 px-4 py-3 font-medium text-black w-1/3">{key}</td>
                      <td className="px-4 py-3 text-gray-600">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-heading text-2xl font-semibold text-black">Related Products</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
