'use client';

import { Card } from '@/components/UI/Card';

export default function DesignTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Design Tasks</h1>
        <p className="text-gray-600 mt-2">
          Your design tasks and assignments
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Design Tasks will be displayed here</p>
      </Card>
    </div>
  );
}
