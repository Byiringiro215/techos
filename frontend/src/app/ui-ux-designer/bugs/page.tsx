'use client';

import { Card } from '@/components/UI/Card';

export default function UI/UXIssuesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">UI/UX Issues</h1>
        <p className="text-gray-600 mt-2">
          UI/UX bugs and issues
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for UI/UX Issues will be displayed here</p>
      </Card>
    </div>
  );
}
