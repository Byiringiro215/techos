'use client';

import { useMemo } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  getEntityById,
  mockEntities,
  resolveEntityKey,
  resolvePageKind,
  dashboardByRole,
  mockMessageThreads,
  type MockRecord,
  type MockUserRole,
} from '@/mocks';
import { useMockQuery, useMockMutation } from '@/hooks/useMockQuery';
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
  ArrowLeft,
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
    return <DashboardView roleKey={roleKey} basePath={basePath} />;
  }
  if (kind === 'messages') {
    return <MessagesView breadcrumbs={breadcrumbs} />;
  }
  if (kind === 'calendar') {
    return <CalendarBoard breadcrumbs={breadcrumbs} />;
  }
  if (kind === 'tasks') {
    return (
      <KanbanBoard
        title={title}
        description="Trello-style board — drag cards across columns. Mock data only."
        breadcrumbs={breadcrumbs}
        initialItems={mockEntities.tasks || []}
      />
    );
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
    return <AnalyticsView title={title} breadcrumbs={breadcrumbs} roleKey={roleKey} />;
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
  const mutation = useMockMutation({ successMessage: 'Bulk action completed (mock)' });

  const { data, isLoading } = useMockQuery(
    () => mockEntities[entityKey] || mockEntities.projects,
    [entityKey],
  );

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
        header: 'Owner',
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-2">
            <Avatar size="sm" name={row.owner} />
            <span>{row.owner}</span>
          </div>
        ),
      },
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
        header: 'Amount',
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
        render: (row) => (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-brand opacity-80 group-hover/row:opacity-100">
            View
            <ChevronRight className="h-4 w-4" />
          </span>
        ),
      },
    ],
    [],
  );

  const statuses = Array.from(new Set((data || []).map((r) => r.status)));

  return (
    <div className="space-y-2">
      <PageHeader
        title={title}
        description={`Browse, filter, and open ${entityLabel(entityKey).toLowerCase()} — click a row for the full record.`}
        breadcrumbs={breadcrumbs}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success('Export queued (mock)')}>
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
        data={data || []}
        isLoading={isLoading}
        searchKeys={['title', 'name', 'owner', 'company', 'status', 'description']}
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
        emptyTitle={`No ${entityLabel(entityKey).toLowerCase()} yet`}
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
        description={`This will remove ${pendingIds.length} item(s). Mock only — nothing is permanently deleted.`}
        confirmLabel="Delete"
        variant="danger"
        loading={mutation.isLoading}
        onConfirm={() => {
          mutation.mutate();
          setConfirmOpen(false);
        }}
      />

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title={`New ${entityLabel(entityKey)}`} size="lg">
        <CreateFormFields
          entityKey={entityKey}
          onDone={() => setCreateOpen(false)}
        />
      </Modal>
    </div>
  );
}

function CreateFormFields({ entityKey, onDone }: { entityKey: string; onDone: () => void }) {
  const mutation = useMockMutation({ successMessage: `${entityLabel(entityKey)} created (mock)` });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: '',
    owner: '',
    status: 'Draft',
    priority: 'medium',
    description: '',
    amount: '',
  });

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.owner.trim()) next.owner = 'Owner is required';
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
        await mutation.mutateAsync(form);
        onDone();
      }}
    >
      <Input
        label="Title"
        required
        value={form.title}
        error={errors.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder="Enter a clear title"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Owner"
          required
          value={form.owner}
          error={errors.owner}
          onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
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
      <TextArea
        label="Description"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        rows={3}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isLoading}>
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
  const mutation = useMockMutation({ successMessage: `${entityLabel(entityKey)} created (mock)` });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: '',
    owner: '',
    status: 'Draft',
    priority: 'medium',
    description: '',
    amount: '',
  });

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.owner.trim()) next.owner = 'Owner is required';
    if (form.description.trim().length > 0 && form.description.trim().length < 10) {
      next.description = 'Description must be at least 10 characters';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix validation errors');
      return;
    }
    await mutation.mutateAsync(form);
    router.back();
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={`Create a new ${entityLabel(entityKey).toLowerCase()}. Submission is mocked.`}
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
            <Input
              label="Owner"
              required
              value={form.owner}
              error={errors.owner}
              onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
              placeholder="Assignee name"
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
            error={errors.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Add context for this record"
            rows={4}
          />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={mutation.isLoading}>
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
  roleKey,
}: {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  roleKey: MockUserRole;
}) {
  const { data, isLoading } = useMockQuery(() => dashboardByRole[roleKey], [roleKey]);

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description="Analytics powered by sample data — swap for API responses later."
        breadcrumbs={breadcrumbs}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {data.stats.map((stat) => (
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
          <SimpleAreaChart data={data.chartData} dataKey="value" secondaryKey="secondary" height={260} />
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-ink mb-4">Comparison</h3>
          <SimpleBarChart data={data.chartData} dataKey="value" height={260} />
        </Card>
      </div>
      <Card>
        <h3 className="text-sm font-medium text-ink mb-4">Goal progress</h3>
        <div className="space-y-4">
          {data.metrics.map((m) => (
            <Progress
              key={m.id}
              value={Math.min(100, Math.round((m.value / m.target) * 100))}
              label={`${m.label} — ${m.value}${m.unit || ''} / ${m.target}${m.unit || ''}`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

export function DashboardView({ roleKey, basePath }: { roleKey: MockUserRole; basePath: string }) {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useMockQuery(() => dashboardByRole[roleKey], [roleKey]);

  if (isLoading || !data) {
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
        {data.stats.map((stat) => (
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
            <Badge variant="info" size="sm">
              Mock data
            </Badge>
          </div>
          <SimpleAreaChart data={data.chartData} dataKey="value" secondaryKey="secondary" height={280} />
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-ink mb-4">Quick actions</h3>
          <div className="space-y-2">
            {data.quickActions.map((action) => (
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
            {data.activities.map((a) => (
              <li key={a.id} className="flex gap-3 text-sm">
                <Avatar size="sm" name={a.actor} />
                <div>
                  <p className="text-ink">
                    <span className="text-ink font-medium">{a.actor}</span> {a.action}{' '}
                    <span className="text-ink">{a.target}</span>
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-ink mb-4">Upcoming meetings</h3>
          <ul className="space-y-3">
            {data.meetings.map((m) => (
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
                    {m.date} · {m.time} · {m.attendees} attendees
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
          {data.metrics.map((m) => (
            <Progress
              key={m.id}
              value={Math.min(100, Math.round((m.value / m.target) * 100))}
              label={`${m.label}`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function MessagesView({ breadcrumbs }: { breadcrumbs: { label: string; href?: string }[] }) {
  const [activeId, setActiveId] = useState(mockMessageThreads[0]?.id);
  const [draft, setDraft] = useState('');
  const thread = mockMessageThreads.find((t) => t.id === activeId) || mockMessageThreads[0];
  const send = useMockMutation({ successMessage: 'Message sent (mock)' });

  return (
    <div>
      <PageHeader title="Messages" description="Team conversations (mock)." breadcrumbs={breadcrumbs} />
      <Card padding="none" className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] min-h-[480px]">
          <aside className="border-b md:border-b-0 md:border-r border-border overflow-y-auto max-h-[480px]">
            {mockMessageThreads.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                className={cnThread(t.id === activeId)}
              >
                <Avatar size="sm" name={t.name} />
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink truncate">{t.name}</p>
                    <span className="text-[10px] text-ink-muted shrink-0">{t.time}</span>
                  </div>
                  <p className="text-xs text-ink-muted truncate">{t.lastMessage}</p>
                </div>
                {t.unread > 0 && (
                  <span className="text-[10px] bg-brand text-ink-inverse rounded-full px-1.5 py-0.5 font-medium">
                    {t.unread}
                  </span>
                )}
              </button>
            ))}
          </aside>
          <div className="flex flex-col">
            <div className="px-4 py-3 border-b border-border flex items-center gap-3">
              <Avatar size="sm" name={thread?.name} />
              <div>
                <p className="text-sm font-medium text-ink">{thread?.name}</p>
                <p className="text-xs text-ink-muted">{thread?.role || 'Teammate'}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[320px]">
              {thread?.messages.map((m) => (
                <div key={m.id} className={`flex ${m.self ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      m.self ? 'bg-brand text-ink-inverse' : 'bg-bg-muted text-ink border border-border'
                    }`}
                  >
                    <p>{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.self ? 'text-ink-inverse/70' : 'text-ink-muted'}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <form
              className="p-3 border-t border-border flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.trim()) return;
                send.mutate({ text: draft });
                setDraft('');
              }}
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message..."
                className="flex-1"
              />
              <Button type="submit" loading={send.isLoading} aria-label="Send">
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
      text: 'Hi — I\'m your TechOS assistant (mock). Ask about projects, budgets, or sprint status.',
    },
  ]);
  const mutation = useMockMutation({ successMessage: 'Response ready', delayMs: 700 });

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        description="Prototype assistant UI. Responses are mocked for Phase 1."
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
            await mutation.mutateAsync({ q });
            setHistory((h) => [
              ...h,
              {
                role: 'assistant',
                text: `Mock insight for “${q}”: based on sample data, you're tracking well against Q3 goals. Connect the real AI endpoint in Phase 2.`,
              },
            ]);
          }}
        >
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything about your workspace..."
            className="flex-1"
          />
          <Button type="submit" loading={mutation.isLoading}>
            Ask
          </Button>
        </form>
      </Card>
    </div>
  );
}

function SettingsView({ breadcrumbs }: { breadcrumbs: { label: string; href?: string }[] }) {
  const user = useAuthStore((s) => s.user);
  const mutation = useMockMutation({ successMessage: 'Settings saved (mock)' });
  const [name, setName] = useState(`${user?.firstName || ''} ${user?.lastName || ''}`.trim());
  const [email, setEmail] = useState(user?.email || '');
  const [tz, setTz] = useState('America/New_York');

  return (
    <div>
      <PageHeader title="Settings" description="Account and workspace preferences." breadcrumbs={breadcrumbs} />
      <Tabs defaultValue="profile">
        <TabList aria-label="Settings sections">
          <Tab value="profile">Profile</Tab>
          <Tab value="notifications">Notifications</Tab>
          <Tab value="security">Security</Tab>
        </TabList>
        <TabPanel value="profile">
          <Card className="max-w-xl space-y-4">
            <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Select label="Timezone" value={tz} onChange={(e) => setTz(e.target.value)}>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="UTC">UTC</option>
            </Select>
            <Button loading={mutation.isLoading} onClick={() => mutation.mutate({ name, email, tz })}>
              Save preferences
            </Button>
          </Card>
        </TabPanel>
        <TabPanel value="notifications">
          <Card className="max-w-xl space-y-3 text-sm text-ink-secondary">
            <p>Email digests, mention alerts, and billing notices — toggles are visual only in Phase 1.</p>
            <label className="flex items-center justify-between py-2 border-b border-border">
              <span>Product updates</span>
              <input type="checkbox" defaultChecked className="accent-white" />
            </label>
            <label className="flex items-center justify-between py-2 border-b border-border">
              <span>Mention notifications</span>
              <input type="checkbox" defaultChecked className="accent-white" />
            </label>
            <label className="flex items-center justify-between py-2">
              <span>Weekly summary</span>
              <input type="checkbox" className="accent-white" />
            </label>
          </Card>
        </TabPanel>
        <TabPanel value="security">
          <Card className="max-w-xl space-y-4">
            <p className="text-sm text-ink-muted">Password and session controls will connect to auth APIs later.</p>
            <Button variant="outline" onClick={() => toast.success('Password reset email mocked')}>
              Send password reset
            </Button>
          </Card>
        </TabPanel>
      </Tabs>
    </div>
  );
}
