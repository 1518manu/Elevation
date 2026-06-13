import AdminTopbar from '@/components/admin/AdminTopbar'
import SortableList from '@/components/admin/SortableList'
import { useProcessSteps, useUpdateProcessStep } from '@/hooks/useProcessSteps'

export default function ProcessStepsAdminPage() {
  const { data: steps = [] } = useProcessSteps({ is_active: undefined })
  const updateStep = useUpdateProcessStep()

  return (
    <div>
      <AdminTopbar title="Process Steps" />
      <div className="p-6">
        <SortableList
          items={steps}
          onReorder={async (items) => {
            for (let i = 0; i < items.length; i++) {
              await updateStep.mutateAsync({ id: items[i].id, step_number: i + 1 })
            }
          }}
          renderItem={(step) => (
            <div>
              <p className="font-semibold text-black">{step.step_number}. {step.title}</p>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          )}
        />
      </div>
    </div>
  )
}
