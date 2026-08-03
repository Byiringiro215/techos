'use client';

import { Bell, Search, LogOut, User, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function TopBar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      'ceo': 'CEO',
      'cto': 'CTO',
      'finance': 'Finance Manager',
      'software_engineer': 'Software Engineer',
      'ui_ux_designer': 'UI/UX Designer',
      'customer_support': 'Customer Support',
    };
    return roleNames[role] || role;
  };

  return (
    <div className="bg-[#0a0a0a] border-b border-gray-800 px-6 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-800 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400">{getRoleName(user?.role || '')}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-800 py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-800">
                    <p className="text-sm font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#252525] flex items-center gap-3">
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#252525] flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  
                  <div className="border-t border-gray-800 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#252525] flex items-center gap-3"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
