import { ListOrdered, ArrowRight } from 'lucide-react'
import { useProcessSteps, useUpdateProcessStep } from '@/hooks/useProcessSteps'
import { useToast } from '@/components/ui/toast'
import SortableList from '@/components/admin/SortableList'

export default function ProcessStepsAdminPage() {
  const { data: steps = [], isLoading } = useProcessSteps({ is_active: undefined })
  const updateStep = useUpdateProcessStep()
  const { toast } = useToast()

  const handleReorder = async (items) => {
    try {
      for (let i = 0; i < items.length; i++) {
        await updateStep.mutateAsync({ id: items[i].id, step_number: i + 1 })
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

  const renderItem = (step) => (
    <div className="flex items-center gap-4 w-full">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#D42B2B] flex items-center justify-center">
        <span className="text-white font-bold font-['Syne', 'sans-serif']">
          {step.step_number}
        </span>
      </div>
      <div className="flex-1">
        <p className="font-['DM Sans', 'sans-serif'] text-[14px] font-semibold text-[#0E0E0E]">
          {step.title}
        </p>
        <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500 line-clamp-2">
          {step.description}
        </p>
      </div>
      {!step.is_active && (
        <span className="text-xs font-semibold text-gray-400">Hidden</span>
      )}
    </div>
  )

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div>
          <p className="font-['Syne', 'sans-serif'] text-[11px] uppercase tracking-wider text-[#9CA3AF] mb-1">
            CONTENT
          </p>
          <h1 className="font-['Syne', 'sans-serif'] text-[24px] font-bold text-[#0E0E0E] mb-1">
            Process Steps
          </h1>
          <p className="font-['DM Sans', 'sans-serif'] text-[13px] text-gray-500">
            {steps.length} steps · {steps.filter(s => s.is_active).length} visible
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-[#F9ECEC] border border-[#D42B2B20] rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <ListOrdered className="h-5 w-5 text-[#D42B2B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-['DM Sans', 'sans-serif'] text-sm font-medium text-[#0E0E0E] mb-1">
              Drag and drop to reorder process steps
            </p>
            <p className="font-['DM Sans', 'sans-serif'] text-xs text-gray-600">
              The order set here determines how the project process appears on the website. Each step will be automatically numbered.
            </p>
          </div>
        </div>
      </div>

      {/* Sortable Steps List */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading steps...</div>
        ) : steps.length === 0 ? (
          <div className="text-center py-16">
            <ListOrdered className="h-10 w-10 text-[#D42B2B] mx-auto mb-3" />
            <p className="font-['Syne', 'sans-serif'] text-[18px] font-medium text-[#0E0E0E] mb-1">
              No process steps yet
            </p>
            <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
              Process steps are typically set up during installation and edited directly in the database.
            </p>
          </div>
        ) : (
          <SortableList
            items={steps.map((s, i) => ({ ...s, id: s.id || String(i) }))}
            onReorder={handleReorder}
            renderItem={renderItem}
            emptyMessage="Drag and drop to reorder process steps"
          />
        )}
      </div>
    </div>
  )
}