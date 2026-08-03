import React from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <div className="flex items-center">
          <input
            type="radio"
            id={radioId}
            className={cn(
              'h-5 w-5 border-2 border-gray-300 rounded-full',
              'focus:ring-2 focus:ring-black focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'checked:bg-black checked:border-black',
              'cursor-pointer',
              error && 'border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {label && (
            <label
              htmlFor={radioId}
              className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

// Radio Group Component
export interface RadioGroupProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({ label, error, children, className }: RadioGroupProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {children}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
