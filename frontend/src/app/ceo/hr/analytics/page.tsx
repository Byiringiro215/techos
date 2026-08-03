'use client';

import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { useHrStats, useEmployees, useDepartments, useLeaveRequests } from '@/hooks/useHR';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import {
  BarChart3,
  Users,
  UserPlus,
  UserMinus,
  TrendingUp,
  CalendarClock,
  PieChart,
  Clock,
  Building
} from 'lucide-react';

export default function HRAnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useHrStats();
  const { data: employees, isLoading: empLoading } = useEmployees();
  const { data: departments, isLoading: deptLoading } = useDepartments();
  const { data: leaves, isLoading: leaveLoading } = useLeaveRequests();

  const isLoading = statsLoading || empLoading || deptLoading || leaveLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const headcountByDept: Record<string, number> = {};
  employees?.forEach(emp => {
    headcountByDept[emp.department] = (headcountByDept[emp.department] || 0) + 1;
  });

  const deptData = Object.entries(headcountByDept).map(([name, count]) => ({
    name,
    count,
    pct: Math.round((count / (employees?.length || 1)) * 100)
  }));

  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(e => e.status === 'active').length || 0;
  const leaveTaken = leaves?.filter(l => l.status === 'approved').length || 0;
  const pendingLeaves = leaves?.filter(l => l.status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">HR Analytics</h1>
        <p className="text-gray-400 mt-2">Workforce metrics, headcount, and HR performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <Users className="h-8 w-8 text-white mb-3" />
          <p className="text-sm text-gray-400">Total Headcount</p>
          <p className="text-3xl font-bold text-white mt-1">{totalEmployees}</p>
          <p className="text-sm text-white mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +8 this month
          </p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <UserPlus className="h-8 w-8 text-green-400 mb-3" />
          <p className="text-sm text-gray-400">Hires YTD</p>
          <p className="text-3xl font-bold text-white mt-1">24</p>
          <p className="text-sm text-green-400 mt-2">+12% vs target</p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <UserMinus className="h-8 w-8 text-red-400 mb-3" />
          <p className="text-sm text-gray-400">Attrition Rate</p>
          <p className="text-3xl font-bold text-white mt-1">5.2%</p>
          <p className="text-sm text-green-400 mt-2">-0.8% below target</p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <CalendarClock className="h-8 w-8 text-white mb-3" />
          <p className="text-sm text-gray-400">Leaves Approved</p>
          <p className="text-3xl font-bold text-white mt-1">{leaveTaken}</p>
          <p className="text-sm text-gray-500 mt-2">{pendingLeaves} pending review</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Building className="h-5 w-5" /> Headcount by Department
          </h2>
          <div className="space-y-4">
            {deptData.length === 0 ? (
              [
                { name: 'Engineering', count: 42, pct: 34 },
                { name: 'Sales', count: 28, pct: 23 },
                { name: 'Product', count: 18, pct: 15 },
                { name: 'Marketing', count: 15, pct: 12 },
                { name: 'Design', count: 10, pct: 8 },
                { name: 'Operations', count: 11, pct: 9 },
              ].map(dept => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white font-medium">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{dept.count} people</span>
                      <Badge variant="default">{dept.pct}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-white"
                      style={{ width: `${dept.pct}%` }}
                    />
                  </div>
                </div>
              ))
            ) : deptData.map(dept => (
              <div key={dept.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-medium">{dept.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{dept.count} people</span>
                    <Badge variant="default">{dept.pct}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{ width: `${dept.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5" /> Leave Type Breakdown
          </h2>
          <div className="space-y-4">
            {[
              { type: 'Vacation', count: leaves?.filter(l => l.type === 'vacation').length || 18, color: 'bg-white' },
              { type: 'Sick Leave', count: leaves?.filter(l => l.type === 'sick').length || 8, color: 'bg-yellow-500' },
              { type: 'Personal', count: leaves?.filter(l => l.type === 'personal').length || 5, color: 'bg-blue-500' },
              { type: 'Other', count: leaves?.filter(l => l.type === 'other').length || 3, color: 'bg-gray-500' },
            ].map(item => (
              <div key={item.type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">{item.type}</span>
                  <span className="text-sm text-gray-400">{item.count} requests</span>
                </div>
                <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${Math.min((item.count / 34) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Avg per Employee</p>
              <p className="text-xl font-bold text-white mt-1">
                {totalEmployees > 0 ? ((leaveTaken + pendingLeaves) / totalEmployees).toFixed(1) : '0'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Approval Rate</p>
              <p className="text-xl font-bold text-white mt-1">
                {leaveTaken + pendingLeaves > 0 ? Math.round((leaveTaken / (leaveTaken + pendingLeaves)) * 100) : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" /> Workforce Trends
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
            <PieChart className="h-6 w-6 text-white mb-3" />
            <p className="text-sm text-gray-400">Gender Diversity</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">Male</span>
                <span className="text-gray-400">58%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">Female</span>
                <span className="text-gray-400">42%</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-400 mb-3" />
            <p className="text-sm text-gray-400">Internal Promotions</p>
            <p className="text-2xl font-bold text-white mt-2">14</p>
            <p className="text-xs text-gray-500 mt-1">YTD across departments</p>
          </div>
          <div className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
            <Users className="h-6 w-6 text-white mb-3" />
            <p className="text-sm text-gray-400">Avg Tenure</p>
            <p className="text-2xl font-bold text-white mt-2">2.4 yrs</p>
            <p className="text-xs text-gray-500 mt-1">Across all employees</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
