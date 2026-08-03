'use client';

import { Card } from '@/components/UI/Card';

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Security Settings</h1>
        <p className="text-gray-600 mt-2">
          Security and access control
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Security Settings will be displayed here</p>
      </Card>
    </div>
  );
}
