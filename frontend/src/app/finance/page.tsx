'use client';

import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/UI/Card';
import { DollarSign, TrendingUp, CreditCard, PieChart } from 'lucide-react';

export default function FinanceDashboard() {
  const user = useAuthStore((state) => state.user);

  const stats = [
    { title: 'Total Revenue', value: '$2.4M', change: '+12.5%', icon: DollarSign },
    { title: 'Net Profit', value: '$876K', change: '+18.7%', icon: TrendingUp },
    { title: 'Pending Invoices', value: '24', change: '$54.2K', icon: CreditCard },
    { title: 'Expenses', value: '$1.52M', change: '+3.2%', icon: PieChart },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">
          Welcome back, {user?.firstName || 'Finance'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Financial operations dashboard
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
              <p className="text-sm text-green-600 mt-2">{stat.change}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded">
              Review Pending Invoices
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded">
              Approve Expenses
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded">
              View Financial Reports
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="font-medium">Q4 Report Generated</p>
              <p className="text-gray-500">2 hours ago</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">15 Invoices Paid</p>
              <p className="text-gray-500">5 hours ago</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Budget Approved</p>
              <p className="text-gray-500">1 day ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
