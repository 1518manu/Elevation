/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // Admin-specific variants with Red·Black·White design system
        'admin-primary': 'bg-[#D42B2B] text-white font-semibold hover:bg-[#B01F1F] shadow-[0_4px_16px_rgba(212,43,43,0.24)] hover:shadow-[0_6px_20px_rgba(212,43,43,0.32)] hover:-translate-y-px active:translate-y-0 transition-all duration-150',
        'admin-secondary': 'bg-white text-[#D42B2B] border-[1.5px] border-[#D42B2B] font-semibold hover:bg-[#F9ECEC]',
        'admin-ghost': 'bg-transparent text-gray-500 border-[1.5px] border-gray-200 hover:bg-[#F7F7F7] hover:text-gray-700 hover:border-gray-300',
        'admin-danger': 'bg-[#D42B2B] text-white font-semibold hover:bg-[#B01F1F]',
        'admin-icon': 'bg-transparent text-gray-500 border-[1.5px] border-gray-200 hover:bg-[#F7F7F7] hover:text-gray-700 hover:border-gray-300 p-2',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        // Admin-specific sizes
        'admin-sm': 'h-8 px-3 py-1.5 text-xs',
        'admin-md': 'h-9 px-4 py-1.5 text-xs',
        'admin-lg': 'h-11 px-6 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
