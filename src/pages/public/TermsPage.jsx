import SEOHead from '@/components/common/SEOHead'

export default function TermsPage() {
  return (
    <>
      <SEOHead title="Terms of Service" description="ALFAFUJI ELEVATOR INDIA PVT LTD terms and conditions of service." noIndex />
     <section className="bg-black py-12 text-white">
  <div className="mx-auto mt-16 py-4 max-w-7xl px-4 sm:px-6 lg:px-8">
    <nav className="flex items-center gap-1 text-sm text-white/70">
      <a href="/" className="hover:text-white">
        Home
      </a>

      <span>/</span>

      <span className="text-white">
        Terms of Service
      </span>
    </nav>
  </div>
</section>
<section className="py-12 lg:py-16">
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-heading text-3xl font-bold text-gray-900 md:text-4xl"> Terms of Service</h1>
        <div className="prose max-w-none space-y-4 text-gray-600">
          <p>Last updated: June 2026</p>
          <p>By accessing and using the ALFAFUJI ELEVATOR INDIA PVT LTD website, you agree to be bound by these Terms of Service.</p>
          <h2 className="text-xl font-semibold text-black">Use of Website</h2>
          <p>You may use our website for lawful purposes only. You agree not to use the site in any way that could damage or impair its functionality.</p>
          <h2 className="text-xl font-semibold text-black">Quotes and Services</h2>
          <p>Quote requests submitted through our website are non-binding until a formal contract is signed. Prices and specifications are subject to site survey and final agreement.</p>
          <h2 className="text-xl font-semibold text-black">Intellectual Property</h2>
          <p>All content on this website, including text, images, and logos, is the property of ALFAFUJI ELEVATOR INDIA PVT LTD and protected by applicable copyright laws.</p>
          <h2 className="text-xl font-semibold text-black">Limitation of Liability</h2>
          <p>ALFAFUJI ELEVATOR INDIA PVT LTD shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website.</p>
        </div>
      </div>
</section>
    </>
  )
}
