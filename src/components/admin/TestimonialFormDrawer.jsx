import { useState, useEffect } from 'react'
import { X, Star, Image as ImageIcon } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial } from '@/hooks/useTestimonials'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/admin/ImageUpload'
import RichEditor from '@/components/admin/RichEditor'
import { useToast } from '@/components/ui/toast'

const emptyTestimonial = {
  name: '',
  company: '',
  role: '',
  rating: 5,
  content: '',
  photo_url: '',
  is_featured: false,
  is_active: true,
  display_order: 0
}

export default function TestimonialFormDrawer({ open, onOpenChange, editId, onSave }) {
  const { data: testimonials } = useTestimonials()
  const createTestimonial = useCreateTestimonial()
  const updateTestimonial = useUpdateTestimonial()
  const { toast } = useToast()
  
  const [form, setForm] = useState(emptyTestimonial)

  useEffect(() => {
    if (editId && testimonials) {
      const testimonial = testimonials.find(t => t.id === editId)
      if (testimonial) {
        setForm(testimonial)
      }
    } else if (open) {
      setForm(emptyTestimonial)
    }
  }, [editId, testimonials, open])

  const handleSave = async () => {
    try {
      if (editId) {
        await updateTestimonial.mutateAsync({ id: editId, ...form })
        toast({ title: 'Testimonial updated successfully' })
      } else {
        await createTestimonial.mutateAsync(form)
        toast({ title: 'Testimonial added successfully' })
      }
      onSave()
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save testimonial',
        variant: 'destructive' 
      })
    }
  }

  const handleRatingChange = (rating) => {
    setForm({ ...form, rating })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl right-0 h-full sm:max-w-[680px] sm:h-auto sm:max-h-[90vh] sm:overflow-y-auto">
        <div className="flex h-full flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
            <h2 className="font-['Syne', 'sans-serif'] text-[20px] font-bold text-[#0E0E0E]">
              {editId ? 'Edit Testimonial' : 'Add Testimonial'}
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
            {/* Photo Upload */}
            <div>
              <Label className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E] mb-3 block">
                Photo
              </Label>
              <ImageUpload 
                bucket={STORAGE_BUCKETS.testimonials}
                value={form.photo_url}
                onChange={(url) => setForm({ ...form, photo_url: url })}
              />
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Information
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-[#D42B2B]">*</span></Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter customer name"
                  className="focus:border-[#D42B2B]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company <span className="text-[#D42B2B]">*</span></Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Enter company name"
                  className="focus:border-[#D42B2B]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role/Position</Label>
                <Input
                  id="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. CEO, Manager, Director"
                  className="focus:border-[#D42B2B]"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <Label className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E] mb-3 block">
                Rating
              </Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= form.rating
                          ? 'fill-amber-500 text-amber-500'
                          : 'fill-gray-300 text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Testimonial Content
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="content">Customer Review</Label>
                <RichEditor
                  content={form.content}
                  onChange={(content) => setForm({ ...form, content })}
                />
              </div>
            </div>

            {/* Visibility Options */}
            <div className="space-y-4">
              <h3 className="font-['Syne', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
                Visibility
              </h3>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Feature this testimonial on homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Visible on website</span>
              </label>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] px-6 py-4">
            <Button variant="admin-ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="admin-primary" onClick={handleSave} className="px-8">
              {editId ? 'Save Changes' : 'Add Testimonial'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}