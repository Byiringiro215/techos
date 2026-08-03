'use client';

import { Card } from '@/components/UI/Card';

export default function FinancialAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Financial Analytics</h1>
        <p className="text-gray-600 mt-2">
          Financial analytics and insights
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Financial Analytics will be displayed here</p>
      </Card>
    </div>
  );
}
