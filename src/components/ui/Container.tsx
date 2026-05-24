import React from 'react';
import { cn } from '../../lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fluid?: boolean;
}

export function Container({ children, className, fluid = false, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto px-6 md:px-10 lg:px-16',
        !fluid && 'max-w-container',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
