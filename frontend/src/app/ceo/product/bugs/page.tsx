'use client';

import { Card } from '@/components/UI/Card';

export default function BugsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Bugs</h1>
        <p className="text-gray-600 mt-2">
          Bug tracking and management
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Bugs will be displayed here</p>
      </Card>
    </div>
  );
}
