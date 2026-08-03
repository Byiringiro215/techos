'use client';

import { Card } from '@/components/UI/Card';

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Knowledge Base</h1>
        <p className="text-gray-600 mt-2">
          Support articles and documentation
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Knowledge Base will be displayed here</p>
      </Card>
    </div>
  );
}
