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



function StatItem({ icon: Icon, value, label, suffix = '+', inView, index }) {

  const count = useCountUp(value, 2000, inView)

  return (

    <motion.div

      initial={{ opacity: 0, y: 24 }}

      whileInView={{ opacity: 1, y: 0 }}

      viewport={{ once: true }}

      transition={{ delay: index * 0.1, duration: 0.5 }}

      className="group relative flex flex-col items-start border-l-2 border-red-600 pl-5"

    >

      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10 transition-colors duration-300 group-hover:bg-red-600">

        <Icon className="h-5 w-5 text-red-600 transition-colors duration-300 group-hover:text-white" />

      </div>

      <p className="font-heading text-4xl font-bold leading-none text-black md:text-5xl">

        {count}

        <span className="text-red-600">{suffix}</span>

      </p>

      <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-gray-400">

        {label}

      </p>

    </motion.div>

  )

}



export default function StatsCounter() {

  const ref = useRef(null)

  const [inView, setInView] = useState(false)

  const { data: settings } = useSiteSettings()

  const stats = settings?.stats || { years: 20, projects: 2000, clients: 350, cities: 12 }



  useEffect(() => {

    const observer = new IntersectionObserver(

      ([entry]) => { if (entry.isIntersecting) setInView(true) },

      { threshold: 0.3 }

    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()

  }, [])



  const items = [

    { icon: Calendar,  value: stats.years    || 15,   label: 'Years Experience'   },

    { icon: Building2, value: stats.projects || 2000, label: 'Projects Completed' },

    { icon: Users,     value: stats.clients  || 350,  label: 'Happy Clients'      },

    { icon: MapPin,    value: stats.cities   || 12,   label: 'Cities Served'      },

  ]



  return (

    <section ref={ref} className="bg-white py-16 md:py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">



        {/* Two-column layout: left text + right placeholder box */}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">



          {/* LEFT — eyebrow + headline + body + stats */}

          <div>

            {/* Eyebrow — matches screenshot exactly */}

            <div className="mb-5 flex items-center gap-3">

              <div className="h-6 w-1 bg-red-600" />

              <p className="text-sm font-semibold text-red-600 tracking-wide">

                Ascend your Comfort

              </p>

            </div>



            {/* Headline — bold, large, left-justified, matches screenshot */}

            <h2 className="mb-6 font-heading text-4xl font-extrabold leading-tight text-black md:text-5xl lg:text-[3.25rem]">

              Elevator: An innovation<br />

              treating every floor equal

            </h2>



            {/* Body copy — left-justified */}

            <p className="mb-10 max-w-xl text-base leading-relaxed text-gray-500">

            In today’s rapidly growing urban landscape, elevators are essential for ensuring safe, efficient,

             and comfortable vertical transportation. ALFAFUJI Elevator India Pvt. Ltd. provides innovative elevator solutions for residential,

              commercial, industrial, and institutional buildings across India. We specialize in customized elevators that combine advanced technology, 

              safety, reliability, and elegant design. Our solutions are tailored to complement modern architecture while delivering superior performance. 

              With a commitment to quality and customer satisfaction, we help shape smarter and more accessible spaces. 

              ALFAFUJI continues to set new benchmarks in vertical mobility across India.

        </p>



            {/* Stats — 2×2 grid, left-aligned */}

            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">

              {items.map((item, i) => (

                <StatItem key={item.label} {...item} index={i} inView={inView} />

              ))}

            </div>

          </div>





          <div className="flex pt-16  items-stretch lg:min-h-[480px]">

            <img 

              src="/lift.png" 

              alt="ALFAFUJI Luxury Elevator" 

              className="w-full h-full object-contain rounded-2xl"

              style={{ maxHeight: 560 }}

            />

          </div>



        </div>

      </div>

    </section>

  )

}