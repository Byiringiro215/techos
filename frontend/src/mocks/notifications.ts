import { NotificationItem } from './types';

function iso(offsetHours: number): string {
  const d = new Date();
  d.setUTCMinutes(0, 0, 0);
  d.setUTCHours(d.getUTCHours() - offsetHours);
  return d.toISOString();
}

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-001',
    title: 'New comment on "Billing Engine V2"',
    body: 'Marcus Webb mentioned you: "Can you double-check the currency rounding logic before we merge?"',
    time: iso(1),
    read: false,
    type: 'info',
  },
  {
    id: 'notif-002',
    title: 'Invoice INV-2026-0143 was sent',
    body: 'Your invoice to Vertex Health for $8,600 was delivered successfully.',
    time: iso(4),
    read: true,
    type: 'success',
  },
  {
    id: 'notif-003',
    title: 'Sprint 24 ends in 2 days',
    body: 'You have 3 open tasks remaining before the sprint closes on Friday.',
    time: iso(6),
    read: false,
    type: 'warning',
  },
  {
    id: 'notif-004',
    title: 'Code review requested',
    body: 'Sofia Martinez requested your review on "refactor: sprint board drag-and-drop".',
    time: iso(9),
    read: false,
    type: 'info',
  },
  {
    id: 'notif-005',
    title: 'Deal "Solstice Bank - Renewal" won',
    body: 'Congratulations! The two-year renewal closed at $152,000.',
    time: iso(20),
    read: true,
    type: 'success',
  },
  {
    id: 'notif-006',
    title: 'Leave request awaiting your approval',
    body: 'Ethan Brooks requested one week of vacation starting in 15 days.',
    time: iso(26),
    read: false,
    type: 'warning',
  },
  {
    id: 'notif-007',
    title: 'Production deploy succeeded',
    body: 'techos-web v2.3.2 deployed successfully with zero downtime.',
    time: iso(30),
    read: true,
    type: 'success',
  },
  {
    id: 'notif-008',
    title: 'Ticket escalated: Billing charged twice',
    body: 'A critical ticket from Solstice Bank was escalated to the finance team.',
    time: iso(36),
    read: false,
    type: 'error',
  },
];

export function getUnreadCount(): number {
  return mockNotifications.filter((n) => !n.read).length;
}
