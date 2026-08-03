'use client';

import { Card } from '@/components/UI/Card';

export default function EngineeringTeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Engineering Team</h1>
        <p className="text-gray-600 mt-2">
          Engineering team management
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Engineering Team will be displayed here</p>
      </Card>
    </div>
  );
}
