'use client';

import { Card } from '@/components/UI/Card';

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Expenses</h1>
        <p className="text-gray-600 mt-2">
          Track and manage company expenses
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Expenses will be displayed here</p>
      </Card>
    </div>
  );
}
