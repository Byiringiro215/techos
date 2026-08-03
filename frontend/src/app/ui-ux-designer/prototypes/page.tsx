'use client';

import { Card } from '@/components/UI/Card';

export default function DesignPrototypesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Design Prototypes</h1>
        <p className="text-gray-600 mt-2">
          Interactive prototypes
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Design Prototypes will be displayed here</p>
      </Card>
    </div>
  );
}
