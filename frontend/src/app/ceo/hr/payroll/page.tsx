'use client';

import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/UI/Table';
import {
  DollarSign,
  CreditCard,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';

export default function PayrollPage() {
  const payrollRuns = [
    { id: '1', period: 'September 2024', runDate: '2024-09-30', employees: 124, total: 985400, status: 'paid' },
    { id: '2', period: 'August 2024', runDate: '2024-08-31', employees: 122, total: 968200, status: 'paid' },
    { id: '3', period: 'July 2024', runDate: '2024-07-31', employees: 118, total: 942000, status: 'paid' },
    { id: '4', period: 'October 2024', runDate: '2024-10-31', employees: 126, total: 1012000, status: 'scheduled' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="success">Paid</Badge>;
      case 'scheduled': return <Badge variant="info">Scheduled</Badge>;
      case 'processing': return <Badge variant="warning">Processing</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Payroll</h1>
          <p className="text-gray-400 mt-2">Salary and compensation management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <DollarSign className="h-8 w-8 text-white mb-3" />
          <p className="text-sm text-gray-400">Monthly Payroll</p>
          <p className="text-3xl font-bold text-white mt-1">$985.4K</p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <Users className="h-8 w-8 text-white mb-3" />
          <p className="text-sm text-gray-400">Employees</p>
          <p className="text-3xl font-bold text-white mt-1">124</p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <CreditCard className="h-8 w-8 text-white mb-3" />
          <p className="text-sm text-gray-400">Avg Salary</p>
          <p className="text-3xl font-bold text-white mt-1">$7.9K</p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <TrendingUp className="h-8 w-8 text-green-400 mb-3" />
          <p className="text-sm text-gray-400">YoY Growth</p>
          <p className="text-3xl font-bold text-white mt-1">+8.2%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Upcoming & Recent Runs
          </h2>
          <div className="space-y-4">
            {payrollRuns.map(run => (
              <div key={run.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-white">{run.period}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Run: {new Date(run.runDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {run.employees} employees
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${(run.total / 1000).toFixed(1)}K</p>
                  <div className="mt-1">{getStatusBadge(run.status)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5" /> Payroll Breakdown
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Base Salaries', amount: 825000, pct: 83 },
              { label: 'Bonuses', amount: 68000, pct: 7 },
              { label: 'Benefits', amount: 52400, pct: 5 },
              { label: 'Taxes', amount: 40000, pct: 5 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{item.label}</span>
                  <span className="text-sm text-white font-medium">${(item.amount / 1000).toFixed(1)}K</span>
                </div>
                <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.pct}% of total</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
