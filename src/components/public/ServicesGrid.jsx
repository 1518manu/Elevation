import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wrench, Settings, RefreshCw } from 'lucide-react'
import { useServices } from '@/hooks/useServices'
import { Skeleton } from '@/components/ui/skeleton'

const serviceImages = {
  installation: '/assets/images/installation.png',
  maintenance: '/assets/images/maintenance.png',
  modernization: '/assets/images/modernization.png',
}

const iconMap = { Wrench, Settings, RefreshCw }

export default function ServicesGrid() {
  const { data: services = [], isLoading } = useServices()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="aspect-[4/3] rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
      {services.map((service, i) => {
        const bgImage = serviceImages[service.slug] || serviceImages.maintenance
        const Icon = iconMap[service.icon] || Wrench

        return (
          <motion.div
            key={service.id}
            className="h-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
          >
            <Link
              to={`/services/${service.slug}`}
              className="group relative flex flex-col h-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg transition-all duration-500"
            >
              <div 
                className="h-[75%] bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${bgImage})`,
                }}
              />
              
              <div className="relative z-10 h-[25%] bg-white p-4 flex items-center gap-4 transition-all duration-500 group-hover:bg-gray-50">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-red-50">
                  <Icon className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base font-semibold text-black transition-all duration-500 group-hover:text-red-700 truncate">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-medium transition-all duration-500 group-hover:text-gray-800 truncate">
                    {service.short_description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-full transition-all duration-300 group-hover:bg-white group-hover:text-red-600">
                    Read More
                    <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}