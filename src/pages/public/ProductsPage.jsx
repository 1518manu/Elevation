import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import SEOHead from '@/components/common/SEOHead'
import ProductCard from '@/components/public/ProductCard'
import { useProducts } from '@/hooks/useProducts'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { PRODUCT_CATEGORIES } from '@/lib/constants'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const [search, setSearch] = useState('')
  const { data: products = [], isLoading } = useProducts()

  const filtered = useMemo(() => {
    let result = products
    if (category !== 'all') result = result.filter((p) => p.category === category)
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    return result
  }, [products, category, search])

  const tabs = [{ value: 'all', label: 'All' }, ...PRODUCT_CATEGORIES]

  return (
    <>
      <SEOHead title="Our Elevator Products" description="Browse our complete range of passenger elevators, home lifts, freight elevators, escalators and more." />
      <section className="bg-black py-16 text-white">
        <div className="mx-auto mt-10 max-w-7xl px-4 py-10 md:ml-32 md:mt-12 md:py-4">
          <nav className="mb-4 text-sm text-white/70">Home / Products</nav>
          <h1 className="font-heading text-4xl font-bold">Our Elevator Products</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSearchParams(tab.value === 'all' ? {} : { category: tab.value })}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${category === tab.value ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search products..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-500">No products found</p>
            </div>
          ) : (
            <motion.div initial="initial" animate="animate" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
