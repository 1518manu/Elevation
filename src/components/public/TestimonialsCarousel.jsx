import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Star, Quote } from 'lucide-react'
import { useTestimonials } from '@/hooks/useTestimonials'
import { getImageUrl } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import 'swiper/css'
import 'swiper/css/pagination'

export default function TestimonialsCarousel() {
  const { data: testimonials = [], isLoading } = useTestimonials({ is_featured: true, is_active: true })

  if (isLoading) return <Skeleton className="mx-auto h-64 max-w-3xl rounded-xl" />

  if (!testimonials.length) return null

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={24}
      slidesPerView={1}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
      className="pb-12"
    >
      {testimonials.map((t) => (
        <SwiperSlide key={t.id}>
          <div className="rounded-xl bg-white p-6 shadow-card">
            <Quote className="mb-3 h-8 w-8 text-accent/50" />
            <p className="mb-4 text-gray-600">&ldquo;{t.content}&rdquo;</p>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: t.rating || 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <div className="flex items-center gap-3">
              {t.photo_url ? (
                <img src={getImageUrl(t.photo_url, 80)} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-primary">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}{t.company ? `, ${t.company}` : ''}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
