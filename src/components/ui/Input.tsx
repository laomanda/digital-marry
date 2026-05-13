import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="label-caps text-muted-gray tracking-[0.2em]">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'bg-transparent border-0 border-b border-[rgba(255,255,255,0.15)] text-off-white font-sans text-[16px] py-3 focus:outline-none focus:border-off-white transition-colors placeholder:text-[rgba(138,138,138,0.4)]',
            error && 'border-red-500/60',
            className
          )}
          {...props}
        />
        {error && <p className="font-sans text-[11px] text-red-400 mt-1">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="label-caps text-muted-gray tracking-[0.2em]">
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={cn(
            'bg-transparent border-0 border-b border-[rgba(255,255,255,0.15)] text-off-white font-sans text-[16px] py-3 focus:outline-none focus:border-off-white transition-colors resize-none placeholder:text-[rgba(138,138,138,0.4)]',
            error && 'border-red-500/60',
            className
          )}
          {...props}
        />
        {error && <p className="font-sans text-[11px] text-red-400 mt-1">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
