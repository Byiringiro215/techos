'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const container = containerRef.current;
    const focusable = container?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusable?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'Tab' && container) {
        const nodes = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (nodes.length === 0) return;

        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="presentation">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-bg-inverse/40 backdrop-blur-[2px] transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          className={cn(
            'relative bg-surface border border-border w-full shadow-lg rounded-2xl',
            sizes[size]
          )}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-border">
              {title && (
                <h2 id="modal-title" className="text-xl font-semibold text-ink">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="text-ink-muted hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 text-ink-secondary">{children}</div>
        </div>
      </div>
    </div>
  );
}
