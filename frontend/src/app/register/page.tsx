'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/roles';
import api from '@/lib/api';
import { getRoleRoute } from '@/lib/roleRoutes';
import { buildDemoSession } from '@/lib/demoAuth';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthField } from '@/components/auth/AuthField';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!username.trim()) next.username = 'Username is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    if (!password) next.password = 'Password is required';
    else if (password.length < 8) next.password = 'Minimum 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const parts = username.trim().split(/\s+/);
    const firstName = parts[0] || 'Demo';
    const lastName = parts.slice(1).join(' ') || 'User';
    const role = UserRole.SOFTWARE_ENGINEER;

    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
        role,
      });
      if (response.data.success) {
        const user = response.data.data.user;
        setAuth(user, response.data.data.token);
        toast.success('Account created successfully!');
        router.push(getRoleRoute(user.role));
        return;
      }
      toast.error('Registration failed');
    } catch {
      const session = buildDemoSession(role);
      setAuth(
        {
          ...session.user,
          email,
          firstName,
          lastName,
          name: username.trim(),
        },
        session.token,
      );
      toast.success('Account ready (demo mode)');
      router.push(session.redirectTo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      panelSide="right"
      panel={
        <>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Welcome Back!</h2>
          <p className="mt-3 text-sm text-white/90">Already have an account?</p>
          <Link
            href="/login"
            className="mt-7 inline-flex min-w-[150px] items-center justify-center rounded-xl border-2 border-white px-10 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Login
          </Link>
        </>
      }
      form={
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-center text-3xl font-bold text-ink tracking-tight">Registration</h1>

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
              icon={<Mail className="h-4 w-4" />}
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              error={errors.email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <AuthField
              icon={<Lock className="h-4 w-4" />}
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              error={errors.password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-brand py-3.5 text-sm font-semibold text-white shadow-md shadow-brand/25 transition hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <SocialAuthButtons mode="register" />
        </div>
      }
    />
  );
}
