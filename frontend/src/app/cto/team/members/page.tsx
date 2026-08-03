'use client';

import { Card } from '@/components/UI/Card';

export default function TeamMembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Team Members</h1>
        <p className="text-gray-600 mt-2">
          Engineering team members
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Team Members will be displayed here</p>
      </Card>
    </div>
  );
}
