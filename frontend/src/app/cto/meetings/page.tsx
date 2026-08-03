'use client';

import { Card } from '@/components/UI/Card';

export default function TechMeetingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Tech Meetings</h1>
        <p className="text-gray-600 mt-2">
          Technology team meetings
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Tech Meetings will be displayed here</p>
      </Card>
    </div>
  );
}
