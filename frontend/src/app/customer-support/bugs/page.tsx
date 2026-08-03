'use client';

import { Card } from '@/components/UI/Card';

export default function Customer-ReportedBugsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Customer-Reported Bugs</h1>
        <p className="text-gray-600 mt-2">
          Bugs reported by customers
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Customer-Reported Bugs will be displayed here</p>
      </Card>
    </div>
  );
}
