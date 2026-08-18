'use client';

import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/UI/PageHeader';
import { DataTable, type Column } from '@/components/UI/DataTable';
import { Badge } from '@/components/UI/Badge';
import { Select } from '@/components/UI/Select';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { TextArea } from '@/components/UI/TextArea';
import { Modal } from '@/components/UI/Modal';
import {
  useCisoAuditProjects,
  useCisoTasks,
  useCreateAuditTask,
  useDeleteAuditTask,
  useUpdateAuditTask,
  useUpdateCisoTaskStatus,
  type CisoTask,
} from '@/hooks/useCiso';

type TaskForm = {
  title: string;
  description: string;
  project_audit_id: string;
  priority: string;
};

const EMPTY_FORM: TaskForm = { title: '', description: '', project_audit_id: '', priority: 'medium' };

export default function CisoTasksPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'finished' | 'not_finished'>('all');
  const [auditFilter, setAuditFilter] = useState('');
  const queryFilter = statusFilter === 'all' ? undefined : statusFilter;
  const { data: tasks = [], isLoading } = useCisoTasks(queryFilter, auditFilter || undefined);
  const { data: audits = [] } = useCisoAuditProjects();
  const createTask = useCreateAuditTask();
  const updateTask = useUpdateAuditTask();
  const deleteTask = useDeleteAuditTask();
  const updateStatus = useUpdateCisoTaskStatus();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CisoTask | null>(null);
  const [form, setForm] = useState<TaskForm>(EMPTY_FORM);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      project_audit_id: auditFilter || audits[0]?.id || '',
    });
    setModalOpen(true);
  };

  const openEdit = (row: CisoTask) => {
    setEditing(row);
    setForm({
      title: row.title || '',
      description: row.description || '',
      project_audit_id: row.project_audit_id,
      priority: row.priority || 'medium',
    });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.project_audit_id) return;
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      project_audit_id: form.project_audit_id,
      priority: form.priority,
    };
    if (editing) {
      await updateTask.mutateAsync({ id: editing.id, data: payload });
    } else {
      await createTask.mutateAsync(payload);
    }
    setModalOpen(false);
  };

  const columns: Column<CisoTask>[] = useMemo(
    () => [
      { key: 'title', header: 'Task', sortable: true },
      {
        key: 'audit_name',
        header: 'Project audit',
        sortable: true,
        render: (row) => row.audit_name || '—',
      },
      {
        key: 'status',
        header: 'Progress',
        sortable: true,
        render: (row) => (
          <Badge variant={row.finished ? 'success' : 'warning'}>
            {row.finished ? 'Finished' : 'Not finished'}
          </Badge>
        ),
      },
      {
        key: 'priority',
        header: 'Priority',
        sortable: true,
        render: (row) => (
          <Badge variant={row.priority === 'critical' || row.priority === 'high' ? 'error' : 'default'}>
            {row.priority}
          </Badge>
        ),
      },
      {
        key: 'actions',
        header: '',
        render: (row) => (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              size="sm"
              variant={row.finished ? 'outline' : 'primary'}
              onClick={() => updateStatus.mutate({ id: row.id, finished: !row.finished })}
            >
              Mark {row.finished ? 'not finished' : 'finished'}
            </Button>
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
    [updateStatus],
  );

  const saving = createTask.isPending || updateTask.isPending;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Audit Tasks"
        description="Create tasks against a project audit so security work stays grouped."
        actions={
          <>
            <div className="w-52">
              <Select value={auditFilter} onChange={(e) => setAuditFilter(e.target.value)}>
                <option value="">All project audits</option>
                {audits.map((audit) => (
                  <option key={audit.id} value={audit.id}>
                    {audit.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-44">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              >
                <option value="all">All tasks</option>
                <option value="finished">Finished</option>
                <option value="not_finished">Not finished</option>
              </Select>
            </div>
            <Button onClick={openCreate} disabled={!audits.length}>
              <Plus className="h-4 w-4 mr-2" />
              Create task
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        data={tasks}
        isLoading={isLoading}
        searchKeys={['title', 'audit_name', 'status', 'priority']}
        pageSize={10}
        getRowId={(row) => row.id}
        emptyTitle={audits.length ? 'No audit tasks yet' : 'Create a project audit first'}
        emptyDescription={
          audits.length
            ? 'Add a task and pick which project audit it belongs to.'
            : 'Go to Project Audits and create an audit, then come back to add tasks.'
        }
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit audit task' : 'Create audit task'}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <Select
            label="Project audit"
            required
            value={form.project_audit_id}
            onChange={(e) => setForm((f) => ({ ...f, project_audit_id: e.target.value }))}
          >
            <option value="">Select a project audit</option>
            {audits.map((audit) => (
              <option key={audit.id} value={audit.id}>
                {audit.name}
              </option>
            ))}
          </Select>
          <Input
            label="Task name"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Review SSO session expiry"
          />
          <TextArea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="What needs to be checked or completed"
            rows={4}
          />
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
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.title.trim() || !form.project_audit_id} loading={saving}>
              {editing ? 'Save changes' : 'Create task'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!confirmId} onClose={() => setConfirmId(null)} title="Delete audit task?">
        <p className="text-sm text-ink-secondary">This task will be removed from its project audit.</p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setConfirmId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleteTask.isPending}
            onClick={async () => {
              if (!confirmId) return;
              await deleteTask.mutateAsync(confirmId);
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
