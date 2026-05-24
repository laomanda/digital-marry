import { cn } from '../../lib/utils';

interface DecorativeLineProps {
  className?: string;
  dark?: boolean;
  vertical?: boolean;
}

export function DecorativeLine({ className, dark = false, vertical = false }: DecorativeLineProps) {
  return (
    <div
      className={cn(
        'opacity-50',
        dark ? 'bg-white/20' : 'bg-burgundy/20',
        vertical ? 'w-[1px] h-full' : 'h-[1px] w-full',
        className
      )}
      data-animate="line"
    />
  );
}
