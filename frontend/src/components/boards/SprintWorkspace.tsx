'use client';

import { useMemo, useState } from 'react';
import { Flag, Target, Timer } from 'lucide-react';
import { type MockRecord } from '@/mocks';
import { SPRINT_COLUMNS } from '@/mocks/boards';
import { useEntityList, useUpdateEntity } from '@/hooks/useEntityApi';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Progress } from '@/components/UI/Progress';
import { PageHeader } from '@/components/UI/PageHeader';
import { EmptyState } from '@/components/UI/EmptyState';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { KanbanBoard } from '@/components/boards/KanbanBoard';
import { formatDate } from '@/lib/utils';

interface SprintWorkspaceProps {
  breadcrumbs?: { label: string; href?: string }[];
}

export function SprintWorkspace({ breadcrumbs }: SprintWorkspaceProps) {
  const { data: sprints = [], isLoading: sprintsLoading, isError: sprintsError } = useEntityList('sprints');
  const { data: tasks = [], isLoading: tasksLoading, isError: tasksError } = useEntityList('tasks');
  const updateSprint = useUpdateEntity('sprints');

  const activeSprint = sprints.find((s) => /active/i.test(String(s.status))) || sprints[0];
  const [selectedId, setSelectedId] = useState<string>('');
  const selected = sprints.find((s) => s.id === (selectedId || activeSprint?.id)) || activeSprint;

  const sprintTasks = useMemo(() => {
    if (!selected) return [] as MockRecord[];
    const sprintId = selected.id;
    const titleTag = selected.title;
    return (tasks as MockRecord[]).filter((task) => {
      const raw = task as MockRecord & { sprint_id?: string; sprintId?: string };
      return (
        raw.sprint_id === sprintId ||
        raw.sprintId === sprintId ||
        task.tags?.some((tag) => tag.toLowerCase().includes(String(titleTag).toLowerCase())) ||
        String(task.description || '').toLowerCase().includes(String(titleTag).toLowerCase())
      );
    });
  }, [selected, tasks]);

  const backlog = useMemo(() => {
    const tagged = new Set(sprintTasks.map((t) => t.id));
    return (tasks as MockRecord[]).filter((t) => !tagged.has(t.id)).slice(0, 8);
  }, [sprintTasks, tasks]);

  const doneCount = sprintTasks.filter((t) => /done|completed/i.test(t.status)).length;
  const progress = sprintTasks.length
    ? Math.round((doneCount / sprintTasks.length) * 100)
    : Number(selected?.progress) || 0;

  if (sprintsLoading || tasksLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (sprintsError || tasksError) {
    return <EmptyState title="Unable to load sprints" description="Refresh the page to try again." />;
  }

  if (!selected) {
    return <EmptyState title="No sprints yet" description="Create a sprint to start planning work." />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sprints"
        description="Sprint board with backlog and drag-and-drop workflow."
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={selected.id}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.title}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              variant="outline"
              loading={updateSprint.isPending}
              onClick={() =>
                updateSprint.mutate({
                  id: selected.id,
                  data: { ...selected, status: 'Active', title: selected.title },
                })
              }
            >
              {/active/i.test(String(selected.status)) ? 'Active' : 'Start sprint'}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-ink">{selected.title}</h2>
                <Badge variant={selected.statusVariant}>{selected.status}</Badge>
              </div>
              <p className="text-sm text-ink-muted mt-1">{selected.description}</p>
            </div>
            <div className="text-sm text-ink-secondary flex items-center gap-2">
              <Timer className="h-4 w-4 text-brand" />
              {selected.startDate ? formatDate(selected.startDate) : '—'} →{' '}
              {selected.dueDate ? formatDate(selected.dueDate) : '—'}
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} label={`Sprint progress · ${doneCount}/${sprintTasks.length} done`} showValue />
          </div>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Target className="h-4 w-4 text-brand" />
            Sprint goal
          </div>
          <p className="text-sm text-ink-secondary leading-relaxed">
            {selected.description || 'Ship committed work and keep the board healthy.'}
          </p>
          <div className="flex items-center gap-2 text-xs text-ink-muted pt-2 border-t border-border">
            <Flag className="h-3.5 w-3.5" />
            Owner: {selected.owner}
          </div>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-ink">{selected.title} board</h3>
          <p className="text-xs text-ink-muted">Drag cards between columns</p>
        </div>
        <KanbanBoard
          key={selected.id}
          embedded
          initialItems={sprintTasks}
          columns={SPRINT_COLUMNS}
          entityKey="tasks"
        />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-ink">Backlog</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {backlog.map((item: MockRecord) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-bg-muted/50 px-3 py-3 hover:border-brand/30 transition-colors"
            >
              <p className="text-sm font-medium text-ink">{item.title}</p>
              <div className="mt-2 flex items-center justify-between">
                <Badge variant={item.statusVariant} size="sm">
                  {item.status}
                </Badge>
                <span className="text-xs text-ink-muted">{item.owner}</span>
              </div>
            </div>
          ))}
          {backlog.length === 0 && (
            <p className="text-sm text-ink-muted col-span-full">Backlog is empty.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
