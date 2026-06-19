import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import { useProcessSteps } from '@/hooks/useProcessSteps'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProcessStepper() {
  const { data: steps = [], isLoading } = useProcessSteps()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
    )
  }

  return (
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
              <h4 className="mb-1 text-sm font-semibold text-white">{step.title}</h4>
              <p className="hidden text-xs text-white/80 lg:block">{step.description}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
