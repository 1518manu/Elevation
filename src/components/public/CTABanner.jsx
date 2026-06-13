import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useQuoteModal } from '@/components/common/QuoteModal'

export default function CTABanner({ title = 'Ready to Elevate Your Building?', subtitle = 'Get a free consultation and quote from our experts today.' }) {
  const { openModal } = useQuoteModal()

  return (
    <section className="relative overflow-hidden bg-primary py-16 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary-light opacity-50" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-4xl px-4 text-center sm:px-6"
      >
        <h2 className="mb-4 font-heading text-3xl font-bold text-white md:text-4xl">{title}</h2>
        <p className="mb-8 text-lg text-white/80">{subtitle}</p>
        <Button onClick={openModal} size="lg" className="bg-accent px-8 font-bold text-primary hover:bg-accent-dark">
          Get Free Quote
        </Button>
      </motion.div>
    </section>
  )
}
