import type { MockRecord } from './types';
import { mockEntities } from './entities';
import { OWNERS } from './entities';

export interface DetailComment {
  id: string;
  author: string;
  body: string;
  time: string;
}

export interface DetailActivity {
  id: string;
  actor: string;
  action: string;
  time: string;
}

export interface DetailAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface DetailRelated {
  id: string;
  title: string;
  kind: string;
  status: string;
  hrefHint?: string;
}

export interface DetailChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

function pickOwner(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i) * (i + 1)) % 997;
  return OWNERS[h % OWNERS.length];
}

function ago(hours: number): string {
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 14) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

/** Deterministic mock extras for any record — feels like Jira/Linear/HubSpot detail. */
export function getDetailExtras(entityKey: string, record: MockRecord) {
  const seed = `${entityKey}-${record.id}`;
  const assignees = Array.from(
    new Set([record.assignee || record.owner, pickOwner(seed + 'a'), pickOwner(seed + 'b')]),
  ).slice(0, record.priority === 'critical' || record.priority === 'high' ? 3 : 2);

  const watchers = [pickOwner(seed + 'w'), pickOwner(seed + 'x')].filter(
    (n) => !assignees.includes(n),
  );

  const activities: DetailActivity[] = [
    { id: 'a1', actor: record.owner, action: 'updated status', time: ago(2) },
    { id: 'a2', actor: assignees[1] || record.owner, action: 'left a comment', time: ago(18) },
    { id: 'a3', actor: watchers[0] || record.owner, action: 'was added as watcher', time: ago(40) },
    { id: 'a4', actor: record.owner, action: 'changed priority', time: ago(72) },
    { id: 'a5', actor: 'System', action: 'created this record', time: ago(24 * 14) },
  ];

  const comments: DetailComment[] = [
    {
      id: 'c1',
      author: assignees[1] || record.owner,
      body: 'Synced with stakeholders — next checkpoint is the end of sprint. Flagging scope risk on the offline path.',
      time: ago(18),
    },
    {
      id: 'c2',
      author: record.owner,
      body: 'Agreed. Let’s keep the MVP slice and park the nice-to-haves in the backlog.',
      time: ago(12),
    },
    {
      id: 'c3',
      author: watchers[0] || pickOwner(seed + 'c'),
      body: 'Docs updated. Link attached under Files.',
      time: ago(5),
    },
  ];

  const attachments: DetailAttachment[] = [
    { id: 'f1', name: `${record.id}-brief.pdf`, size: '420 KB', type: 'PDF' },
    { id: 'f2', name: 'requirements.xlsx', size: '88 KB', type: 'Sheet' },
    { id: 'f3', name: 'screenshot-flow.png', size: '1.2 MB', type: 'Image' },
  ];

  const checklist: DetailChecklistItem[] = [
    { id: 'k1', label: 'Requirements reviewed', done: true },
    { id: 'k2', label: 'Stakeholders aligned', done: true },
    { id: 'k3', label: 'Implementation started', done: (record.progress || 0) > 20 },
    { id: 'k4', label: 'QA / review ready', done: (record.progress || 0) >= 80 },
    { id: 'k5', label: 'Shipped / closed', done: record.status.toLowerCase().includes('done') || record.status.toLowerCase().includes('closed') || record.status.toLowerCase().includes('paid') },
  ];

  const related = buildRelated(entityKey, record);

  const workflow = workflowFor(entityKey, record.status);

  return { assignees, watchers, activities, comments, attachments, checklist, related, workflow };
}

function workflowFor(entityKey: string, current: string): string[] {
  const maps: Record<string, string[]> = {
    tasks: ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'],
    bugs: ['Open', 'Triaged', 'In Progress', 'In Review', 'Resolved', 'Closed'],
    projects: ['Planning', 'Active', 'On Hold', 'Completed'],
    sprints: ['Planning', 'Active', 'Completed'],
    tickets: ['New', 'Open', 'Pending', 'Waiting on Customer', 'Resolved', 'Closed'],
    invoices: ['Draft', 'Sent', 'Viewed', 'Partial', 'Paid', 'Overdue', 'Void'],
    expenses: ['Draft', 'Submitted', 'Approved', 'Rejected', 'Reimbursed'],
    payments: ['Pending', 'Processing', 'Completed', 'Failed'],
    deals: ['Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'],
    leads: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
    codeReviews: ['Open', 'Changes Requested', 'Approved', 'Merged'],
    campaigns: ['Draft', 'Scheduled', 'Active', 'Paused', 'Completed'],
  };
  return maps[entityKey] || ['Draft', current, 'In Progress', 'Done'];
}

function buildRelated(entityKey: string, record: MockRecord): DetailRelated[] {
  const take = (key: string, n: number, kind: string): DetailRelated[] =>
    (mockEntities[key] || []).slice(0, n).map((r) => ({
      id: r.id,
      title: r.title,
      kind,
      status: r.status,
    }));

  switch (entityKey) {
    case 'projects':
      return [
        ...take('tasks', 3, 'Task'),
        ...take('bugs', 2, 'Bug'),
        ...take('sprints', 1, 'Sprint'),
      ];
    case 'tasks':
    case 'bugs':
      return [...take('projects', 1, 'Project'), ...take('codeReviews', 2, 'PR'), ...take('commits', 2, 'Commit')];
    case 'tickets':
      return [...take('bugs', 2, 'Bug'), ...take('knowledgeBase', 2, 'KB Article'), ...take('contacts', 1, 'Contact')];
    case 'invoices':
    case 'payments':
      return [...take('customers', 1, 'Customer'), ...take('deals', 1, 'Deal'), ...take('payments', 2, 'Payment')];
    case 'deals':
    case 'leads':
      return [...take('contacts', 2, 'Contact'), ...take('campaigns', 1, 'Campaign')];
    case 'codeReviews':
      return [...take('commits', 2, 'Commit'), ...take('tasks', 2, 'Task')];
    default:
      return [
        ...take('documents', 2, 'Document'),
        ...take('meetings', 1, 'Meeting'),
      ].filter((r) => r.id !== record.id);
  }
}

export function entitySingular(entityKey: string): string {
  const map: Record<string, string> = {
    projects: 'Project',
    tasks: 'Task',
    bugs: 'Bug',
    sprints: 'Sprint',
    invoices: 'Invoice',
    expenses: 'Expense',
    payments: 'Payment',
    budgets: 'Budget',
    tickets: 'Ticket',
    deals: 'Deal',
    leads: 'Lead',
    contacts: 'Contact',
    codeReviews: 'Code review',
    commits: 'Commit',
    campaigns: 'Campaign',
    features: 'Feature',
    employees: 'Employee',
    knowledgeBase: 'Article',
  };
  return map[entityKey] || 'Record';
}
