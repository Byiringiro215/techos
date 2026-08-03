'use client';

import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/UI/Card';
import { Code, GitBranch, Bug, CheckCircle } from 'lucide-react';

export default function SoftwareEngineerDashboard() {
  const user = useAuthStore((state) => state.user);

  const stats = [
    { title: 'Active Tasks', value: '8', change: '3 in progress', icon: CheckCircle },
    { title: 'Code Reviews', value: '5', change: '2 pending', icon: GitBranch },
    { title: 'Bugs Assigned', value: '3', change: '1 critical', icon: Bug },
    { title: 'Commits This Week', value: '24', change: '+8 from last week', icon: Code },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">
          Welcome back, {user?.firstName || 'Engineer'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Your engineering dashboard
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
              <p className="font-medium">Implement user authentication</p>
              <p className="text-sm text-gray-500">In Progress • High Priority</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Fix payment gateway bug</p>
              <p className="text-sm text-gray-500">Todo • Critical</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Code review for PR #234</p>
              <p className="text-sm text-gray-500">Pending Review</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="font-medium">Merged PR #232</p>
              <p className="text-gray-500">2 hours ago</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Fixed bug TECH-145</p>
              <p className="text-gray-500">5 hours ago</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Committed to main branch</p>
              <p className="text-gray-500">1 day ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
