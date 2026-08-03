import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({ children, className, hover = false, padding = 'md', onClick }: CardProps) {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-[#0a0a0a] border border-gray-800',
        hover && 'hover:border-white transition-colors cursor-pointer',
        onClick && 'cursor-pointer',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
