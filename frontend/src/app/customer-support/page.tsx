'use client';

import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/UI/Card';
import { Ticket, MessageSquare, Users, TrendingUp } from 'lucide-react';

export default function CustomerSupportDashboard() {
  const user = useAuthStore((state) => state.user);

  const stats = [
    { title: 'Open Tickets', value: '23', change: '5 new today', icon: Ticket },
    { title: 'Active Chats', value: '8', change: '3 waiting', icon: MessageSquare },
    { title: 'Total Customers', value: '1,248', change: '+45 this week', icon: Users },
    { title: 'Satisfaction Rate', value: '94%', change: '+2% from last week', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">
          Welcome back, {user?.firstName || 'Support'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Your customer support dashboard
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
          <h2 className="text-lg font-semibold text-black mb-4">Recent Tickets</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Payment not processing</p>
              <p className="text-sm text-gray-500">High Priority • 30 min ago</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Feature request: Dark mode</p>
              <p className="text-sm text-gray-500">Low Priority • 2 hours ago</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Login issues</p>
              <p className="text-sm text-gray-500">Medium Priority • 5 hours ago</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded">
              Create New Ticket
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded">
              Start Live Chat
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded">
              View Knowledge Base
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
