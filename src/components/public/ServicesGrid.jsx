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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
      {services.map((service, i) => {
        const Icon = iconMap[service.icon] || Wrench

        return (
          <motion.div
            key={service.id}
            className="h-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
          >
            <Link
              to={`/services/${service.slug}`}
              className="group flex flex-col h-full rounded-xl bg-white p-6 shadow-card transition-all duration-500 ease-&lsqb;cubic-bezier(0.22,1,0.36,1)&rsqb; hover:shadow-card-hover"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-black/10 transition-all duration-500 ease-&lsqb;cubic-bezier(0.22,1,0.36,1)&rsqb; group-hover:bg-red-50">
                <Icon className="h-6 w-6 text-black transition-all duration-500 ease-&lsqb;cubic-bezier(0.22,1,0.36,1)&rsqb; group-hover:scale-110 group-hover:text-red-600" />
              </div>

              <h3 className="mb-2 font-heading text-xl font-semibold text-black transition-colors duration-500 ease-&lsqb;cubic-bezier(0.22,1,0.36,1)&rsqb; group-hover:text-red-700">
                {service.title}
              </h3>

              <p className="text-sm text-gray-600 transition-colors duration-500 ease-&lsqb;cubic-bezier(0.22,1,0.36,1)&rsqb; group-hover:text-gray-800 flex-1">
                {service.short_description}
              </p>

              <div className="mt-5 h-[2px] w-0 bg-red-600 transition-all duration-500 ease-&lsqb;cubic-bezier(0.22,1,0.36,1)&rsqb; group-hover:w-full"></div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}