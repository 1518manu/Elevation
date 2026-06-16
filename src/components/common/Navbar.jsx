import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS, PRODUCT_CATEGORIES } from '@/lib/constants'
import { useQuoteModal } from './QuoteModal'
import { useServices } from '@/hooks/useServices'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { Button } from '@/components/ui/button'
import logo from "../../assets/images/logo.svg";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState(null)
  const location = useLocation()
  const { openModal } = useQuoteModal()
  const { data: services = [] } = useServices()
  const { data: settings } = useSiteSettings()
  const phone = settings?.phones?.[0] || '+91 98765 43210'
  const popupRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
    setMobileExpandedDropdown(null)
  }, [location.pathname])

  // Close popup on outside click
  useEffect(() => {
    if (!mobileOpen) return
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen])

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  const toggleMobileDropdown = (key) => {
    setMobileExpandedDropdown((prev) => (prev === key ? null : key))
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-gray-200 bg-white transition-shadow duration-300',
        scrolled && 'shadow-md'
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Elevation Logo" className="h-12 w-auto" />
          <span className="font-heading text-lg font-bold tracking-wide text-black md:text-xl">
            ELEVATION
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-5 lg:flex xl:gap-5">
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
                  'relative px-1 py-0 text-[15px] font-medium leading-none text-gray-700 transition-all duration-200 hover:text-[#9B2D30]',
                  isActive(link.href) &&
                    'text-[#9B2D30] after:absolute after:left-0 after:-bottom-[28px] after:h-[3px] after:w-full after:bg-[#9B2D30] after:content-[""]'
                )}
              >
                <span className="flex items-center gap-1">
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="h-3 w-3" />}
                </span>
              </Link>

              {link.hasDropdown === 'products' && openDropdown === 'products' && (
                <div className="absolute left-0 top-full z-50 mt-3 w-[480px] rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                  <div className="grid grid-cols-3 gap-2">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.value}
                        to={`/products?category=${cat.value}`}
                        className="rounded-lg p-3 text-center hover:bg-gray-50 transition duration-200 ease-out transform hover:scale-105 hover:font-bold"
                      >
                        <p className="text-xs font-semibold text-black">{cat.label}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {link.hasDropdown === 'services' && openDropdown === 'services' && (
                <div className="absolute left-0 top-full z-50 mt-3 w-72 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                  {services.slice(0, 3).map((svc) => (
                    <Link
                      key={svc.id}
                      to={`/services/${svc.slug}`}
                      className="block rounded-lg p-3 hover:bg-gray-50 transition duration-200 ease-out transform hover:scale-105 hover:font-bold"
                    >
                      <p className="text-sm font-semibold text-black">{svc.title}</p>
                      <p className="text-xs text-gray-500">{svc.short_description?.slice(0, 60)}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-5">
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center gap-1 text-sm font-medium text-black"
          >
            <Phone className="h-4 w-4 text-black" />
            {phone}
          </a>
          <Button
            onClick={openModal}
            className="h-12 rounded-full bg-[#E62B24] px-7 text-base font-semibold text-white hover:bg-[#c9251f]"
          >
            Get Free Quote
          </Button>
        </div>

        {/* Mobile Right: Phone + Quote + Hamburger with Popup */}
        <div className="relative flex items-center gap-2 lg:hidden" ref={popupRef}>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center justify-center rounded-full border border-gray-200 p-2 text-black transition hover:bg-gray-100"
            aria-label={`Call ${phone}`}
          >
            <Phone className="h-5 w-5" />
          </a>
          <Button
            onClick={openModal}
            className="h-9 rounded-full bg-[#E62B24] px-4 text-sm font-semibold text-white hover:bg-[#c9251f]"
          >
            Get Quote
          </Button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="ml-1 flex items-center justify-center rounded-md p-1 text-gray-700 transition hover:bg-gray-100"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Popup Menu Panel */}
          {mobileOpen && (
            <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-64 rounded-2xl border border-gray-100 bg-white shadow-2xl overflow-hidden">
              {/* Arrow tip */}
              <div className="absolute -top-[7px] right-4 h-3.5 w-3.5 rotate-45 border-l border-t border-gray-100 bg-white" />

              <nav className="flex flex-col py-2">
                {NAV_LINKS.map((link, index) => (
                  <div key={link.href}>
                    {link.hasDropdown ? (
                      <>
                        <button
                          onClick={() => toggleMobileDropdown(link.hasDropdown)}
                          className={cn(
                            'flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition hover:bg-gray-50',
                            isActive(link.href) ? 'text-[#9B2D30]' : 'text-gray-800'
                          )}
                        >
                          {link.label}
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 text-gray-400 transition-transform duration-200',
                              mobileExpandedDropdown === link.hasDropdown && 'rotate-180'
                            )}
                          />
                        </button>

                        {link.hasDropdown === 'products' && mobileExpandedDropdown === 'products' && (
                          <div className="bg-gray-50 px-5 pb-2 pt-1">
                            {PRODUCT_CATEGORIES.map((cat) => (
                              <Link
                                key={cat.value}
                                to={`/products?category=${cat.value}`}
                                className="block py-1.5 text-xs font-medium text-gray-600 transition hover:text-[#9B2D30]"
                                onClick={() => setMobileOpen(false)}
                              >
                                {cat.label}
                              </Link>
                            ))}
                          </div>
                        )}

                        {link.hasDropdown === 'services' && mobileExpandedDropdown === 'services' && (
                          <div className="bg-gray-50 px-5 pb-2 pt-1">
                            {services.map((svc) => (
                              <Link
                                key={svc.id}
                                to={`/services/${svc.slug}`}
                                className="block py-1.5 text-xs font-medium text-gray-600 transition hover:text-[#9B2D30]"
                                onClick={() => setMobileOpen(false)}
                              >
                                {svc.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={link.href}
                        className={cn(
                          'block px-4 py-3 text-sm font-medium transition hover:bg-gray-50',
                          isActive(link.href) ? 'text-[#9B2D30]' : 'text-gray-800'
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                    {index < NAV_LINKS.length - 1 && (
                      <div className="mx-4 border-b border-gray-100" />
                    )}
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}