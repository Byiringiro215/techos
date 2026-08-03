import { Employee, LeaveRequest } from '@/types/hr';
import { mockEntities } from './entities';

/** Map mock employee records into the shape expected by existing HR pages. */
export function getMockEmployees(): Employee[] {
  return (mockEntities.employees || []).map((row, index) => {
    const [first = 'Alex', ...rest] = (row.owner || 'Alex Chen').split(' ');
    const last = rest.join(' ') || 'User';
    const status =
      row.status.toLowerCase().includes('leave')
        ? 'on_leave'
        : row.status.toLowerCase().includes('term')
          ? 'terminated'
          : 'active';

    return {
      id: row.id,
      org_id: 'org-techos-demo',
      user_id: `user-${row.id}`,
      employee_number: `E-${1000 + index}`,
      department: row.department || row.category || 'Engineering',
      position: row.title || 'Team Member',
      hire_date: row.createdAt,
      salary: typeof row.amount === 'number' ? row.amount : 95000,
      status: status as Employee['status'],
      created_at: row.createdAt,
      user: {
        id: `user-${row.id}`,
        first_name: first,
        last_name: last,
        email: row.email || `${first}.${last}`.toLowerCase().replace(/\s+/g, '.') + '@techos.io',
      },
    };
  });
}

export function getMockLeaveRequests(): LeaveRequest[] {
  const employees = getMockEmployees();
  return (mockEntities.leaveRequests || []).map((row, index) => {
    const employee = employees[index % employees.length];
    const statusRaw = row.status.toLowerCase();
    const status: LeaveRequest['status'] = statusRaw.includes('approve')
      ? 'approved'
      : statusRaw.includes('reject')
        ? 'rejected'
        : 'pending';

    const typeRaw = (row.category || row.tags?.[0] || 'vacation').toLowerCase();
    const type: LeaveRequest['type'] = typeRaw.includes('sick')
      ? 'sick'
      : typeRaw.includes('personal')
        ? 'personal'
        : typeRaw.includes('other')
          ? 'other'
          : 'vacation';

    return {
      id: row.id,
      org_id: 'org-techos-demo',
      employee_id: employee.id,
      type,
      start_date: row.dueDate || row.createdAt,
      end_date: row.updatedAt,
      reason: row.description,
      status,
      created_at: row.createdAt,
      employee,
    };
  });
}

export function getMockHrStats() {
  const employees = getMockEmployees();
  const leaves = getMockLeaveRequests();
  return {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === 'active').length,
    onLeave: employees.filter((e) => e.status === 'on_leave').length,
    pendingLeaves: leaves.filter((l) => l.status === 'pending').length,
    openPositions: 4,
    avgTenureMonths: 28,
  };
}
