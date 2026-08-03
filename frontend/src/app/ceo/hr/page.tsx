'use client';

import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { EmptyState } from '@/components/UI/EmptyState';
import { useEmployees, useLeaveRequests, useHrStats } from '@/hooks/useHR';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  CalendarClock,
  TrendingUp,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
  DollarSign
} from 'lucide-react';

export default function HROverviewPage() {
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const { data: leaveRequests, isLoading: leavesLoading } = useLeaveRequests();
  const { data: hrStats, isLoading: statsLoading } = useHrStats();

  const isLoading = employeesLoading || leavesLoading || statsLoading;

  const activeEmployees = employees?.filter(e => e.status === 'active').length || 0;
  const onLeaveEmployees = employees?.filter(e => e.status === 'on_leave').length || 0;
  const pendingLeaves = leaveRequests?.filter(l => l.status === 'pending').length || 0;
  const approvedLeaves = leaveRequests?.filter(l => l.status === 'approved').length || 0;

  const stats = [
    {
      title: 'Total Employees',
      value: hrStats?.totalEmployees || employees?.length || 0,
      change: '+8 this month',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Active Staff',
      value: hrStats?.activeEmployees || activeEmployees,
      change: `${onLeaveEmployees} on leave`,
      trend: 'neutral',
      icon: UserCheck,
    },
    {
      title: 'Pending Requests',
      value: hrStats?.pendingLeaves || pendingLeaves,
      change: 'Requires attention',
      trend: pendingLeaves > 0 ? 'warning' : 'up',
      icon: Clock,
    },
    {
      title: 'Departments',
      value: hrStats?.departmentCount || 6,
      change: 'Across company',
      trend: 'neutral',
      icon: Briefcase,
    },
  ];

  const recentHires = employees
    ?.sort((a, b) => new Date(b.hire_date).getTime() - new Date(a.hire_date).getTime())
    .slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">HR Overview</h1>
          <p className="text-gray-400 mt-2">Human resources dashboard and workforce management</p>
        </div>
        <Link
          href="/ceo/hr/employees"
          className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Manage Employees
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 bg-[#0a0a0a] border border-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                  <p className={`text-sm mt-2 ${
                    stat.trend === 'up' ? 'text-white' : 
                    stat.trend === 'warning' ? 'text-yellow-400' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.trend === 'warning' ? 'bg-yellow-900/30' : 'bg-white'
                }`}>
                  <Icon className={`h-5 w-5 ${stat.trend === 'warning' ? 'text-yellow-400' : 'text-black'}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Recent Hires</h2>
            </div>
            <Link href="/ceo/hr/onboarding" className="text-sm text-gray-400 hover:text-white">
              View All
            </Link>
          </div>
          {recentHires.length === 0 ? (
            <EmptyState
              icon={<UserPlus className="h-12 w-12" />}
              title="No recent hires"
              description="New employees will appear here"
            />
          ) : (
            <div className="space-y-4">
              {recentHires.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black font-semibold text-sm">
                      {emp.user?.first_name?.[0]}{emp.user?.last_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {emp.user?.first_name} {emp.user?.last_name}
                      </p>
                      <p className="text-sm text-gray-400">{emp.position} · {emp.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="success">
                      {emp.status === 'active' ? 'Active' : emp.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Hired {new Date(emp.hire_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <CalendarClock className="h-5 w-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Leave Requests</h2>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 border border-gray-800 rounded-lg bg-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Pending</span>
              </div>
              <Badge variant="warning">{pendingLeaves}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-800 rounded-lg bg-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Approved</span>
              </div>
              <Badge variant="success">{approvedLeaves}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-800 rounded-lg bg-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">Total Requests</span>
              </div>
              <Badge variant="default">{leaveRequests?.length || 0}</Badge>
            </div>
          </div>
          <Link
            href="/ceo/hr/leave-requests"
            className="block w-full py-2 text-center text-sm text-gray-300 border border-gray-700 rounded-lg hover:bg-[#1a1a1a]"
          >
            Review Requests
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/ceo/hr/recruitment" className="block">
          <Card className="p-6 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-all h-full">
            <UserPlus className="h-8 w-8 text-white mb-4" />
            <h3 className="font-semibold text-white mb-2">Recruitment</h3>
            <p className="text-sm text-gray-400">Manage job postings and candidates</p>
          </Card>
        </Link>
        <Link href="/ceo/hr/performance" className="block">
          <Card className="p-6 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-all h-full">
            <TrendingUp className="h-8 w-8 text-white mb-4" />
            <h3 className="font-semibold text-white mb-2">Performance</h3>
            <p className="text-sm text-gray-400">Reviews and performance tracking</p>
          </Card>
        </Link>
        <Link href="/ceo/hr/payroll" className="block">
          <Card className="p-6 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-all h-full">
            <DollarSign className="h-8 w-8 text-white mb-4" />
            <h3 className="font-semibold text-white mb-2">Payroll</h3>
            <p className="text-sm text-gray-400">Salary and compensation management</p>
          </Card>
        </Link>
        <Link href="/ceo/hr/benefits" className="block">
          <Card className="p-6 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-all h-full">
            <CheckCircle className="h-8 w-8 text-white mb-4" />
            <h3 className="font-semibold text-white mb-2">Benefits</h3>
            <p className="text-sm text-gray-400">Employee benefits and perks</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
