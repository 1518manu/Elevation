import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, loading }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-start gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-[#F9ECEC] flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-[#D42B2B]" />
            </div>
            <div className="flex-1">
              <DialogTitle className="font-['Syne', 'sans-serif'] text-[18px] font-bold text-[#0E0E0E]">
                {title || 'Are you sure?'}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="font-['DM Sans', 'sans-serif'] text-sm text-gray-600">
            {description || 'This action cannot be undone.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3">
          <Button 
            variant="admin-ghost" 
            onClick={() => onOpenChange(false)} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="admin-primary" 
            onClick={onConfirm} 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}