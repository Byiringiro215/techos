'use client';

import { Card } from '@/components/UI/Card';

export default function OperationsAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Operations Analytics</h1>
        <p className="text-gray-600 mt-2">
          Operational metrics and KPIs
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Operations Analytics will be displayed here</p>
      </Card>
    </div>
  );
}
