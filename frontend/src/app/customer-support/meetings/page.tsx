'use client';

import { Card } from '@/components/UI/Card';

export default function SupportMeetingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Support Meetings</h1>
        <p className="text-gray-600 mt-2">
          Support team meetings
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Support Meetings will be displayed here</p>
      </Card>
    </div>
  );
}
