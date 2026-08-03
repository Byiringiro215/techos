'use client';

import { Card } from '@/components/UI/Card';

export default function CurrentSprintsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Current Sprints</h1>
        <p className="text-gray-600 mt-2">
          Active sprint work
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Current Sprints will be displayed here</p>
      </Card>
    </div>
  );
}
