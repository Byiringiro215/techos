'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      const roleRoutes: Record<string, string> = {
        'ceo': '/ceo',
        'cto': '/cto',
        'finance': '/finance',
        'software_engineer': '/software-engineer',
        'ui_ux_designer': '/ui-ux-designer',
        'customer_support': '/customer-support',
      };
      
      const redirectRoute = roleRoutes[user.role] || '/login';
      router.push(redirectRoute);
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  );
}
