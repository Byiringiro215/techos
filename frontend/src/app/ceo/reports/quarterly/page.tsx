'use client';

import { Card } from '@/components/UI/Card';

export default function QuarterlyReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Quarterly Reports</h1>
        <p className="text-gray-600 mt-2">
          Quarterly business reports
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Quarterly Reports will be displayed here</p>
      </Card>
    </div>
  );
}
