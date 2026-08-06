import { MockRecord, StatusVariant } from './types';

export type BoardColumnId = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'blocked';

export interface BoardColumn {
  id: BoardColumnId;
  title: string;
  accent: string;
  statuses: string[];
}

export const TASK_COLUMNS: BoardColumn[] = [
  { id: 'todo', title: 'To Do', accent: 'border-t-ink-muted', statuses: ['To Do', 'todo', 'Open', 'Backlog'] },
  { id: 'in_progress', title: 'In Progress', accent: 'border-t-brand', statuses: ['In Progress', 'in_progress', 'Active'] },
  { id: 'in_review', title: 'In Review', accent: 'border-t-warning', statuses: ['In Review', 'Review', 'in_review'] },
  { id: 'blocked', title: 'Blocked', accent: 'border-t-danger', statuses: ['Blocked', 'blocked'] },
  { id: 'done', title: 'Done', accent: 'border-t-success', statuses: ['Done', 'done', 'Completed', 'Closed', 'Resolved'] },
];

export const SPRINT_COLUMNS: BoardColumn[] = [
  { id: 'todo', title: 'To Do', accent: 'border-t-ink-muted', statuses: ['To Do', 'todo'] },
  { id: 'in_progress', title: 'In Progress', accent: 'border-t-brand', statuses: ['In Progress', 'in_progress'] },
  { id: 'in_review', title: 'In Review', accent: 'border-t-warning', statuses: ['In Review', 'in_review'] },
  { id: 'done', title: 'Done', accent: 'border-t-success', statuses: ['Done', 'done', 'Completed'] },
];

const COLUMN_STATUS_LABEL: Record<BoardColumnId, { status: string; statusVariant: StatusVariant }> = {
  backlog: { status: 'Backlog', statusVariant: 'default' },
  todo: { status: 'To Do', statusVariant: 'default' },
  in_progress: { status: 'In Progress', statusVariant: 'info' },
  in_review: { status: 'In Review', statusVariant: 'warning' },
  blocked: { status: 'Blocked', statusVariant: 'error' },
  done: { status: 'Done', statusVariant: 'success' },
};

export function resolveColumnId(status: string, columns: BoardColumn[]): BoardColumnId {
  const match = columns.find((col) =>
    col.statuses.some((s) => s.toLowerCase() === status.toLowerCase()),
  );
  return match?.id || 'todo';
}

export function applyColumnMove(item: MockRecord, columnId: BoardColumnId): MockRecord {
  const mapped = COLUMN_STATUS_LABEL[columnId];
  return {
    ...item,
    status: mapped.status,
    statusVariant: mapped.statusVariant,
    progress:
      columnId === 'done'
        ? 100
        : columnId === 'todo' || columnId === 'backlog'
          ? 0
          : typeof item.progress === 'number'
            ? item.progress
            : 40,
    updatedAt: new Date().toISOString(),
  };
}

export function getBoardTasks(_sprintTag?: string): MockRecord[] {
  return [];
}

export function getActiveSprint(): MockRecord | undefined {
  return undefined;
}
