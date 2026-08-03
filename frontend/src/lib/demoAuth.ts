import { UserRole } from '@/types/roles';
import { mockUsers } from '@/mocks/users';
import { getRoleRoute } from '@/lib/roleRoutes';

export interface DemoAccount {
  role: UserRole;
  label: string;
  email: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: UserRole.CEO,
    label: 'CEO',
    email: 'alexandra.chen@techos.io',
    description: 'Executive overview & company ops',
  },
  {
    role: UserRole.CTO,
    label: 'CTO',
    email: 'marcus.webb@techos.io',
    description: 'Engineering, product & infrastructure',
  },
  {
    role: UserRole.FINANCE,
    label: 'Finance',
    email: 'priya.sharma@techos.io',
    description: 'Invoices, budgets & revenue',
  },
  {
    role: UserRole.SOFTWARE_ENGINEER,
    label: 'Engineer',
    email: 'jordan.lee@techos.io',
    description: 'Tasks, sprints & code reviews',
  },
  {
    role: UserRole.UI_UX_DESIGNER,
    label: 'Designer',
    email: 'liam.nguyen@techos.io',
    description: 'Design system & prototypes',
  },
  {
    role: UserRole.CUSTOMER_SUPPORT,
    label: 'Support',
    email: 'noah.rodriguez@techos.io',
    description: 'Tickets, chat & knowledge base',
  },
];

export function buildDemoSession(role: UserRole) {
  const mock = mockUsers.find((u) => u.role === role) || mockUsers[0];
  const user = {
    id: mock.id,
    email: mock.email,
    firstName: mock.firstName,
    lastName: mock.lastName,
    role,
    organizationId: 'org-techos-demo',
    name: `${mock.firstName} ${mock.lastName}`,
    status: 'active',
  };
  const token = `demo-token-${role}-${Date.now()}`;
  return { user, token, redirectTo: getRoleRoute(role) };
}
