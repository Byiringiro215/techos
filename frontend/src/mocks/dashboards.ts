import { MockUserRole, RoleDashboardData } from './types';

// Per-role dashboard content: KPI stats, recent activity, upcoming meetings,
// progress metrics, monthly chart series, and quick actions relative to the
// role's base route (e.g. `/ceo`, `/software-engineer`).

export const dashboardByRole: Record<MockUserRole, RoleDashboardData> = {
  ceo: {
    stats: [
      { id: 'ceo-stat-1', title: 'Annual Recurring Revenue', value: '$12.4M', change: '+12.5% vs last quarter', trend: 'up', icon: 'DollarSign' },
      { id: 'ceo-stat-2', title: 'Total Employees', value: '248', change: '+8 hires this month', trend: 'up', icon: 'Users' },
      { id: 'ceo-stat-3', title: 'Active Projects', value: '34', change: '6 launching this quarter', trend: 'up', icon: 'FolderKanban' },
      { id: 'ceo-stat-4', title: 'Net Revenue Retention', value: '118%', change: '+4.1% YoY', trend: 'up', icon: 'TrendingUp' },
    ],
    activities: [
      { id: 'ceo-act-1', actor: 'Priya Sharma', action: 'closed the renewal for', target: 'Solstice Bank ($152,000)', time: '25 minutes ago', icon: 'DollarSign' },
      { id: 'ceo-act-2', actor: 'Marcus Webb', action: 'shipped release', target: 'v2.3.2 hotfix', time: '2 hours ago', icon: 'Package' },
      { id: 'ceo-act-3', actor: 'Alexandra Chen', action: 'approved budget for', target: 'Q4 hiring plan', time: '4 hours ago', icon: 'CheckSquare' },
      { id: 'ceo-act-4', actor: 'Noah Rodriguez', action: 'escalated a ticket from', target: 'Solstice Bank (billing issue)', time: '6 hours ago', icon: 'AlertCircle' },
      { id: 'ceo-act-5', actor: 'Liam Nguyen', action: 'published', target: 'Design System 2.0 components', time: 'Yesterday', icon: 'FileText' },
    ],
    meetings: [
      { id: 'ceo-mtg-1', title: 'Weekly Exec Sync', time: '10:00 AM', date: 'Today', attendees: 6, location: 'Boardroom A' },
      { id: 'ceo-mtg-2', title: 'Board Meeting - Q3 Review', time: '9:00 AM', date: 'In 12 days', attendees: 9, location: 'Boardroom A' },
      { id: 'ceo-mtg-3', title: 'Nimbus Retail QBR', time: '11:00 AM', date: 'In 4 days', attendees: 5, location: 'Zoom' },
    ],
    metrics: [
      { id: 'ceo-metric-1', label: 'Revenue Goal ($18M ARR)', value: 12.4, target: 18 },
      { id: 'ceo-metric-2', label: 'Hiring Goal (12 engineers)', value: 7, target: 12 },
      { id: 'ceo-metric-3', label: 'SOC 2 Type II Certification', value: 75, target: 100, unit: '%' },
      { id: 'ceo-metric-4', label: 'Customer NPS Target (55)', value: 47, target: 55 },
    ],
    chartData: [
      { month: 'Feb', value: 890000, secondary: 210000 },
      { month: 'Mar', value: 940000, secondary: 225000 },
      { month: 'Apr', value: 985000, secondary: 240000 },
      { month: 'May', value: 1020000, secondary: 238000 },
      { month: 'Jun', value: 1080000, secondary: 252000 },
      { month: 'Jul', value: 1145000, secondary: 261000 },
      { month: 'Aug', value: 1210000, secondary: 274000 },
    ],
    quickActions: [
      { label: 'Financial Overview', href: '/finance', icon: 'DollarSign' },
      { label: 'Company Analytics', href: '/analytics', icon: 'TrendingUp' },
      { label: 'Team Overview', href: '/hr/employees', icon: 'Users' },
      { label: 'Strategic Goals', href: '/goals', icon: 'Target' },
    ],
  },

  cto: {
    stats: [
      { id: 'cto-stat-1', title: 'Active Projects', value: '11', change: '3 shipping this sprint', trend: 'up', icon: 'FolderKanban' },
      { id: 'cto-stat-2', title: 'Sprint Velocity', value: '87 pts', change: '+9 pts vs last sprint', trend: 'up', icon: 'CheckSquare' },
      { id: 'cto-stat-3', title: 'Critical Bugs', value: '5', change: '-3 since last week', trend: 'down', icon: 'AlertCircle' },
      { id: 'cto-stat-4', title: 'Engineering Team', value: '42', change: '+2 new hires', trend: 'up', icon: 'Users' },
    ],
    activities: [
      { id: 'cto-act-1', actor: 'Aisha Patel', action: 'opened a review on', target: 'Windows CI runner fix', time: '15 minutes ago', icon: 'Code' },
      { id: 'cto-act-2', actor: 'Jordan Lee', action: 'merged', target: 'offline sync queue for mobile', time: '1 hour ago', icon: 'GitMerge' },
      { id: 'cto-act-3', actor: 'Ethan Brooks', action: 'deployed', target: 'techos-analytics v0.8.0 to production', time: '3 hours ago', icon: 'Rocket' },
      { id: 'cto-act-4', actor: 'Sofia Martinez', action: 'flagged a flaky test in', target: 'checkout integration suite', time: '5 hours ago', icon: 'AlertCircle' },
      { id: 'cto-act-5', actor: 'Marcus Webb', action: 'proposed', target: 'ADR-015: Consolidate API gateways', time: 'Yesterday', icon: 'FileText' },
    ],
    meetings: [
      { id: 'cto-mtg-1', title: 'Architecture Review: Billing Engine V2', time: '1:00 PM', date: 'In 3 days', attendees: 7, location: 'Zoom' },
      { id: 'cto-mtg-2', title: 'Sprint 24 Planning', time: '2:00 PM', date: 'In 2 days', attendees: 8, location: 'Zoom' },
      { id: 'cto-mtg-3', title: 'Candidate Debrief: Backend Engineer', time: '4:00 PM', date: '3 days ago', attendees: 4, location: 'Zoom' },
    ],
    metrics: [
      { id: 'cto-metric-1', label: 'Sprint Completion Rate', value: 87, target: 100, unit: '%' },
      { id: 'cto-metric-2', label: 'Code Review Turnaround (<24h)', value: 78, target: 100, unit: '%' },
      { id: 'cto-metric-3', label: 'Test Coverage', value: 82, target: 90, unit: '%' },
      { id: 'cto-metric-4', label: 'Uptime SLA (99.95%)', value: 99.92, target: 99.95, unit: '%' },
    ],
    chartData: [
      { month: 'Feb', value: 62, secondary: 8 },
      { month: 'Mar', value: 68, secondary: 6 },
      { month: 'Apr', value: 71, secondary: 9 },
      { month: 'May', value: 75, secondary: 7 },
      { month: 'Jun', value: 79, secondary: 5 },
      { month: 'Jul', value: 84, secondary: 6 },
      { month: 'Aug', value: 87, secondary: 5 },
    ],
    quickActions: [
      { label: 'Active Projects', href: '/projects', icon: 'FolderKanban' },
      { label: 'Product Features', href: '/product/features', icon: 'Package' },
      { label: 'Bug Tracking', href: '/product/bugs', icon: 'AlertCircle' },
      { label: 'Team Analytics', href: '/analytics', icon: 'TrendingUp' },
    ],
  },

  finance: {
    stats: [
      { id: 'fin-stat-1', title: 'Total Revenue (MTD)', value: '$187,400', change: '+12.5% vs last month', trend: 'up', icon: 'DollarSign' },
      { id: 'fin-stat-2', title: 'Net Profit Margin', value: '38.6%', change: '+2.1 pts', trend: 'up', icon: 'TrendingUp' },
      { id: 'fin-stat-3', title: 'Outstanding Invoices', value: '$54,200', change: '4 overdue', trend: 'down', icon: 'FileText' },
      { id: 'fin-stat-4', title: 'Pending Expense Approvals', value: '18', change: '+3 today', trend: 'down', icon: 'AlertCircle' },
    ],
    activities: [
      { id: 'fin-act-1', actor: 'Daniel Kim', action: 'sent invoice', target: 'INV-2026-0143 to Vertex Health', time: '20 minutes ago', icon: 'FileText' },
      { id: 'fin-act-2', actor: 'Priya Sharma', action: 'approved expense', target: 'AWS infrastructure - July ($18,400)', time: '2 hours ago', icon: 'CheckSquare' },
      { id: 'fin-act-3', actor: 'Daniel Kim', action: 'flagged invoice', target: 'INV-2026-0144 as overdue', time: '4 hours ago', icon: 'AlertCircle' },
      { id: 'fin-act-4', actor: 'Priya Sharma', action: 'closed the renewal for', target: 'Solstice Bank ($152,000)', time: '5 hours ago', icon: 'DollarSign' },
      { id: 'fin-act-5', actor: 'Daniel Kim', action: 'rejected expense', target: 'Zoom enterprise renewal', time: 'Yesterday', icon: 'AlertCircle' },
    ],
    meetings: [
      { id: 'fin-mtg-1', title: 'Nimbus Retail QBR', time: '11:00 AM', date: 'In 4 days', attendees: 5, location: 'Zoom' },
      { id: 'fin-mtg-2', title: 'Board Meeting - Q3 Review', time: '9:00 AM', date: 'In 12 days', attendees: 9, location: 'Boardroom A' },
      { id: 'fin-mtg-3', title: 'Monthly Financial Close Kickoff', time: '3:00 PM', date: 'Tomorrow', attendees: 3, location: 'Zoom' },
    ],
    metrics: [
      { id: 'fin-metric-1', label: 'Invoices Collected On Time', value: 84, target: 95, unit: '%' },
      { id: 'fin-metric-2', label: 'Budget Utilization', value: 61, target: 100, unit: '%' },
      { id: 'fin-metric-3', label: 'Expense Approval SLA (<48h)', value: 73, target: 90, unit: '%' },
      { id: 'fin-metric-4', label: 'Churn Reduction Goal (<4%)', value: 5.2, target: 4, unit: '%' },
    ],
    chartData: [
      { month: 'Feb', value: 142000, secondary: 96000 },
      { month: 'Mar', value: 151000, secondary: 99000 },
      { month: 'Apr', value: 158000, secondary: 101000 },
      { month: 'May', value: 149000, secondary: 97000 },
      { month: 'Jun', value: 166000, secondary: 104000 },
      { month: 'Jul', value: 174000, secondary: 108000 },
      { month: 'Aug', value: 187400, secondary: 115000 },
    ],
    quickActions: [
      { label: 'Invoices', href: '/invoices', icon: 'FileText' },
      { label: 'Expenses', href: '/expenses', icon: 'DollarSign' },
      { label: 'Financial Reports', href: '/financial-reports', icon: 'TrendingUp' },
      { label: 'Analytics', href: '/analytics', icon: 'TrendingUp' },
    ],
  },

  software_engineer: {
    stats: [
      { id: 'se-stat-1', title: 'My Open Tasks', value: '7', change: '2 due this week', trend: 'down', icon: 'CheckSquare' },
      { id: 'se-stat-2', title: 'Assigned Bugs', value: '4', change: '1 critical', trend: 'down', icon: 'AlertCircle' },
      { id: 'se-stat-3', title: 'Active Projects', value: '3', change: 'Contributing', trend: 'up', icon: 'FolderKanban' },
      { id: 'se-stat-4', title: 'Pending Code Reviews', value: '6', change: '2 awaiting your review', trend: 'down', icon: 'Code' },
    ],
    activities: [
      { id: 'se-act-1', actor: 'Sofia Martinez', action: 'requested your review on', target: 'refactor: sprint board drag-and-drop', time: '10 minutes ago', icon: 'Code' },
      { id: 'se-act-2', actor: 'Marcus Webb', action: 'commented on', target: 'webhook HMAC signature verification', time: '1 hour ago', icon: 'MessageSquare' },
      { id: 'se-act-3', actor: 'Aisha Patel', action: 'merged your PR', target: 'chore: migrate settings page to RSC', time: '3 hours ago', icon: 'GitMerge' },
      { id: 'se-act-4', actor: 'Jordan Lee', action: 'assigned you a task in', target: 'Sprint 24 - Sync & Stability', time: '5 hours ago', icon: 'CheckSquare' },
      { id: 'se-act-5', actor: 'Ethan Brooks', action: 'deployed', target: 'techos-analytics v0.8.0 to production', time: 'Yesterday', icon: 'Rocket' },
    ],
    meetings: [
      { id: 'se-mtg-1', title: 'Sprint 24 Planning', time: '2:00 PM', date: 'In 2 days', attendees: 8, location: 'Zoom' },
      { id: 'se-mtg-2', title: 'Design Critique', time: '1:00 PM', date: '2 days ago', attendees: 5, location: 'Design Studio' },
      { id: 'se-mtg-3', title: 'Incident Postmortem: Payments Outage', time: '3:00 PM', date: '5 days ago', attendees: 6, location: 'Zoom' },
    ],
    metrics: [
      { id: 'se-metric-1', label: 'Sprint 24 Progress', value: 58, target: 100, unit: '%' },
      { id: 'se-metric-2', label: 'My Code Review Turnaround', value: 91, target: 100, unit: '%' },
      { id: 'se-metric-3', label: 'Test Coverage on My Modules', value: 88, target: 90, unit: '%' },
      { id: 'se-metric-4', label: 'Bugs Closed This Sprint', value: 6, target: 10 },
    ],
    chartData: [
      { month: 'Feb', value: 28, secondary: 3 },
      { month: 'Mar', value: 31, secondary: 2 },
      { month: 'Apr', value: 26, secondary: 4 },
      { month: 'May', value: 34, secondary: 1 },
      { month: 'Jun', value: 37, secondary: 2 },
      { month: 'Jul', value: 33, secondary: 3 },
      { month: 'Aug', value: 39, secondary: 1 },
    ],
    quickActions: [
      { label: 'My Tasks', href: '/tasks', icon: 'CheckSquare' },
      { label: 'Bugs to Fix', href: '/bugs', icon: 'AlertCircle' },
      { label: 'Code Reviews', href: '/code-reviews', icon: 'Code' },
      { label: 'AI Assistant', href: '/ai', icon: 'Lightbulb' },
    ],
  },

  ui_ux_designer: {
    stats: [
      { id: 'ux-stat-1', title: 'Active Prototypes', value: '5', change: '2 ready for review', trend: 'up', icon: 'Package' },
      { id: 'ux-stat-2', title: 'My Open Tasks', value: '6', change: '1 due today', trend: 'down', icon: 'CheckSquare' },
      { id: 'ux-stat-3', title: 'Design System Adoption', value: '71%', change: '+6 pts this month', trend: 'up', icon: 'TrendingUp' },
      { id: 'ux-stat-4', title: 'Research Studies Active', value: '3', change: '1 wrapping up', trend: 'up', icon: 'Lightbulb' },
    ],
    activities: [
      { id: 'ux-act-1', actor: 'Grace Kim', action: 'shared findings from', target: 'Onboarding Friction Study', time: '30 minutes ago', icon: 'FileText' },
      { id: 'ux-act-2', actor: 'Jordan Lee', action: 'approved your prototype', target: 'Mobile Navigation Shell', time: '2 hours ago', icon: 'CheckSquare' },
      { id: 'ux-act-3', actor: 'Liam Nguyen', action: 'published', target: '12 new Design System 2.0 components', time: '4 hours ago', icon: 'Package' },
      { id: 'ux-act-4', actor: 'Grace Kim', action: 'scheduled', target: 'Enterprise Admin Needs Assessment interviews', time: 'Yesterday', icon: 'Calendar' },
      { id: 'ux-act-5', actor: 'Ethan Brooks', action: 'commented on', target: 'Custom Report Builder Concept', time: 'Yesterday', icon: 'MessageSquare' },
    ],
    meetings: [
      { id: 'ux-mtg-1', title: 'Design Critique', time: '1:00 PM', date: 'Today', attendees: 5, location: 'Design Studio' },
      { id: 'ux-mtg-2', title: 'User Research Readout', time: '11:00 AM', date: 'Tomorrow', attendees: 6, location: 'Zoom' },
      { id: 'ux-mtg-3', title: 'Onboarding Wizard v3 Review', time: '2:30 PM', date: 'In 2 days', attendees: 4, location: 'Zoom' },
    ],
    metrics: [
      { id: 'ux-metric-1', label: 'Onboarding Wizard v3 Progress', value: 85, target: 100, unit: '%' },
      { id: 'ux-metric-2', label: 'Design System Adoption', value: 71, target: 90, unit: '%' },
      { id: 'ux-metric-3', label: 'Accessibility Audit Coverage', value: 100, target: 100, unit: '%' },
      { id: 'ux-metric-4', label: 'Prototypes Approved This Quarter', value: 9, target: 12 },
    ],
    chartData: [
      { month: 'Feb', value: 52, secondary: 4 },
      { month: 'Mar', value: 55, secondary: 3 },
      { month: 'Apr', value: 58, secondary: 5 },
      { month: 'May', value: 61, secondary: 4 },
      { month: 'Jun', value: 65, secondary: 6 },
      { month: 'Jul', value: 68, secondary: 5 },
      { month: 'Aug', value: 71, secondary: 5 },
    ],
    quickActions: [
      { label: 'Prototypes', href: '/prototypes', icon: 'Package' },
      { label: 'User Research', href: '/user-research', icon: 'Lightbulb' },
      { label: 'Design System', href: '/design-system', icon: 'Palette' },
      { label: 'AI Assistant', href: '/ai', icon: 'Lightbulb' },
    ],
  },

  customer_support: {
    stats: [
      { id: 'cs-stat-1', title: 'Open Tickets', value: '38', change: '6 unassigned', trend: 'down', icon: 'AlertCircle' },
      { id: 'cs-stat-2', title: 'Urgent Issues', value: '4', change: '2 SLA at risk', trend: 'down', icon: 'AlertCircle' },
      { id: 'cs-stat-3', title: 'Avg. Response Time', value: '2.1h', change: '-0.4h vs last week', trend: 'up', icon: 'TrendingUp' },
      { id: 'cs-stat-4', title: 'CSAT Score', value: '4.7 / 5', change: '+0.3 vs last month', trend: 'up', icon: 'Target' },
    ],
    activities: [
      { id: 'cs-act-1', actor: 'Emma Wilson', action: 'resolved ticket', target: 'Cannot reset password (Northwind Foods)', time: '18 minutes ago', icon: 'CheckSquare' },
      { id: 'cs-act-2', actor: 'Noah Rodriguez', action: 'escalated ticket', target: 'Billing charged twice (Solstice Bank)', time: '1 hour ago', icon: 'AlertCircle' },
      { id: 'cs-act-3', actor: 'Emma Wilson', action: 'published', target: 'Customizing your dashboard (draft)', time: '3 hours ago', icon: 'FileText' },
      { id: 'cs-act-4', actor: 'Noah Rodriguez', action: 'replied to', target: 'API returns 429 during peak hours', time: '5 hours ago', icon: 'MessageSquare' },
      { id: 'cs-act-5', actor: 'Emma Wilson', action: 'closed ticket', target: 'Request for additional seats', time: 'Yesterday', icon: 'CheckSquare' },
    ],
    meetings: [
      { id: 'cs-mtg-1', title: 'Support Team Standup', time: '9:00 AM', date: 'Today', attendees: 4, location: 'Zoom' },
      { id: 'cs-mtg-2', title: 'Customer Advisory Board', time: '10:00 AM', date: 'In 6 days', attendees: 8, location: 'Zoom' },
      { id: 'cs-mtg-3', title: 'Knowledge Base Content Review', time: '2:00 PM', date: 'Tomorrow', attendees: 3, location: 'Zoom' },
    ],
    metrics: [
      { id: 'cs-metric-1', label: 'First Response SLA (<1h)', value: 68, target: 100, unit: '%' },
      { id: 'cs-metric-2', label: 'Ticket Resolution Rate', value: 92, target: 95, unit: '%' },
      { id: 'cs-metric-3', label: 'CSAT Score', value: 94, target: 96, unit: '%' },
      { id: 'cs-metric-4', label: 'Knowledge Base Articles Published', value: 9, target: 12 },
    ],
    chartData: [
      { month: 'Feb', value: 210, secondary: 4.3 },
      { month: 'Mar', value: 198, secondary: 4.4 },
      { month: 'Apr', value: 225, secondary: 4.4 },
      { month: 'May', value: 240, secondary: 4.5 },
      { month: 'Jun', value: 232, secondary: 4.6 },
      { month: 'Jul', value: 251, secondary: 4.6 },
      { month: 'Aug', value: 268, secondary: 4.7 },
    ],
    quickActions: [
      { label: 'Tickets', href: '/tickets', icon: 'AlertCircle' },
      { label: 'Knowledge Base', href: '/knowledge-base', icon: 'FileText' },
      { label: 'Messages', href: '/messages', icon: 'MessageSquare' },
      { label: 'AI Assistant', href: '/ai', icon: 'Lightbulb' },
    ],
  },
};

export function getDashboardForRole(role: string): RoleDashboardData {
  return dashboardByRole[role as MockUserRole] ?? dashboardByRole.software_engineer;
}
