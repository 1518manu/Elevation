import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Phone, Mail } from 'lucide-react'
import SEOHead from '@/components/common/SEOHead'
import { ContactFormSchema } from '@/lib/validators'
import { useCreateContactInquiry } from '@/hooks/useContactInquiries'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { APP_URL } from '@/lib/constants'

export default function ContactPage() {
  const { toast } = useToast()
  const createContact = useCreateContactInquiry()
  const { data: settings } = useSiteSettings()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(ContactFormSchema) })

  const onSubmit = async (data) => {
    try {
      await createContact.mutateAsync(data)
      reset()
      toast({ title: 'Message sent!', description: 'We will get back to you soon.' })
    } catch {
      toast({ title: 'Error', description: 'Failed to send message.', variant: 'destructive' })
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings?.company_name || 'Alfa Elevator',
    url: APP_URL,
    telephone: settings?.phones?.[0],
  }

  return (
    <>
      <SEOHead title="Contact Us" description="Get in touch with Alfa Elevator for quotes, support, and inquiries." jsonLd={jsonLd} />
      <section className="bg-black py-16 text-white">
        <div className="mx-auto mt-10 max-w-7xl px-4 py-10 md:ml-32 md:mt-12 md:py-4">
          <nav className="mb-4 text-sm text-white/70">Home / Contact</nav>
          <h1 className="font-heading text-4xl font-bold">Contact Us</h1>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 font-heading text-2xl font-semibold text-black">Get In Touch</h2>
              {settings?.phones?.map((p, i) => (
                <p key={i} className="mb-3 flex items-center gap-2 text-gray-600"><Phone className="h-5 w-5 text-red-600" /><a href={`tel:${p}`}>{p}</a></p>
              ))}
              {settings?.emails?.map((e, i) => (
                <p key={i} className="mb-3 flex items-center gap-2 text-gray-600"><Mail className="h-5 w-5 text-red-600" /><a href={`mailto:${e}`}>{e}</a></p>
              ))}
              {settings?.addresses?.map((a, i) => (
                <p key={i} className="mb-3 flex items-start gap-2 text-gray-600"><MapPin className="mt-1 h-5 w-5 text-red-600" />{a.street}, {a.city}, {a.state} - {a.pincode}</p>
              ))}
              {settings?.google_maps_embed && (
                <div className="mt-6 overflow-hidden rounded-xl" dangerouslySetInnerHTML={{ __html: settings.google_maps_embed }} />
              )}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl bg-white p-6 shadow-card">
              <h2 className="mb-4 font-heading text-2xl font-semibold text-black">Send Your Queries</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" {...register('full_name')} />
                  {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" {...register('phone')} />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" {...register('subject')} />
                  {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} {...register('message')} />
                {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 text-black mt-4">{isSubmitting ? 'Sending...' : 'Send Message'}</Button>

              {/* Image Space 16:9 Ratio */}
              <div className="mt-6 w-full aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-md flex items-center justify-center border-2 border-gray-300">
                <div className="text-center">
                  <p className="text-gray-500 font-semibold">Image Space (16:9)</p>
                  <p className="text-gray-400 text-sm">1600 x 900px</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
