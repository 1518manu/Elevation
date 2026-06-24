import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { NAV_LINKS, PRODUCT_CATEGORIES } from '@/lib/constants'
import { useQuoteModal } from './QuoteModal'
import { useServices } from '@/hooks/useServices'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { Button } from '@/components/ui/button'
import logo from "../../assets/images/logo.png"

const ChevronDownIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3 w-3"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const PhoneIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
)

const XIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

const ChevronDownMobileIcon = ({ className }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const PhoneMobileIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState(null)
  const [dropdownTimeout, setDropdownTimeout] = useState(null)
  const location = useLocation()
  const { openModal } = useQuoteModal()
  const { data: services = [] } = useServices()
  const { data: settings } = useSiteSettings()
  const phone = settings?.phones?.[0] || '+91 98765 43210'
  const careersVisible = settings?.careers_visible ?? true
  const popupRef = useRef(null)

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  const visibleNavLinks = NAV_LINKS.filter(link => 
    link.href !== '/careers' || careersVisible
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
    setMobileExpandedDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [mobileOpen])

  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout)
      }
    }
  }, [dropdownTimeout])

  const handleDropdownMouseLeave = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
    }
    setDropdownTimeout(
      setTimeout(() => {
        setOpenDropdown(null)
      }, 300)
    )
  }

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
    }
  }

  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 50) {
        setShowNavbar(true)
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  const toggleMobileDropdown = (key) => {
    setMobileExpandedDropdown((prev) => (prev === key ? null : key))
  }

  const headerAnimation = prefersReducedMotion ? {} : {
    transition: 'all 0.3s ease'
  }

  return (
    <header
      className={cn(
        "fixed left-1/2 z-50 w-[calc(100%-1rem)] max-w-7xl -translate-x-1/2 rounded-2xl bg-white/95 backdrop-blur-md",
        showNavbar ? "top-10 opacity-100" : "-top-32 opacity-0",
        scrolled && "shadow-xl"
      )}
      style={headerAnimation}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-10 lg:px-8">
        <Link to="/" className="flex items-center p-2">
          <img 
            src={logo} 
            alt="Elevation Logo" 
            className="h-14 w-auto" 
            width="56"
            height="56"
            loading="eager"
          />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-5">
          {visibleNavLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => {
                if (link.hasDropdown) {
                  if (dropdownTimeout) clearTimeout(dropdownTimeout)
                  setOpenDropdown(link.hasDropdown)
                }
              }}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <Link
                to={link.href}
                className={cn(
                  'relative px-1 py-0 text-[15px] font-medium leading-none text-gray-700 transition-colors duration-200 hover:text-[#9B2D30]',
                  isActive(link.href) &&
                    'after:absolute after:left-0 after:-bottom-[28px] after:h-[3px] after:w-full after:bg-[#9B2D30] after:content-[""]'
                )}
              >
                <span className="flex items-center gap-1">
                  {link.label}
                  {link.hasDropdown && <ChevronDownIcon />}
                </span>
              </Link>

              {link.hasDropdown === 'products' && openDropdown === 'products' && (
                <div 
                  className="absolute left-0 top-full z-50 mt-3 w-[480px] rounded-xl border border-gray-100 bg-white p-4 shadow-xl"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                  style={{ willChange: 'transform' }}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.value}
                        to={`/products?category=${cat.value}`}
                        className="block rounded-lg p-3 relative group hover:bg-gray-50 transition-colors duration-200"
                      >
                        <p className="text-xs font-semibold text-gray-900 group-hover:text-[#9B2D30] transition-colors">
                          {cat.label}
                        </p>
                        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#9B2D30] group-hover:w-full transition-all duration-200"></span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {link.hasDropdown === 'services' && openDropdown === 'services' && (
                <div 
                  className="absolute left-0 top-full z-50 mt-3 w-72 rounded-xl border border-gray-100 bg-white p-2 shadow-xl"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                  style={{ willChange: 'transform' }}
                >
                  {services.slice(0, 3).map((svc) => (
                    <Link
                      key={svc.id}
                      to={`/services/${svc.slug}`}
                      className="block rounded-lg p-3 relative group hover:bg-gray-50 transition-colors duration-200"
                    >
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-[#9B2D30] transition-colors">
                        {svc.title}
                      </p>
                      <p className="text-xs text-gray-500">{svc.short_description?.slice(0, 60)}</p>
                      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#9B2D30] group-hover:w-full transition-all duration-200"></span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5 p-5">
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center gap-1 text-sm font-medium text-black"
          >
            <PhoneIcon />
            {phone}
          </a>
          <Button
            onClick={openModal}
            className="h-12 rounded-full bg-[#E62B24] px-7 text-base font-semibold text-white hover:bg-[#c9251f]"
          >
            Get Free Quote
          </Button>
        </div>

        <div className="relative flex items-center gap-2 lg:hidden" ref={popupRef}>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center justify-center rounded-full border border-gray-200 p-2 text-black transition hover:bg-gray-100"
            aria-label={`Call ${phone}`}
          >
            <PhoneMobileIcon />
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
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>

          {mobileOpen && (
            <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-64 rounded-2xl border border-gray-100 bg-white shadow-2xl overflow-hidden">
              <div className="absolute -top-[7px] right-4 h-3.5 w-3.5 rotate-45 border-l border-t border-gray-100 bg-white" />

              <nav className="flex flex-col py-2">
                {visibleNavLinks.map((link, index) => (
                  <div key={link.href}>
                    {link.hasDropdown ? (
                      <>
                        <button
                          onClick={() => toggleMobileDropdown(link.hasDropdown)}
                          className={cn(
                            'flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50',
                            isActive(link.href) ? 'text-[#9B2D30]' : 'text-gray-800'
                          )}
                        >
                          {link.label}
                          <ChevronDownMobileIcon
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
                                className="block py-1.5 text-xs font-medium text-gray-600 transition-colors hover:text-[#9B2D30]"
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
                                className="block py-1.5 text-xs font-medium text-gray-600 transition-colors hover:text-[#9B2D30]"
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
                          'block px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50',
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