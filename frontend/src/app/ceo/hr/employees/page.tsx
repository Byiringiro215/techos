'use client';

import { useState } from 'react';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { EmptyState } from '@/components/UI/EmptyState';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/UI/Table';
import { Input } from '@/components/UI/Input';
import { useEmployees, useDepartments } from '@/hooks/useHR';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Filter
} from 'lucide-react';

export default function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();
  const { data: departments } = useDepartments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEmployees = employees?.filter(emp => {
    const fullName = `${emp.user?.first_name} ${emp.user?.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'on_leave':
        return <Badge variant="warning">On Leave</Badge>;
      case 'terminated':
        return <Badge variant="error">Terminated</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Employees</h1>
          <p className="text-gray-400 mt-2">Manage all company employees ({filteredEmployees.length} total)</p>
        </div>
        <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name, position, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1a1a1a] border-gray-800 text-white placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>

        {filteredEmployees.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No employees found"
            description={searchTerm ? 'Try adjusting your search or filters' : 'Add your first employee to get started'}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <Link href={`/ceo/hr/employees/${emp.id}`} className="flex items-center gap-3 hover:opacity-80">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black font-semibold text-sm">
                        {emp.user?.first_name?.[0]}{emp.user?.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {emp.user?.first_name} {emp.user?.last_name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {emp.user?.email}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <p className="text-gray-300">{emp.position}</p>
                    <p className="text-xs text-gray-500">#{emp.employee_number}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{emp.department}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(emp.status)}
                  </TableCell>
                  <TableCell>
                    <p className="text-gray-300">{new Date(emp.hire_date).toLocaleDateString()}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/ceo/hr/employees/${emp.id}`}
                        className="p-2 hover:bg-[#1a1a1a] rounded-lg text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <Users className="h-8 w-8 text-white mb-4" />
          <h3 className="font-semibold text-white mb-1">Departments</h3>
          <p className="text-2xl font-bold text-white">{departments?.length || '6'}</p>
          <p className="text-sm text-gray-500 mt-1">Across organization</p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <UserPlus className="h-8 w-8 text-white mb-4" />
          <h3 className="font-semibold text-white mb-1">New This Month</h3>
          <p className="text-2xl font-bold text-white">
            {employees?.filter(e => {
              const hireDate = new Date(e.hire_date);
              const now = new Date();
              return hireDate.getMonth() === now.getMonth() && hireDate.getFullYear() === now.getFullYear();
            }).length || '0'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Recent additions</p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <Phone className="h-8 w-8 text-white mb-4" />
          <h3 className="font-semibold text-white mb-1">Avg Tenure</h3>
          <p className="text-2xl font-bold text-white">2.4 yrs</p>
          <p className="text-sm text-gray-500 mt-1">Company-wide</p>
        </Card>
      </div>
    </div>
  );
}
