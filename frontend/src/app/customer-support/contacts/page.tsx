'use client';

import { Card } from '@/components/UI/Card';

export default function CustomerContactsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Customer Contacts</h1>
        <p className="text-gray-600 mt-2">
          Customer contact management
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Customer Contacts will be displayed here</p>
      </Card>
    </div>
  );
}
