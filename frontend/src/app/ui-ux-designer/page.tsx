'use client';

import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/UI/Card';
import { Palette, Figma, Users, FileText } from 'lucide-react';

export default function UIUXDesignerDashboard() {
  const user = useAuthStore((state) => state.user);

  const stats = [
    { title: 'Active Projects', value: '4', change: '2 in review', icon: Figma },
    { title: 'Design Tasks', value: '12', change: '5 completed', icon: Palette },
    { title: 'User Research', value: '3', change: '1 ongoing', icon: Users },
    { title: 'Prototypes', value: '8', change: '2 ready', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">
          Welcome back, {user?.firstName || 'Designer'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Your design dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <Icon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-black">{stat.value}</div>
              <p className="text-sm text-gray-600 mt-2">{stat.change}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Today's Tasks</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Design checkout flow</p>
              <p className="text-sm text-gray-500">In Progress • High Priority</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Update design system</p>
              <p className="text-sm text-gray-500">Todo • Medium</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">User testing session</p>
              <p className="text-sm text-gray-500">Scheduled for 3pm</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="font-medium">Completed dashboard redesign</p>
              <p className="text-gray-500">2 hours ago</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Updated color palette</p>
              <p className="text-gray-500">5 hours ago</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Published prototype v2.0</p>
              <p className="text-gray-500">1 day ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
