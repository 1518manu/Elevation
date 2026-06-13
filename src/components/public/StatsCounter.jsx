import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Building2, Users, MapPin } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

function useCountUp(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration, start])
  return count
}

function StatItem({ icon: Icon, value, label, suffix = '+', inView }) {
  const count = useCountUp(value, 2000, inView)
  return (
    <div className="text-center">
      <Icon className="mx-auto mb-3 h-8 w-8 text-red-600" />
      <p className="font-heading text-4xl font-bold text-black">{count}{suffix}</p>
      <p className="mt-1 text-sm uppercase tracking-wide text-gray-500">{label}</p>
    </div>
  )
}

export default function StatsCounter() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const { data: settings } = useSiteSettings()
  const stats = settings?.stats || { years: 15, projects: 2000, clients: 350, cities: 12 }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const items = [
    { icon: Calendar, value: stats.years || 15, label: 'Years Experience' },
    { icon: Building2, value: stats.projects || 2000, label: 'Projects Completed' },
    { icon: Users, value: stats.clients || 350, label: 'Happy Clients' },
    { icon: MapPin, value: stats.cities || 12, label: 'Cities Served' },
  ]

  return (
    <section ref={ref} className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-red-600/10 to-black/5" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white p-8 shadow-card md:p-12"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {items.map((item) => (
              <StatItem key={item.label} {...item} inView={inView} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
