import { cn } from '../../lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'label-caps inline-flex items-center justify-center gap-2 tracking-[0.25em] transition-all duration-300 relative overflow-hidden group',
          {
            'bg-off-white text-black hover:bg-white px-8 py-4': variant === 'primary',
            'border border-[rgba(255,255,255,0.2)] text-off-white hover:border-off-white hover:bg-[rgba(255,255,255,0.05)] px-8 py-4':
              variant === 'outline',
            'text-muted-gray hover:text-off-white px-0 py-2': variant === 'ghost',
          },
          {
            'px-5 py-2.5': size === 'sm',
            'px-8 py-4': size === 'md',
            'px-10 py-5 text-[12px]': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
