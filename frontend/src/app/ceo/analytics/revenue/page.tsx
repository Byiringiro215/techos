'use client';

import { Card } from '@/components/UI/Card';

export default function RevenueAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Revenue Analytics</h1>
        <p className="text-gray-600 mt-2">
          Detailed revenue metrics and trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
          <div className="text-2xl font-bold text-black">$2.4M</div>
          <p className="text-sm text-green-600 mt-2">+12.5%</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Recurring</h3>
          <div className="text-2xl font-bold text-black">$180K</div>
          <p className="text-sm text-green-600 mt-2">+8.3%</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Average Deal Size</h3>
          <div className="text-2xl font-bold text-black">$15.2K</div>
          <p className="text-sm text-green-600 mt-2">+5.1%</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Revenue Growth</h2>
        <div className="h-80 flex items-center justify-center text-gray-500">
          Revenue growth chart will be displayed here
        </div>
      </Card>
    </div>
  );
}
