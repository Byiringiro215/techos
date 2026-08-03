import { mockUsers, getFullName } from './users';
import { mockEntities } from './entities';

export type TeamStatus = 'active' | 'forming' | 'archived';

export interface TeamMemberRef {
  userId: string;
  roleInTeam: 'lead' | 'member';
}

export interface Team {
  id: string;
  name: string;
  description: string;
  department: string;
  status: TeamStatus;
  leadId: string;
  memberIds: string[];
  projectIds: string[];
  createdAt: string;
  updatedAt: string;
}

function iso(offsetDays: number): string {
  const d = new Date();
  d.setUTCHours(12, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString();
}

export const seedTeams: Team[] = [
  {
    id: 'team-001',
    name: 'Mobile Platform',
    description: 'Owns the TechOS companion apps and offline sync stack.',
    department: 'Engineering',
    status: 'active',
    leadId: 'usr-005',
    memberIds: ['usr-005', 'usr-006', 'usr-007'],
    projectIds: ['prj-001'],
    createdAt: iso(-90),
    updatedAt: iso(-2),
  },
  {
    id: 'team-002',
    name: 'Design Systems',
    description: 'Tokens, components, and product design quality.',
    department: 'Design',
    status: 'active',
    leadId: 'usr-009',
    memberIds: ['usr-009', 'usr-010'],
    projectIds: ['prj-005', 'prj-001'],
    createdAt: iso(-120),
    updatedAt: iso(-1),
  },
  {
    id: 'team-003',
    name: 'Platform Security',
    description: 'Auth, SSO, and compliance-sensitive infrastructure.',
    department: 'Engineering',
    status: 'forming',
    leadId: 'usr-008',
    memberIds: ['usr-008', 'usr-002'],
    projectIds: ['prj-003'],
    createdAt: iso(-14),
    updatedAt: iso(-1),
  },
  {
    id: 'team-004',
    name: 'Revenue Ops',
    description: 'Billing, invoicing, and finance-adjacent product work.',
    department: 'Finance',
    status: 'active',
    leadId: 'usr-003',
    memberIds: ['usr-003', 'usr-004'],
    projectIds: ['prj-004'],
    createdAt: iso(-60),
    updatedAt: iso(-5),
  },
];

export function getSelectablePeople() {
  return mockUsers.filter((u) => u.status === 'active');
}

export function getProjectOptions() {
  return (mockEntities.projects || []).map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    owner: p.owner,
  }));
}

export function resolveMemberNames(memberIds: string[]): string[] {
  return memberIds
    .map((id) => {
      const user = mockUsers.find((u) => u.id === id);
      return user ? getFullName(user) : null;
    })
    .filter(Boolean) as string[];
}
