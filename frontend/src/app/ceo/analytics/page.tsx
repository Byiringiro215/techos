'use client';

import { Card } from '@/components/UI/Card';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';

export default function CEOAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Company Analytics</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive company-wide metrics and KPIs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-black">$2.4M</div>
          <p className="text-sm text-green-600 mt-2">+12.5% from last quarter</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Net Profit</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-black">$876K</div>
          <p className="text-sm text-green-600 mt-2">+18.7% margin</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Team Size</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-black">248</div>
          <p className="text-sm text-green-600 mt-2">+8 this month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Projects</h3>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-black">23</div>
          <p className="text-sm text-gray-600 mt-2">5 completed this quarter</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Company Performance</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Performance chart will be displayed here
        </div>
      </Card>
    </div>
  );
}
