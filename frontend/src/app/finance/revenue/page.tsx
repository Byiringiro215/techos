'use client';

import { Card } from '@/components/UI/Card';

export default function RevenueTrackingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Revenue Tracking</h1>
        <p className="text-gray-600 mt-2">
          Revenue tracking and analysis
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Revenue Tracking will be displayed here</p>
      </Card>
    </div>
  );
}
