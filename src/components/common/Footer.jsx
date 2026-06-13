import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Youtube, ArrowUpFromLine } from 'lucide-react'
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
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <ArrowUpFromLine className="h-8 w-8 text-red-600" />
              <span className="font-heading text-xl font-bold">{APP_NAME}</span>
            </div>
            <p className="mb-4 text-sm text-gray-300">{settings?.tagline || ' Rise high with us'}</p>
            <div className="flex gap-3">
              {Object.entries(social).map(([key, url]) => {
                const Icon = socialIcons[key]
                if (!Icon || !url) return null
                return (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-red-600 hover:text-white transition-colors" aria-label={key}>
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-heading font-semibold text-red-600">Products</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.products.map((l) => (
                <li key={l.href}><Link to={l.href} className="text-sm text-gray-300 hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading font-semibold text-red-600">Services</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.services.map((l) => (
                <li key={l.href}><Link to={l.href} className="text-sm text-gray-300 hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading font-semibold text-red-600">Company</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((l) => (
                <li key={l.href}><Link to={l.href} className="text-sm text-gray-300 hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading font-semibold text-red-600">Legal</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((l) => (
                <li key={l.href}><Link to={l.href} className="text-sm text-gray-300 hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">© {year} {APP_NAME}. All rights reserved.</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>GST: {GST_NUMBER}</span>
              <span>CIN: {CIN_NUMBER}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
