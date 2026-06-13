import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const baseUrl = process.env.VITE_APP_URL || 'https://alfaelevator.in'

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'monthly' },
  { loc: '/about', priority: '1.0', changefreq: 'monthly' },
  { loc: '/products', priority: '0.9', changefreq: 'weekly' },
  { loc: '/services', priority: '0.9', changefreq: 'weekly' },
  { loc: '/projects', priority: '0.8', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
  { loc: '/careers', priority: '0.7', changefreq: 'weekly' },
  { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
]

async function generateSitemap() {
  const urls = [...staticPages]
  const now = new Date().toISOString().split('T')[0]

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: products } = await supabase.from('products').select('slug, updated_at').eq('is_active', true)
    products?.forEach((p) => urls.push({ loc: `/products/${p.slug}`, priority: '0.9', changefreq: 'weekly', lastmod: p.updated_at?.split('T')[0] }))

    const { data: services } = await supabase.from('services').select('slug, updated_at').eq('is_active', true)
    services?.forEach((s) => urls.push({ loc: `/services/${s.slug}`, priority: '0.8', changefreq: 'weekly', lastmod: s.updated_at?.split('T')[0] }))

    const { data: projects } = await supabase.from('projects').select('slug, updated_at').eq('is_active', true)
    projects?.forEach((p) => urls.push({ loc: `/projects/${p.slug}`, priority: '0.8', changefreq: 'weekly', lastmod: p.updated_at?.split('T')[0] }))

    const { data: blogs } = await supabase.from('blogs').select('slug, updated_at').eq('is_published', true)
    blogs?.forEach((b) => urls.push({ loc: `/blog/${b.slug}`, priority: '0.8', changefreq: 'weekly', lastmod: b.updated_at?.split('T')[0] }))
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${u.lastmod || now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  writeFileSync('public/sitemap.xml', xml)
  console.log(`Sitemap generated with ${urls.length} URLs`)
}

generateSitemap()
