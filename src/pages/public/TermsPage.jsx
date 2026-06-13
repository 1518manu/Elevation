import SEOHead from '@/components/common/SEOHead'

export default function TermsPage() {
  return (
    <>
      <SEOHead title="Terms of Service" description="Alfa Elevator terms and conditions of service." noIndex />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 font-heading text-3xl font-bold text-primary">Terms of Service</h1>
        <div className="prose max-w-none space-y-4 text-gray-600">
          <p>Last updated: June 2026</p>
          <p>By accessing and using the Alfa Elevator website, you agree to be bound by these Terms of Service.</p>
          <h2 className="text-xl font-semibold text-primary">Use of Website</h2>
          <p>You may use our website for lawful purposes only. You agree not to use the site in any way that could damage or impair its functionality.</p>
          <h2 className="text-xl font-semibold text-primary">Quotes and Services</h2>
          <p>Quote requests submitted through our website are non-binding until a formal contract is signed. Prices and specifications are subject to site survey and final agreement.</p>
          <h2 className="text-xl font-semibold text-primary">Intellectual Property</h2>
          <p>All content on this website, including text, images, and logos, is the property of Alfa Elevator and protected by applicable copyright laws.</p>
          <h2 className="text-xl font-semibold text-primary">Limitation of Liability</h2>
          <p>Alfa Elevator shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website.</p>
        </div>
      </div>
    </>
  )
}
