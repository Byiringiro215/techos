'use client';

import { useMemo, useState } from 'react';
import { DataTable, type Column } from '@/components/UI/DataTable';
import { PageHeader } from '@/components/UI/PageHeader';
import { Badge } from '@/components/UI/Badge';
import { Select } from '@/components/UI/Select';
import { useCisoAuditProjects, useUpdateAuditProjectStatus, type CisoAuditProject } from '@/hooks/useCiso';

const AUDIT_STATUS_OPTIONS = [
  { value: 'needed', label: 'Audit Needed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
] as const;

export default function CisoProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'needed' | 'in_progress' | 'completed'>('all');
  const queryFilter = statusFilter === 'all' ? undefined : statusFilter;
  const { data: projects = [], isLoading } = useCisoAuditProjects(queryFilter);
  const updateStatus = useUpdateAuditProjectStatus();

  const columns: Column<CisoAuditProject>[] = useMemo(
    () => [
      { key: 'name', header: 'Project', sortable: true },
      {
        key: 'status',
        header: 'Project Status',
        render: (row) => <Badge variant="default">{row.status}</Badge>,
      },
      {
        key: 'audit_status',
        header: 'Audit Status',
        sortable: true,
        render: (row) => {
          const variant = row.audit_status === 'completed' ? 'success' : row.audit_status === 'in_progress' ? 'info' : 'warning';
          return <Badge variant={variant}>{row.audit_status.replace('_', ' ')}</Badge>;
        },
      },
      {
        key: 'priority',
        header: 'Priority',
        render: (row) => (
          <Badge variant={row.priority === 'critical' || row.priority === 'high' ? 'error' : 'default'}>
            {row.priority}
          </Badge>
        ),
      },
      {
        key: 'action',
        header: 'Set Audit Status',
        render: (row) => (
          <Select
            value={row.audit_status}
            onChange={(e) =>
              updateStatus.mutate({
                id: row.id,
                audit_status: e.target.value as 'needed' | 'in_progress' | 'completed',
              })
            }
            className="min-w-[140px]"
          >
            {AUDIT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ),
      },
    ],
    [updateStatus],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Project Security Audits"
        description="Projects requiring an audit, or with audits currently in progress."
        actions={
          <div className="w-56">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'needed' | 'in_progress' | 'completed')}
            >
              <option value="all">All audit statuses</option>
              {AUDIT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={projects}
        isLoading={isLoading}
        searchKeys={['name', 'status', 'priority', 'audit_status']}
        pageSize={10}
        getRowId={(row) => row.id}
        emptyTitle="No audit projects found"
        emptyDescription="Projects with required audits will appear here."
      />
    </div>
  );
}
