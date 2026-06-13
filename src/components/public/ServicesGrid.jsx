import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wrench, Settings, RefreshCw } from 'lucide-react'
import { useServices } from '@/hooks/useServices'
import { Skeleton } from '@/components/ui/skeleton'

const iconMap = { Wrench, Settings, RefreshCw }

export default function ServicesGrid() {
  const { data: services = [], isLoading } = useServices()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {services.map((service, i) => {
        const Icon = iconMap[service.icon] || Wrench
        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/services/${service.slug}`}
              className="group block rounded-xl bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-heading text-xl font-semibold text-primary group-hover:text-accent-dark">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600">{service.short_description}</p>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
