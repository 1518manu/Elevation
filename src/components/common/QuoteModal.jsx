import { createContext, useContext, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import { QuoteFormSchema } from '@/lib/validators'
import { useCreateQuoteInquiry } from '@/hooks/useQuoteInquiries'
import { ELEVATOR_TYPES, BUILDING_TYPES, WHATSAPP_NUMBER } from '@/lib/constants'

const QuoteModalContext = createContext(null)

export function QuoteModalProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const openModal = useCallback(() => {
    setSubmitted(false)
    setOpen(true)
  }, [])

  const closeModal = useCallback(() => setOpen(false), [])

  return (
    <QuoteModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <QuoteModal open={open} onOpenChange={setOpen} submitted={submitted} setSubmitted={setSubmitted} />
    </QuoteModalContext.Provider>
  )
}

export function useQuoteModal() {
  const ctx = useContext(QuoteModalContext)
  if (!ctx) throw new Error('useQuoteModal must be used within QuoteModalProvider')
  return ctx
}

function QuoteModal({ open, onOpenChange, submitted, setSubmitted }) {
  const { toast } = useToast()
  const createQuote = useCreateQuoteInquiry()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(QuoteFormSchema) })

  const onSubmit = async (data) => {
    try {
      await createQuote.mutateAsync(data)
      setSubmitted(true)
      reset()
      toast({ title: 'Quote request submitted!', description: 'Our team will contact you within 24 hours.' })
    } catch {
      toast({ title: 'Error', description: 'Failed to submit quote request. Please try again.', variant: 'destructive' })
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setSubmitted(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-black">Get Free Quote</DialogTitle>
          <DialogDescription>Fill in your details and our team will contact you within 24 hours.</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-black">Thank you!</h3>
            <p className="mb-6 text-black-600">Our team will contact you within 24 hours.</p>
            <Button asChild className="bg-red-600 text-black hover:bg-red-700">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C+I+submitted+a+quote+request`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" {...register('full_name')} aria-describedby={errors.full_name ? 'full_name-error' : undefined} />
                {errors.full_name && <p id="full_name-error" className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register('email')} aria-describedby={errors.email ? 'email-error' : undefined} />
                {errors.email && <p id="email-error" className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone (+91)</Label>
                <Input id="phone" type="tel" placeholder="7902512987" {...register('phone')} aria-describedby={errors.phone ? 'phone-error' : undefined} />
                {errors.phone && <p id="phone-error" className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} aria-describedby={errors.city ? 'city-error' : undefined} />
                {errors.city && <p id="city-error" className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="elevator_type">Elevator Type</Label>
                <Select value={watch('elevator_type')} onValueChange={(v) => setValue('elevator_type', v)}>
                  <SelectTrigger id="elevator_type"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {ELEVATOR_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.elevator_type && <p className="mt-1 text-xs text-red-500">{errors.elevator_type.message}</p>}
              </div>
              <div>
                <Label htmlFor="num_floors">Number of Floors</Label>
                <Input id="num_floors" type="number" min={2} {...register('num_floors')} aria-describedby={errors.num_floors ? 'num_floors-error' : undefined} />
                {errors.num_floors && <p id="num_floors-error" className="mt-1 text-xs text-red-500">{errors.num_floors.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="building_type">Building Type</Label>
                <Select value={watch('building_type')} onValueChange={(v) => setValue('building_type', v)}>
                  <SelectTrigger id="building_type"><SelectValue placeholder="Select building type" /></SelectTrigger>
                  <SelectContent>
                    {BUILDING_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.building_type && <p className="mt-1 text-xs text-red-500">{errors.building_type.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message">Message / Requirements (optional)</Label>
                <Textarea id="message" rows={3} {...register('message')} />
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 font-bold text-black hover:bg-red-700">
              {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default QuoteModalProvider
