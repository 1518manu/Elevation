import { useState } from 'react'
import { GripVertical, MoreVertical, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

function SortableItem({ id, children, onEdit, onDelete, onReorder }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-white border border-[#E5E5E5] rounded-lg p-4 mb-2 ${
        isDragging ? 'shadow-lg scale-[1.02] opacity-50' : 'hover:shadow-md'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-400 hover:text-gray-600 transition-colors"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1">
        {children}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onReorder(id, 'up')}
            className="text-gray-400 hover:text-gray-600 p-1"
            disabled
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => onReorder(id, 'down')}
            className="text-gray-400 hover:text-gray-600 p-1"
            disabled
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit && onEdit(id)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-[#D42B2B]"
              onClick={() => onDelete && onDelete(id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default function SortableList({ 
  items, 
  onReorder, 
  renderItem, 
  onEdit, 
  onDelete,
  emptyMessage = "No items to display"
}) {
  const [itemsList, setItemsList] = useState(items)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setItemsList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })

      if (onReorder) {
        const newOrder = arrayMove(itemsList, itemsList.findIndex((item) => item.id === active.id), itemsList.findIndex((item) => item.id === over.id))
        onReorder(newOrder)
      }
    }
  }

  const handleReorder = (id, direction) => {
    const index = itemsList.findIndex((item) => item.id === id)
    if (direction === 'up' && index > 0) {
      const newOrder = arrayMove(itemsList, index, index - 1)
      setItemsList(newOrder)
      if (onReorder) onReorder(newOrder)
    } else if (direction === 'down' && index < itemsList.length - 1) {
      const newOrder = arrayMove(itemsList, index, index + 1)
      setItemsList(newOrder)
      if (onReorder) onReorder(newOrder)
    }
  }

  return (
    <div className="sortable-list">
      {itemsList.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={itemsList} strategy={verticalListSortingStrategy}>
            {itemsList.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                onReorder={handleReorder}
                onEdit={onEdit}
                onDelete={onDelete}
              >
                {renderItem ? renderItem(item) : (
                  <span className="font-['DM Sans', 'sans-serif'] text-sm text-[#0E0E0E]">
                    {item.name || item.title || 'Item'}
                  </span>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}