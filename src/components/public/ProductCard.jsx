import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getImageUrl } from '@/lib/utils'
import { useQuoteModal } from '@/components/common/QuoteModal'

export default function ProductCard({ product, index = 0 }) {
  const { openModal } = useQuoteModal()
  const image = product.images?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group overflow-hidden rounded-xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-video overflow-hidden">
        {image ? (
          <img
            src={getImageUrl(image)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">No image</div>
        )}
        <Badge className="absolute left-3 top-3 bg-primary/90 capitalize text-white">{product.category}</Badge>
      </div>
      <div className="p-5">
        <h3 className="mb-2 font-heading text-lg font-semibold text-primary">{product.name}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">{product.short_description}</p>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1 border-primary text-primary">
            <Link to={`/products/${product.slug}`}>View Details</Link>
          </Button>
          <Button size="sm" onClick={openModal} className="flex-1 bg-accent text-primary hover:bg-accent-dark">
            Get Quote
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
