import { MessageThread } from './types';

function iso(offsetMinutes: number): string {
  const d = new Date();
  d.setUTCSeconds(0, 0);
  d.setUTCMinutes(d.getUTCMinutes() - offsetMinutes);
  return d.toISOString();
}

export const mockMessageThreads: MessageThread[] = [
  {
    id: 'thread-001',
    name: 'Marcus Webb',
    avatar: 'MW',
    role: 'CTO',
    lastMessage: "Let's sync on the billing engine architecture before standup.",
    time: iso(12),
    unread: 2,
    online: true,
    messages: [
      { id: 'msg-001-1', sender: 'Marcus Webb', text: 'Hey, did you get a chance to look at the ADR for the API gateway consolidation?', time: iso(90) },
      { id: 'msg-001-2', sender: 'You', text: 'Yes, I left a few comments about rate limiting defaults.', time: iso(75), self: true },
      { id: 'msg-001-3', sender: 'Marcus Webb', text: 'Perfect, I\'ll address those today.', time: iso(60) },
      { id: 'msg-001-4', sender: 'Marcus Webb', text: "Let's sync on the billing engine architecture before standup.", time: iso(12) },
    ],
  },
  {
    id: 'thread-002',
    name: 'Sofia Martinez',
    avatar: 'SM',
    role: 'Backend Engineer',
    lastMessage: 'Pushed a fix for the flaky checkout test, can you re-run CI?',
    time: iso(45),
    unread: 0,
    online: true,
    messages: [
      { id: 'msg-002-1', sender: 'Sofia Martinez', text: 'The checkout e2e test keeps failing intermittently.', time: iso(180) },
      { id: 'msg-002-2', sender: 'You', text: 'Probably a timing issue with the cart totals calculation.', time: iso(170), self: true },
      { id: 'msg-002-3', sender: 'Sofia Martinez', text: 'Pushed a fix for the flaky checkout test, can you re-run CI?', time: iso(45) },
    ],
  },
  {
    id: 'thread-003',
    name: 'Priya Sharma',
    avatar: 'PS',
    role: 'VP of Finance',
    lastMessage: 'Invoice for Solstice Bank has been sent, thanks for the quick turnaround.',
    time: iso(120),
    unread: 0,
    online: false,
    messages: [
      { id: 'msg-003-1', sender: 'You', text: 'The Solstice Bank invoice is ready for review whenever you have a moment.', time: iso(200), self: true },
      { id: 'msg-003-2', sender: 'Priya Sharma', text: 'Looks good, please send it over.', time: iso(150) },
      { id: 'msg-003-3', sender: 'Priya Sharma', text: 'Invoice for Solstice Bank has been sent, thanks for the quick turnaround.', time: iso(120) },
    ],
  },
  {
    id: 'thread-004',
    name: 'Liam Nguyen',
    avatar: 'LN',
    role: 'Lead Product Designer',
    lastMessage: 'The new empty states are live in the design system library.',
    time: iso(240),
    unread: 1,
    online: true,
    messages: [
      { id: 'msg-004-1', sender: 'Liam Nguyen', text: 'Working on the empty-state illustrations for reports.', time: iso(400) },
      { id: 'msg-004-2', sender: 'You', text: 'Awesome, can you share previews when ready?', time: iso(390), self: true },
      { id: 'msg-004-3', sender: 'Liam Nguyen', text: 'The new empty states are live in the design system library.', time: iso(240) },
    ],
  },
  {
    id: 'thread-005',
    name: 'Noah Rodriguez',
    avatar: 'NR',
    role: 'Customer Support Lead',
    lastMessage: 'Escalated the Solstice Bank billing ticket to your queue, flagged urgent.',
    time: iso(300),
    unread: 3,
    online: false,
    messages: [
      { id: 'msg-005-1', sender: 'Noah Rodriguez', text: 'We have a customer reporting duplicate charges.', time: iso(340) },
      { id: 'msg-005-2', sender: 'You', text: 'Send me the account details, I\'ll take a look now.', time: iso(330), self: true },
      { id: 'msg-005-3', sender: 'Noah Rodriguez', text: 'On it, sending the ticket link.', time: iso(320) },
      { id: 'msg-005-4', sender: 'Noah Rodriguez', text: 'Escalated the Solstice Bank billing ticket to your queue, flagged urgent.', time: iso(300) },
    ],
  },
  {
    id: 'thread-006',
    name: 'Grace Kim',
    avatar: 'GK',
    role: 'UX Researcher',
    lastMessage: 'Sharing the onboarding friction study readout deck now.',
    time: iso(600),
    unread: 0,
    online: false,
    messages: [
      { id: 'msg-006-1', sender: 'Grace Kim', text: 'Wrapping up the onboarding study this week.', time: iso(700) },
      { id: 'msg-006-2', sender: 'You', text: 'Excited to see the findings!', time: iso(650), self: true },
      { id: 'msg-006-3', sender: 'Grace Kim', text: 'Sharing the onboarding friction study readout deck now.', time: iso(600) },
    ],
  },
];

export function getThreadById(id: string) {
  return mockMessageThreads.find((thread) => thread.id === id);
}

export function getTotalUnreadMessages(): number {
  return mockMessageThreads.reduce((total, thread) => total + thread.unread, 0);
}
