import { useState, useEffect } from 'react'
import { X, Phone, MessageSquare, Mail, AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useQuoteInquiries, useUpdateQuoteInquiry } from '@/hooks/useQuoteInquiries'
import { timeAgo } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import StatusBadge from '@/components/admin/StatusBadge'
import { useToast } from '@/components/ui/toast'
import { QUOTE_STATUSES } from '@/lib/constants'

export default function QuoteDetailDrawer({ quoteId, open, onOpenChange }) {
  const { data: quotes } = useQuoteInquiries()
  const updateQuote = useUpdateQuoteInquiry()
  const { toast } = useToast()
  
  const [quote, setQuote] = useState(null)
  const [status, setStatus] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [salesNotes, setSalesNotes] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (quoteId && quotes) {
      const foundQuote = quotes.find(q => q.id === quoteId)
      if (foundQuote) {
        setQuote(foundQuote)
        setStatus(foundQuote.status)
        setAssignedTo(foundQuote.assigned_to || '')
        setSalesNotes(foundQuote.sales_notes || '')
        setIsDirty(false)
      }
    }
  }, [quoteId, quotes])

  const handleSave = async () => {
    try {
      await updateQuote.mutateAsync({
        id: quoteId,
        status,
        assigned_to: assignedTo,
        sales_notes: salesNotes
      })
      toast({ title: 'Inquiry updated successfully' })
      setIsDirty(false)
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to update inquiry',
        variant: 'destructive' 
      })
    }
  }

  const handleCall = () => {
    if (quote?.phone) {
      window.open(`tel:${quote.phone}`, '_blank')
    }
  }

  const handleWhatsApp = () => {
    if (quote?.phone) {
      window.open(`https://wa.me/${quote.phone.replace(/\D/g, '')}`, '_blank')
    }
  }

  const handleEmail = () => {
    if (quote?.email) {
      window.open(`mailto:${quote.email}`, '_blank')
    }
  }

  const generateShortId = (id) => {
    return id?.substring(0, 8).toUpperCase() || 'UNKNOWN'
  }

  if (!quote) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl right-0 h-full sm:max-w-[480px] sm:h-auto sm:max-h-[90vh] sm:overflow-y-auto">
        <div className="flex h-full flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
            <div>
              <h2 className="font-['Syne', 'sans-serif'] text-[18px] font-bold text-[#0E0E0E]">
                Quote Inquiry
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-['JetBrains Mono', 'monospace'] text-[12px] text-gray-500">
                  #{generateShortId(quote.id)}
                </span>
                <span className="text-gray-300">·</span>
                <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">
                  {timeAgo(quote.created_at)}
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
            {/* Contact Info */}
            <div>
              <h3 className="font-['Syne', 'sans-serif'] text-[13px] font-semibold text-[#0E0E0E] mb-3">
                Contact Information
              </h3>
              <div className="bg-[#F7F7F7] rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">Full Name</span>
                  <span className="font-['DM Sans', 'sans-serif'] text-sm font-medium text-[#0E0E0E]">
                    {quote.full_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">Email</span>
                  <a 
                    href={`mailto:${quote.email}`}
                    className="font-['DM Sans', 'sans-serif'] text-sm font-medium text-[#D42B2B] hover:underline"
                  >
                    {quote.email}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">Phone</span>
                  <a 
                    href={`tel:${quote.phone}`}
                    className="font-['DM Sans', 'sans-serif'] text-sm font-medium text-[#D42B2B] hover:underline"
                  >
                    {quote.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className="font-['Syne', 'sans-serif'] text-[13px] font-semibold text-[#0E0E0E] mb-3">
                Project Details
              </h3>
              <div className="bg-[#F7F7F7] rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">City, State</span>
                  <span className="font-['DM Sans', 'sans-serif'] text-sm text-[#0E0E0E]">
                    {quote.city}, {quote.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">Elevator Type</span>
                  <StatusBadge status={quote.elevator_type} />
                </div>
                <div className="flex justify-between">
                  <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">Floors</span>
                  <span className="font-['DM Sans', 'sans-serif'] text-sm text-[#0E0E0E]">
                    {quote.num_floors} floors
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500">Building Type</span>
                  <span className="font-['DM Sans', 'sans-serif'] text-sm text-[#0E0E0E]">
                    {quote.building_type}
                  </span>
                </div>
                {quote.message && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="font-['DM Sans', 'sans-serif'] text-sm text-gray-500 block mb-1">Message</span>
                    <p className="font-['DM Sans', 'sans-serif'] text-sm text-[#0E0E0E]">
                      {quote.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Management */}
            <div>
              <h3 className="font-['Syne', 'sans-serif'] text-[13px] font-semibold text-[#0E0E0E] mb-3">
                Management
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value) => { setStatus(value); setIsDirty(true) }}>
                    <SelectTrigger id="status" className="focus:border-[#D42B2B]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUOTE_STATUSES.map(s => (
                        <SelectItem key={s.value} value={s.value} className="capitalize">
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assigned">Assigned To</Label>
                  <Input
                    id="assigned"
                    value={assignedTo}
                    onChange={(e) => { setAssignedTo(e.target.value); setIsDirty(true) }}
                    placeholder="Enter assigned person name or email"
                    className="focus:border-[#D42B2B]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Sales Notes</Label>
                  <Textarea
                    id="notes"
                    value={salesNotes}
                    onChange={(e) => { setSalesNotes(e.target.value); setIsDirty(true) }}
                    placeholder="Add notes about this inquiry..."
                    rows={4}
                    className="focus:border-[#D42B2B]"
                  />
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

            {/* Quick Actions */}
            <div>
              <h3 className="font-['Syne', 'sans-serif'] text-[13px] font-semibold text-[#0E0E0E] mb-3">
                Quick Actions
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="admin-ghost" 
                  onClick={handleCall}
                  className="flex flex-col items-center gap-1 py-4"
                >
                  <Phone className="h-5 w-5" />
                  <span className="text-xs">Call Now</span>
                </Button>
                <Button 
                  variant="admin-ghost" 
                  onClick={handleWhatsApp}
                  className="flex flex-col items-center gap-1 py-4"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-xs">WhatsApp</span>
                </Button>
                <Button 
                  variant="admin-ghost" 
                  onClick={handleEmail}
                  className="flex flex-col items-center gap-1 py-4"
                >
                  <Mail className="h-5 w-5" />
                  <span className="text-xs">Send Email</span>
                </Button>
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