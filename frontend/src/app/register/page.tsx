'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/roles';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: UserRole.SOFTWARE_ENGINEER as UserRole,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      
      if (response.data.success) {
        const user = response.data.data.user;
        setAuth(user, response.data.data.token);
        toast.success('Account created successfully!');
        
        // Redirect based on user role
        const roleRoutes: Record<string, string> = {
          'ceo': '/ceo',
          'cto': '/cto',
          'finance': '/finance',
          'software_engineer': '/software-engineer',
          'ui_ux_designer': '/ui-ux-designer',
          'customer_support': '/customer-support',
        };
        
        const redirectRoute = roleRoutes[user.role] || '/';
        router.push(redirectRoute);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Role options with descriptions
  const roleOptions = [
    { value: UserRole.CEO, label: 'CEO', description: 'Chief Executive Officer' },
    { value: UserRole.CTO, label: 'CTO', description: 'Chief Technology Officer' },
    { value: UserRole.FINANCE, label: 'Finance', description: 'Financial & Revenue Management' },
    { value: UserRole.SOFTWARE_ENGINEER, label: 'Software Engineer', description: 'Develop and maintain code' },
    { value: UserRole.UI_UX_DESIGNER, label: 'UI/UX Designer', description: 'Design user interfaces' },
    { value: UserRole.CUSTOMER_SUPPORT, label: 'Customer Support', description: 'Support customers' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h1 className="text-4xl font-bold text-center text-black">TechOS</h1>
          <p className="mt-2 text-center text-gray-600">
            The Operating System for Software Companies
          </p>
          <h2 className="mt-6 text-2xl font-bold text-center text-black">
            Create your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-black">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-black">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-black">
                Your Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-black focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Select the role that best matches your position
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-sm text-black hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
