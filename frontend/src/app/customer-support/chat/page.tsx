'use client';

import { Card } from '@/components/UI/Card';

export default function LiveChatSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Live Chat Support</h1>
        <p className="text-gray-600 mt-2">
          Live customer chat support
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Live Chat Support will be displayed here</p>
      </Card>
    </div>
  );
}
