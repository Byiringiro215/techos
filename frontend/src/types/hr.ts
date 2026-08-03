export interface Employee {
  id: string;
  org_id: string;
  user_id: string;
  employee_number: string;
  department: string;
  position: string;
  hire_date: string;
  salary?: number;
  manager_id?: string;
  status: 'active' | 'on_leave' | 'terminated';
  created_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface LeaveRequest {
  id: string;
  org_id: string;
  employee_id: string;
  type: 'vacation' | 'sick' | 'personal' | 'other';
  start_date: string;
  end_date: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approval_date?: string;
  rejection_reason?: string;
  created_at: string;
  employee?: Employee;
}
