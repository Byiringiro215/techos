'use client';

import toast from 'react-hot-toast';

const providers = [
  { id: 'google', label: 'G', aria: 'Google' },
  { id: 'facebook', label: 'f', aria: 'Facebook' },
  {
    id: 'github',
    label: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.22.682-.48 0-.24-.01-.87-.01-1.71-2.782.6-3.369-1.34-3.369-1.34-.454-1.16-1.11-1.47-1.11-1.47-.908-.62.07-.61.07-.61 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.555-1.11-4.555-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.115 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.01 10.01 0 0022 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
    aria: 'GitHub',
  },
  { id: 'linkedin', label: 'in', aria: 'LinkedIn' },
] as const;

interface SocialAuthButtonsProps {
  mode: 'login' | 'register';
}

export function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
  return (
    <div className="mt-6">
      <p className="text-center text-xs text-ink-muted mb-3">
        or {mode === 'login' ? 'login' : 'register'} with social platforms
      </p>
      <div className="flex items-center justify-center gap-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            aria-label={provider.aria}
            onClick={() => toast('Social sign-in coming in a later phase', { icon: '👋' })}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-sm font-semibold text-ink-secondary shadow-sm transition hover:border-brand/40 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {provider.label}
          </button>
        ))}
      </div>
    </div>
  );
}
