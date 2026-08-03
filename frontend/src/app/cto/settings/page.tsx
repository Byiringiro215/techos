'use client';

import { Card } from '@/components/UI/Card';

export default function TechSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Tech Settings</h1>
        <p className="text-gray-600 mt-2">
          Technology settings and configuration
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Tech Settings will be displayed here</p>
      </Card>
    </div>
  );
}
