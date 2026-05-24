import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'none';
  delay?: number;
}

export function Reveal({ children, className, direction = 'up', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={cn('reveal-wrapper', className)} 
      data-animate="section"
      data-direction={direction}
      data-delay={delay}
    >
      <div className={cn(
        'transition-all duration-1000',
        !isVisible && {
          'opacity-0 translate-y-12': direction === 'up',
          'opacity-0 -translate-x-12': direction === 'left',
          'opacity-0 translate-x-12': direction === 'right',
          'opacity-0': direction === 'none',
        },
        isVisible && 'opacity-100 translate-y-0 translate-x-0'
      )}>
        {children}
      </div>
    </div>
  );
}
