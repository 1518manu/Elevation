import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useJobs, useCreateJob, useUpdateJob } from '@/hooks/useJobs'
import { JOB_DEPARTMENTS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import RichEditor from '@/components/admin/RichEditor'
import { useToast } from '@/components/ui/toast'

const emptyJob = {
  title: '',
  department: 'technical',
  location: '',
  job_type: 'full_time',
  experience_required: '',
  salary_range: '',
  application_deadline: '',
  description: '',
  requirements: [],
  responsibilities: [],
  is_active: true
}

export default function JobFormDrawer({ open, onOpenChange, editId, onSave }) {
  const { data: jobs } = useJobs()
  const createJob = useCreateJob()
  const updateJob = useUpdateJob()
  const { toast } = useToast()
  
  const [form, setForm] = useState(emptyJob)
  const [requirementInput, setRequirementInput] = useState('')
  const [responsibilityInput, setResponsibilityInput] = useState('')

  useEffect(() => {
    if (editId && jobs) {
      const job = jobs.find(j => j.id === editId)
      if (job) {
        setForm({
          ...job,
          requirements: job.requirements || [],
          responsibilities: job.responsibilities || []
        })
      }
    } else if (open) {
      setForm(emptyJob)
    }
  }, [editId, jobs, open])

  const handleSave = async () => {
    try {
      if (editId) {
        await updateJob.mutateAsync({ id: editId, ...form })
        toast({ title: 'Job opening updated successfully' })
      } else {
        await createJob.mutateAsync(form)
        toast({ title: 'Job opening created successfully' })
      }
      onSave()
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save job opening',
        variant: 'destructive' 
      })
    }
  }

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setForm({ ...form, requirements: [...form.requirements, requirementInput.trim()] })
      setRequirementInput('')
    }
  }

  const removeRequirement = (index) => {
    setForm({ ...form, requirements: form.requirements.filter((_, i) => i !== index) })
  }

  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      setForm({ ...form, responsibilities: [...form.responsibilities, responsibilityInput.trim()] })
      setResponsibilityInput('')
    }
  }

  const removeResponsibility = (index) => {
    setForm({ ...form, responsibilities: form.responsibilities.filter((_, i) => i !== index) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl right-0 h-full sm:max-w-[680px] sm:h-auto sm:max-h-[90vh] sm:overflow-y-auto">
        <div className="flex h-full flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
            <h2 className="font-['Syne', 'sans-serif'] text-[20px] font-bold text-[#0E0E0E]">
              {editId ? 'Edit Job Opening' : 'Post Job Opening'}
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* SECTION 1: Position */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Position
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Job Title <span className="text-[#D42B2B]">*</span></Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter job title"
                  className="focus:border-[#D42B2B]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department <span className="text-[#D42B2B]">*</span></Label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                  <SelectTrigger id="department" className="focus:border-[#D42B2B]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_DEPARTMENTS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location <span className="text-[#D42B2B]">*</span></Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Bengaluru, Remote"
                  className="focus:border-[#D42B2B]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_type">Job Type <span className="text-[#D42B2B]">*</span></Label>
                <Select value={form.job_type} onValueChange={(v) => setForm({ ...form, job_type: v })}>
                  <SelectTrigger id="job_type" className="focus:border-[#D42B2B]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SECTION 2: Compensation & Timeline */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Compensation & Timeline
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Required</Label>
                <Input
                  id="experience"
                  value={form.experience_required}
                  onChange={(e) => setForm({ ...form, experience_required: e.target.value })}
                  placeholder="e.g. 2-4 years"
                  className="focus:border-[#D42B2B]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  value={form.salary_range}
                  onChange={(e) => setForm({ ...form, salary_range: e.target.value })}
                  placeholder="e.g. ₹4L – ₹6L"
                  className="focus:border-[#D42B2B]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={form.application_deadline}
                  onChange={(e) => setForm({ ...form, application_deadline: e.target.value })}
                  className="focus:border-[#D42B2B]"
                />
              </div>
            </div>

            {/* SECTION 3: Job Content */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Job Content
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <RichEditor
                  content={form.description}
                  onChange={(content) => setForm({ ...form, description: content })}
                />
              </div>

              <div className="space-y-2">
                <Label>Requirements</Label>
                <div className="flex gap-2">
                  <Input
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="Add requirement and press Enter"
                    onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                    className="flex-1 focus:border-[#D42B2B]"
                  />
                  <Button type="button" onClick={addRequirement} variant="admin-primary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.requirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg px-3 py-1"
                    >
                      <span className="text-sm">• {req}</span>
                      <button
                        onClick={() => removeRequirement(index)}
                        className="text-[#D42B2B] hover:text-[#B01F1F]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Responsibilities</Label>
                <div className="flex gap-2">
                  <Input
                    value={responsibilityInput}
                    onChange={(e) => setResponsibilityInput(e.target.value)}
                    placeholder="Add responsibility and press Enter"
                    onKeyPress={(e) => e.key === 'Enter' && addResponsibility()}
                    className="flex-1 focus:border-[#D42B2B]"
                  />
                  <Button type="button" onClick={addResponsibility} variant="admin-primary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.responsibilities.map((resp, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg px-3 py-1"
                    >
                      <span className="text-sm">• {resp}</span>
                      <button
                        onClick={() => removeResponsibility(index)}
                        className="text-[#D42B2B] hover:text-[#B01F1F]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 4: Visibility */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Visibility
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Active job opening</span>
              </label>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] px-6 py-4">
            <Button variant="admin-ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="admin-primary" onClick={handleSave} className="px-8">
              {editId ? 'Save Changes' : 'Post Job'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}