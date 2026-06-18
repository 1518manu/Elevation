import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Star } from 'lucide-react'
import { useTestimonials } from '@/hooks/useTestimonials'
import { getImageUrl } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import 'swiper/css'
import 'swiper/css/pagination'

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').trim()
}

function StarRating({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: Math.min(Math.max(count, 1), 5) }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-red-600 text-red-600" />
      ))}
    </div>
  )
}

function Avatar({ name, photoUrl }) {
  if (photoUrl) {
    return (
      <img
        src={getImageUrl(photoUrl, 80)}
        alt={name}
        className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-red-100"
      />
    )
  }
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white ring-2 ring-red-100">
      {name?.charAt(0)?.toUpperCase() ?? '?'}
    </div>
  )
}

export default function TestimonialsCarousel() {
  const { data: testimonials = [], isLoading } = useTestimonials({
    is_featured: true,
    is_active: true,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-56 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (!testimonials.length) return null

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={24}
      slidesPerView={1}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      breakpoints={{
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="!pb-10"
      style={{
        '--swiper-pagination-color': '#dc2626',
        '--swiper-pagination-bullet-inactive-color': '#d1d5db',
        '--swiper-pagination-bullet-inactive-opacity': '1',
        '--swiper-pagination-bullet-size': '8px',
      }}
    >
      {testimonials.map((t) => {
        const content = stripHtml(t.content)
        const subline = [t.role, t.company].filter(Boolean).join(', ')

        return (
          <SwiperSlide key={t.id} style={{ height: 'auto', alignSelf: 'stretch' }}>
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-gray-800 bg-black/5 p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">

              {/* Quote mark */}
              <svg
                width="32" height="24" viewBox="0 0 32 24"
                fill="none" xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M0 24V14.4C0 10.56 0.96 7.28 2.88 4.56C4.88 1.84 7.76 0.16 11.52 0L12.96 2.88C10.4 3.52 8.48 4.72 7.2 6.48C5.92 8.24 5.28 10.16 5.28 12.24H10.56V24H0ZM19.44 24V14.4C19.44 10.56 20.4 7.28 22.32 4.56C24.32 1.84 27.2 0.16 30.96 0L32.4 2.88C29.84 3.52 27.92 4.72 26.64 6.48C25.36 8.24 24.72 10.16 24.72 12.24H30V24H19.44Z"
                  fill="#ce0505"
                  opacity="0.8"
                />
              </svg>

              {/* Content — grows to fill space */}
              {content ? (
                <p className="flex-1 text-[15px] leading-relaxed text-gray-900">
                  "{content}"
                </p>
              ) : null}

              {/* Stars */}
              <StarRating count={t.rating || 5} />

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <Avatar name={t.name} photoUrl={t.photo_url} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{t.name}</p>
                  {subline ? (
                    <p className="truncate text-xs text-gray-500">{subline}</p>
                  ) : null}
                </div>
              </div>

            </div>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}