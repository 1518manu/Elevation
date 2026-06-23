import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Youtube} from 'lucide-react'
import { FOOTER_LINKS, GST_NUMBER, CIN_NUMBER, APP_NAME } from '@/lib/constants'
import { useSiteSettings } from '@/hooks/useSiteSettings'

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
}

export default function Footer() {
  const { data: settings } = useSiteSettings()
  const social = settings?.social_links || {}
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto mt-4 max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

        {/* ── Desktop layout (md+): unchanged 5-col flex row ── */}
        <div className="hidden md:flex md:flex-row md:gap-8">
          {/* Brand */}
          <div className="w-48 shrink-0">
            <div className="mb-4 flex items-center gap-2">
              <span className="font-heading text-xl font-bold">{APP_NAME}</span>
              </div>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-6 w-1 bg-red-600" />
              <p className="text-sm font-semibold text-red-600 tracking-wide">
                {settings?.tagline || 'Rise high with us'}
              </p>
            </div>
                        <div className="flex gap-3">
              {Object.entries(social).map(([key, url]) => {
                const Icon = socialIcons[key]
                if (!Icon || !url) return null
                return (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                    className="rounded-full bg-white/10 p-2 hover:bg-red-600 hover:text-white transition-colors"
                    aria-label={key}>
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="flex flex-1 justify-between">
            <div>
              <h4 className="mb-4 font-heading font-bold text-red-600">Products</h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.products.map((l) => (
                  <li key={l.href}><Link to={l.href} className="text-sm text-gray-300 hover:text-red-600">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-heading font-bold text-red-600">Legal</h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.legal.map((l) => (
                  <li key={l.href}><Link to={l.href} className="text-sm text-gray-300 hover:text-red-600">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-heading font-bold text-red-600">Services</h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.services.map((l) => (
                  <li key={l.href}><Link to={l.href} className="text-sm text-gray-300 hover:text-red-600">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-heading font-bold text-red-600">Company</h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.company.map((l) => (
                  <li key={l.href}><Link to={l.href} className="text-sm text-gray-300 hover:text-red-600">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Mobile layout (< md): flex-based, no grid ── */}
        <div className="md:hidden ">
          {/* Brand row */}
          <div className="mb-4 px-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="font-heading text-xl font-bold">{APP_NAME}</span>
            </div>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-6 w-1 bg-red-600" />
              <p className="text-sm font-semibold text-red-600 tracking-wide">
                {settings?.tagline || 'Rise high with us'}
              </p>
            </div>
            <div className="flex gap-3">
              {Object.entries(social).map(([key, url]) => {
                const Icon = socialIcons[key]
                if (!Icon || !url) return null
                return (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                    className="rounded-full bg-white/10 p-2 hover:bg-red-600 hover:text-white transition-colors"
                    aria-label={key}>
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links row: left = Products + Legal, right = Services + Company */}
          <div className="flex flex-row justify-between p-10">
            {/* Left column */}
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="mb-3 font-heading font-bold text-red-600">Products</h4>
                <ul className="space-y-2">
                  {FOOTER_LINKS.products.map((l) => (
                    <li key={l.href}><Link to={l.href} className="text-sm text-gray-300 hover:text-red-600">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-heading font-bold text-red-600">Legal</h4>
                <ul className="space-y-2">
                  {FOOTER_LINKS.legal.map((l) => (
                    <li key={l.href}><Link to={l.href} className="text-sm text-gray-300 hover:text-red-600">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="mb-3 font-heading font-bold text-red-600">Services</h4>
                <ul className="space-y-2">
                  {FOOTER_LINKS.services.map((l) => (
                    <li key={l.href}><Link to={l.href} className="text-sm text-gray-300 hover:text-red-600">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-heading font-bold text-red-600">Company</h4>
                <ul className="space-y-2">
                  {FOOTER_LINKS.company.map((l) => (
                    <li key={l.href}><Link to={l.href} className="text-sm text-gray-300 hover:text-red-600">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar — unchanged */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-100">© {year} {APP_NAME} </p>
            <p>All rights reserved.</p>
            <div className="flex gap-4 text-xs text-gray-100">
              <span>GST: {GST_NUMBER}</span>
              <span>CIN: {CIN_NUMBER}</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}