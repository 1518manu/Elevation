import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, ArrowUpFromLine, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS, PRODUCT_CATEGORIES } from '@/lib/constants'
import { useQuoteModal } from './QuoteModal'
import { useServices } from '@/hooks/useServices'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const location = useLocation()
  const { openModal } = useQuoteModal()
  const { data: services = [] } = useServices()
  const { data: settings } = useSiteSettings()
  const phone = settings?.phones?.[0] || '+91 98765 43210'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [location.pathname])

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-gray-200 bg-white transition-shadow duration-300',
        scrolled && 'shadow-md'
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <ArrowUpFromLine className="h-8 w-8 text-primary" />
          <span className="font-heading text-lg font-bold tracking-wide text-primary md:text-xl">
            ALFA ELEVATOR
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.hasDropdown)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                to={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary',
                  isActive(link.href) && 'border-b-2 border-accent text-primary'
                )}
              >
                <span className="flex items-center gap-1">
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="h-3 w-3" />}
                </span>
              </Link>

              {link.hasDropdown === 'products' && openDropdown === 'products' && (
                <div className="absolute left-0 top-full z-50 w-[480px] rounded-xl border bg-white p-4 shadow-card">
                  <div className="grid grid-cols-3 gap-2">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.value}
                        to={`/products?category=${cat.value}`}
                        className="rounded-lg p-3 text-center hover:bg-gray-50"
                      >
                        <p className="text-xs font-semibold text-primary">{cat.label}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {link.hasDropdown === 'services' && openDropdown === 'services' && (
                <div className="absolute left-0 top-full z-50 w-72 rounded-xl border bg-white p-2 shadow-card">
                  {services.slice(0, 3).map((svc) => (
                    <Link
                      key={svc.id}
                      to={`/services/${svc.slug}`}
                      className="block rounded-lg p-3 hover:bg-gray-50"
                    >
                      <p className="text-sm font-semibold text-primary">{svc.title}</p>
                      <p className="text-xs text-gray-500">{svc.short_description?.slice(0, 60)}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-1 text-sm font-medium text-primary">
            <Phone className="h-4 w-4" />
            {phone}
          </a>
          <Button onClick={openModal} className="rounded-full bg-accent px-5 py-2 font-bold text-primary hover:bg-accent-dark">
            Get Free Quote
          </Button>
        </div>

        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 top-[72px] z-40 overflow-y-auto bg-white lg:hidden">
          <nav className="flex flex-col p-4">
            {NAV_LINKS.map((link) => (
              <div key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    'block border-b py-3 text-base font-medium',
                    isActive(link.href) ? 'text-primary' : 'text-gray-700'
                  )}
                  onClick={() => !link.hasDropdown && setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.hasDropdown === 'products' && (
                  <div className="grid grid-cols-2 gap-2 py-2 pl-4">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link key={cat.value} to={`/products?category=${cat.value}`} className="py-1 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
                {link.hasDropdown === 'services' && (
                  <div className="py-2 pl-4">
                    {services.map((svc) => (
                      <Link key={svc.id} to={`/services/${svc.slug}`} className="block py-1 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>
                        {svc.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Button onClick={() => { openModal(); setMobileOpen(false) }} className="mt-4 bg-accent font-bold text-primary">
              Get Free Quote
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
