'use client';

import { Card } from '@/components/UI/Card';

export default function AnnualReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Annual Reports</h1>
        <p className="text-gray-600 mt-2">
          Annual business reports
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Annual Reports will be displayed here</p>
      </Card>
    </div>
  );
}
