// Shared TypeScript types for the TechOS frontend mock data layer.
// Every mock module in `src/mocks` should build on these shapes so that
// generic UI components (tables, cards, charts, lists) can render any
// entity without bespoke per-entity typing.

export type StatusVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type TrendDirection = 'up' | 'down';

/**
 * Generic record shape used for every mock "entity" (projects, tasks, bugs,
 * invoices, leads, tickets, etc). Extra domain-specific fields are allowed
 * via the index signature so each entity can carry the fields relevant to
 * it (amount, progress, tags, email, company...) while still satisfying a
 * single shared contract for list/detail views.
 */
export interface MockRecord {
  id: string;
  title: string;
  name?: string;
  status: string;
  statusVariant: StatusVariant;
  owner: string;
  ownerAvatar?: string;
  ownerEmail?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  startDate?: string;
  description: string;
  priority?: Priority;
  amount?: number;
  currency?: string;
  progress?: number;
  tags?: string[];
  email?: string;
  company?: string;
  category?: string;
  assignee?: string;
  department?: string;
  location?: string;
  rating?: number;
  [key: string]: unknown;
}

export interface KpiStat {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon?: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  actorAvatar?: string;
  action: string;
  target: string;
  time: string;
  icon?: string;
}

export interface ChartPoint {
  month: string;
  value: number;
  secondary?: number;
  [key: string]: string | number | undefined;
}

export interface ProgressMetric {
  id: string;
  label: string;
  value: number;
  target: number;
  unit?: string;
}

export interface QuickAction {
  label: string;
  href: string;
  icon?: string;
}

export interface DashboardMeeting {
  id: string;
  title: string;
  time: string;
  date: string;
  attendees: number;
  location?: string;
}

export interface RoleDashboardData {
  stats: KpiStat[];
  activities: ActivityItem[];
  meetings: DashboardMeeting[];
  metrics: ProgressMetric[];
  chartData: ChartPoint[];
  quickActions: QuickAction[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface MessageBubble {
  id: string;
  sender: string;
  text: string;
  time: string;
  self?: boolean;
}

export interface MessageThread {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  messages: MessageBubble[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'deadline' | 'reminder' | 'event' | 'interview' | 'review';
  location?: string;
  attendees?: string[];
  color?: StatusVariant;
  description?: string;
}

export type MockUserRole =
  | 'ceo'
  | 'cto'
  | 'finance'
  | 'software_engineer'
  | 'ui_ux_designer'
  | 'customer_support';

export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: MockUserRole;
  department: string;
  title: string;
  status: 'active' | 'invited' | 'inactive';
  initials: string;
  location?: string;
  phone?: string;
  joinedAt: string;
}

export type PageKind =
  | 'list'
  | 'detail'
  | 'create'
  | 'analytics'
  | 'messages'
  | 'calendar'
  | 'tasks'
  | 'sprints'
  | 'teams'
  | 'ai'
  | 'settings'
  | 'dashboard'
  | 'form';
