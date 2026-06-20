import { Link } from 'react-router-dom'
import SEOHead from '@/components/common/SEOHead'
import ServicesGrid from '@/components/public/ServicesGrid'
import CTABanner from '@/components/public/CTABanner'
import * as LucideIcons from 'lucide-react'
import { motion } from 'framer-motion'
import { useProcessSteps } from '@/hooks/useProcessSteps'
import { Skeleton } from '@/components/ui/skeleton'

export default function ServicesPage() {
  const { data: steps = [], isLoading } = useProcessSteps()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
    )
  }
  return (
    <>
      <SEOHead title="Our Services" description="Elevator installation, maintenance AMC, and modernization services across India." />
      <section className="bg-black py-20 text-white">
        <div className="mx-auto mt-10 max-w-7xl px-4 py-8 md:ml-32 md:mt-12 md:py-4">
          <nav className="mb-4 text-sm text-white/70">
            <Link to="/" className="hover:text-white/90">Home</Link> / Services
          </nav>
          <h1 className="font-heading text-4xl font-bold">Our Services</h1>
        </div>
      </section>
      <section className="py-8">
        <div className="mx-52 max-w-6xl px-4">
          <div className="inline-block relative mb-6">
            <h2 className="mb-2 font-heading text-2xl font-bold text-black">Engineering Excellence. Delivering Mobility.</h2>
            <div className="absolute mx-1 top-full mt-2 h-1 w-32 bg-red-600" />
          </div>

          <div className="space-y-2 text-gray-700">
            <p className="text-base font-semibold leading-8">
              We provide complete elevator solutions for residential, commercial, industrial, healthcare, hospitality, and institutional projects. Combining advanced engineering, innovative technology, and industry expertise, we deliver safe, efficient, and reliable vertical mobility systems tailored to the unique needs of every building.
            </p>
            <p className="text-base font-semibold leading-8">
              From design, supply, and installation to testing, modernization, and preventive maintenance, we manage every stage of the elevator lifecycle. With a strong focus on safety, quality, and performance, our team ensures dependable operation, responsive support, and long-term value for every project we undertake.
            </p>
            
          </div>
        </div>
      </section>
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4"><ServicesGrid /></div>
      </section>
      <section className=" py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center font-heading text-3xl font-semibold text-black">How We Work</h2>
         <div className="relative">
      <div className="hidden md:absolute md:left-0 md:right-0 md:top-8 md:block md:h-0.5 md:bg-red-600/50" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:grid-cols-10">
        {steps.map((step, i) => {
          const Icon = LucideIcons[step.icon_name] || LucideIcons.Circle
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-600 bg-white shadow-card">
                <Icon className="h-6 w-6 text-black" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {step.step_number}
                </span>
              </div>
              <h4 className="mb-1 text-sm font-semibold text-black">{step.title}</h4>
              <p className="hidden text-xs text-black/80 lg:block">{step.description}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
        </div>
      </section>
      <CTABanner />
    </>
  )
}
