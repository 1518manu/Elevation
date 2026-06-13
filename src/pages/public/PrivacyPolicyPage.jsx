import SEOHead from '@/components/common/SEOHead'

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEOHead title="Privacy Policy" description="Alfa Elevator privacy policy and data protection practices." noIndex />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 font-heading text-3xl font-bold text-black">Privacy Policy</h1>
        <div className="prose max-w-none space-y-4 text-gray-600">
          <p>Last updated: June 2026</p>
          <p>Alfa Elevator (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.</p>
          <h2 className="text-xl font-semibold text-black">Information We Collect</h2>
          <p>We collect information you provide directly, such as name, email, phone number, and message content when you submit contact forms, quote requests, or job applications.</p>
          <h2 className="text-xl font-semibold text-black">How We Use Your Information</h2>
          <p>We use your information to respond to inquiries, process quote requests, manage job applications, and improve our services. We do not sell your personal information to third parties.</p>
          <h2 className="text-xl font-semibold text-black">Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or destruction.</p>
          <h2 className="text-xl font-semibold text-black">Contact Us</h2>
          <p>For privacy-related questions, contact us at info@alfaelevator.in</p>
        </div>
      </div>
    </>
  )
}
