'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { useEmployee } from '@/hooks/useHR';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  User,
  Building,
  Hash,
  Edit,
  Trash2,
  FileText
} from 'lucide-react';

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: employee, isLoading } = useEmployee(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Active</Badge>;
      case 'on_leave': return <Badge variant="warning">On Leave</Badge>;
      case 'terminated': return <Badge variant="error">Terminated</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#1a1a1a] rounded-lg text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {employee?.user?.first_name} {employee?.user?.last_name}
          </h1>
          <p className="text-gray-400 mt-1">{employee?.position} · {employee?.department}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-black font-bold text-2xl mb-4">
              {employee?.user?.first_name?.[0]}{employee?.user?.last_name?.[0]}
            </div>
            <h2 className="text-xl font-semibold text-white">
              {employee?.user?.first_name} {employee?.user?.last_name}
            </h2>
            <p className="text-gray-400 mt-1">{employee?.position}</p>
            <div className="mt-3">{getStatusBadge(employee?.status || 'active')}</div>
          </div>
          <div className="space-y-3 border-t border-gray-800 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </span>
              <span className="text-sm text-white">{employee?.user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Hash className="h-4 w-4" /> Employee #
              </span>
              <span className="text-sm text-white">{employee?.employee_number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Building className="h-4 w-4" /> Department
              </span>
              <span className="text-sm text-white">{employee?.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Hire Date
              </span>
              <span className="text-sm text-white">
                {employee?.hire_date ? new Date(employee.hire_date).toLocaleDateString() : '-'}
              </span>
            </div>
            {employee?.salary && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Salary
                </span>
                <span className="text-sm text-white">${employee.salary.toLocaleString()}/yr</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-800">
            <button className="flex-1 py-2 px-4 text-sm border border-gray-700 text-gray-300 rounded-lg hover:bg-[#1a1a1a] flex items-center justify-center gap-2">
              <Edit className="h-4 w-4" /> Edit
            </button>
            <button className="py-2 px-4 text-sm border border-red-900 text-red-400 rounded-lg hover:bg-red-900/30">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" /> Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Position</p>
                <p className="text-white font-medium">{employee?.position || '-'}</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="text-white font-medium">{employee?.department || '-'}</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Employee Number</p>
                <p className="text-white font-medium">{employee?.employee_number || '-'}</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                {getStatusBadge(employee?.status || 'active')}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <User className="h-5 w-5" /> Recent Activity
              </h3>
              <Link href={`/ceo/hr/performance/${id}`} className="text-sm text-gray-400 hover:text-white">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Completed Q3 Performance Review', time: '2 weeks ago', type: 'success' },
                { title: '5 days vacation approved', time: '1 month ago', type: 'success' },
                { title: 'Project milestone reached', time: '2 months ago', type: 'info' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
