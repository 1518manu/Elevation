import { useState } from 'react'
import { Plus, Star, MoreVertical, Edit, Trash2, Quote } from 'lucide-react'
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '@/hooks/useTestimonials'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import TestimonialFormDrawer from '@/components/admin/TestimonialFormDrawer'
import SortableList from '@/components/admin/SortableList'

export default function TestimonialsAdminPage() {
  const { data: testimonials = [], isLoading } = useTestimonials({ is_active: undefined })
  const createTestimonial = useCreateTestimonial()
  const updateTestimonial = useUpdateTestimonial()
  const deleteTestimonial = useDeleteTestimonial()
  const { toast } = useToast()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const openCreate = () => { setEditId(null); setDrawerOpen(true) }
  const openEdit = (id) => { setEditId(id); setDrawerOpen(true) }

  const handleReorder = async (items) => {
    try {
      for (let i = 0; i < items.length; i++) {
        await updateTestimonial.mutateAsync({ id: items[i].id, display_order: i })
      }
      toast({ title: 'Order updated successfully' })
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to update order',
        variant: 'destructive' 
      })
    }
  }

  const renderStarRating = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'fill-gray-300 text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  const renderItem = (testimonial) => (
    <div className="flex items-center gap-4 w-full">
      <div className="flex-shrink-0">
        {testimonial.photo_url ? (
          <img 
            src={testimonial.photo_url} 
            alt={testimonial.name}
            className="h-12 w-12 rounded-lg object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-[#D42B2B] flex items-center justify-center">
            <Quote className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <p className="font-['DM Sans', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E0E]">
            {testimonial.name}
          </p>
          <span className="text-gray-300">·</span>
          <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
            {testimonial.company}
          </p>
          <span className="text-gray-300">·</span>
          <p className="font-['DM Sans', 'sans-serif] text-sm text-gray-500">
            {testimonial.role}
          </p>
        </div>
        <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-600 line-clamp-2">
          {testimonial.content}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {renderStarRating(testimonial.rating)}
          {(testimonial.is_featured || !testimonial.is_active) && (
            <>
              {testimonial.is_featured && (
                <span className="text-xs font-semibold text-amber-600">★ Featured</span>
              )}
              {!testimonial.is_active && (
                <span className="text-xs font-semibold text-gray-400">Hidden</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-['Syne', 'sans-serif'] text-[11px] uppercase tracking-wider text-[#9CA3AF] mb-1">
              CONTENT
            </p>
            <h1 className="font-['Syne', 'sans-serif'] text-[24px] font-bold text-[#0E0E0E] mb-1">
              Testimonials
            </h1>
            <p className="font-['DM Sans', 'sans-serif'] text-[13px] text-gray-500">
              {testimonials.length} total · {testimonials.filter(t => t.is_active).length} visible
            </p>
          </div>
          <Button variant="admin-primary" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Testimonial
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-[#F9ECEC] border border-[#D42B2B20] rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <Quote className="h-5 w-5 text-[#D42B2B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-['DM Sans', 'sans-serif'] text-sm font-medium text-[#0E0E0E0E] mb-1">
              Drag and drop to reorder testimonials
            </p>
            <p className="font-['DM Sans', 'sans-serif'] text-xs text-gray-600">
              The order set here determines how testimonials appear on the website. Featured testimonials are shown first in the testimonials section.
            </p>
          </div>
        </div>
      </div>

      {/* Sortable Testimonials List */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16">
            <Quote className="h-10 w-10 text-[#D42B2B] mx-auto mb-3" />
            <p className="font-['Syne', 'sans-serif'] text-[18px] font-medium text-[#0E0E0E] mb-1">
              No testimonials yet
            </p>
            <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500 mb-4">
              Add testimonials to showcase customer feedback on your website.
            </p>
            <Button variant="admin-primary" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add First Testimonial
            </Button>
          </div>
        ) : (
          <SortableList
            items={testimonials.map((t, i) => ({ ...t, id: t.id || String(i) }))}
            onReorder={handleReorder}
            renderItem={renderItem}
          />
        )}
      </div>

      <TestimonialFormDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
        editId={editId}
        onSave={() => setDrawerOpen(false)}
      />

      <ConfirmDialog 
        open={!!deleteId} 
        onOpenChange={() => setDeleteId(null)} 
        title="Delete Testimonial"
        description="This action cannot be undone. The testimonial will be permanently removed from the website."
        onConfirm={async () => { 
          await deleteTestimonial.mutateAsync(deleteId); 
          setDeleteId(null); 
          toast({ title: 'Testimonial deleted' }) 
        }} 
      />
    </div>
  )
}