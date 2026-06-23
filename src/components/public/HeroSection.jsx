import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, Shield, Award, Clock, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuoteModal } from '@/components/common/QuoteModal'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import taglineImage from '@/assets/images/tagline.png'
import brochurePdf from '@/assets/brochure.pdf'

const BADGES = [
  { icon: Shield, label: 'BIS Certified' },
  { icon: Award, label: 'ISO 9001:2015' },
  { icon: Clock, label: '5+ Years' },
  { icon: Building2, label: '500+ Installations' },
]

const HEADLINE = 'ALFAFUJI \n ELEVATOR \n INDIA PVT LTD'

const HEADLINE_STYLE = {
  fontFamily: '"Playfair Display", "Cinzel", "Didot", serif',
  letterSpacing: '-0.02em',
  textTransform: 'uppercase',
}

const ANIMATION = {
  headline: { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } },
  tagline: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.8, delay: 0.3 } },
  description: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1 } },
  buttons: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.2 } },
  badges: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay: 0.4 } },
  card: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.8, delay: 0.6 } },
  scroll: { animate: { y: [0, 8, 0] }, transition: { repeat: Infinity, duration: 2 } },
}

export default function HeroSection() {
  const { openModal } = useQuoteModal()
  const { data: settings } = useSiteSettings()
  const subheadline = settings?.hero_content?.subheadline || 'From residential home lifts to commercial passenger elevators — engineered for India.'

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Background Gradient + Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(139,0,0,0.75) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')`,
        }}
        role="img"
        aria-label="Modern elevator building"
      />

      {/* Main Content Container */}
      <div className="relative z-10 mx-4 md:mx-8 lg:mx-64 max-w-7xl px-4 py-12 md:py-16 lg:py-20 mt-6 sm:mt-12 md:mt-20 lg:mt-24 sm:px-6 lg:px-8">

        {/* Headline + Tagline Image Row */}
        <div className="mb-6 flex items-center justify-between gap-4">
          
          {/* Left: Headline */}
          <motion.h1
            {...ANIMATION.headline}
            className="flex-1 font-black text-[28px] leading-tight text-white md:text-5xl lg:text-[56px] whitespace-pre-line"
            style={HEADLINE_STYLE}
          >
            {HEADLINE}
          </motion.h1>

         {/* Right: Tagline Image */}
          <motion.div
            {...ANIMATION.tagline}
            className="flex-shrink-0 w-[100px] sm:w-[120px] md:w-[160px] lg:w-[180px]"
          >
            <img
              src={taglineImage}
              alt="Rise High With Us"
              width="240"
              height="280"
              fetchpriority="high"
              decoding="async"
              className="w-full h-auto object-contain"
            />
          </motion.div>

        </div>

        {/* Description */}
        <motion.p
          {...ANIMATION.description}
          className="mb-8 max-w-2xl text-lg hidden sm:block text-white/90 md:text-xl"
        >
          {subheadline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          {...ANIMATION.buttons}
          className="mb-10 flex flex-wrap gap-4"
        >
          <Button
            onClick={openModal}
            className="bg-red-600 px-8 py-3 text-base font-bold text-white hover:bg-red-700 transition-colors"
          >
            Get Free Quote
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-2 border-white bg-transparent px-8 py-3 text-white hover:bg-white hover:text-black transition-colors"
          >
            <Link to="/products">View Our Products</Link>
          </Button>
        </motion.div>

        {/* Badges */}
        <motion.div
          {...ANIMATION.badges}
          className="flex flex-wrap gap-3"
        >
          {BADGES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm text-white hover:border-white/60 transition-colors"
            >
              <Icon className="h-4 w-4 text-red-500" />
              {label}
            </span>
          ))}
        </motion.div>

      </div>

      {/* Download Brochure Card - Desktop Only */}
      <motion.div
        {...ANIMATION.card}
        className="absolute bottom-28 right-32 hidden lg:block max-w-xs rounded-xl bg-white/95 p-5 shadow-lg"
      >
        <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">
          Download Brochure
        </p>
        <p className="font-black text-lg text-black mb-3">
          Company Profile
        </p>
        <a
          href={brochurePdf}
          download="ALFAFUJI-brochure.pdf"
          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PDF
        </a>
      </motion.div>

      {/* Mobile Brochure Circular Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-24 right-4 z-20 lg:hidden"
      >
        <a
          href={brochurePdf}
          download="ALFAFUJI-brochure.pdf"
          className="group relative flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-visible"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-600 flex-shrink-0"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <div className="absolute bottom-full right-0 mb-3 flex w-72 flex-col rounded-3xl bg-white p-6 text-left text-black shadow-xl opacity-0 scale-95 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 lg:hidden">
            <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">
              Download Brochure
            </p>
            <p className="font-black text-lg text-black mb-4">
              Company Profile
            </p>
            <span className="inline-flex items-center justify-center bg-red-600 px-3 py-2 rounded-lg text-sm font-bold text-white">
              Download PDF
            </span>
          </div>
        </a>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        {...ANIMATION.scroll}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="h-8 w-8 text-white/70" />
      </motion.div>

    </section>
  )
}