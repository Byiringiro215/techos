'use client';

import { Card } from '@/components/UI/Card';

export default function CRMIntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">CRM Integrations</h1>
        <p className="text-gray-600 mt-2">
          CRM system integrations
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for CRM Integrations will be displayed here</p>
      </Card>
    </div>
  );
}
