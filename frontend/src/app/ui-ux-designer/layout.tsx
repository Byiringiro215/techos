'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/roles';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  CheckSquare,
  FolderKanban,
  Sparkles,
  Bug,
  Palette,
  Layers,
  Users,
  FileText,
  Bot,
  Calendar,
  MessageSquare
} from 'lucide-react';

export default function UIUXDesignerLayout({
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

    if (user.role !== UserRole.UI_UX_DESIGNER) {
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

  if (!user || user.role !== UserRole.UI_UX_DESIGNER) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/ui-ux-designer', icon: LayoutDashboard },
    { name: 'Design Tasks', href: '/ui-ux-designer/tasks', icon: CheckSquare },
    { name: 'Projects', href: '/ui-ux-designer/projects', icon: FolderKanban },
    { name: 'Features', href: '/ui-ux-designer/features', icon: Sparkles },
    { name: 'UI/UX Issues', href: '/ui-ux-designer/bugs', icon: Bug },
    { name: 'Design System', href: '/ui-ux-designer/design-system', icon: Palette },
    { name: 'Prototypes', href: '/ui-ux-designer/prototypes', icon: Layers },
    { name: 'User Research', href: '/ui-ux-designer/user-research', icon: Users },
    { name: 'Documentation', href: '/ui-ux-designer/documentation', icon: FileText },
    { name: 'AI Assistant', href: '/ui-ux-designer/ai', icon: Bot },
    { name: 'Calendar', href: '/ui-ux-designer/calendar', icon: Calendar },
    { name: 'Meetings', href: '/ui-ux-designer/meetings', icon: Users },
    { name: 'Messages', href: '/ui-ux-designer/messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto">
          <div className="p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-black">TechOS</h1>
              <p className="text-sm text-gray-600">Design</p>
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
