import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-sans tracking-wide text-taupe uppercase">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'flex min-h-[120px] w-full bg-transparent border-b border-border-gray/50 px-0 py-3 text-sm font-sans placeholder:text-muted-gray focus-visible:outline-none focus-visible:border-taupe disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none',
            error && 'border-red-500 focus-visible:border-red-500',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-sans">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
