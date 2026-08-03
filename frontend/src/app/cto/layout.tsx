'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/roles';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BarChart3, 
  FolderKanban,
  ListTodo,
  CheckSquare,
  Package,
  Users,
  GitPullRequest,
  Boxes,
  FileText,
  Server,
  Bot,
  Calendar,
  MessageSquare,
  Target,
  FileBarChart,
  Settings
} from 'lucide-react';

export default function CTOLayout({
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

    if (user.role !== UserRole.CTO) {
      const roleRoutes: Record<string, string> = {
        'ceo': '/ceo',
        'cto': '/cto',
        'finance': '/finance',
        'software_engineer': '/software-engineer',
        'ui_ux_designer': '/ui-ux-designer',
        'customer_support': '/customer-support',
      };
      router.push(roleRoutes[user.role] || '/login');
      return;
    }
  }, [user, router]);

  if (!user || user.role !== UserRole.CTO) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/cto', icon: LayoutDashboard },
    { name: 'Analytics', href: '/cto/analytics', icon: BarChart3 },
    { name: 'Projects', href: '/cto/projects', icon: FolderKanban },
    { name: 'Sprints', href: '/cto/sprints', icon: ListTodo },
    { name: 'Tasks', href: '/cto/tasks', icon: CheckSquare },
    { name: 'Product', href: '/cto/product', icon: Package },
    { name: 'Team', href: '/cto/team', icon: Users },
    { name: 'Code Reviews', href: '/cto/code-reviews', icon: GitPullRequest },
    { name: 'Architecture', href: '/cto/architecture', icon: Boxes },
    { name: 'Documentation', href: '/cto/documentation', icon: FileText },
    { name: 'Infrastructure', href: '/cto/infrastructure', icon: Server },
    { name: 'AI Assistant', href: '/cto/ai', icon: Bot },
    { name: 'Calendar', href: '/cto/calendar', icon: Calendar },
    { name: 'Meetings', href: '/cto/meetings', icon: Users },
    { name: 'Messages', href: '/cto/messages', icon: MessageSquare },
    { name: 'Goals', href: '/cto/goals', icon: Target },
    { name: 'Reports', href: '/cto/reports', icon: FileBarChart },
    { name: 'Settings', href: '/cto/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto">
          <div className="p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-black">TechOS</h1>
              <p className="text-sm text-gray-600">CTO Dashboard</p>
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
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-4 border-t border-gray-200 pb-4">
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase">User</p>
                <p className="text-sm font-medium text-black mt-1">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
