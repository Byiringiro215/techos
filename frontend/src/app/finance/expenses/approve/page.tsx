'use client';

import { Card } from '@/components/UI/Card';

export default function ApproveExpensesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Approve Expenses</h1>
        <p className="text-gray-600 mt-2">
          Review and approve expenses
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Approve Expenses will be displayed here</p>
      </Card>
    </div>
  );
}
