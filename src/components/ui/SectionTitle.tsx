import { cn } from '../../lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  dark?: boolean;
}

export function SectionTitle({ title, subtitle, align = 'center', className, dark = false }: SectionTitleProps) {
  return (
    <div className={cn('flex flex-col gap-3', {
      'items-start text-left': align === 'left',
      'items-center text-center': align === 'center',
      'items-end text-right': align === 'right',
    }, className)} data-animate="title">
      {subtitle && (
        <span className={cn('label-caps text-taupe', {
          'text-terracotta': !dark,
        })}>
          {subtitle}
        </span>
      )}
      <h2 
        className={cn('font-script text-section-title leading-none', {
          'text-white': dark,
          'text-black': !dark,
        })}
        style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400 }}
      >
        {title}
      </h2>
    </div>
  );
}
