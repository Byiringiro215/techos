'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/UI/PageHeader';
import { DataTable, type Column } from '@/components/UI/DataTable';
import { Badge } from '@/components/UI/Badge';
import { Select } from '@/components/UI/Select';
import { Button } from '@/components/UI/Button';
import { useCisoTasks, useUpdateCisoTaskStatus, type CisoTask } from '@/hooks/useCiso';

export default function CisoTasksPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'finished' | 'not_finished'>('all');
  const queryFilter = statusFilter === 'all' ? undefined : statusFilter;
  const { data: tasks = [], isLoading } = useCisoTasks(queryFilter);
  const updateStatus = useUpdateCisoTaskStatus();

  const columns: Column<CisoTask>[] = useMemo(
    () => [
      { key: 'title', header: 'Task', sortable: true },
      {
        key: 'status',
        header: 'Progress',
        sortable: true,
        render: (row) => (
          <Badge variant={row.finished ? 'success' : 'warning'}>
            {row.finished ? 'Finished' : 'Not Finished'}
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
        header: 'Action',
        render: (row) => (
          <Button
            size="sm"
            variant={row.finished ? 'outline' : 'primary'}
            onClick={() => updateStatus.mutate({ id: row.id, finished: !row.finished })}
          >
            Mark as {row.finished ? 'Not Finished' : 'Finished'}
          </Button>
        ),
      },
    ],
    [updateStatus],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="CISO Task Management"
        description="Track security task completion status across the organization."
        actions={
          <div className="w-52">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'finished' | 'not_finished')}
            >
              <option value="all">All tasks</option>
              <option value="finished">Finished</option>
              <option value="not_finished">Not finished</option>
            </Select>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={tasks}
        isLoading={isLoading}
        searchKeys={['title', 'status', 'priority']}
        pageSize={10}
        getRowId={(row) => row.id}
        emptyTitle="No security tasks found"
        emptyDescription="Tasks will appear here when created."
      />
    </div>
  );
}
