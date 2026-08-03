'use client';

import { Card } from '@/components/UI/Card';

export default function UserResearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">User Research</h1>
        <p className="text-gray-600 mt-2">
          User research and insights
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for User Research will be displayed here</p>
      </Card>
    </div>
  );
}
