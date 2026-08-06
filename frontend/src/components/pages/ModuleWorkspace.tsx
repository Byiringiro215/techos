'use client';

import { useMemo, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  resolveEntityKey,
  resolvePageKind,
  type MockRecord,
  type MockUserRole,
} from '@/mocks';
import {
  useCreateEntity,
  useDeleteEntity,
  useEntityActivity,
  useEntityList,
} from '@/hooks/useEntityApi';
import { useDashboard } from '@/hooks/useDashboard';
import { useAnalyticsOverview, useKPIs } from '@/hooks/useAnalytics';
import { useSendChatMessage } from '@/hooks/useAI';
import { useChannels, useChannelMessages, useSendMessage } from '@/hooks/useChannels';
import { useUpdateMyProfile, useUpdateMyPassword, useUsers } from '@/hooks/useUsers';
import { useOrganization, useUpdateOrganization } from '@/hooks/useOrganizations';
import { formatCurrency, formatDate } from '@/lib/utils';
import { buildBreadcrumbs, humanize, titleFromPath } from '@/lib/navigation';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/UI/PageHeader';
import { DataTable, type Column } from '@/components/UI/DataTable';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Progress } from '@/components/UI/Progress';
import { StatCard } from '@/components/UI/StatCard';
import { SimpleAreaChart, SimpleBarChart } from '@/components/UI/Charts';
import { Input } from '@/components/UI/Input';
import { Select } from '@/components/UI/Select';
import { TextArea } from '@/components/UI/TextArea';
import { EmptyState } from '@/components/UI/EmptyState';
import { Skeleton, SkeletonCard } from '@/components/UI/Skeleton';
import { Tabs, TabList, Tab, TabPanel } from '@/components/UI/Tabs';
import { Avatar } from '@/components/UI/Avatar';
import { ConfirmDialog } from '@/components/UI/ConfirmDialog';
import { Modal } from '@/components/UI/Modal';
import { CalendarBoard } from '@/components/boards/CalendarBoard';
import { KanbanBoard } from '@/components/boards/KanbanBoard';
import { SprintWorkspace } from '@/components/boards/SprintWorkspace';
import { TeamsWorkspace } from '@/components/teams/TeamsWorkspace';
import { EntityDetailView } from '@/components/pages/EntityDetailView';
import {
  Plus,
  Download,
  Trash2,
  Send,
  Bot,
  Calendar as CalendarIcon,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

/** Build a detail URL for a list row under the current pathname. */
function detailPathForRow(pathname: string, rowId: string): string {
  const base = pathname.replace(/\/$/, '');
  return `${base}/${rowId}`;
}

function roleKeyFromPath(pathname: string): MockUserRole {
  const root = pathname.split('/').filter(Boolean)[0];
  const map: Record<string, MockUserRole> = {
    ceo: 'ceo',
    cto: 'cto',
    ciso: 'ciso',
    finance: 'finance',
    'software-engineer': 'software_engineer',
    'ui-ux-designer': 'ui_ux_designer',
    'customer-support': 'customer_support',
  };
  return map[root] || 'ceo';
}

function basePathFromPathname(pathname: string): string {
  const root = pathname.split('/').filter(Boolean)[0] || 'ceo';
  return `/${root}`;
}

function entityLabel(key: string): string {
  return humanize(key.replace(/([A-Z])/g, '-$1').toLowerCase());
}

export function ModuleWorkspace() {
  const pathname = usePathname() || '/';
  const params = useParams();
  const kind = resolvePageKind(pathname);
  const paramId =
    typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;
  const pathTail = pathname.split('/').filter(Boolean).pop();
  const detailId = paramId || (kind === 'detail' ? pathTail : undefined);
  const entityKey = resolveEntityKey(pathname);
  const basePath = basePathFromPathname(pathname);
  const roleKey = roleKeyFromPath(pathname);
  const title = titleFromPath(pathname);
  const breadcrumbs = buildBreadcrumbs(pathname, basePath, entityLabel(roleKey));

  if (kind === 'dashboard') {
    return <DashboardView basePath={basePath} />;
  }
  if (kind === 'messages') {
    return <MessagesView breadcrumbs={breadcrumbs} />;
  }
  if (kind === 'calendar') {
    return <CalendarBoard breadcrumbs={breadcrumbs} />;
  }
  if (kind === 'tasks') {
    return <TasksView title={title} breadcrumbs={breadcrumbs} />;
  }
  if (kind === 'sprints') {
    return <SprintWorkspace breadcrumbs={breadcrumbs} />;
  }
  if (kind === 'teams') {
    return <TeamsWorkspace breadcrumbs={breadcrumbs} />;
  }
  if (kind === 'ai') {
    return <AiView breadcrumbs={breadcrumbs} />;
  }
  if (kind === 'settings') {
    return <SettingsView breadcrumbs={breadcrumbs} />;
  }
  if (kind === 'analytics') {
    return <AnalyticsView title={title} breadcrumbs={breadcrumbs} />;
  }
  if (kind === 'create' || kind === 'form') {
    return <FormView title={title} entityKey={entityKey} breadcrumbs={breadcrumbs} />;
  }
  if (kind === 'detail' || detailId) {
    return (
      <EntityDetailView
        title={title}
        entityKey={entityKey}
        detailId={detailId || ''}
        breadcrumbs={breadcrumbs}
        basePath={pathname.replace(/\/[^/]+$/, '')}
      />
    );
  }
  return (
    <ListView
      title={title}
      entityKey={entityKey}
      breadcrumbs={breadcrumbs}
      pathname={pathname}
    />
  );
}

function TasksView({
  title,
  breadcrumbs,
}: {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}) {
  const { data: tasks = [], isLoading, isError } = useEntityList('tasks');

  if (isLoading) {
    return <SkeletonCard className="h-96" />;
  }

  if (isError) {
    return <EmptyState title="Unable to load tasks" description="Refresh the page to try again." />;
  }

  return (
    <KanbanBoard
      title={title}
      description="Drag cards across workflow columns."
      breadcrumbs={breadcrumbs}
      initialItems={tasks as MockRecord[]}
    />
  );
}

function ListView({
  title,
  entityKey,
  breadcrumbs,
  pathname,
}: {
  title: string;
  entityKey: string;
  breadcrumbs: { label: string; href?: string }[];
  pathname: string;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingIds, setPendingIds] = useState<MockRecord[]>([]);
  const { data, isLoading } = useEntityList(entityKey);
  const deleteEntity = useDeleteEntity(entityKey);

  const openDetail = (row: MockRecord) => {
    router.push(detailPathForRow(pathname, row.id));
  };

  const columns: Column<MockRecord>[] = useMemo(
    () => [
      {
        key: 'title',
        header: 'Name',
        sortable: true,
        render: (row) => (
          <div>
            <p className="font-medium text-ink group-hover/row:text-brand transition-colors">
              {row.title || row.name}
            </p>
            {row.company && <p className="text-xs text-ink-muted">{row.company}</p>}
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (row) => <Badge variant={row.statusVariant}>{row.status}</Badge>,
      },
      {
        key: 'owner',
        header: entityKey === 'projects' ? 'Client' : 'Owner',
        sortable: true,
        render: (row) =>
          entityKey === 'projects' ? (
            <span>{row.client_name || row.owner || '—'}</span>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar size="sm" name={row.owner} />
              <span>{row.owner}</span>
            </div>
          ),
      },
      ...(entityKey === 'projects'
        ? [
            {
              key: 'progress',
              header: 'Progress',
              sortable: true,
              render: (row: MockRecord) => {
                const value = typeof row.progress === 'number' ? row.progress : 0;
                const end = row.end_date || row.dueDate;
                return (
                  <div className="min-w-[100px]">
                    <div className="flex items-center justify-between text-xs text-ink-muted mb-1">
                      <span>
                        {row.start_date ? formatDate(row.start_date) : '—'}
                        {' → '}
                        {end ? formatDate(end) : '—'}
                      </span>
                      <span className="tabular-nums text-ink">{value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                      />
                    </div>
                  </div>
                );
              },
            } as Column<MockRecord>,
          ]
        : []),
      {
        key: 'priority',
        header: 'Priority',
        sortable: true,
        render: (row) =>
          row.priority ? (
            <Badge
              variant={
                row.priority === 'critical' || row.priority === 'high'
                  ? 'error'
                  : row.priority === 'medium'
                    ? 'warning'
                    : 'default'
              }
              size="sm"
            >
              {row.priority}
            </Badge>
          ) : (
            <span className="text-ink-muted">—</span>
          ),
      },
      {
        key: 'amount',
        header: entityKey === 'projects' ? 'Budget' : 'Amount',
        sortable: true,
        render: (row) =>
          typeof row.amount === 'number' ? (
            <span className="tabular-nums">{formatCurrency(row.amount)}</span>
          ) : (
            <span className="text-ink-muted">—</span>
          ),
      },
      {
        key: 'updatedAt',
        header: 'Updated',
        sortable: true,
        render: (row) => <span className="text-ink-muted">{formatDate(row.updatedAt)}</span>,
      },
      {
        key: '_actions',
        header: '',
        className: 'w-28 text-right',
        render: () => (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-brand opacity-80 group-hover/row:opacity-100">
            View
            <ChevronRight className="h-4 w-4" />
          </span>
        ),
      },
    ],
    [entityKey],
  );

  const statuses = Array.from(new Set((data || []).map((r) => r.status).filter(Boolean)));

  return (
    <div className="space-y-2">
      <PageHeader
        title={title}
        description={`Browse, create, and manage ${title.toLowerCase()}.`}
        breadcrumbs={breadcrumbs}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success('Export queued')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        data={(data || []) as MockRecord[]}
        isLoading={isLoading}
        searchKeys={['title', 'name', 'owner', 'client_name', 'company', 'status', 'description']}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: statuses.map((s) => ({ value: s, label: s })),
          },
        ]}
        selectable
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
        getRowId={(row) => row.id}
        emptyTitle={`No ${title.toLowerCase()} yet`}
        emptyDescription="Create your first record to get started."
        onRowClick={openDetail}
        bulkActions={[
          {
            label: 'Delete',
            icon: Trash2,
            variant: 'danger',
            onClick: (rows) => {
              setPendingIds(rows);
              setConfirmOpen(true);
            },
          },
        ]}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        title="Delete selected?"
        description={`This will permanently delete ${pendingIds.length} item(s).`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteEntity.isPending}
        onConfirm={async () => {
          await Promise.all(pendingIds.map((row) => deleteEntity.mutateAsync(row.id)));
          setConfirmOpen(false);
          setPendingIds([]);
        }}
      />

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title={`New ${title}`} size="lg">
        <CreateFormFields entityKey={entityKey} onDone={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
}

function formatUserLabel(user: {
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}) {
  const first = user.first_name || user.firstName || '';
  const last = user.last_name || user.lastName || '';
  const name = `${first} ${last}`.trim();
  const role = user.role ? ` · ${user.role.replace(/_/g, ' ')}` : '';
  return `${name || user.email || 'User'}${role}`;
}

function OwnerUserSelect({
  value,
  onChange,
  error,
  required,
}: {
  value: string;
  onChange: (userId: string) => void;
  error?: string;
  required?: boolean;
}) {
  const { data: users = [], isLoading } = useUsers();
  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!value && currentUser?.id && (users as any[]).some((u) => u.id === currentUser.id)) {
      onChange(currentUser.id);
    }
  }, [value, currentUser?.id, users, onChange]);

  return (
    <Select
      label="Owner"
      required={required}
      value={value}
      error={error}
      disabled={isLoading}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{isLoading ? 'Loading users...' : 'Select a user'}</option>
      {(users as any[]).map((user) => (
        <option key={user.id} value={user.id}>
          {formatUserLabel(user)}
        </option>
      ))}
    </Select>
  );
}

function CreateFormFields({ entityKey, onDone }: { entityKey: string; onDone: () => void }) {
  const createEntity = useCreateEntity(entityKey);
  const currentUser = useAuthStore((s) => s.user);
  const isInvoice = entityKey === 'invoices';
  const isDeal = entityKey === 'deals' || entityKey === 'opportunities';
  const isProject = entityKey === 'projects';
  const today = new Date().toISOString().slice(0, 10);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: '',
    owner: currentUser?.id || '',
    client_name: '',
    status: isDeal ? 'qualification' : isProject ? 'active' : 'Draft',
    priority: 'medium',
    description: '',
    amount: '',
    start_date: today,
    end_date: '',
  });

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = isInvoice ? 'Invoice title is required' : 'Title is required';
    if (isInvoice && !form.client_name.trim()) next.client_name = 'Client is required';
    if (isProject && !form.client_name.trim()) next.client_name = 'Client is required';
    if (isProject && !form.start_date) next.start_date = 'Start date is required';
    if (isProject && !form.end_date) next.end_date = 'End date is required';
    if (
      isProject &&
      form.start_date &&
      form.end_date &&
      new Date(form.end_date).getTime() <= new Date(form.start_date).getTime()
    ) {
      next.end_date = 'End date must be after start date';
    }
    if (!isInvoice && !isProject && !form.owner) next.owner = 'Owner is required';
    if ((isDeal || isInvoice) && !form.amount) next.amount = 'Amount is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (!validate()) {
          toast.error('Please fix validation errors');
          return;
        }
        await createEntity.mutateAsync({
          ...form,
          owner_id: form.owner,
          assigned_to: form.owner,
          client_name: form.client_name || (isInvoice ? form.title : form.client_name),
        });
        onDone();
      }}
    >
      <Input
        label={isInvoice ? 'Invoice title' : isDeal ? 'Deal name' : isProject ? 'Project name' : 'Title'}
        required
        value={form.title}
        error={errors.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder={
          isInvoice
            ? 'e.g. March retainer'
            : isDeal
              ? 'e.g. Acme expansion'
              : isProject
                ? 'e.g. Website redesign'
                : 'Enter a clear title'
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isInvoice || isProject ? (
          <Input
            label="Client"
            required
            value={form.client_name}
            error={errors.client_name}
            onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
            placeholder="Client or company name"
          />
        ) : (
          <OwnerUserSelect
            required
            value={form.owner}
            error={errors.owner}
            onChange={(owner) => setForm((f) => ({ ...f, owner }))}
          />
        )}
        <Select
          label={isDeal ? 'Stage' : 'Status'}
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
        >
          {isDeal ? (
            <>
              <option value="qualification">Qualification</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed_won">Closed won</option>
              <option value="closed_lost">Closed lost</option>
            </>
          ) : isProject ? (
            <>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="on_hold">On hold</option>
              <option value="completed">Completed</option>
            </>
          ) : (
            <>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              {isInvoice && <option value="Sent">Sent</option>}
              {isInvoice && <option value="Paid">Paid</option>}
            </>
          )}
        </Select>
      </div>
      {isProject && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Timeline start"
            type="date"
            required
            value={form.start_date}
            error={errors.start_date}
            onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
          />
          <Input
            label="Timeline end"
            type="date"
            required
            value={form.end_date}
            error={errors.end_date}
            onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
          />
        </div>
      )}
      {!isDeal && (
        <Select
          label="Priority"
          value={form.priority}
          onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </Select>
      )}
      <TextArea
        label="Description"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        rows={3}
      />
      <Input
        label={isDeal || isInvoice ? 'Amount' : isProject ? 'Budget (optional)' : 'Amount (optional)'}
        type="number"
        required={isDeal || isInvoice}
        value={form.amount}
        error={errors.amount}
        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
        placeholder={isDeal ? 'Deal value' : isProject ? 'Project budget' : undefined}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={createEntity.isPending}>
          Create
        </Button>
      </div>
    </form>
  );
}

function FormView({
  title,
  entityKey,
  breadcrumbs,
}: {
  title: string;
  entityKey: string;
  breadcrumbs: { label: string; href?: string }[];
}) {
  const router = useRouter();
  const createEntity = useCreateEntity(entityKey);
  const currentUser = useAuthStore((s) => s.user);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: '',
    owner: currentUser?.id || '',
    status: 'Draft',
    priority: 'medium',
    description: '',
    amount: '',
  });

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.owner) next.owner = 'Owner is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix validation errors');
      return;
    }
    await createEntity.mutateAsync({
      ...form,
      owner_id: form.owner,
    });
    router.back();
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={`Create a new ${entityLabel(entityKey).toLowerCase()}.`}
        breadcrumbs={breadcrumbs}
      />
      <Card>
        <form onSubmit={onSubmit} className="space-y-5 max-w-2xl" noValidate>
          <Input
            label="Title"
            required
            value={form.title}
            error={errors.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Enter a clear title"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OwnerUserSelect
              required
              value={form.owner}
              error={errors.owner}
              onChange={(owner) => setForm((f) => ({ ...f, owner }))}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
            <Input
              label="Amount (optional)"
              type="number"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="0.00"
            />
          </div>
          <TextArea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Add context for this record"
            rows={4}
          />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={createEntity.isPending}>
              Create
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function AnalyticsView({
  title,
  breadcrumbs,
}: {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}) {
  const overviewQuery = useAnalyticsOverview();
  const kpisQuery = useKPIs();
  const payload = overviewQuery.data?.data || overviewQuery.data;
  const kpis = kpisQuery.data?.data || kpisQuery.data || [];

  if (overviewQuery.isLoading || kpisQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="h-28" />
        ))}
      </div>
    );
  }

  if (overviewQuery.isError || !payload) {
    return <EmptyState title="Unable to load analytics" description="Refresh the page to try again." />;
  }

  const stats = [
    { id: 'projects', title: 'Projects', value: String(payload.projects?.total ?? 0), change: 0, trend: 'up' as const },
    { id: 'tasks', title: 'Tasks', value: String(payload.tasks?.total ?? 0), change: 0, trend: 'up' as const },
    { id: 'sprints', title: 'Sprints', value: String(payload.sprints?.active ?? 0), change: 0, trend: 'up' as const },
    { id: 'team', title: 'Active team members', value: String(payload.team?.active_members ?? 0), change: 0, trend: 'up' as const },
  ];
  const chartData = [
    { name: 'To do', value: payload.tasks?.todo ?? 0, secondary: payload.projects?.active ?? 0 },
    { name: 'In progress', value: payload.tasks?.in_progress ?? 0, secondary: payload.sprints?.active ?? 0 },
    { name: 'Done', value: payload.tasks?.done ?? 0, secondary: payload.projects?.completed ?? 0 },
    { name: 'Open bugs', value: payload.bugs?.open ?? 0, secondary: payload.bugs?.resolved ?? 0 },
  ];
  const metrics = Array.isArray(kpis)
    ? (kpis as Array<{ id: string; name?: string; title?: string; current?: number; value?: number; target?: number; target_value?: number; unit?: string }>).map((kpi) => ({
        id: kpi.id,
        label: kpi.name || kpi.title || 'KPI',
        value: Number(kpi.current ?? kpi.value ?? 0),
        target: Number(kpi.target ?? kpi.target_value ?? 0),
        unit: kpi.unit || '',
      }))
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description="Track operational performance across your organization."
        breadcrumbs={breadcrumbs}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-medium text-ink mb-4">Trend</h3>
          <SimpleAreaChart data={chartData} dataKey="value" secondaryKey="secondary" height={260} />
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-ink mb-4">Comparison</h3>
          <SimpleBarChart data={chartData} dataKey="value" height={260} />
        </Card>
      </div>
      <Card>
        <h3 className="text-sm font-medium text-ink mb-4">Goal progress</h3>
        <div className="space-y-4">
          {metrics.length === 0 ? (
            <EmptyState title="No KPIs yet" description="Create KPIs to monitor progress here." />
          ) : metrics.map((m) => (
            <Progress
              key={m.id}
              value={m.target > 0 ? Math.min(100, Math.round((m.value / m.target) * 100)) : 0}
              label={`${m.label} — ${m.value}${m.unit || ''} / ${m.target}${m.unit || ''}`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

type DashboardStat = {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
};
type MeetingRecord = { id: string; title: string; dueDate?: string; location?: string };
type ActivityRecord = { id: string; actor_name?: string; action?: string; summary?: string; created_at?: string };
type GoalRecord = { id: string; title: string; progress?: number };
type ChannelRecord = { id: string; name: string; description?: string; type?: string };
type ChannelMessage = { id: string; sender_id?: string; user_id?: string; content?: string; text?: string; created_at?: string };

export function DashboardView({ basePath }: { basePath: string }) {
  const user = useAuthStore((s) => s.user);
  const dashboardQuery = useDashboard();
  const activityQuery = useEntityActivity();
  const meetingsQuery = useEntityList('meetings');
  const goalsQuery = useEntityList('goals');
  const apiDash = dashboardQuery.data;

  const payload = apiDash?.data || apiDash;

  const asNumber = (value: unknown, fallback = 0): number => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
      return Number(value);
    }
    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      if (typeof obj.total === 'number') return obj.total;
      if (typeof obj.count === 'number') return obj.count;
      if (typeof obj.active === 'number') return obj.active;
    }
    return fallback;
  };

  const projectsTotal = asNumber(payload?.projects?.total ?? payload?.totalProjects ?? payload?.projects);
  const openTasks = asNumber(
    payload?.team_productivity
      ? Math.max(
          0,
          asNumber(payload.team_productivity.total_tasks) - asNumber(payload.team_productivity.completed),
        )
      : payload?.openTasks ?? payload?.tasks,
  );
  const revenue = asNumber(payload?.financials?.total_revenue ?? payload?.revenue ?? payload?.totalRevenue);
  const teamSize = asNumber(payload?.employees ?? payload?.teamSize ?? payload?.team?.active_members);

  const statsFromApi: DashboardStat[] | null = payload
    ? [
        { id: 'projects', title: 'Projects', value: String(projectsTotal), change: 0, trend: 'up' as const },
        { id: 'tasks', title: 'Open tasks', value: String(openTasks), change: 0, trend: 'up' as const },
        { id: 'revenue', title: 'Revenue', value: formatCurrency(revenue), change: 0, trend: 'up' as const },
        { id: 'team', title: 'Team', value: String(teamSize), change: 0, trend: 'up' as const },
      ]
    : null;

  if (dashboardQuery.isLoading || activityQuery.isLoading || meetingsQuery.isLoading || goalsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (dashboardQuery.isError || !statsFromApi) {
    return <EmptyState title="Unable to load dashboard" description="Refresh the page to try again." />;
  }

  const activities = (activityQuery.data || []).slice(0, 5);
  const meetings = ((meetingsQuery.data || []) as MeetingRecord[])
    .filter((meeting) => !meeting.dueDate || new Date(meeting.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime())
    .filter((meeting, index, list) => list.findIndex((item) => item.id === meeting.id) === index)
    .slice(0, 5);

  const formatActivityLine = (a: ActivityRecord) => {
    const actor = (a.actor_name || 'Someone').trim();
    const summary = (a.summary || '').trim();
    const action = (a.action || '').trim().toLowerCase();
    // Prefer summary alone when it already includes the verb (created/updated/deleted...)
    if (summary) {
      const alreadyHasVerb = /^(created|updated|deleted|added|removed|changed)\b/i.test(summary);
      if (alreadyHasVerb) return { actor, text: summary };
      if (action) return { actor, text: `${action} ${summary}` };
      return { actor, text: summary };
    }
    return { actor, text: action || 'made an update' };
  };
  const goals = ((goalsQuery.data || []) as GoalRecord[]).slice(0, 6);
  const chartData = [
    {
      name: 'Projects',
      value: asNumber(payload?.projects?.active ?? projectsTotal),
      secondary: projectsTotal,
    },
    {
      name: 'Tasks',
      value: asNumber(payload?.team_productivity?.in_progress ?? openTasks),
      secondary: asNumber(payload?.team_productivity?.completed),
    },
    {
      name: 'Goals',
      value: asNumber(payload?.goals?.average_progress),
      secondary: asNumber(payload?.goals?.total),
    },
    {
      name: 'Net',
      value: asNumber(payload?.financials?.net ?? revenue),
      secondary: asNumber(payload?.financials?.total_revenue ?? revenue),
    },
  ];
  const quickActions = [
    { label: 'View product', href: '/product' },
    { label: 'Review tasks', href: '/tasks' },
    { label: 'Create goal', href: '/goals/create' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>
        <p className="text-ink-muted mt-1 text-sm">
          Here&apos;s what&apos;s happening across your workspace today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsFromApi.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-ink">Performance overview</h3>
          </div>
          <SimpleAreaChart data={chartData} dataKey="value" secondaryKey="secondary" height={280} />
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-ink mb-4">Quick actions</h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={`${basePath}${action.href.startsWith('/') ? action.href : `/${action.href}`}`}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm text-ink hover:border-brand/40 hover:bg-bg-muted transition-colors"
              >
                {action.label}
                <Sparkles className="h-4 w-4 text-ink-muted" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-medium text-ink mb-4">Recent activity</h3>
          <ul className="space-y-3">
            {activities.length === 0 ? (
              <EmptyState title="No recent activity" description="Activity will appear as work is updated." />
            ) : (activities as ActivityRecord[]).map((a) => {
              const line = formatActivityLine(a);
              return (
              <li key={a.id} className="flex gap-3 text-sm">
                <Avatar size="sm" name={line.actor} />
                <div>
                  <p className="text-ink">
                    <span className="text-ink font-medium">{line.actor}</span>{' '}
                    <span className="text-ink-secondary">{line.text}</span>
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {a.created_at ? new Date(a.created_at).toLocaleString() : ''}
                  </p>
                </div>
              </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-ink mb-4">Upcoming meetings</h3>
          <ul className="space-y-3">
            {meetings.length === 0 ? (
              <EmptyState title="No upcoming meetings" description="Scheduled meetings will appear here." />
            ) : meetings.map((m) => (
              <li
                key={m.id}
                className="flex items-start gap-3 rounded-lg border border-border p-3"
              >
                <div className="rounded-lg bg-bg-muted p-2">
                  <CalendarIcon className="h-4 w-4 text-ink-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{m.title}</p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {m.dueDate ? new Date(m.dueDate).toLocaleString() : 'Schedule pending'}
                  </p>
                  {m.location && <p className="text-xs text-ink-muted mt-0.5">{m.location}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-medium text-ink mb-4">Goals & capacity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.length === 0 ? (
            <EmptyState title="No active goals" description="Create a goal to begin tracking progress." />
          ) : goals.map((m) => (
            <Progress
              key={m.id}
              value={Math.min(100, Number(m.progress ?? 0))}
              label={m.title}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function MessagesView({ breadcrumbs }: { breadcrumbs: { label: string; href?: string }[] }) {
  const { data: channels = [], isLoading } = useChannels();
  const [activeId, setActiveId] = useState<string>('');
  const [draft, setDraft] = useState('');
  const channelId = activeId || channels[0]?.id || '';
  const { data: messages = [] } = useChannelMessages(channelId);
  const send = useSendMessage();
  const user = useAuthStore((s) => s.user);
  const channelItems = channels as ChannelRecord[];
  const messageItems = messages as ChannelMessage[];
  const activeChannel = channelItems.find((channel) => channel.id === channelId) || channelItems[0];

  return (
    <div>
      <PageHeader title="Messages" description="Team channels and conversations." breadcrumbs={breadcrumbs} />
      <Card padding="none" className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] min-h-[480px]">
          <aside className="border-b md:border-b-0 md:border-r border-border overflow-y-auto max-h-[480px]">
            {isLoading && <p className="p-4 text-sm text-ink-muted">Loading channels...</p>}
            {!isLoading && channels.length === 0 && (
              <p className="p-4 text-sm text-ink-muted">No channels yet. Create one from the API or seed data.</p>
            )}
            {channelItems.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                className={cnThread(t.id === channelId)}
              >
                <Avatar size="sm" name={t.name} />
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-medium text-ink truncate">{t.name}</p>
                  <p className="text-xs text-ink-muted truncate">{t.description || t.type || 'Channel'}</p>
                </div>
              </button>
            ))}
          </aside>
          <div className="flex flex-col">
            <div className="px-4 py-3 border-b border-border flex items-center gap-3">
              <Avatar size="sm" name={activeChannel?.name || 'Channel'} />
              <div>
                <p className="text-sm font-medium text-ink">{activeChannel?.name || 'Select a channel'}</p>
                <p className="text-xs text-ink-muted">{activeChannel?.type || 'Workspace'}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[320px]">
              {messageItems.map((m) => {
                const self = m.sender_id === user?.id || m.user_id === user?.id;
                return (
                  <div key={m.id} className={`flex ${self ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        self ? 'bg-brand text-ink-inverse' : 'bg-bg-muted text-ink border border-border'
                      }`}
                    >
                      <p>{m.content || m.text}</p>
                      <p className={`text-[10px] mt-1 ${self ? 'text-ink-inverse/70' : 'text-ink-muted'}`}>
                        {m.created_at ? new Date(m.created_at).toLocaleTimeString() : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <form
              className="p-3 border-t border-border flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!draft.trim() || !channelId) return;
                await send.mutateAsync({ channelId, content: draft.trim() });
                setDraft('');
              }}
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message..."
                className="flex-1"
                disabled={!channelId}
              />
              <Button type="submit" loading={send.isPending} aria-label="Send" disabled={!channelId}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}

function cnThread(active: boolean) {
  return `w-full flex items-center gap-3 px-3 py-3 border-b border-border/80 hover:bg-bg-muted transition-colors ${
    active ? 'bg-bg-muted' : ''
  }`;
}

function AiView({ breadcrumbs }: { breadcrumbs: { label: string; href?: string }[] }) {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Hi — I’m your TechOS assistant. Ask about projects, budgets, or sprint status.',
    },
  ]);
  const mutation = useSendChatMessage();

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        description="Ask questions about your organization and workspace."
        breadcrumbs={breadcrumbs}
      />
      <Card className="max-w-3xl space-y-4">
        <div className="space-y-3 min-h-[280px]">
          {history.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-brand text-ink-inverse flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm max-w-[85%] ${
                  m.role === 'user'
                    ? 'bg-brand text-ink-inverse'
                    : 'bg-bg-muted border border-border text-ink'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!prompt.trim()) return;
            const q = prompt.trim();
            setPrompt('');
            setHistory((h) => [...h, { role: 'user', text: q }]);
            try {
              const response = await mutation.mutateAsync({ message: q });
              const content = response?.data?.message || response?.message;
              if (!content) throw new Error('The assistant returned an empty response.');
              setHistory((h) => [...h, { role: 'assistant', text: content }]);
            } catch (error: unknown) {
              toast.error(error instanceof Error ? error.message : 'Unable to get an assistant response');
            }
          }}
        >
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything about your workspace..."
            className="flex-1"
          />
          <Button type="submit" loading={mutation.isPending}>
            Ask
          </Button>
        </form>
      </Card>
    </div>
  );
}

function SettingsView({ breadcrumbs }: { breadcrumbs: { label: string; href?: string }[] }) {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateMyProfile();
  const updatePassword = useUpdateMyPassword();
  const { data: orgData } = useOrganization();
  const updateOrg = useUpdateOrganization();
  const org = orgData?.data || orgData;
  const [name, setName] = useState(`${user?.firstName || ''} ${user?.lastName || ''}`.trim());
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [orgName, setOrgName] = useState('');

  return (
    <div>
      <PageHeader title="Settings" description="Account and workspace preferences." breadcrumbs={breadcrumbs} />
      <Tabs defaultValue="profile">
        <TabList aria-label="Settings sections">
          <Tab value="profile">Profile</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="organization">Organization</Tab>
        </TabList>
        <TabPanel value="profile">
          <Card className="max-w-xl space-y-4">
            <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" value={user?.email || ''} disabled />
            <Button
              loading={updateProfile.isPending}
              onClick={async () => {
                const parts = name.trim().split(/\s+/);
                await updateProfile.mutateAsync({
                  first_name: parts[0] || user?.firstName,
                  last_name: parts.slice(1).join(' ') || user?.lastName,
                });
                toast.success('Profile updated');
              }}
            >
              Save profile
            </Button>
          </Card>
        </TabPanel>
        <TabPanel value="security">
          <Card className="max-w-xl space-y-4">
            <p className="text-sm text-ink-muted">We recommend updating your password after first login.</p>
            <Input
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              loading={updatePassword.isPending}
              onClick={async () => {
                if (!currentPassword || newPassword.length < 8) {
                  toast.error('Enter current password and a new password (8+ chars)');
                  return;
                }
                await updatePassword.mutateAsync({ currentPassword, newPassword });
                toast.success('Password updated');
                setCurrentPassword('');
                setNewPassword('');
              }}
            >
              Update password
            </Button>
          </Card>
        </TabPanel>
        <TabPanel value="organization">
          <Card className="max-w-xl space-y-4">
            <Input
              label="Organization name"
              value={orgName || org?.name || ''}
              onChange={(e) => setOrgName(e.target.value)}
            />
            <Button
              loading={updateOrg.isPending}
              onClick={async () => {
                await updateOrg.mutateAsync({ name: orgName || org?.name });
              }}
            >
              Save organization
            </Button>
          </Card>
        </TabPanel>
      </Tabs>
    </div>
  );
}
