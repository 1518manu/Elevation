import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, Shield, Award, Clock, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuoteModal } from '@/components/common/QuoteModal'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import taglineImage from '@/assets/images/tagline.png'
import brochurePdf from '@/assets/brochure.pdf'

export default function HeroSection() {
  const { openModal } = useQuoteModal()
  const { data: settings } = useSiteSettings()
  const hero = settings?.hero_content || {}
  const headline = "ALFAFUJI \n ELEVATOR \n INDIA PVT LTD "
  const subheadline =
    hero.subheadline ||
    'From residential home lifts to commercial passenger elevators — engineered for India.'

  const badges = [
    { icon: Shield, label: 'BIS Certified' },
    { icon: Award, label: 'ISO 9001:2015' },
    { icon: Clock, label: '5+ Years' },
    { icon: Building2, label: '500+ Installations' },
  ]

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(139,0,0,0.75) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')`,
        }}
      />

      <div className="relative z-10 mx-64 max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

        {/* ── HEADLINE + ANIMATION ROW ───────────────────────────────────── */}
        <div className="mb-6 flex items-center gap-6">

          {/* LEFT 2/3 — headline */}
          <div className="w-18 pr-6 ">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl font-black text-[32px] leading-tight text-white md:text-5xl lg:text-[56px] whitespace-pre-line"
              style={{
                fontFamily: '"Playfair Display", "Cinzel", "Didot", serif',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}
            >
              {headline}
            </motion.h1>
          </div>

          {/* RIGHT 1/3 — tagline image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex w-1/3 items-center pl-4 justify-center"
          >
            <img
              src={taglineImage}
              alt="Rise High With Us"
              className="h-full max-h-[220px] w-full max-w-[200px] object-contain"
            />
          </motion.div>

        </div>
        {/* ── END HEADLINE + ANIMATION ROW ──────────────────────────────── */}

        {/* Everything below is UNCHANGED */}
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
          <Button
            onClick={openModal}
            className="bg-red-600 px-8 py-3 text-base font-bold text-white hover:bg-red-700"
          >
            Get Free Quote
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-2 border-white bg-transparent px-8 py-3 text-white hover:bg-white hover:text-black"
          >
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
            <span
              key={label}
              className="flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm text-white"
            >
              <Icon className="h-4 w-4 text-red-500" />
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-28 right-32 hidden max-w-xs rounded-xl bg-white/95 p-5 shadow-lg lg:block"
      >
        <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">Download Brochure</p>
        <p className="font-black text-lg text-black">Company Profile</p>
        <a 
          href={brochurePdf} 
          download="alfafuji-brochure.pdf"
          className="mt-3 inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download PDF
        </a>
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