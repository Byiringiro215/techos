import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <div className="flex items-center">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id={checkboxId}
              className={cn(
                'h-5 w-5 border-2 border-gray-300 rounded',
                'focus:ring-2 focus:ring-black focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'checked:bg-black checked:border-black',
                'appearance-none cursor-pointer',
                error && 'border-red-500',
                className
              )}
              ref={ref}
              {...props}
            />
            <Check 
              className={cn(
                "absolute left-0.5 top-0.5 h-4 w-4 text-white pointer-events-none",
                "opacity-0 peer-checked:opacity-100"
              )} 
            />
          </div>
          {label && (
            <label
              htmlFor={checkboxId}
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

Checkbox.displayName = 'Checkbox';
