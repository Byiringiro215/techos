'use client';

import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import {
  UserPlus,
  CheckCircle,
  Clock,
  Users,
  ClipboardList,
  FileText,
  Shield,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useEmployees } from '@/hooks/useHR';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';

export default function OnboardingPage() {
  const { data: employees, isLoading } = useEmployees();

  const recentHires = employees
    ?.sort((a, b) => new Date(b.hire_date).getTime() - new Date(a.hire_date).getTime())
    .slice(0, 6) || [];

  const onboardingSteps = [
    { id: 1, title: 'Paperwork & Documentation', icon: FileText, description: 'Contracts, tax forms, NDAs', completed: true },
    { id: 2, title: 'Accounts & Access', icon: Shield, description: 'Email, tools, permissions', completed: true },
    { id: 3, title: 'Workplace Setup', icon: Users, description: 'Desk, equipment, team intro', completed: false },
    { id: 4, title: 'Training', icon: BookOpen, description: 'Company policies, role training', completed: false },
    { id: 5, title: '30-Day Review', icon: ClipboardList, description: 'First check-in meeting', completed: false },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getOnboardingStatus = (hireDate: string) => {
    const daysSince = Math.floor((Date.now() - new Date(hireDate).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince < 7) return { status: 'in_progress', pct: 40 };
    if (daysSince < 30) return { status: 'in_progress', pct: 70 };
    return { status: 'completed', pct: 100 };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Onboarding</h1>
        <p className="text-gray-400 mt-2">New hire onboarding and integration process</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <UserPlus className="h-8 w-8 text-white mb-3" />
          <p className="text-sm text-gray-400">Active Onboarding</p>
          <p className="text-3xl font-bold text-white mt-1">5</p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <CheckCircle className="h-8 w-8 text-green-400 mb-3" />
          <p className="text-sm text-gray-400">Completed This Quarter</p>
          <p className="text-3xl font-bold text-white mt-1">12</p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <Clock className="h-8 w-8 text-yellow-400 mb-3" />
          <p className="text-sm text-gray-400">Avg Time to Complete</p>
          <p className="text-3xl font-bold text-white mt-1">28d</p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <Users className="h-8 w-8 text-white mb-3" />
          <p className="text-sm text-gray-400">New This Month</p>
          <p className="text-3xl font-bold text-white mt-1">3</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 bg-[#0a0a0a] border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Users className="h-5 w-5" /> Recent New Hires
          </h2>
          {recentHires.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UserPlus className="h-12 w-12 mx-auto mb-2" />
              <p>No recent hires</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentHires.map(emp => {
                const { status, pct } = getOnboardingStatus(emp.hire_date);
                return (
                  <div key={emp.id} className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black font-semibold text-sm">
                          {emp.user?.first_name?.[0]}{emp.user?.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {emp.user?.first_name} {emp.user?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{emp.position} · {emp.department}</p>
                        </div>
                      </div>
                      <Badge variant={status === 'completed' ? 'success' : 'info'}>
                        {status === 'completed' ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                      <div className="bg-white h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-gray-500">{pct}% · Hired {new Date(emp.hire_date).toLocaleDateString()}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <ClipboardList className="h-5 w-5" /> Onboarding Checklist
          </h2>
          <div className="space-y-3">
            {onboardingSteps.map((step, i) => (
              <div key={step.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-white text-black' : 'bg-gray-800 text-gray-500'
                  }`}>
                    {step.completed ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  {i < onboardingSteps.length - 1 && (
                    <div className={`w-0.5 h-full mt-1 ${step.completed ? 'bg-white' : 'bg-gray-800'}`} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className={`font-medium ${step.completed ? 'text-white' : 'text-gray-400'}`}>{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
