'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/roles';
import { TopBar } from '@/components/Layout/TopBar';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BarChart3, 
  DollarSign, 
  Users, 
  Briefcase,
  FolderKanban,
  Package,
  UserCircle,
  TrendingUp,
  Target,
  Calendar,
  MessageSquare,
  FileText,
  Megaphone,
  Bot,
  Settings,
  Building2
} from 'lucide-react';

export default function CEOLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== UserRole.CEO) {
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
      return;
    }
  }, [user, router]);

  if (!user || user.role !== UserRole.CEO) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/ceo', icon: LayoutDashboard },
    { name: 'Analytics', href: '/ceo/analytics', icon: BarChart3 },
    { name: 'Finance', href: '/ceo/finance', icon: DollarSign },
    { name: 'HR', href: '/ceo/hr', icon: Users },
    { name: 'Operations', href: '/ceo/operations', icon: Building2 },
    { name: 'Projects', href: '/ceo/projects', icon: FolderKanban },
    { name: 'Product', href: '/ceo/product', icon: Package },
    { name: 'CRM', href: '/ceo/crm', icon: UserCircle },
    { name: 'Sales', href: '/ceo/sales', icon: TrendingUp },
    { name: 'Marketing', href: '/ceo/marketing', icon: Megaphone },
    { name: 'Goals', href: '/ceo/goals', icon: Target },
    { name: 'Calendar', href: '/ceo/calendar', icon: Calendar },
    { name: 'Meetings', href: '/ceo/meetings', icon: Users },
    { name: 'Messages', href: '/ceo/messages', icon: MessageSquare },
    { name: 'Documents', href: '/ceo/documents', icon: FileText },
    { name: 'AI Assistant', href: '/ceo/ai', icon: Bot },
    { name: 'Settings', href: '/ceo/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        {/* CEO Sidebar */}
        <aside className="w-64 bg-[#0a0a0a] border-r border-gray-800 h-screen fixed left-0 top-0 overflow-y-auto">
          <div className="p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">TechOS</h1>
              <p className="text-sm text-gray-400">CEO Dashboard</p>
            </div>
            
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white text-black'
                        : 'text-gray-300 hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-4 border-t border-gray-800 pb-4">
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">User</p>
                <p className="text-sm font-medium text-white mt-1">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <TopBar />
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
