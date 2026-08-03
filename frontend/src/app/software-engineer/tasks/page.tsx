'use client';

import { Card } from '@/components/UI/Card';

export default function MyTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">My Tasks</h1>
        <p className="text-gray-600 mt-2">
          Your assigned development tasks
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for My Tasks will be displayed here</p>
      </Card>
    </div>
  );
}
