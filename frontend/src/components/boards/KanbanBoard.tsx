'use client';

import { useMemo, useState } from 'react';
import { Filter, GripVertical, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { MockRecord } from '@/mocks';
import {
  BoardColumn,
  BoardColumnId,
  TASK_COLUMNS,
  applyColumnMove,
  resolveColumnId,
} from '@/mocks/boards';
import { Avatar } from '@/components/UI/Avatar';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Input } from '@/components/UI/Input';
import { Modal } from '@/components/UI/Modal';
import { PageHeader } from '@/components/UI/PageHeader';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

const PRIORITY_VARIANT: Record<string, 'default' | 'success' | 'error' | 'warning' | 'info'> = {
  low: 'default',
  medium: 'warning',
  high: 'error',
  critical: 'error',
};

interface KanbanBoardProps {
  title?: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  initialItems: MockRecord[];
  columns?: BoardColumn[];
  /** Hide page header when nested inside another workspace (e.g. sprints) */
  embedded?: boolean;
}

export function KanbanBoard({
  title = 'Tasks',
  description = 'Drag cards between columns — Trello-style board (mock).',
  breadcrumbs,
  initialItems,
  columns = TASK_COLUMNS,
  embedded = false,
}: KanbanBoardProps) {
  const [items, setItems] = useState<MockRecord[]>(initialItems);
  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropCol, setDropCol] = useState<BoardColumnId | null>(null);
  const [active, setActive] = useState<MockRecord | null>(null);
  const [createCol, setCreateCol] = useState<BoardColumnId | null>(null);
  const [draftTitle, setDraftTitle] = useState('');

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q));
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      return matchesQuery && matchesPriority;
    });
  }, [items, query, priorityFilter]);

  const byColumn = (columnId: BoardColumnId) =>
    filtered.filter((item) => resolveColumnId(item.status, columns) === columnId);

  const moveItem = (itemId: string, columnId: BoardColumnId) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? applyColumnMove(item, columnId) : item)),
    );
    toast.success(`Moved to ${columns.find((c) => c.id === columnId)?.title}`);
  };

  const createCard = () => {
    if (!createCol || !draftTitle.trim()) return;
    const base = applyColumnMove(
      {
        id: `tsk-${Date.now()}`,
        title: draftTitle.trim(),
        status: 'To Do',
        statusVariant: 'default',
        owner: 'You',
        assignee: 'You',
        priority: 'medium',
        progress: 0,
        tags: ['Sprint 24'],
        description: 'Created from the board (mock).',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      createCol,
    );
    setItems((prev) => [base, ...prev]);
    setDraftTitle('');
    setCreateCol(null);
    toast.success('Card created (mock)');
  };

  return (
    <div className="space-y-5">
      {!embedded && (
        <PageHeader
          title={title}
          description={description}
          breadcrumbs={breadcrumbs}
          actions={
            <Button
              size="sm"
              onClick={() => {
                setCreateCol('todo');
                setDraftTitle('');
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New card
            </Button>
          }
        />
      )}

      <Card className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cards, owners, tags..."
            className="w-full rounded-xl bg-bg-muted border border-transparent pl-10 pr-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:bg-surface"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-ink-muted" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl bg-bg-muted border border-transparent px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
          >
            <option value="all">All priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </Card>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {columns.map((column) => {
          const cards = byColumn(column.id);
          const isDropTarget = dropCol === column.id;
          return (
            <section
              key={column.id}
              className={cn(
                'w-[280px] shrink-0 rounded-2xl bg-bg-muted/70 border border-border flex flex-col max-h-[calc(100vh-220px)]',
                isDropTarget && 'ring-2 ring-brand/40 bg-brand-mist/40',
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDropCol(column.id);
              }}
              onDragLeave={() => setDropCol((c) => (c === column.id ? null : c))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/card-id') || draggingId;
                if (id) moveItem(id, column.id);
                setDraggingId(null);
                setDropCol(null);
              }}
            >
              <header className={cn('px-3 py-3 border-b border-border border-t-4 rounded-t-2xl bg-surface', column.accent)}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-ink">
                    {column.title}
                    <span className="ml-2 text-ink-muted font-medium">{cards.length}</span>
                  </h3>
                  <button
                    type="button"
                    aria-label={`Add to ${column.title}`}
                    onClick={() => {
                      setCreateCol(column.id);
                      setDraftTitle('');
                    }}
                    className="p-1 rounded-lg text-ink-muted hover:bg-surface-hover hover:text-ink"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                {cards.map((card) => (
                  <article
                    key={card.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggingId(card.id);
                      e.dataTransfer.setData('text/card-id', card.id);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDropCol(null);
                    }}
                    onClick={() => setActive(card)}
                    className={cn(
                      'group cursor-grab active:cursor-grabbing rounded-xl border border-border bg-surface p-3 shadow-sm hover:shadow-md hover:border-brand/30 transition-all',
                      draggingId === card.id && 'opacity-50',
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 mt-0.5 text-ink-muted opacity-0 group-hover:opacity-100 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink leading-snug">{card.title}</p>
                        {card.tags && card.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {card.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-brand-mist px-1.5 py-0.5 text-[10px] font-medium text-brand"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {card.priority && (
                              <Badge variant={PRIORITY_VARIANT[card.priority] || 'default'} size="sm">
                                {card.priority}
                              </Badge>
                            )}
                          </div>
                          <Avatar size="sm" name={card.assignee || card.owner} />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
                {cards.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border px-3 py-8 text-center text-xs text-ink-muted">
                    Drop cards here
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <Modal isOpen={!!active} onClose={() => setActive(null)} title={active?.title} size="lg">
        {active && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant={active.statusVariant}>{active.status}</Badge>
              {active.priority && (
                <Badge variant={PRIORITY_VARIANT[active.priority] || 'default'}>{active.priority}</Badge>
              )}
            </div>
            <p className="text-ink-secondary">{active.description}</p>
            <dl className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs text-ink-muted">Assignee</dt>
                <dd className="mt-1 text-ink">{active.assignee || active.owner}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Updated</dt>
                <dd className="mt-1 text-ink">{formatDate(active.updatedAt)}</dd>
              </div>
              {active.dueDate && (
                <div>
                  <dt className="text-xs text-ink-muted">Due</dt>
                  <dd className="mt-1 text-ink">{formatDate(active.dueDate)}</dd>
                </div>
              )}
              {typeof active.progress === 'number' && (
                <div>
                  <dt className="text-xs text-ink-muted">Progress</dt>
                  <dd className="mt-1 text-ink">{active.progress}%</dd>
                </div>
              )}
            </dl>
            <div className="flex flex-wrap gap-2 pt-2">
              {columns.map((col) => (
                <Button
                  key={col.id}
                  size="sm"
                  variant={resolveColumnId(active.status, columns) === col.id ? 'primary' : 'outline'}
                  onClick={() => {
                    moveItem(active.id, col.id);
                    setActive((prev) => (prev ? applyColumnMove(prev, col.id) : prev));
                  }}
                >
                  {col.title}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!createCol}
        onClose={() => setCreateCol(null)}
        title={`New card · ${columns.find((c) => c.id === createCol)?.title || ''}`}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            required
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreateCol(null)}>
              Cancel
            </Button>
            <Button onClick={createCard} disabled={!draftTitle.trim()}>
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
