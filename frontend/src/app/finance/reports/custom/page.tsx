'use client';

import { Card } from '@/components/UI/Card';

export default function CustomReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Custom Reports</h1>
        <p className="text-gray-600 mt-2">
          Custom report builder
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Custom Reports will be displayed here</p>
      </Card>
    </div>
  );
}
