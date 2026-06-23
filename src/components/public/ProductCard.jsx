import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useQuoteModal } from '@/components/common/QuoteModal'

export default function ProductCard({ product, index = 0 }) {
  const { openModal } = useQuoteModal()
  const image = product.images?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group relative overflow-hidden rounded-xl bg-white/50 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover border-b-4 border-red-600"
    >
      
      <div className="relative aspect-video overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width="640"
            height="360"
            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
            No image
          </div>
        )}

        <Badge className="absolute left-5 top-5 z-30 bg-red-600/90 capitalize text-white">
          {product.category}
        </Badge>
      </div>

      <div className="relative z-10 p-5">
        <h3 className="mb-2 font-heading text-lg font-semibold text-black">
          {product.name}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {product.short_description}
        </p>

        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 border-red-600 text-red-600"
            disabled={!product.slug}
          >
            {product.slug ? (
              <Link to={`/products/${product.slug}`}>
                View Details
              </Link>
            ) : (
              <span>View Details</span>
            )}
          </Button>

          <Button
            size="sm"
            onClick={openModal}
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
          >
            Get Quote
          </Button>
        </div>
      </div>
    </motion.div>
  )
}