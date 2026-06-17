/* eslint-disable react-refresh/only-export-components */
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono uppercase tracking-wider',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // Admin-specific status badges
        'admin-new': 'bg-[#EFF6FF] text-[#1D4ED8]',
        'admin-contacted': 'bg-[#FFF7ED] text-[#C2410C]',
        'admin-quoted': 'bg-[#F5F3FF] text-[#6D28D9]',
        'admin-closed': 'bg-[#F0FDF4] text-[#15803D]',
        'admin-lost': 'bg-[#FEF2F2] text-[#B01F1F]',
        'admin-published': 'bg-[#F0FDF4] text-[#15803D]',
        'admin-draft': 'bg-[#F7F7F7] text-gray-600',
        'admin-active': 'bg-[#F0FDF4] text-[#15803D]',
        'admin-inactive': 'bg-[#F7F7F7] text-gray-500',
        'admin-role': 'bg-[#F9ECEC] text-[#B01F1F]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
