'use client';

import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/UI/DataTable';
import { PageHeader } from '@/components/UI/PageHeader';
import { Badge } from '@/components/UI/Badge';
import { Select } from '@/components/UI/Select';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { TextArea } from '@/components/UI/TextArea';
import { Modal } from '@/components/UI/Modal';
import {
  useCisoAuditProjects,
  useCreateProjectAudit,
  useDeleteProjectAudit,
  useUpdateProjectAudit,
  type CisoAuditProject,
} from '@/hooks/useCiso';

const AUDIT_STATUS_OPTIONS = [
  { value: 'needed', label: 'Audit Needed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
] as const;

type AuditForm = {
  name: string;
  description: string;
  status: 'needed' | 'in_progress' | 'completed';
};

const EMPTY_FORM: AuditForm = { name: '', description: '', status: 'needed' };

export default function CisoProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'needed' | 'in_progress' | 'completed'>('all');
  const queryFilter = statusFilter === 'all' ? undefined : statusFilter;
  const { data: projects = [], isLoading } = useCisoAuditProjects(queryFilter);
  const createAudit = useCreateProjectAudit();
  const updateAudit = useUpdateProjectAudit();
  const deleteAudit = useDeleteProjectAudit();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CisoAuditProject | null>(null);
  const [form, setForm] = useState<AuditForm>(EMPTY_FORM);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (row: CisoAuditProject) => {
    setEditing(row);
    setForm({
      name: row.name || '',
      description: row.description || '',
      status: (row.status as AuditForm['status']) || 'needed',
    });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
    };
    if (editing) {
      await updateAudit.mutateAsync({ id: editing.id, data: payload });
    } else {
      await createAudit.mutateAsync(payload);
    }
    setModalOpen(false);
  };

  const columns: Column<CisoAuditProject>[] = useMemo(
    () => [
      { key: 'name', header: 'Audit', sortable: true },
      {
        key: 'description',
        header: 'Description',
        render: (row) => (
          <span className="text-ink-secondary line-clamp-2">{row.description || '—'}</span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (row) => {
          const variant = row.status === 'completed' ? 'success' : row.status === 'in_progress' ? 'info' : 'warning';
          return <Badge variant={variant}>{(row.status || 'needed').replace('_', ' ')}</Badge>;
        },
      },
      {
        key: 'task_count',
        header: 'Tasks',
        render: (row) => <span className="tabular-nums">{row.task_count ?? 0}</span>,
      },
      {
        key: 'action',
        header: '',
        render: (row) => (
          <div className="flex items-center justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="danger" onClick={() => setConfirmId(row.id)}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const saving = createAudit.isPending || updateAudit.isPending;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Project Audits"
        description="Create and manage security audits. Each audit can have its own tasks."
        actions={
          <>
            <div className="w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              >
                <option value="all">All statuses</option>
                {AUDIT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create audit
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        data={projects}
        isLoading={isLoading}
        searchKeys={['name', 'description', 'status']}
        pageSize={10}
        getRowId={(row) => row.id}
        emptyTitle="No project audits yet"
        emptyDescription="Create an audit first, then add tasks against it."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit project audit' : 'Create project audit'}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <Input
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Q3 access-control audit"
          />
          <TextArea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="What this audit covers and why it is needed"
            rows={4}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as AuditForm['status'] }))}
          >
            {AUDIT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.name.trim()} loading={saving}>
              {editing ? 'Save changes' : 'Create audit'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!confirmId} onClose={() => setConfirmId(null)} title="Delete project audit?">
        <p className="text-sm text-ink-secondary">
          This also deletes every audit task attached to this project audit.
        </p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setConfirmId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleteAudit.isPending}
            onClick={async () => {
              if (!confirmId) return;
              await deleteAudit.mutateAsync(confirmId);
              setConfirmId(null);
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
