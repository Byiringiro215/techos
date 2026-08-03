'use client';

import { Card } from '@/components/UI/Card';
import { TrendingUp } from 'lucide-react';

export default function GrowthMetricsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Growth Metrics</h1>
        <p className="text-gray-600 mt-2">
          Company growth indicators and projections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Revenue Growth</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-black">24.3%</div>
          <p className="text-sm text-gray-600 mt-2">Year over year</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Customer Growth</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-black">18.7%</div>
          <p className="text-sm text-gray-600 mt-2">Quarter over quarter</p>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Team Growth</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-black">12.5%</div>
          <p className="text-sm text-gray-600 mt-2">This year</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Market Share</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-black">8.2%</div>
          <p className="text-sm text-gray-600 mt-2">Industry position</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Growth Projections</h2>
        <div className="h-80 flex items-center justify-center text-gray-500">
          Growth projection chart will be displayed here
        </div>
      </Card>
    </div>
  );
}
