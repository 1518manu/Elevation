import { useState, useEffect } from 'react'
import { X, Download, FileText, User, Calendar, Phone, Mail, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useApplications, useUpdateApplication } from '@/hooks/useApplications'
import { useJobs } from '@/hooks/useJobs'
import { timeAgo, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { useAuth } from '@/hooks/useAuth'
import { APPLICATION_STATUSES } from '@/lib/constants'
import { supabase } from '@/lib/supabase'

export default function ApplicationDetailDrawer({ applicationId, open, onOpenChange }) {
  const { data: applications } = useApplications()
  const { data: jobs } = useJobs()
  const updateApplication = useUpdateApplication()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [application, setApplication] = useState(null)
  const [status, setStatus] = useState('')
  const [hrNotes, setHrNotes] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (applicationId && applications) {
      const foundApplication = applications.find(a => a.id === applicationId)
      if (foundApplication) {
        setApplication(foundApplication)
        setStatus(foundApplication.status)
        setHrNotes(foundApplication.hr_notes || '')
        setIsDirty(false)
      }
    }
  }, [applicationId, applications])

  const handleSave = async () => {
    try {
      await updateApplication.mutateAsync({
        id: applicationId,
        status,
        hr_notes: hrNotes,
        reviewed_by: user?.id
      })
      toast({ title: 'Application updated successfully' })
      setIsDirty(false)
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to update application',
        variant: 'destructive' 
      })
    }
  }

  const handleDownloadResume = async () => {
    if (application?.resume_url) {
      try {
        const { data, error } = await supabase.storage
          .from('resumes')
          .createSignedUrl(application.resume_url, { expiresIn: 3600 })
        
        if (error) throw error
        
        window.open(data.signedUrl, '_blank')
      } catch (error) {
        toast({ 
          title: 'Error', 
          description: 'Failed to generate download link',
          variant: 'destructive' 
        })
      }
    }
  }

  const getJobTitle = () => {
    if (application?.job_id && jobs) {
      const job = jobs.find(j => j.id === application.job_id)
      return job?.title || 'Unknown position'
    }
    return application?.jobs?.title || 'Unknown position'
  }

  if (!application) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl right-0 h-full sm:max-w-[480px] sm:h-auto sm:max-h-[90vh] sm:overflow-y-auto">
        <div className="flex h-full flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
            <div>
              <h2 className="font-['Syne', 'sans-serif'] text-[18px] font-bold text-[#0E0E0E]">
                Job Application
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-['JetBrains Mono', 'monospace'] text-[12px] text-gray-500">
                  #{application.id.substring(0, 8).toUpperCase()}
                </span>
                <span className="text-gray-300">·</span>
                <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
                  {timeAgo(application.created_at)}
                </span>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Applicant Info */}
            <div>
              <h3 className="font-['Syne', 'sans-serif'] text-[13px] font-semibold text-[#0E0E0E] mb-3">
                Applicant Information
              </h3>
              <div className="bg-[#F7F7F7] rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[#D42B2B] flex items-center justify-center">
                    <span className="text-white font-bold">
                      {application.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-['DM Sans', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                      {application.full_name}
                    </p>
                    <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
                      {application.email}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-['DM Sans', 'sans-serif'] text-xs text-gray-500">Phone</span>
                    <p className="font-['DM Sans', 'sans-serif'] text-sm text-[#0E0E0E] mt-1">
                      {application.phone || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="font-['DM Sans', 'sans-serif'] text-xs text-gray-500">Applied</span>
                    <p className="font-['DM Sans', 'sans-serif'] text-sm text-[#0E0E0E] mt-1">
                      {formatDate(application.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div>
              <h3 className="font-['Syne', 'sans-serif'] text-[13px] font-semibold text-[#0E0E0E] mb-3">
                Position Applied For
              </h3>
              <div className="bg-[#F7F7F7] rounded-lg p-4">
                <p className="font-['DM Sans', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                  {getJobTitle()}
                </p>
              </div>
            </div>

            {/* Cover Letter */}
            {application.cover_letter && (
              <div>
                <h3 className="font-['Syne', 'sans-serif'] text-[13px] font-semibold text-[#0E0E0E] mb-3">
                  Cover Letter
                </h3>
                <div className="bg-[#F7F7F7] rounded-lg p-4">
                  <p className="font-['DM Sans', 'sans-serif'] text-sm text-[#0E0E0E] whitespace-pre-wrap">
                    {application.cover_letter}
                  </p>
                </div>
              </div>
            )}

            {/* Resume */}
            {application.resume_url && (
              <div>
                <h3 className="font-['Syne', 'sans-serif'] text-[13px] font-semibold text-[#0E0E0E] mb-3">
                  Resume
                </h3>
                <Button 
                  variant="admin-secondary" 
                  onClick={handleDownloadResume}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              </div>
            )}

            {/* HR Management */}
            <div>
              <h3 className="font-['Syne', 'sans-serif'] text-[13px] font-semibold text-[#0E0E0E] mb-3">
                HR Management
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Application Status</Label>
                  <Select value={status} onValueChange={(value) => { setStatus(value); setIsDirty(true) }}>
                    <SelectTrigger id="status" className="focus:border-[#D42B2B]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_STATUSES.map(s => (
                        <SelectItem key={s.value} value={s.value} className="capitalize">
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">HR Notes</Label>
                  <Textarea
                    id="notes"
                    value={hrNotes}
                    onChange={(e) => { setHrNotes(e.target.value); setIsDirty(true) }}
                    placeholder="Add notes about this applicant..."
                    rows={4}
                    className="focus:border-[#D42B2B]"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Reviewed by:</span>
                  <span className="font-medium">
                    {application.reviewed_by ? user?.full_name || 'Unknown' : 'Not reviewed'}
                  </span>
                </div>

                {isDirty && (
                  <Button 
                    variant="admin-primary" 
                    onClick={handleSave} 
                    className="w-full"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] px-6 py-4">
            <Button variant="admin-ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}