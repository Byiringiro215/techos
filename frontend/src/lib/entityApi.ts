/**
 * Maps ModuleWorkspace entity keys to real backend endpoints.
 * Native modules use dedicated APIs; everything else uses /workspace/:type.
 */

export type EntityFieldMap = {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  owner?: string;
  amount?: string;
  dueDate?: string;
};

export type EntityApiConfig = {
  /** Query key + path segment */
  key: string;
  listPath: string;
  itemPath: (id: string) => string;
  createPath: string;
  /** Map UI form fields → API body */
  toCreateBody: (form: Record<string, any>) => Record<string, any>;
  /** Normalize API row → UI MockRecord-like shape */
  toUi: (row: any) => Record<string, any>;
};

function workspaceConfig(type: string): EntityApiConfig {
  return {
    key: type,
    listPath: `/workspace/${type}`,
    itemPath: (id) => `/workspace/${type}/${id}`,
    createPath: `/workspace/${type}`,
    toCreateBody: (form) => ({
      title: form.title || form.name,
      description: form.description,
      status: form.status || 'active',
      priority: form.priority,
      owner: form.owner,
      amount: form.amount ? Number(form.amount) : undefined,
      due_date: form.dueDate || form.due_date,
      metadata: form,
    }),
    toUi: (row) => ({
      ...row,
      title: row.title || row.name,
      name: row.name || row.title,
      statusVariant: row.statusVariant || 'default',
      dueDate: row.dueDate || row.due_date,
      createdAt: row.createdAt || row.created_at,
      updatedAt: row.updatedAt || row.updated_at,
    }),
  };
}

function statusVariant(status?: string) {
  const s = (status || '').toLowerCase();
  if (['active', 'completed', 'done', 'paid', 'approved', 'won', 'published'].includes(s)) return 'success';
  if (['pending', 'in_progress', 'open', 'draft', 'scheduled', 'qualified'].includes(s)) return 'warning';
  if (['rejected', 'cancelled', 'terminated', 'lost', 'critical', 'closed'].includes(s)) return 'error';
  return 'default';
}

const native: Record<string, EntityApiConfig> = {
  projects: {
    key: 'projects',
    listPath: '/projects',
    itemPath: (id) => `/projects/${id}`,
    createPath: '/projects',
    toCreateBody: (form) => ({
      name: form.title || form.name,
      description: form.description,
      status: form.status || 'active',
      priority: form.priority || 'medium',
      start_date: form.start_date,
      end_date: form.end_date,
      budget: form.amount ? Number(form.amount) : undefined,
      client_name: form.client_name?.trim() || undefined,
    }),
    toUi: (row) => {
      const start = row.start_date;
      const end = row.end_date;
      let progress =
        typeof row.progress === 'number'
          ? row.progress
          : (() => {
              if (!start || !end) return 0;
              const s = new Date(start).getTime();
              const e = new Date(end).getTime();
              if (!(e > s)) return 0;
              const now = Date.now();
              if (now <= s) return 0;
              if (now >= e) return 100;
              return Math.round(((now - s) / (e - s)) * 100);
            })();
      const client = row.client_name || row.metadata?.client_name || row.owner_name || '—';
      return {
        ...row,
        id: row.id,
        title: row.name || row.title,
        name: row.name,
        description: row.description,
        status: row.status || 'active',
        statusVariant: statusVariant(row.status),
        priority: row.priority,
        owner: client,
        client_name: client,
        amount: row.budget,
        dueDate: row.end_date,
        start_date: start,
        end_date: end,
        progress,
        createdAt: row.created_at,
        updatedAt: row.updated_at || row.created_at,
      };
    },
  },
  tasks: {
    key: 'tasks',
    listPath: '/tasks',
    itemPath: (id) => `/tasks/${id}`,
    createPath: '/tasks',
    toCreateBody: (form) => ({
      title: form.title,
      description: form.description,
      status: form.status || 'todo',
      priority: form.priority || 'medium',
    }),
    toUi: (row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      statusVariant: statusVariant(row.status),
      priority: row.priority,
      owner: row.assignee_name || row.owner || '—',
      dueDate: row.due_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  contacts: {
    key: 'contacts',
    listPath: '/crm/contacts',
    itemPath: (id) => `/crm/contacts/${id}`,
    createPath: '/crm/contacts',
    toCreateBody: (form) => {
      const parts = String(form.title || form.owner || 'New Contact').trim().split(/\s+/);
      return {
        first_name: parts[0] || 'New',
        last_name: parts.slice(1).join(' ') || 'Contact',
        email: form.email,
        company_name: form.company,
        status: form.status || 'active',
        type: 'lead',
        notes: form.description,
      };
    },
    toUi: (row) => ({
      id: row.id,
      title: `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.email,
      name: `${row.first_name || ''} ${row.last_name || ''}`.trim(),
      description: row.notes,
      status: row.status || row.type || 'active',
      statusVariant: statusVariant(row.status),
      owner: row.owner_name || '—',
      company: row.company_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  deals: {
    key: 'deals',
    listPath: '/crm/deals',
    itemPath: (id) => `/crm/deals/${id}`,
    createPath: '/crm/deals',
    toCreateBody: (form) => {
      const stageRaw = String(form.status || form.stage || 'qualification').toLowerCase().replace(/\s+/g, '_');
      const allowed = new Set(['qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost']);
      return {
        title: form.title,
        value: form.amount ? Number(form.amount) : 0,
        stage: allowed.has(stageRaw) ? stageRaw : 'qualification',
        assigned_to: form.owner_id || form.owner || form.assigned_to,
        notes: form.description,
        description: form.description,
        expected_close_date: form.dueDate,
      };
    },
    toUi: (row) => ({
      id: row.id,
      title: row.title || row.name,
      description: row.notes || row.description,
      status: row.stage || row.status,
      statusVariant: statusVariant(row.stage || row.status),
      owner: row.owner_name || row.owner || '—',
      amount: row.value ?? row.amount,
      company: row.company_name,
      priority: row.probability != null ? String(row.probability) : undefined,
      dueDate: row.close_date || row.expected_close_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  leads: {
    key: 'leads',
    listPath: '/crm/contacts',
    itemPath: (id) => `/crm/contacts/${id}`,
    createPath: '/crm/contacts',
    toCreateBody: (form) => {
      const parts = String(form.title || 'New Lead').trim().split(/\s+/);
      return {
        first_name: parts[0] || 'New',
        last_name: parts.slice(1).join(' ') || 'Lead',
        company_name: form.company,
        type: 'lead',
        status: 'qualified',
        notes: form.description,
      };
    },
    toUi: (row) => ({
      id: row.id,
      title: `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Lead',
      description: row.notes,
      status: row.status || 'lead',
      statusVariant: statusVariant(row.status),
      owner: row.owner_name || '—',
      company: row.company_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  invoices: {
    key: 'invoices',
    listPath: '/finance/invoices',
    itemPath: (id) => `/finance/invoices/${id}`,
    createPath: '/finance/invoices',
    toCreateBody: (form) => {
      const amount = form.amount ? Number(form.amount) : 0;
      const clientName = form.client_name || form.company || form.title || 'Client';
      return {
        client_name: clientName,
        amount,
        total: amount,
        status: (form.status || 'draft').toString().toLowerCase().replace(/\s+/g, '_'),
        due_date: form.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
        issued_date: new Date().toISOString().slice(0, 10),
        description: form.description,
        notes: form.description,
        items: [
          {
            description: form.description || clientName || 'Service',
            quantity: 1,
            unit_price: amount,
            total: amount,
          },
        ],
      };
    },
    toUi: (row) => ({
      id: row.id,
      title: row.invoice_number || row.client_name || `Invoice ${row.id?.slice(0, 8)}`,
      description: row.description || row.notes,
      status: row.status,
      statusVariant: statusVariant(row.status),
      owner: row.client_name || '—',
      company: row.client_name,
      client_name: row.client_name,
      amount: row.amount ?? row.total ?? 0,
      dueDate: row.due_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  expenses: {
    key: 'expenses',
    listPath: '/finance/expenses',
    itemPath: (id) => `/finance/expenses/${id}`,
    createPath: '/finance/expenses',
    toCreateBody: (form) => ({
      description: form.description || form.title,
      amount: form.amount ? Number(form.amount) : 0,
      category: form.owner || 'General',
      status: form.status || 'pending',
      expense_date: new Date().toISOString().slice(0, 10),
    }),
    toUi: (row) => ({
      id: row.id,
      title: row.description || row.category || 'Expense',
      description: row.description,
      status: row.status,
      statusVariant: statusVariant(row.status),
      owner: row.category || row.submitted_by_name || '—',
      amount: row.amount,
      dueDate: row.expense_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  budgets: {
    key: 'budgets',
    listPath: '/finance/budgets',
    itemPath: (id) => `/finance/budgets/${id}`,
    createPath: '/finance/budgets',
    toCreateBody: (form) => ({
      name: form.title || form.name,
      amount: form.amount ? Number(form.amount) : 0,
      period: 'annual',
      description: form.description,
    }),
    toUi: (row) => ({
      id: row.id,
      title: row.name || row.title,
      description: row.description,
      status: row.status || 'active',
      statusVariant: statusVariant(row.status || 'active'),
      owner: row.owner || '—',
      amount: row.amount || row.allocated,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  meetings: {
    key: 'meetings',
    listPath: '/meetings',
    itemPath: (id) => `/meetings/${id}`,
    createPath: '/meetings',
    toCreateBody: (form) => {
      const start = form.dueDate || new Date(Date.now() + 3600000).toISOString();
      const day = start.slice(0, 10);
      return {
        title: form.title,
        description: form.description,
        date: day,
        start_time: '09:00',
        end_time: '10:00',
        status: form.status || 'scheduled',
        agenda: form.description,
      };
    },
    toUi: (row) => ({
      id: row.id,
      title: row.title,
      description: row.description || row.agenda,
      status: row.status,
      statusVariant: statusVariant(row.status),
      owner: row.organizer_name || row.owner || '—',
      dueDate: row.scheduled_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  goals: {
    key: 'goals',
    listPath: '/goals',
    itemPath: (id) => `/goals/${id}`,
    createPath: '/goals',
    toCreateBody: (form) => ({
      title: form.title,
      description: form.description || '',
      type: form.type || 'company',
      owner_id: form.owner_id || form.owner,
      due_date: form.dueDate || form.target_date || undefined,
    }),
    toUi: (row) => ({
      id: row.id,
      title: row.title || row.name,
      description: row.description,
      status: row.status,
      statusVariant: statusVariant(row.status),
      owner: row.owner_name || row.owner || '—',
      owner_id: row.owner_id,
      progress: row.progress,
      dueDate: row.due_date || row.target_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  documents: {
    key: 'documents',
    listPath: '/documents',
    itemPath: (id) => `/documents/${id}`,
    createPath: '/documents',
    toCreateBody: (form) => ({
      title: form.title,
      description: form.description,
      type: 'document',
      status: form.status || 'draft',
    }),
    toUi: (row) => ({
      id: row.id,
      title: row.title || row.name,
      description: row.description,
      status: row.status || 'active',
      statusVariant: statusVariant(row.status),
      owner: row.owner_name || row.created_by_name || '—',
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  announcements: {
    key: 'announcements',
    listPath: '/announcements',
    itemPath: (id) => `/announcements/${id}`,
    createPath: '/announcements',
    toCreateBody: (form) => ({
      title: form.title,
      content: form.description || form.title,
      status: form.status || 'published',
    }),
    toUi: (row) => ({
      id: row.id,
      title: row.title,
      description: row.content || row.description,
      status: row.status || (row.is_pinned ? 'pinned' : 'published'),
      statusVariant: statusVariant(row.status || 'published'),
      owner: row.author_name || '—',
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  features: {
    key: 'features',
    listPath: '/product/features',
    itemPath: (id) => `/product/features/${id}`,
    createPath: '/product/features',
    toCreateBody: (form) => ({
      title: form.title,
      description: form.description,
      status: form.status || 'backlog',
      priority: form.priority || 'medium',
    }),
    toUi: (row) => ({
      id: row.id,
      title: row.title || row.name,
      description: row.description,
      status: row.status,
      statusVariant: statusVariant(row.status),
      priority: row.priority,
      owner: row.owner_name || '—',
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  bugs: {
    key: 'bugs',
    listPath: '/product/bugs',
    itemPath: (id) => `/product/bugs/${id}`,
    createPath: '/product/bugs',
    toCreateBody: (form) => ({
      title: form.title,
      description: form.description,
      status: form.status || 'open',
      priority: form.priority || 'medium',
    }),
    toUi: (row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      statusVariant: statusVariant(row.status),
      priority: row.priority,
      owner: row.assignee_name || '—',
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  releases: {
    key: 'releases',
    listPath: '/product/releases',
    itemPath: (id) => `/product/releases/${id}`,
    createPath: '/product/releases',
    toCreateBody: (form) => ({
      name: form.title || form.name,
      description: form.description,
      status: form.status || 'planned',
      release_date: form.dueDate,
    }),
    toUi: (row) => ({
      id: row.id,
      title: row.name || row.title || row.version,
      description: row.description,
      status: row.status,
      statusVariant: statusVariant(row.status),
      owner: row.owner_name || '—',
      dueDate: row.release_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  reports: {
    key: 'reports',
    listPath: '/reports',
    itemPath: (id) => `/reports/saved/${id}`,
    createPath: '/reports',
    toCreateBody: (form) => ({
      title: form.title,
      description: form.description,
      type: 'custom',
      status: form.status || 'draft',
    }),
    toUi: (row) => ({
      id: row.id,
      title: row.title || row.name,
      description: row.description,
      status: row.status || 'ready',
      statusVariant: statusVariant(row.status || 'ready'),
      owner: row.owner_name || '—',
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  sprints: {
    key: 'sprints',
    listPath: '/sprints',
    itemPath: (id) => `/sprints/${id}`,
    createPath: '/sprints',
    toCreateBody: (form) => ({
      name: form.title || form.name,
      goal: form.description,
      status: form.status || 'planned',
      start_date: new Date().toISOString().slice(0, 10),
      end_date: form.dueDate,
    }),
    toUi: (row) => ({
      id: row.id,
      title: row.name || row.title,
      description: row.goal || row.description,
      status: row.status,
      statusVariant: statusVariant(row.status),
      owner: row.owner || '—',
      dueDate: row.end_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  employees: {
    key: 'employees',
    listPath: '/hr/employees',
    itemPath: (id) => `/hr/employees/${id}`,
    createPath: '/users',
    toCreateBody: (form) => {
      const parts = String(form.title || form.owner || 'New User').trim().split(/\s+/);
      return {
        firstName: parts[0] || 'New',
        lastName: parts.slice(1).join(' ') || 'User',
        email: form.email || `${(parts[0] || 'user').toLowerCase()}@techos.io`,
        role: 'software_engineer',
      };
    },
    toUi: (row) => ({
      id: row.id,
      title: `${row.user?.first_name || row.first_name || ''} ${row.user?.last_name || row.last_name || ''}`.trim() || row.position,
      name: `${row.user?.first_name || ''} ${row.user?.last_name || ''}`.trim(),
      description: row.position,
      status: row.status,
      statusVariant: statusVariant(row.status),
      owner: (row.user?.role || row.role || '—').toString().replace(/_/g, ' '),
      role: row.user?.role || row.role,
      dueDate: row.hire_date || row.start_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
  leaveRequests: {
    key: 'leaveRequests',
    listPath: '/hr/leaves',
    itemPath: (id) => `/hr/leaves/${id}`,
    createPath: '/hr/leaves',
    toCreateBody: (form) => ({
      type: 'vacation',
      start_date: new Date().toISOString().slice(0, 10),
      end_date: form.dueDate || new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      reason: form.description || form.title,
    }),
    toUi: (row) => ({
      id: row.id,
      title: `${row.type || 'Leave'} — ${row.status}`,
      description: row.reason,
      status: row.status,
      statusVariant: statusVariant(row.status),
      owner: row.employee_name || '—',
      dueDate: row.end_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      ...row,
    }),
  },
};

/** Entity keys that map to dedicated APIs */
export const ENTITY_API: Record<string, EntityApiConfig> = {
  ...native,
  // CRM aliases
  customers: native.contacts,
  opportunities: native.deals,
  // Finance aliases
  payments: workspaceConfig('payments'),
  subscriptions: workspaceConfig('subscriptions'),
  quotations: workspaceConfig('quotations'),
  teams: workspaceConfig('teams'),
  // Marketing / Sales / Ops
  campaigns: workspaceConfig('campaigns'),
  processes: workspaceConfig('processes'),
  candidates: workspaceConfig('candidates'),
  jobs: workspaceConfig('jobs'),
  payroll: workspaceConfig('payroll'),
  benefits: workspaceConfig('benefits'),
  performanceReviews: workspaceConfig('performanceReviews'),
  onboardingTasks: workspaceConfig('onboardingTasks'),
  tickets: workspaceConfig('tickets'),
  // Design / research
  prototypes: workspaceConfig('prototypes'),
  research: workspaceConfig('research'),
  architecture: workspaceConfig('architecture'),
  deployments: workspaceConfig('deployments'),
  codeReviews: workspaceConfig('codeReviews'),
  commits: workspaceConfig('commits'),
  notifications: workspaceConfig('notifications'),
};

export function getEntityApi(entityKey: string): EntityApiConfig {
  return ENTITY_API[entityKey] || workspaceConfig(entityKey);
}
