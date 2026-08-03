'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { EmptyState } from '@/components/UI/EmptyState';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/UI/Table';
import { Pagination } from '@/components/UI/Pagination';
import { Input } from '@/components/UI/Input';
import { useEmployees, useDepartments } from '@/hooks/useHR';
import { useClientPagination } from '@/hooks/useClientPagination';
import {
  Users,
  UserPlus,
  Search,
  ChevronRight,
  Mail,
  Phone,
  Filter
} from 'lucide-react';

export default function EmployeesPage() {
  const router = useRouter();
  const { data: employees, isLoading } = useEmployees();
  const { data: departments } = useDepartments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEmployees = useMemo(
    () =>
      employees?.filter((emp) => {
        const fullName = `${emp.user?.first_name} ${emp.user?.last_name}`.toLowerCase();
        const matchesSearch =
          fullName.includes(searchTerm.toLowerCase()) ||
          emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
        return matchesSearch && matchesStatus;
      }) || [],
    [employees, searchTerm, statusFilter],
  );

  const { page, pageSize, total, pageItems, setPage, setPageSize, resetPage } =
    useClientPagination(filteredEmployees, 10);

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
          <h1 className="text-3xl font-bold text-ink">Employees</h1>
          <p className="text-ink-muted mt-2">Manage all company employees ({filteredEmployees.length} total)</p>
        </div>
        <button className="px-4 py-2 bg-brand text-ink-inverse text-sm font-medium rounded-xl hover:bg-brand-deep transition-colors flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      <Card className="p-6 bg-surface border border-border">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <Input
              placeholder="Search by name, position, department..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                resetPage();
              }}
              className="pl-10 bg-bg-muted border-border text-ink placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-ink-muted" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                resetPage();
              }}
              className="bg-bg-muted border border-border rounded-lg px-3 py-2 text-sm text-ink-secondary focus:outline-none focus:ring-2 focus:ring-brand/40/20"
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
          <div className="space-y-4">
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
                {pageItems.map((emp) => (
                  <TableRow
                    key={emp.id}
                    className="cursor-pointer group/row"
                    onClick={() => router.push(`/ceo/hr/employees/${emp.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(`/ceo/hr/employees/${emp.id}`);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                    aria-label={`View ${emp.user?.first_name} ${emp.user?.last_name}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-brand-mist flex items-center justify-center text-brand font-semibold text-sm">
                          {emp.user?.first_name?.[0]}{emp.user?.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-ink group-hover/row:text-brand">
                            {emp.user?.first_name} {emp.user?.last_name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-ink-muted flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {emp.user?.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-ink-secondary">{emp.position}</p>
                      <p className="text-xs text-ink-muted">#{emp.employee_number}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{emp.department}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(emp.status)}
                    </TableCell>
                    <TableCell>
                      <p className="text-ink-secondary">{new Date(emp.hire_date).toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-brand">
                        View
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-surface border border-border">
          <Users className="h-8 w-8 text-ink mb-4" />
          <h3 className="font-semibold text-ink mb-1">Departments</h3>
          <p className="text-2xl font-bold text-ink">{departments?.length || '6'}</p>
          <p className="text-sm text-ink-muted mt-1">Across organization</p>
        </Card>
        <Card className="p-6 bg-surface border border-border">
          <UserPlus className="h-8 w-8 text-ink mb-4" />
          <h3 className="font-semibold text-ink mb-1">New This Month</h3>
          <p className="text-2xl font-bold text-ink">
            {employees?.filter(e => {
              const hireDate = new Date(e.hire_date);
              const now = new Date();
              return hireDate.getMonth() === now.getMonth() && hireDate.getFullYear() === now.getFullYear();
            }).length || '0'}
          </p>
          <p className="text-sm text-ink-muted mt-1">Recent additions</p>
        </Card>
        <Card className="p-6 bg-surface border border-border">
          <Phone className="h-8 w-8 text-ink mb-4" />
          <h3 className="font-semibold text-ink mb-1">Avg Tenure</h3>
          <p className="text-2xl font-bold text-ink">2.4 yrs</p>
          <p className="text-sm text-ink-muted mt-1">Company-wide</p>
        </Card>
      </div>
    </div>
  );
}
