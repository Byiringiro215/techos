'use client';

import { Card } from '@/components/UI/Card';

export default function TypographyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Typography</h1>
        <p className="text-gray-600 mt-2">
          Typography system
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Typography will be displayed here</p>
      </Card>
    </div>
  );
}
