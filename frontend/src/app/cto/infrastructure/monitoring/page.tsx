'use client';

import { Card } from '@/components/UI/Card';

export default function SystemMonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">System Monitoring</h1>
        <p className="text-gray-600 mt-2">
          System monitoring and health
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for System Monitoring will be displayed here</p>
      </Card>
    </div>
  );
}
