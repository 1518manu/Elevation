import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, Shield, Award, Clock, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuoteModal } from '@/components/common/QuoteModal'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function HeroSection() {
  const { openModal } = useQuoteModal()
  const { data: settings } = useSiteSettings()
  const hero = settings?.hero_content || {}
  const headline = hero.headline || "India's Most Trusted Elevator Solutions"
  const subheadline = hero.subheadline || 'From residential home lifts to commercial passenger elevators — engineered for India.'

  const badges = [
    { icon: Shield, label: 'BIS Certified' },
    { icon: Award, label: 'ISO 9001:2015' },
    { icon: Clock, label: '15+ Years' },
    { icon: Building2, label: '2000+ Installations' },
  ]

  return (
    <section className="relative flex min-h-[80vh] items-center md:min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(139,0,0,0.75) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 max-w-3xl font-heading text-[32px] font-bold leading-tight text-white md:text-5xl lg:text-[56px]"
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 max-w-2xl text-lg text-white/90 md:text-xl"
        >
          {subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 flex flex-wrap gap-4"
        >
          <Button onClick={openModal} className="bg-accent px-8 py-3 text-base font-bold text-primary hover:bg-accent-dark">
            Get Free Quote
          </Button>
          <Button asChild variant="outline" className="border-2 border-white bg-transparent px-8 py-3 text-white hover:bg-white hover:text-primary">
            <Link to="/products">View Our Products</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          {badges.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
              <Icon className="h-4 w-4 text-red-600" />
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-32 right-8 hidden max-w-xs rounded-xl bg-white/95 p-4 shadow-card lg:block"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-red-600">Latest Project</p>
        <p className="font-heading font-semibold text-black">Prestige Tower, Bengaluru</p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="h-8 w-8 text-white/70" />
      </motion.div>
    </section>
  )
}
