'use client';

import { Card } from '@/components/UI/Card';

export default function DevToolIntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Dev Tool Integrations</h1>
        <p className="text-gray-600 mt-2">
          Development tool integrations
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Dev Tool Integrations will be displayed here</p>
      </Card>
    </div>
  );
}
