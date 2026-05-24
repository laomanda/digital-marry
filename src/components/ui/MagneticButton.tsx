import React, { useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import gsap from 'gsap';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'ghost';
  dark?: boolean;
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className, variant = 'solid', dark = false, ...props }, ref) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const buttonRef = (ref as any) || localRef;

    useEffect(() => {
      const button = buttonRef.current;
      if (!button) return;

      const handleMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = button.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) * 0.3;
        const y = (e.clientY - top - height / 2) * 0.3;

        gsap.to(button, {
          x,
          y,
          duration: 0.8,
          ease: 'power3.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)',
        });
      };

      button.addEventListener('mousemove', handleMouseMove);
      button.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [buttonRef]);

    return (
      <button
        ref={buttonRef}
        className={cn(
          'relative inline-flex items-center justify-center px-8 py-3.5 font-mono text-sm tracking-widest uppercase transition-colors duration-300',
          {
            'bg-burgundy text-white hover:bg-black': variant === 'solid' && !dark,
            'bg-white text-black hover:bg-taupe': variant === 'solid' && dark,
            'border border-burgundy text-burgundy hover:bg-burgundy hover:text-white': variant === 'outline' && !dark,
            'border border-white/30 text-white hover:bg-white hover:text-black hover:border-white': variant === 'outline' && dark,
            'text-burgundy hover:text-black underline-offset-4 hover:underline': variant === 'ghost' && !dark,
            'text-white hover:text-taupe underline-offset-4 hover:underline': variant === 'ghost' && dark,
          },
          className
        )}
        {...props}
      >
        <span>{children}</span>
      </button>
    );
  }
);
MagneticButton.displayName = 'MagneticButton';
