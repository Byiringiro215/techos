'use client';

import { Card } from '@/components/UI/Card';

export default function SupportAIAssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Support AI Assistant</h1>
        <p className="text-gray-600 mt-2">
          AI-powered support assistance
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Support AI Assistant will be displayed here</p>
      </Card>
    </div>
  );
}
