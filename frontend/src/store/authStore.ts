import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '@/types/roles';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  name?: string;
  avatar?: string;
  status?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
      isAuthenticated: () => {
        return !!get().token;
      },
      hasRole: (role: UserRole) => {
        return get().user?.role === role;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
