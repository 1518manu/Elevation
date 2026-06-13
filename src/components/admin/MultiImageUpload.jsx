import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getImageUrl } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'

function SortableImage({ id, url, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="relative flex items-center gap-2 rounded-lg border bg-white p-2">
      <button type="button" {...attributes} {...listeners} className="cursor-grab text-gray-400"><GripVertical className="h-4 w-4" /></button>
      <img src={getImageUrl(url, 100)} alt="" className="h-12 w-12 rounded object-cover" />
      <button type="button" onClick={() => onRemove(url)} className="ml-auto text-red-500"><X className="h-4 w-4" /></button>
    </div>
  )
}

export default function MultiImageUpload({ bucket, value = [], onChange, maxImages = 20 }) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleUpload = async (files) => {
    if (value.length + files.length > maxImages) {
      toast({ title: `Maximum ${maxImages} images allowed`, variant: 'destructive' })
      return
    }
    setUploading(true)
    const newUrls = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from(bucket).upload(fileName, file)
      if (error) {
        toast({ title: 'Upload failed', description: error.message, variant: 'destructive' })
        continue
      }
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
      newUrls.push(getImageUrl(publicUrl))
    }

    onChange([...value, ...newUrls])
    setUploading(false)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = value.indexOf(active.id)
      const newIndex = value.indexOf(over.id)
      onChange(arrayMove(value, oldIndex, newIndex))
    }
  }

  const handleRemove = (url) => onChange(value.filter((u) => u !== url))

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {value.map((url) => (
              <SortableImage key={url} id={url} url={url} onRemove={handleRemove} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {value.length < maxImages && (
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="multi-upload"
            onChange={(e) => handleUpload(Array.from(e.target.files))}
          />
          <Button type="button" variant="outline" disabled={uploading} onClick={() => document.getElementById('multi-upload').click()}>
            {uploading ? 'Uploading...' : `Add Images (${value.length}/${maxImages})`}
          </Button>
        </div>
      )}
    </div>
  )
}
