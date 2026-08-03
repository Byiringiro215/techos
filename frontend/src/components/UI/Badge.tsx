import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border-gray-700',
    success: 'bg-green-900/30 text-green-400 border-green-800',
    error: 'bg-red-900/30 text-red-400 border-red-800',
    warning: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    info: 'bg-blue-900/30 text-blue-400 border-blue-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={cn(
      'inline-flex items-center font-medium border rounded',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
}
