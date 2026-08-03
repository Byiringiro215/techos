'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { getRoleRoute } from '@/lib/roleRoutes';
import { DEMO_ACCOUNTS, buildDemoSession } from '@/lib/demoAuth';
import { UserRole } from '@/types/roles';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthField } from '@/components/auth/AuthField';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const enterDemo = (role: UserRole) => {
    const session = buildDemoSession(role);
    setAuth(session.user, session.token);
    toast.success(`Signed in as ${session.user.firstName} (demo)`);
    router.push(session.redirectTo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!username.trim()) next.username = 'Username is required';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    if (Object.keys(next).length) return;

    const email = username.includes('@')
      ? username.trim()
      : `${username.trim().toLowerCase().replace(/\s+/g, '.')}@techos.io`;

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const user = response.data.data.user;
        setAuth(user, response.data.data.token);
        toast.success('Welcome back!');
        router.push(getRoleRoute(user.role));
        return;
      }
      toast.error('Login failed');
    } catch {
      const demo = DEMO_ACCOUNTS.find(
        (a) =>
          a.email.toLowerCase() === email.toLowerCase() ||
          a.email.toLowerCase().startsWith(username.trim().toLowerCase()),
      );
      if (demo) {
        enterDemo(demo.role);
        return;
      }
      toast.error('API unavailable — try a demo role below.');
      setShowDemo(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      panelSide="left"
      panel={
        <>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Hello, Welcome!</h2>
          <p className="mt-3 text-sm text-white/90">Don&apos;t have an account?</p>
          <Link
            href="/register"
            className="mt-7 inline-flex min-w-[150px] items-center justify-center rounded-xl border-2 border-white px-10 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Register
          </Link>
        </>
      }
      form={
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-center text-3xl font-bold text-ink tracking-tight">Login</h1>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
            <AuthField
              icon={<User className="h-4 w-4" />}
              placeholder="Username"
              autoComplete="username"
              value={username}
              error={errors.username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <AuthField
              icon={<Lock className="h-4 w-4" />}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              error={errors.password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-center">
              <button
                type="button"
                onClick={() => toast('Password reset will connect to auth APIs later', { icon: '✉️' })}
                className="text-xs text-ink-muted hover:text-brand transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand py-3.5 text-sm font-semibold text-white shadow-md shadow-brand/25 transition hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <SocialAuthButtons mode="login" />

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowDemo((v) => !v)}
              className="text-xs text-ink-muted hover:text-brand transition-colors"
            >
              {showDemo ? 'Hide demo roles' : 'Continue with demo role'}
            </button>
            {showDemo && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-left">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => enterDemo(account.role)}
                    className="rounded-xl border border-border bg-bg-muted px-3 py-2 hover:border-brand/40 hover:bg-brand-mist transition-colors"
                  >
                    <p className="text-xs font-semibold text-ink">{account.label}</p>
                    <p className="text-[10px] text-ink-muted line-clamp-1">{account.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
