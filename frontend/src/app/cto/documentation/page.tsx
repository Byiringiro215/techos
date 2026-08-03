'use client';

import { Card } from '@/components/UI/Card';

export default function TechnicalDocumentationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Technical Documentation</h1>
        <p className="text-gray-600 mt-2">
          Technical documentation hub
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Technical Documentation will be displayed here</p>
      </Card>
    </div>
  );
}
