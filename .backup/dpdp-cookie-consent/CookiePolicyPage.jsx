import SEOHead from '@/components/common/SEOHead'
import { APP_URL } from '@/lib/constants'

export default function CookiePolicyPage() {
  return (
    <>
      <SEOHead 
        title="Cookie Policy" 
        description="Learn about how AlfaFuji Elevator uses cookies and your rights under the Digital Personal Data Protection Act."
        url={`${APP_URL}/cookie-policy`}
      />
      
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 font-heading text-4xl font-bold text-gray-900">
            Cookie Policy
          </h1>
          
          <div className="space-y-8">
            <section className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">
                Last Updated: June 23, 2026
              </h2>
              <p className="text-gray-600 leading-relaxed">
                This Cookie Policy explains how AlfaFuji Elevator India Pvt Ltd ("we", "us", or "our") 
                uses cookies and similar technologies on our website. This policy is compliant with the 
                Digital Personal Data Protection Act (DPDP) and other applicable data protection laws.
              </p>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">
                What Are Cookies?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                understanding how you use our site.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Under the DPDP, we require your consent before using non-essential cookies. You have 
                the right to accept, reject, or modify your cookie preferences at any time.
              </p>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">
                Types of Cookies We Use
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-600 pl-4">
                  <h3 className="mb-2 font-semibold text-gray-900">Essential Cookies</h3>
                  <p className="text-gray-600 mb-2">
                    These cookies are necessary for the website to function properly. They enable 
                    core functionality such as security, network management, and accessibility. 
                    Without these cookies, the website cannot function properly.
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Examples:</strong> Authentication tokens, session management, security settings
                  </p>
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    These cookies cannot be disabled as they are required for the website to function.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="mb-2 font-semibold text-gray-900">Analytics Cookies</h3>
                  <p className="text-gray-600 mb-2">
                    These cookies help us understand how visitors interact with our website by 
                    collecting and reporting information anonymously. We use this data to improve 
                    our website and services.
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Examples:</strong> Google Analytics, page view tracking, user behavior analysis
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    <strong>Data Retention:</strong> Analytics data is retained for 26 months as per industry standards.
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="mb-2 font-semibold text-gray-900">Functional Cookies</h3>
                  <p className="text-gray-600 mb-2">
                    These cookies enable enhanced functionality and personalization, such as remembering 
                    your language preferences or customized content. They improve your user experience 
                    but are not essential for the website to function.
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Examples:</strong> Language preferences, theme settings, customized content
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="mb-2 font-semibold text-gray-900">Marketing Cookies</h3>
                  <p className="text-gray-600 mb-2">
                    These cookies are used to track visitors across websites to display relevant 
                    advertisements and measure the effectiveness of marketing campaigns. They may 
                    be set by us or our advertising partners.
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Examples:</strong> Ad personalization, conversion tracking, social media integration
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    <strong>Third-Party:</strong> Some marketing cookies may be set by third-party services like Google Ads or Facebook.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">
                Your Rights Under DPDP
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Under the Digital Personal Data Protection Act, you have the following rights regarding cookies:
              </p>
              <ul className="list-disc space-y-2 text-gray-600 pl-6">
                <li><strong>Right to Consent:</strong> You have the right to give, withhold, or withdraw consent for non-essential cookies.</li>
                <li><strong>Right to Information:</strong> You have the right to know what cookies we use and why.</li>
                <li><strong>Right to Withdraw:</strong> You can withdraw your consent at any time through our cookie settings.</li>
                <li><strong>Right to Erasure:</strong> You can request the deletion of your cookie-related data.</li>
                <li><strong>Right to Grievance Redressal:</strong> You can file a complaint if you believe your data rights have been violated.</li>
              </ul>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">
                How We Use Your Cookie Data
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookie data for the following purposes:
              </p>
              <ul className="list-disc space-y-2 text-gray-600 pl-6">
                <li>To improve website performance and user experience</li>
                <li>To analyze website traffic and user behavior</li>
                <li>To personalize content and advertisements</li>
                <li>To ensure website security and prevent fraud</li>
                <li>To remember your preferences and settings</li>
              </ul>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">
                Managing Your Cookie Preferences
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You can manage your cookie preferences in the following ways:
              </p>
              <ul className="list-disc space-y-2 text-gray-600 pl-6">
                <li><strong>Cookie Banner:</strong> Use the cookie consent banner when you first visit our site</li>
                <li><strong>Cookie Settings:</strong> Click "Cookie Settings" in the footer to change your preferences at any time</li>
                <li><strong>Browser Settings:</strong> Configure your browser to block or delete cookies (note: this may affect website functionality)</li>
              </ul>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Your consent preferences are stored for 365 days. After this period, we will request your consent again.
              </p>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">
                Third-Party Cookies
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may allow third-party services to set cookies on your device for analytics and marketing purposes. 
                These third parties include:
              </p>
              <ul className="list-disc space-y-2 text-gray-600 pl-6">
                <li><strong>Google Analytics:</strong> For website analytics and user behavior tracking</li>
                <li><strong>Google Ads:</strong> For advertising and conversion tracking</li>
                <li><strong>Meta (Facebook):</strong> For social media marketing and analytics</li>
              </ul>
              <p className="mt-4 text-gray-600 leading-relaxed">
                These third parties have their own privacy policies and cookie policies. We encourage you to 
                review their policies to understand how they use your data.
              </p>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">
                Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your cookie-related data 
                from unauthorized access, alteration, disclosure, or destruction. This includes using secure cookies 
                with the HttpOnly and Secure attributes where appropriate.
              </p>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">
                Children's Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our website is not intended for children under the age of 18. We do not knowingly collect personal 
                data from children. If you are a parent or guardian and believe your child has provided us with 
                personal data, please contact us, and we will delete such information.
              </p>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">
                Changes to This Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Cookie Policy from time to time. We will notify you of any changes by posting 
                the new policy on this page and updating the "Last Updated" date. We encourage you to review this 
                policy periodically to stay informed about how we use cookies.
              </p>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">
                Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Cookie Policy or our use of cookies, please contact us:
              </p>
              <div className="text-gray-600">
                <p><strong>Email:</strong> privacy@alfaelevator.in</p>
                <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                <p><strong>Address:</strong> [Your Business Address]</p>
              </div>
              <p className="mt-4 text-gray-600 leading-relaxed">
                You also have the right to file a complaint with the Data Protection Board of India if you 
                believe your data protection rights have been violated.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
