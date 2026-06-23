import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, Link } from 'react-router-dom'
import SEOHead from '@/components/common/SEOHead'
import PageLoader from '@/components/common/PageLoader'
import { useJob } from '@/hooks/useJobs'
import { supabase } from '@/lib/supabase'
import { JobApplicationSchema } from '@/lib/validators'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { formatDate as fmtDate } from '@/lib/utils'
import { APP_URL } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

export default function JobDetailPage() {
  const { id } = useParams()
  const { data: job, isLoading } = useJob(id)
  const { toast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(JobApplicationSchema) })

  const onSubmit = async (data) => {
    try {
      const file = data.resume
      const fileName = `${crypto.randomUUID()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, file)
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(fileName)

      const { error } = await supabase.from('applications').insert({
        job_id: id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        cover_letter: data.cover_letter,
        resume_url: publicUrl,
      })
      if (error) throw error
      setSubmitted(true)
      toast({ title: 'Application submitted!', description: 'We will review your application and get back to you.' })
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  }

  if (isLoading) return <PageLoader />
  if (!job) return <div className="py-16 text-center">Job not found</div>

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    datePosted: job.created_at,
    validThrough: job.deadline,
    employmentType: job.job_type?.toUpperCase(),
    hiringOrganization: { '@type': 'Organization', name: 'ALFAFUJI ELEVATOR INDIA PVT LTD' },
  }

  return (
    <>
        <SEOHead
          title={job.title}
          description={job.description?.slice(0, 160)}
          url={`${APP_URL}/careers/${id}`}
          jsonLd={jsonLd}
        />

        {/* Black Breadcrumb Header */}
        <section className="bg-black py-12 text-white">
          <div className="mx-auto mt-16 py-4 max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 text-sm text-white/70">
              <Link to="/" className="hover:text-white">
                Home
              </Link>

              <span>/</span>

              <Link to="/careers" className="hover:text-white">
                Careers
              </Link>

              <span>/</span>

              <span className="text-white">
                {job.title}
              </span>
            </nav>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
          <Badge className="mb-4 capitalize bg-red-600 text-white">
            {job.department}
          </Badge>

          <h1 className="font-heading text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            {job.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            {job.location && (
              <span>{job.location}</span>
            )}

            <span className="capitalize">
              {job.job_type?.replace('_', ' ')}
            </span>

            {job.deadline && (
              <span>
                Apply by: {fmtDate(job.deadline)}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Badge className="mb-3 capitalize">{job.department}</Badge>
            <h1 className="mb-4 font-heading text-3xl font-bold text-black">{job.title}</h1>
            <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
              {job.location && <span>{job.location}</span>}
              <span className="capitalize">{job.job_type?.replace('_', ' ')}</span>
              {job.deadline && <span>Apply by: {fmtDate(job.deadline)}</span>}
            </div>
            <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: job.description || '' }} />
            {job.requirements?.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-black">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">{job.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
            )}
            {job.responsibilities?.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold text-black">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-1">{job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
            )}
          </div>
          <div>
            <div className="sticky top-24 rounded-xl bg-white p-6 shadow-card">
              <h3 className="mb-4 font-heading text-xl font-semibold text-black">Apply Now</h3>
              {submitted ? (
                <p className="text-green-600">Thank you! Your application has been submitted.</p>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register('phone')} />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cover_letter">Cover Letter (optional)</Label>
                    <Textarea id="cover_letter" {...register('cover_letter')} />
                  </div>
                  <div>
                    <Label htmlFor="resume">Resume (PDF/DOCX, max 8MB)</Label>
                    <Input id="resume" type="file" accept=".pdf,.docx" onChange={(e) => setValue('resume', e.target.files[0])} />
                    {errors.resume && <p className="text-xs text-red-500">{errors.resume.message}</p>}
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 text-black">{isSubmitting ? 'Submitting...' : 'Submit Application'}</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
