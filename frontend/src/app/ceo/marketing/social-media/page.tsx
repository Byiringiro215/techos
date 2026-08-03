'use client';

import { Card } from '@/components/UI/Card';

export default function SocialMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Social Media</h1>
        <p className="text-gray-600 mt-2">
          Social media management
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Social Media will be displayed here</p>
      </Card>
    </div>
  );
}
