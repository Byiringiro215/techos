'use client';

import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  error?: string;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ className, icon, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'w-full rounded-xl bg-bg-muted px-4 py-3.5 pr-12 text-sm text-ink',
              'placeholder:text-ink-muted border border-transparent',
              'focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/30 focus:bg-surface',
              'transition-shadow',
              error && 'ring-2 ring-danger/40',
              className,
            )}
            {...props}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted">
            {icon}
          </span>
        </div>
        {error && <p className="mt-1.5 text-xs text-danger px-1">{error}</p>}
      </div>
    );
  },
);

AuthField.displayName = 'AuthField';
