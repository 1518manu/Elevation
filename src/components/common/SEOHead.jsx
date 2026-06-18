import { Helmet } from 'react-helmet-async'
import { DEFAULT_OG_IMAGE, APP_URL } from '@/lib/constants'

export default function SEOHead({
  title,
  description,
  image,
  url,
  type = 'website',
  noIndex = false,
  jsonLd,
}) {
  const fullTitle = title ? `${title} | AlfaFuji Elevator India Pvt Ltd.` : 'Rise high with us.'
  const ogImage = image || `${APP_URL}${DEFAULT_OG_IMAGE}`
  const canonical = url || APP_URL

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title || 'Alfa Elevator India'} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || 'Alfa Elevator India'} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
