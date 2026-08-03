import { CalendarEvent } from './types';

/** Returns an ISO date-only string for the given day offset from today. */
function dateOffset(offsetDays: number): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'evt-001',
    title: 'Weekly Exec Sync',
    date: dateOffset(1),
    startTime: '10:00',
    endTime: '11:00',
    type: 'meeting',
    location: 'Boardroom A',
    attendees: ['Alexandra Chen', 'Marcus Webb', 'Priya Sharma', 'Noah Rodriguez'],
    color: 'info',
    description: 'Weekly leadership sync covering company-wide priorities.',
  },
  {
    id: 'evt-002',
    title: 'Sprint 24 Planning',
    date: dateOffset(2),
    startTime: '14:00',
    endTime: '15:30',
    type: 'meeting',
    location: 'Zoom',
    attendees: ['Jordan Lee', 'Sofia Martinez', 'Ethan Brooks', 'Aisha Patel'],
    color: 'info',
    description: 'Plan scope and capacity for the upcoming two-week sprint.',
  },
  {
    id: 'evt-003',
    title: 'Sprint 24 Ends',
    date: dateOffset(8),
    startTime: '17:00',
    endTime: '17:00',
    type: 'deadline',
    color: 'warning',
    description: 'All committed Sprint 24 work should be merged and deployed.',
  },
  {
    id: 'evt-004',
    title: 'Nimbus Retail QBR',
    date: dateOffset(4),
    startTime: '11:00',
    endTime: '12:00',
    type: 'meeting',
    location: 'Zoom',
    attendees: ['Daniel Kim', 'Priya Sharma', 'Rachel Ortiz'],
    color: 'info',
    description: 'Quarterly business review with Nimbus Retail stakeholders.',
  },
  {
    id: 'evt-005',
    title: 'Invoice INV-2026-0143 Due',
    date: dateOffset(12),
    startTime: '00:00',
    endTime: '00:00',
    type: 'reminder',
    color: 'warning',
    description: 'Payment due date for Vertex Health invoice.',
  },
  {
    id: 'evt-006',
    title: 'Board Meeting - Q3 Review',
    date: dateOffset(12),
    startTime: '09:00',
    endTime: '11:00',
    type: 'meeting',
    location: 'Boardroom A',
    attendees: ['Alexandra Chen', 'Marcus Webb', 'Priya Sharma'],
    color: 'default',
    description: 'Quarterly board meeting covering financials and strategy.',
  },
  {
    id: 'evt-007',
    title: 'Candidate Interview: Wesley Chan',
    date: dateOffset(3),
    startTime: '15:00',
    endTime: '16:00',
    type: 'interview',
    location: 'Zoom',
    attendees: ['Marcus Webb', 'Jordan Lee'],
    color: 'info',
    description: 'On-site interview loop for the Senior Backend Engineer role.',
  },
  {
    id: 'evt-008',
    title: 'Architecture Review: Billing Engine V2',
    date: dateOffset(3),
    startTime: '13:00',
    endTime: '14:00',
    type: 'review',
    location: 'Zoom',
    attendees: ['Marcus Webb', 'Sofia Martinez', 'Aisha Patel'],
    color: 'default',
    description: 'Review proposed schema and service boundaries for billing V2.',
  },
  {
    id: 'evt-009',
    title: 'Design Critique',
    date: dateOffset(0),
    startTime: '13:00',
    endTime: '14:00',
    type: 'meeting',
    location: 'Design Studio',
    attendees: ['Liam Nguyen', 'Grace Kim', 'Ethan Brooks'],
    color: 'info',
    description: 'Weekly review of in-progress onboarding flow designs.',
  },
  {
    id: 'evt-010',
    title: 'Customer Advisory Board',
    date: dateOffset(6),
    startTime: '10:00',
    endTime: '11:30',
    type: 'meeting',
    location: 'Zoom',
    attendees: ['Priya Sharma', 'Noah Rodriguez'],
    color: 'error',
    description: 'Session with key customers to gather product feedback.',
  },
];

export function getEventsForDate(date: string): CalendarEvent[] {
  return mockCalendarEvents.filter((event) => event.date === date);
}
