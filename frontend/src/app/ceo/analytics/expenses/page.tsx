'use client';

import { Card } from '@/components/UI/Card';

export default function ExpensesAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Expense Analytics</h1>
        <p className="text-gray-600 mt-2">
          Company-wide expense breakdown and trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Expenses</h3>
          <div className="text-2xl font-bold text-black">$1.52M</div>
          <p className="text-sm text-red-600 mt-2">+3.2%</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Operating Costs</h3>
          <div className="text-2xl font-bold text-black">$890K</div>
          <p className="text-sm text-green-600 mt-2">-2.1%</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Payroll</h3>
          <div className="text-2xl font-bold text-black">$630K</div>
          <p className="text-sm text-gray-600 mt-2">Stable</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Expense Breakdown</h2>
        <div className="space-y-4">
          {[
            { category: 'Salaries & Benefits', amount: '$630K', percentage: 41 },
            { category: 'Office & Operations', amount: '$380K', percentage: 25 },
            { category: 'Marketing & Sales', amount: '$280K', percentage: 18 },
            { category: 'Technology & Tools', amount: '$180K', percentage: 12 },
            { category: 'Other', amount: '$50K', percentage: 4 },
          ].map((item) => (
            <div key={item.category}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">{item.category}</span>
                <span className="font-medium text-black">{item.amount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
