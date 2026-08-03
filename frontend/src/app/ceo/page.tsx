'use client';

import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/UI/Card';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { useDashboard } from '@/hooks/useDashboard';
import Link from 'next/link';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Briefcase,
  FileText
} from 'lucide-react';

export default function CEODashboard() {
  const user = useAuthStore((state) => state.user);
  const { data: dashboardData, isLoading, isError } = useDashboard();

  const defaultStats = [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-white',
    },
    {
      title: 'Active Employees',
      value: '124',
      change: '+8',
      trend: 'up',
      icon: Users,
      color: 'bg-white',
    },
    {
      title: 'Active Projects',
      value: '32',
      change: '+4',
      trend: 'up',
      icon: Briefcase,
      color: 'bg-white',
    },
    {
      title: 'Growth Rate',
      value: '18.7%',
      change: '+2.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-white',
    },
  ];

  const stats = dashboardData?.stats || defaultStats;

  const defaultRecentActivities = [
    {
      id: 1,
      type: 'success',
      title: 'Q4 Financial Report Completed',
      description: 'Finance team submitted quarterly report',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Budget Approval Pending',
      description: 'Marketing budget awaiting your approval',
      time: '4 hours ago',
    },
    {
      id: 3,
      type: 'info',
      title: 'New Employee Onboarded',
      description: 'Sarah Johnson joined as Senior Developer',
      time: '1 day ago',
    },
    {
      id: 4,
      type: 'success',
      title: 'Project Milestone Reached',
      description: 'Mobile app v2.0 launched successfully',
      time: '2 days ago',
    },
  ];

  const recentActivities = dashboardData?.recentActivities || defaultRecentActivities;

  const defaultUpcomingMeetings = [
    { id: 1, title: 'Board Meeting', time: 'Today, 2:00 PM', attendees: 8 },
    { id: 2, title: 'Strategy Review', time: 'Tomorrow, 10:00 AM', attendees: 12 },
    { id: 3, title: 'Investor Call', time: 'Friday, 3:00 PM', attendees: 5 },
  ];

  const upcomingMeetings = dashboardData?.upcomingMeetings || defaultUpcomingMeetings;

  const defaultDepartmentMetrics = [
    { name: 'Engineering', progress: 85, status: 'On Track' },
    { name: 'Sales', progress: 92, status: 'Ahead' },
    { name: 'Marketing', progress: 78, status: 'On Track' },
    { name: 'Operations', progress: 65, status: 'Needs Attention' },
  ];

  const departmentMetrics = dashboardData?.departmentMetrics || defaultDepartmentMetrics;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-white" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      case 'info':
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.firstName || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-400 mt-2">
          Here&apos;s what&apos;s happening with your company today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any, idx: number) => {
          const Icon = stat.icon || defaultStats[idx].icon;
          return (
            <Card key={stat.title || idx} className="p-6 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <div className="flex items-end gap-2 mt-2">
                    <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUp className="h-4 w-4 text-white" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-white' : 'text-gray-400'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <Icon className="h-5 w-5 text-black" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
              <p className="text-sm text-gray-400">Monthly revenue trend</p>
            </div>
            <Link href="/ceo/analytics/revenue" className="px-4 py-2 text-sm border border-gray-700 text-gray-300 rounded-lg hover:bg-[#1a1a1a]">
              View Report
            </Link>
          </div>
          
          <div className="h-64 bg-[#1a1a1a] rounded-lg flex items-center justify-center border border-gray-800">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Revenue analytics chart</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming Meetings</h2>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting: any) => (
              <Link
                key={meeting.id}
                href={`/ceo/meetings/${meeting.id}`}
                className="block p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
              >
                <h3 className="font-medium text-white text-sm">{meeting.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">{meeting.time}</p>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-400">{meeting.attendees}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/ceo/meetings" className="block w-full mt-4 py-2 text-sm text-center text-gray-300 border border-gray-700 rounded-lg hover:bg-[#1a1a1a]">
            View All Meetings
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="h-5 w-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Department Performance</h2>
          </div>
          <div className="space-y-4">
            {departmentMetrics.map((dept: any) => (
              <div key={dept.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{dept.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    dept.status === 'Ahead' 
                      ? 'bg-white text-black'
                      : dept.status === 'On Track'
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {dept.status}
                  </span>
                </div>
                <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      dept.progress >= 80 ? 'bg-white' : 
                      dept.progress >= 60 ? 'bg-gray-400' : 'bg-gray-600'
                    }`}
                    style={{ width: `${dept.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{dept.progress}% Complete</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Recent Activities</h2>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity: any) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/ceo/reports" className="block w-full mt-4 py-2 text-sm text-center text-gray-300 border border-gray-700 rounded-lg hover:bg-[#1a1a1a]">
            View All Activities
          </Link>
        </Card>
      </div>

      <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/ceo/finance" className="p-4 border-2 border-gray-800 rounded-lg hover:border-white hover:bg-[#1a1a1a] transition-all text-center block">
            <DollarSign className="h-5 w-5 mx-auto mb-2 text-gray-400" />
            <span className="text-sm font-medium text-white">Review Finances</span>
          </Link>
          <Link href="/ceo/hr/employees" className="p-4 border-2 border-gray-800 rounded-lg hover:border-white hover:bg-[#1a1a1a] transition-all text-center block">
            <Users className="h-5 w-5 mx-auto mb-2 text-gray-400" />
            <span className="text-sm font-medium text-white">View Team</span>
          </Link>
          <Link href="/ceo/goals" className="p-4 border-2 border-gray-800 rounded-lg hover:border-white hover:bg-[#1a1a1a] transition-all text-center block">
            <Target className="h-5 w-5 mx-auto mb-2 text-gray-400" />
            <span className="text-sm font-medium text-white">Check Goals</span>
          </Link>
          <Link href="/ceo/analytics" className="p-4 border-2 border-gray-800 rounded-lg hover:border-white hover:bg-[#1a1a1a] transition-all text-center block">
            <BarChart3 className="h-5 w-5 mx-auto mb-2 text-gray-400" />
            <span className="text-sm font-medium text-white">Analytics</span>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link href="/ceo/projects" className="block">
          <Card className="p-6 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-all h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg">
                <Briefcase className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Projects</h3>
                <p className="text-xs text-gray-500">{dashboardData?.projectCount || '32'} active projects</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Track progress across all company initiatives</p>
          </Card>
        </Link>

        <Link href="/ceo/crm" className="block">
          <Card className="p-6 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-all h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg">
                <Users className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Sales Pipeline</h3>
                <p className="text-xs text-gray-500">{dashboardData?.dealCount || '47'} active deals</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Monitor CRM contacts, deals and leads</p>
          </Card>
        </Link>

        <Link href="/ceo/documents" className="block">
          <Card className="p-6 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-all h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg">
                <FileText className="h-5 w-5 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Documents</h3>
                <p className="text-xs text-gray-500">{dashboardData?.documentCount || '156'} files</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Access company reports and important files</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
