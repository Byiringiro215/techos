import { MockRecord } from './types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns an ISO timestamp `offsetDays` from today (negative = past). */
function iso(offsetDays: number, hour = 9, minute = 0): string {
  const d = new Date();
  d.setUTCHours(hour, minute, 0, 0);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString();
}

const OWNERS = [
  'Alexandra Chen',
  'Marcus Webb',
  'Priya Sharma',
  'Daniel Kim',
  'Jordan Lee',
  'Sofia Martinez',
  'Ethan Brooks',
  'Aisha Patel',
  'Liam Nguyen',
  'Grace Kim',
  'Noah Rodriguez',
  'Emma Wilson',
];

const COMPANIES = [
  'Nimbus Retail',
  'Vertex Health',
  'Solstice Bank',
  'Cascade Logistics',
  'Bramble Media',
  'Northwind Foods',
  'Anchor Robotics',
  'Fathom Analytics',
  'Lumen Energy',
  'Orbit Telecom',
  'Harbor Insurance',
  'Meridian Capital',
  'Driftwood Studios',
  'Ironclad Security',
  'Palmetto Airlines',
];

// ---------------------------------------------------------------------------
// projects
// ---------------------------------------------------------------------------

const projects: MockRecord[] = [
  {
    id: 'prj-001',
    title: 'TechOS Mobile App Redesign',
    status: 'Active',
    statusVariant: 'info',
    owner: 'Jordan Lee',
    priority: 'high',
    progress: 62,
    amount: 180000,
    tags: ['mobile', 'design', 'q3'],
    dueDate: iso(38),
    createdAt: iso(-64),
    updatedAt: iso(-1),
    description: 'Full redesign of the TechOS companion mobile app with a new navigation model and offline mode.',
  },
  {
    id: 'prj-002',
    title: 'Customer Data Platform Migration',
    status: 'Active',
    statusVariant: 'info',
    owner: 'Sofia Martinez',
    priority: 'critical',
    progress: 41,
    amount: 420000,
    tags: ['infra', 'data'],
    dueDate: iso(70),
    createdAt: iso(-90),
    updatedAt: iso(-2),
    description: 'Migrate legacy customer records into the new unified data platform with zero downtime.',
  },
  {
    id: 'prj-003',
    title: 'Enterprise SSO Rollout',
    status: 'Planning',
    statusVariant: 'default',
    owner: 'Aisha Patel',
    priority: 'medium',
    progress: 12,
    amount: 96000,
    tags: ['security', 'enterprise'],
    dueDate: iso(95),
    createdAt: iso(-20),
    updatedAt: iso(-3),
    description: 'Introduce SAML/OIDC single sign-on for enterprise customers across the platform.',
  },
  {
    id: 'prj-004',
    title: 'Billing Engine V2',
    status: 'On Hold',
    statusVariant: 'warning',
    owner: 'Marcus Webb',
    priority: 'high',
    progress: 28,
    amount: 260000,
    tags: ['billing', 'backend'],
    dueDate: iso(120),
    createdAt: iso(-140),
    updatedAt: iso(-14),
    description: 'Rebuild the billing engine to support usage-based pricing and multi-currency invoicing.',
  },
  {
    id: 'prj-005',
    title: 'Design System 2.0',
    status: 'Active',
    statusVariant: 'info',
    owner: 'Liam Nguyen',
    priority: 'medium',
    progress: 74,
    amount: 65000,
    tags: ['design-system', 'ui'],
    dueDate: iso(21),
    createdAt: iso(-80),
    updatedAt: iso(-1),
    description: 'Unify components, tokens, and accessibility guidelines across every product surface.',
  },
  {
    id: 'prj-006',
    title: 'Customer Support Automation',
    status: 'Active',
    statusVariant: 'info',
    owner: 'Noah Rodriguez',
    priority: 'medium',
    progress: 55,
    amount: 88000,
    tags: ['support', 'ai'],
    dueDate: iso(45),
    createdAt: iso(-55),
    updatedAt: iso(-4),
    description: 'Deploy AI-assisted triage and canned-response suggestions inside the support console.',
  },
  {
    id: 'prj-007',
    title: 'Marketing Site Relaunch',
    status: 'Completed',
    statusVariant: 'success',
    owner: 'Priya Sharma',
    priority: 'low',
    progress: 100,
    amount: 54000,
    tags: ['marketing', 'web'],
    dueDate: iso(-10),
    createdAt: iso(-120),
    updatedAt: iso(-10),
    description: 'New marketing site with updated pricing pages, case studies, and blog infrastructure.',
  },
  {
    id: 'prj-008',
    title: 'Real-Time Analytics Pipeline',
    status: 'Active',
    statusVariant: 'info',
    owner: 'Ethan Brooks',
    priority: 'high',
    progress: 33,
    amount: 210000,
    tags: ['data', 'streaming'],
    dueDate: iso(60),
    createdAt: iso(-45),
    updatedAt: iso(-2),
    description: 'Stream product usage events into a real-time dashboard for account health scoring.',
  },
  {
    id: 'prj-009',
    title: 'API Gateway Consolidation',
    status: 'Planning',
    statusVariant: 'default',
    owner: 'Marcus Webb',
    priority: 'medium',
    progress: 8,
    amount: 130000,
    tags: ['infra', 'api'],
    dueDate: iso(110),
    createdAt: iso(-15),
    updatedAt: iso(-5),
    description: 'Consolidate five internal gateways into a single managed API gateway with rate limiting.',
  },
  {
    id: 'prj-010',
    title: 'Onboarding Flow Overhaul',
    status: 'Active',
    statusVariant: 'info',
    owner: 'Grace Kim',
    priority: 'high',
    progress: 47,
    amount: 72000,
    tags: ['ux', 'growth'],
    dueDate: iso(30),
    createdAt: iso(-40),
    updatedAt: iso(-1),
    description: 'Reduce time-to-value for new workspaces with a guided, role-aware onboarding wizard.',
  },
  {
    id: 'prj-011',
    title: 'Disaster Recovery Program',
    status: 'Cancelled',
    statusVariant: 'error',
    owner: 'Aisha Patel',
    priority: 'critical',
    progress: 15,
    amount: 190000,
    tags: ['infra', 'resilience'],
    dueDate: iso(-5),
    createdAt: iso(-100),
    updatedAt: iso(-30),
    description: 'Multi-region failover program, cancelled in favor of managed cloud DR tooling.',
  },
  {
    id: 'prj-012',
    title: 'Q3 Sales Enablement Kit',
    status: 'Completed',
    statusVariant: 'success',
    owner: 'Daniel Kim',
    priority: 'low',
    progress: 100,
    amount: 18000,
    tags: ['sales', 'enablement'],
    dueDate: iso(-25),
    createdAt: iso(-70),
    updatedAt: iso(-25),
    description: 'Battlecards, pricing calculators, and demo scripts for the Q3 sales push.',
  },
];

// ---------------------------------------------------------------------------
// tasks
// ---------------------------------------------------------------------------

const tasks: MockRecord[] = [
  { id: 'tsk-001', title: 'Implement offline sync queue', status: 'In Progress', statusVariant: 'info', owner: 'Jordan Lee', assignee: 'Jordan Lee', priority: 'high', progress: 60, tags: ['Sprint 24', 'mobile'], dueDate: iso(4), createdAt: iso(-12), updatedAt: iso(-1), description: 'Build the local write-ahead queue that syncs once connectivity is restored.' },
  { id: 'tsk-002', title: 'Fix flaky checkout integration test', status: 'To Do', statusVariant: 'default', owner: 'Sofia Martinez', assignee: 'Sofia Martinez', priority: 'medium', progress: 0, tags: ['Sprint 24', 'testing'], dueDate: iso(6), createdAt: iso(-3), updatedAt: iso(-3), description: 'Investigate intermittent timeout failures in the checkout end-to-end suite.' },
  { id: 'tsk-003', title: 'Add rate limiting to public API', status: 'In Review', statusVariant: 'warning', owner: 'Ethan Brooks', assignee: 'Ethan Brooks', priority: 'high', progress: 90, tags: ['Sprint 24', 'api'], dueDate: iso(1), createdAt: iso(-9), updatedAt: iso(0), description: 'Token-bucket rate limiter on the public REST API with per-key overrides.' },
  { id: 'tsk-004', title: 'Migrate settings page to server components', status: 'Done', statusVariant: 'success', owner: 'Aisha Patel', assignee: 'Aisha Patel', priority: 'low', progress: 100, tags: ['Sprint 23', 'frontend'], dueDate: iso(-6), createdAt: iso(-18), updatedAt: iso(-6), description: 'Move the account settings page from client-only rendering to RSC.' },
  { id: 'tsk-005', title: 'Design empty states for reports module', status: 'In Progress', statusVariant: 'info', owner: 'Liam Nguyen', assignee: 'Liam Nguyen', priority: 'medium', progress: 45, tags: ['Sprint 24', 'design'], dueDate: iso(5), createdAt: iso(-7), updatedAt: iso(-1), description: 'Illustrate and spec empty/zero-data states across the reports section.' },
  { id: 'tsk-006', title: 'Instrument onboarding funnel events', status: 'Blocked', statusVariant: 'error', owner: 'Grace Kim', assignee: 'Grace Kim', priority: 'medium', progress: 20, tags: ['Sprint 24', 'analytics'], dueDate: iso(3), createdAt: iso(-10), updatedAt: iso(-2), description: 'Blocked on analytics schema approval from data platform team.' },
  { id: 'tsk-007', title: 'Write migration script for legacy invoices', status: 'To Do', statusVariant: 'default', owner: 'Daniel Kim', assignee: 'Daniel Kim', priority: 'high', progress: 0, tags: ['Sprint 24', 'finance'], dueDate: iso(8), createdAt: iso(-2), updatedAt: iso(-2), description: 'Backfill invoice records from the old billing schema into the new one.' },
  { id: 'tsk-008', title: 'Set up canary deploy for payments service', status: 'In Progress', statusVariant: 'info', owner: 'Marcus Webb', assignee: 'Marcus Webb', priority: 'critical', progress: 55, tags: ['Sprint 24', 'devops'], dueDate: iso(2), createdAt: iso(-11), updatedAt: iso(-1), description: 'Roll out canary deployment strategy for the payments microservice.' },
  { id: 'tsk-009', title: 'Update knowledge base search ranking', status: 'To Do', statusVariant: 'default', owner: 'Noah Rodriguez', assignee: 'Noah Rodriguez', priority: 'low', progress: 0, tags: ['Sprint 24', 'support'], dueDate: iso(9), createdAt: iso(-1), updatedAt: iso(-1), description: 'Boost recently-updated articles in knowledge base search results.' },
  { id: 'tsk-010', title: 'Refactor sprint board drag-and-drop', status: 'In Review', statusVariant: 'warning', owner: 'Jordan Lee', assignee: 'Sofia Martinez', priority: 'medium', progress: 85, tags: ['Sprint 23', 'frontend'], dueDate: iso(0), createdAt: iso(-14), updatedAt: iso(0), description: 'Replace the drag-and-drop library on the sprint board for better accessibility.' },
  { id: 'tsk-011', title: 'Add dark mode to prototype viewer', status: 'Done', statusVariant: 'success', owner: 'Grace Kim', assignee: 'Liam Nguyen', priority: 'low', progress: 100, tags: ['Sprint 23', 'design'], dueDate: iso(-8), createdAt: iso(-22), updatedAt: iso(-8), description: 'Dark-mode themed prototype preview for late-night design reviews.' },
  { id: 'tsk-012', title: 'Harden webhook signature verification', status: 'In Progress', statusVariant: 'info', owner: 'Aisha Patel', assignee: 'Ethan Brooks', priority: 'critical', progress: 70, tags: ['Sprint 24', 'security'], dueDate: iso(2), createdAt: iso(-13), updatedAt: iso(-1), description: 'Enforce HMAC signature verification on all inbound webhook endpoints.' },
  { id: 'tsk-013', title: 'Write release notes for v2.4.0', status: 'To Do', statusVariant: 'default', owner: 'Marcus Webb', assignee: 'Marcus Webb', priority: 'medium', progress: 0, tags: ['Sprint 24', 'release'], dueDate: iso(7), createdAt: iso(-1), updatedAt: iso(-1), description: 'Summarize customer-facing changes for the upcoming release.' },
  { id: 'tsk-014', title: 'Audit third-party analytics scripts', status: 'Blocked', statusVariant: 'error', owner: 'Sofia Martinez', assignee: 'Aisha Patel', priority: 'medium', progress: 10, tags: ['Sprint 24', 'compliance'], dueDate: iso(6), createdAt: iso(-9), updatedAt: iso(-3), description: 'Blocked pending legal review of vendor data processing agreements.' },
];

// ---------------------------------------------------------------------------
// bugs
// ---------------------------------------------------------------------------

const bugs: MockRecord[] = [
  { id: 'bug-001', title: 'Dashboard charts flicker on resize', status: 'Open', statusVariant: 'error', owner: 'Ethan Brooks', priority: 'medium', category: 'frontend', tags: ['dashboard'], dueDate: iso(5), createdAt: iso(-6), updatedAt: iso(-1), description: 'Chart canvases re-render repeatedly when the browser window is resized.' },
  { id: 'bug-002', title: 'Invoice PDF export drops line items over 20', status: 'In Progress', statusVariant: 'warning', owner: 'Daniel Kim', priority: 'high', category: 'finance', tags: ['pdf'], dueDate: iso(2), createdAt: iso(-9), updatedAt: iso(-1), description: 'Invoices with more than 20 line items truncate on the second PDF page.' },
  { id: 'bug-003', title: 'Session expires prematurely on Safari', status: 'Open', statusVariant: 'error', owner: 'Sofia Martinez', priority: 'critical', category: 'auth', tags: ['safari'], dueDate: iso(1), createdAt: iso(-4), updatedAt: iso(0), description: 'Users on Safari 18 are logged out roughly every 10 minutes.' },
  { id: 'bug-004', title: 'Kanban board loses card order after refresh', status: 'Resolved', statusVariant: 'success', owner: 'Jordan Lee', priority: 'medium', category: 'frontend', tags: ['tasks'], dueDate: iso(-3), createdAt: iso(-15), updatedAt: iso(-3), description: 'Reordering cards did not persist to the backend before a page refresh.' },
  { id: 'bug-005', title: 'Duplicate notification emails for mentions', status: 'Open', statusVariant: 'error', owner: 'Aisha Patel', priority: 'medium', category: 'notifications', tags: ['email'], dueDate: iso(4), createdAt: iso(-5), updatedAt: iso(-2), description: 'Users receive two identical emails when mentioned in a comment thread.' },
  { id: 'bug-006', title: 'Ticket priority badge color mismatch', status: 'Closed', statusVariant: 'default', owner: 'Noah Rodriguez', priority: 'low', category: 'support', tags: ['ui'], dueDate: iso(-12), createdAt: iso(-20), updatedAt: iso(-12), description: 'Urgent tickets rendered with the warning color instead of error.' },
  { id: 'bug-007', title: 'Calendar month view off by one on DST change', status: 'In Progress', statusVariant: 'warning', owner: 'Grace Kim', priority: 'high', category: 'calendar', tags: ['timezone'], dueDate: iso(3), createdAt: iso(-7), updatedAt: iso(-1), description: 'Events shift one day around daylight saving time transitions.' },
  { id: 'bug-008', title: 'Bulk deal import fails silently over 500 rows', status: 'Reopened', statusVariant: 'error', owner: 'Priya Sharma', priority: 'high', category: 'crm', tags: ['import'], dueDate: iso(2), createdAt: iso(-11), updatedAt: iso(0), description: 'Large CSV imports stop without an error toast, leaving partial data.' },
  { id: 'bug-009', title: 'Code review diff view breaks on binary files', status: 'Open', statusVariant: 'error', owner: 'Marcus Webb', priority: 'low', category: 'engineering', tags: ['code-review'], dueDate: iso(9), createdAt: iso(-2), updatedAt: iso(-2), description: 'Attempting to view a binary asset diff crashes the review pane.' },
  { id: 'bug-010', title: 'Search autocomplete ignores fuzzy matches', status: 'In Progress', statusVariant: 'warning', owner: 'Liam Nguyen', priority: 'medium', category: 'search', tags: ['ux'], dueDate: iso(6), createdAt: iso(-8), updatedAt: iso(-2), description: 'Global search only returns exact prefix matches, hurting discoverability.' },
  { id: 'bug-011', title: 'Expense receipt upload rejects HEIC images', status: 'Resolved', statusVariant: 'success', owner: 'Daniel Kim', priority: 'low', category: 'finance', tags: ['uploads'], dueDate: iso(-9), createdAt: iso(-19), updatedAt: iso(-9), description: 'iPhone receipt photos in HEIC format were rejected by the uploader.' },
  { id: 'bug-012', title: 'Release pipeline stalls on Windows runners', status: 'Open', statusVariant: 'error', owner: 'Aisha Patel', priority: 'critical', category: 'ci-cd', tags: ['pipeline'], dueDate: iso(1), createdAt: iso(-3), updatedAt: iso(0), description: 'Windows-based CI runners hang during the packaging step of the release pipeline.' },
];

// ---------------------------------------------------------------------------
// sprints
// ---------------------------------------------------------------------------

const sprints: MockRecord[] = [
  { id: 'spr-001', title: 'Sprint 24 - Sync & Stability', status: 'Active', statusVariant: 'info', owner: 'Jordan Lee', progress: 58, tags: ['mobile', 'core'], startDate: iso(-6), dueDate: iso(8), createdAt: iso(-6), updatedAt: iso(-1), description: 'Offline sync, rate limiting, and API hardening.' },
  { id: 'spr-002', title: 'Sprint 23 - Foundations', status: 'Completed', statusVariant: 'success', owner: 'Marcus Webb', progress: 100, tags: ['platform'], startDate: iso(-20), dueDate: iso(-6), createdAt: iso(-20), updatedAt: iso(-6), description: 'Server component migration and design system tokens.' },
  { id: 'spr-003', title: 'Sprint 25 - Analytics Push', status: 'Planned', statusVariant: 'default', owner: 'Ethan Brooks', progress: 0, tags: ['analytics'], startDate: iso(8), dueDate: iso(22), createdAt: iso(-2), updatedAt: iso(-2), description: 'Real-time event pipeline and dashboard widgets.' },
  { id: 'spr-004', title: 'Sprint 22 - Security Hardening', status: 'Completed', statusVariant: 'success', owner: 'Aisha Patel', progress: 100, tags: ['security'], startDate: iso(-34), dueDate: iso(-20), createdAt: iso(-34), updatedAt: iso(-20), description: 'Webhook signing, SSO groundwork, and dependency audit.' },
  { id: 'spr-005', title: 'Sprint 24 - Design Systemization', status: 'Active', statusVariant: 'info', owner: 'Liam Nguyen', progress: 66, tags: ['design'], startDate: iso(-6), dueDate: iso(8), createdAt: iso(-6), updatedAt: iso(-1), description: 'Token rollout and empty-state illustrations.' },
  { id: 'spr-006', title: 'Sprint 21 - Billing Cleanup', status: 'Completed', statusVariant: 'success', owner: 'Daniel Kim', progress: 100, tags: ['finance'], startDate: iso(-48), dueDate: iso(-34), createdAt: iso(-48), updatedAt: iso(-34), description: 'Legacy invoice reconciliation and dunning emails.' },
  { id: 'spr-007', title: 'Sprint 25 - Support Automation', status: 'Planned', statusVariant: 'default', owner: 'Noah Rodriguez', progress: 0, tags: ['support'], startDate: iso(8), dueDate: iso(22), createdAt: iso(-1), updatedAt: iso(-1), description: 'AI-assisted ticket triage and macro suggestions.' },
  { id: 'spr-008', title: 'Sprint 20 - Growth Experiments', status: 'Completed', statusVariant: 'success', owner: 'Grace Kim', progress: 100, tags: ['growth'], startDate: iso(-62), dueDate: iso(-48), createdAt: iso(-62), updatedAt: iso(-48), description: 'Onboarding checklist A/B test and activation tracking.' },
];

// ---------------------------------------------------------------------------
// invoices
// ---------------------------------------------------------------------------

const invoices: MockRecord[] = [
  { id: 'inv-001', title: 'INV-2026-0142', status: 'Paid', statusVariant: 'success', owner: 'Priya Sharma', amount: 24800, currency: 'USD', company: 'Nimbus Retail', email: 'ap@nimbusretail.com', dueDate: iso(-4), createdAt: iso(-34), updatedAt: iso(-4), description: 'Annual enterprise plan renewal for Nimbus Retail.' },
  { id: 'inv-002', title: 'INV-2026-0143', status: 'Sent', statusVariant: 'info', owner: 'Priya Sharma', amount: 8600, currency: 'USD', company: 'Vertex Health', email: 'billing@vertexhealth.com', dueDate: iso(12), createdAt: iso(-3), updatedAt: iso(-3), description: 'Q3 usage overage charges for Vertex Health.' },
  { id: 'inv-003', title: 'INV-2026-0144', status: 'Overdue', statusVariant: 'error', owner: 'Daniel Kim', amount: 15200, currency: 'USD', company: 'Solstice Bank', email: 'accounts@solsticebank.com', dueDate: iso(-9), createdAt: iso(-40), updatedAt: iso(-9), description: 'Professional services engagement, net-30 terms.' },
  { id: 'inv-004', title: 'INV-2026-0145', status: 'Draft', statusVariant: 'default', owner: 'Daniel Kim', amount: 4300, currency: 'USD', company: 'Cascade Logistics', email: 'finance@cascadelogistics.com', dueDate: iso(20), createdAt: iso(-1), updatedAt: iso(-1), description: 'Add-on seats for the logistics dispatch module.' },
  { id: 'inv-005', title: 'INV-2026-0146', status: 'Paid', statusVariant: 'success', owner: 'Priya Sharma', amount: 61200, currency: 'USD', company: 'Bramble Media', email: 'ap@bramblemedia.com', dueDate: iso(-15), createdAt: iso(-46), updatedAt: iso(-15), description: 'Multi-year enterprise contract, first installment.' },
  { id: 'inv-006', title: 'INV-2026-0147', status: 'Sent', statusVariant: 'info', owner: 'Daniel Kim', amount: 7800, currency: 'USD', company: 'Northwind Foods', email: 'ap@northwindfoods.com', dueDate: iso(9), createdAt: iso(-6), updatedAt: iso(-6), description: 'Monthly subscription for the analytics add-on.' },
  { id: 'inv-007', title: 'INV-2026-0148', status: 'Cancelled', statusVariant: 'error', owner: 'Priya Sharma', amount: 3100, currency: 'USD', company: 'Anchor Robotics', email: 'ap@anchorrobotics.com', dueDate: iso(-2), createdAt: iso(-25), updatedAt: iso(-18), description: 'Cancelled after downgrade to the starter plan mid-cycle.' },
  { id: 'inv-008', title: 'INV-2026-0149', status: 'Overdue', statusVariant: 'error', owner: 'Daniel Kim', amount: 19850, currency: 'USD', company: 'Fathom Analytics', email: 'billing@fathomanalytics.com', dueDate: iso(-6), createdAt: iso(-38), updatedAt: iso(-6), description: 'Data pipeline integration retainer, invoice #3 of 4.' },
  { id: 'inv-009', title: 'INV-2026-0150', status: 'Paid', statusVariant: 'success', owner: 'Priya Sharma', amount: 11400, currency: 'USD', company: 'Lumen Energy', email: 'ap@lumenenergy.com', dueDate: iso(-20), createdAt: iso(-50), updatedAt: iso(-20), description: 'Standard plan renewal, auto-charged via ACH.' },
  { id: 'inv-010', title: 'INV-2026-0151', status: 'Sent', statusVariant: 'info', owner: 'Daniel Kim', amount: 5600, currency: 'USD', company: 'Orbit Telecom', email: 'ap@orbittelecom.com', dueDate: iso(15), createdAt: iso(-4), updatedAt: iso(-4), description: 'One-time implementation and training fee.' },
  { id: 'inv-011', title: 'INV-2026-0152', status: 'Draft', statusVariant: 'default', owner: 'Priya Sharma', amount: 27600, currency: 'USD', company: 'Harbor Insurance', email: 'accounts@harborinsurance.com', dueDate: iso(25), createdAt: iso(0), updatedAt: iso(0), description: 'Annual contract renewal awaiting final sign-off.' },
  { id: 'inv-012', title: 'INV-2026-0153', status: 'Paid', statusVariant: 'success', owner: 'Daniel Kim', amount: 9200, currency: 'USD', company: 'Meridian Capital', email: 'ap@meridiancapital.com', dueDate: iso(-11), createdAt: iso(-41), updatedAt: iso(-11), description: 'Quarterly subscription payment, paid via wire transfer.' },
];

// ---------------------------------------------------------------------------
// expenses
// ---------------------------------------------------------------------------

const expenses: MockRecord[] = [
  { id: 'exp-001', title: 'AWS infrastructure - July', status: 'Approved', statusVariant: 'success', owner: 'Aisha Patel', amount: 18400, currency: 'USD', category: 'Cloud Infrastructure', dueDate: iso(-2), createdAt: iso(-9), updatedAt: iso(-2), description: 'Monthly AWS spend across production and staging accounts.' },
  { id: 'exp-002', title: 'Figma team plan renewal', status: 'Approved', statusVariant: 'success', owner: 'Liam Nguyen', amount: 2160, currency: 'USD', category: 'Software', dueDate: iso(-15), createdAt: iso(-20), updatedAt: iso(-15), description: 'Annual renewal for the design team Figma seats.' },
  { id: 'exp-003', title: 'Client dinner - Solstice Bank', status: 'Pending', statusVariant: 'warning', owner: 'Priya Sharma', amount: 480, currency: 'USD', category: 'Travel & Entertainment', dueDate: iso(3), createdAt: iso(-1), updatedAt: iso(-1), description: 'Dinner with Solstice Bank leadership during contract renewal visit.' },
  { id: 'exp-004', title: 'Conference tickets - ReactConf', status: 'Rejected', statusVariant: 'error', owner: 'Ethan Brooks', amount: 3200, currency: 'USD', category: 'Professional Development', dueDate: iso(-8), createdAt: iso(-14), updatedAt: iso(-8), description: 'Rejected pending Q4 training budget re-approval.' },
  { id: 'exp-005', title: 'Recruiting agency fee', status: 'Approved', statusVariant: 'success', owner: 'Alexandra Chen', amount: 12500, currency: 'USD', category: 'Recruiting', dueDate: iso(-25), createdAt: iso(-33), updatedAt: iso(-25), description: 'Placement fee for the new senior backend engineer hire.' },
  { id: 'exp-006', title: 'Office snacks & supplies', status: 'Approved', statusVariant: 'success', owner: 'Noah Rodriguez', amount: 640, currency: 'USD', category: 'Office', dueDate: iso(-4), createdAt: iso(-6), updatedAt: iso(-4), description: 'Monthly snack and supplies order for the Miami office.' },
  { id: 'exp-007', title: 'Datadog observability plan upgrade', status: 'Pending', statusVariant: 'warning', owner: 'Marcus Webb', amount: 5400, currency: 'USD', category: 'Software', dueDate: iso(5), createdAt: iso(-2), updatedAt: iso(-2), description: 'Upgrade to the enterprise observability tier for new services.' },
  { id: 'exp-008', title: 'Sales offsite - Austin', status: 'Approved', statusVariant: 'success', owner: 'Daniel Kim', amount: 9800, currency: 'USD', category: 'Travel & Entertainment', dueDate: iso(-30), createdAt: iso(-40), updatedAt: iso(-30), description: 'Two-day sales team offsite including venue and travel.' },
  { id: 'exp-009', title: 'Legal review - vendor contracts', status: 'Pending', statusVariant: 'warning', owner: 'Alexandra Chen', amount: 6200, currency: 'USD', category: 'Legal', dueDate: iso(7), createdAt: iso(-3), updatedAt: iso(-3), description: 'Outside counsel review of new data processing agreements.' },
  { id: 'exp-010', title: 'Zoom enterprise renewal', status: 'Rejected', statusVariant: 'error', owner: 'Priya Sharma', amount: 4100, currency: 'USD', category: 'Software', dueDate: iso(-18), createdAt: iso(-22), updatedAt: iso(-18), description: 'Rejected in favor of consolidating on the existing Meet license.' },
];

// ---------------------------------------------------------------------------
// payments
// ---------------------------------------------------------------------------

const payments: MockRecord[] = [
  { id: 'pay-001', title: 'PMT-88213', status: 'Completed', statusVariant: 'success', owner: 'Priya Sharma', amount: 24800, currency: 'USD', company: 'Nimbus Retail', dueDate: iso(-4), createdAt: iso(-4), updatedAt: iso(-4), description: 'ACH payment received for invoice INV-2026-0142.' },
  { id: 'pay-002', title: 'PMT-88214', status: 'Pending', statusVariant: 'warning', owner: 'Daniel Kim', amount: 15200, currency: 'USD', company: 'Solstice Bank', dueDate: iso(2), createdAt: iso(-1), updatedAt: iso(-1), description: 'Wire transfer initiated, awaiting bank confirmation.' },
  { id: 'pay-003', title: 'PMT-88215', status: 'Failed', statusVariant: 'error', owner: 'Daniel Kim', amount: 7800, currency: 'USD', company: 'Northwind Foods', dueDate: iso(-2), createdAt: iso(-2), updatedAt: iso(-2), description: 'Card declined due to insufficient funds, retry scheduled.' },
  { id: 'pay-004', title: 'PMT-88216', status: 'Completed', statusVariant: 'success', owner: 'Priya Sharma', amount: 61200, currency: 'USD', company: 'Bramble Media', dueDate: iso(-15), createdAt: iso(-15), updatedAt: iso(-15), description: 'First installment of the multi-year enterprise contract.' },
  { id: 'pay-005', title: 'PMT-88217', status: 'Refunded', statusVariant: 'default', owner: 'Priya Sharma', amount: 3100, currency: 'USD', company: 'Anchor Robotics', dueDate: iso(-18), createdAt: iso(-25), updatedAt: iso(-18), description: 'Refunded after plan downgrade and prorated credit.' },
  { id: 'pay-006', title: 'PMT-88218', status: 'Completed', statusVariant: 'success', owner: 'Daniel Kim', amount: 11400, currency: 'USD', company: 'Lumen Energy', dueDate: iso(-20), createdAt: iso(-20), updatedAt: iso(-20), description: 'Auto-charged renewal via saved ACH mandate.' },
  { id: 'pay-007', title: 'PMT-88219', status: 'Pending', statusVariant: 'warning', owner: 'Priya Sharma', amount: 27600, currency: 'USD', company: 'Harbor Insurance', dueDate: iso(6), createdAt: iso(-1), updatedAt: iso(-1), description: 'Awaiting purchase order approval before charge.' },
  { id: 'pay-008', title: 'PMT-88220', status: 'Completed', statusVariant: 'success', owner: 'Daniel Kim', amount: 9200, currency: 'USD', company: 'Meridian Capital', dueDate: iso(-11), createdAt: iso(-11), updatedAt: iso(-11), description: 'Quarterly subscription payment via wire transfer.' },
  { id: 'pay-009', title: 'PMT-88221', status: 'Failed', statusVariant: 'error', owner: 'Priya Sharma', amount: 5600, currency: 'USD', company: 'Orbit Telecom', dueDate: iso(-3), createdAt: iso(-3), updatedAt: iso(-3), description: 'Payment gateway timeout, customer notified to retry.' },
  { id: 'pay-010', title: 'PMT-88222', status: 'Completed', statusVariant: 'success', owner: 'Daniel Kim', amount: 19850, currency: 'USD', company: 'Fathom Analytics', dueDate: iso(-6), createdAt: iso(-6), updatedAt: iso(-6), description: 'Milestone payment for the data pipeline retainer.' },
];

// ---------------------------------------------------------------------------
// budgets
// ---------------------------------------------------------------------------

const budgets: MockRecord[] = [
  { id: 'bud-001', title: 'Engineering Cloud Infrastructure', status: 'On Track', statusVariant: 'success', owner: 'Marcus Webb', amount: 240000, progress: 58, currency: 'USD', category: 'Engineering', createdAt: iso(-180), updatedAt: iso(-2), description: 'Annual cloud hosting and infrastructure tooling budget.' },
  { id: 'bud-002', title: 'Marketing Demand Generation', status: 'At Risk', statusVariant: 'warning', owner: 'Priya Sharma', amount: 150000, progress: 81, currency: 'USD', category: 'Marketing', createdAt: iso(-180), updatedAt: iso(-3), description: 'Paid acquisition and content budget for the fiscal year.' },
  { id: 'bud-003', title: 'People & Recruiting', status: 'On Track', statusVariant: 'success', owner: 'Alexandra Chen', amount: 320000, progress: 47, currency: 'USD', category: 'HR', createdAt: iso(-180), updatedAt: iso(-5), description: 'Hiring agency fees, referral bonuses, and background checks.' },
  { id: 'bud-004', title: 'Customer Support Tooling', status: 'On Track', statusVariant: 'success', owner: 'Noah Rodriguez', amount: 42000, progress: 35, currency: 'USD', category: 'Support', createdAt: iso(-180), updatedAt: iso(-6), description: 'Helpdesk, chat, and knowledge base software licenses.' },
  { id: 'bud-005', title: 'Design & Research Tools', status: 'Over Budget', statusVariant: 'error', owner: 'Liam Nguyen', amount: 28000, progress: 112, currency: 'USD', category: 'Design', createdAt: iso(-180), updatedAt: iso(-4), description: 'Figma, research panel, and prototyping tool subscriptions.' },
  { id: 'bud-006', title: 'Sales Travel & Events', status: 'At Risk', statusVariant: 'warning', owner: 'Daniel Kim', amount: 95000, progress: 76, currency: 'USD', category: 'Sales', createdAt: iso(-180), updatedAt: iso(-7), description: 'Conference sponsorships, travel, and client entertainment.' },
  { id: 'bud-007', title: 'Security & Compliance', status: 'On Track', statusVariant: 'success', owner: 'Aisha Patel', amount: 110000, progress: 39, currency: 'USD', category: 'Engineering', createdAt: iso(-180), updatedAt: iso(-8), description: 'Penetration testing, audits, and compliance certifications.' },
  { id: 'bud-008', title: 'Office & Facilities', status: 'On Track', statusVariant: 'success', owner: 'Alexandra Chen', amount: 68000, progress: 52, currency: 'USD', category: 'Operations', createdAt: iso(-180), updatedAt: iso(-9), description: 'Lease, utilities, and facilities upkeep across all offices.' },
];

// ---------------------------------------------------------------------------
// leads
// ---------------------------------------------------------------------------

const leads: MockRecord[] = [
  { id: 'lead-001', title: 'Rachel Ortiz - Nimbus Retail', status: 'Qualified', statusVariant: 'info', owner: 'Daniel Kim', company: 'Nimbus Retail', email: 'rachel.ortiz@nimbusretail.com', amount: 42000, tags: ['inbound'], createdAt: iso(-14), updatedAt: iso(-1), description: 'Requested a demo after downloading the enterprise pricing guide.' },
  { id: 'lead-002', title: 'Tom Bakshi - Vertex Health', status: 'New', statusVariant: 'default', owner: 'Priya Sharma', company: 'Vertex Health', email: 'tom.bakshi@vertexhealth.com', amount: 18500, tags: ['outbound'], createdAt: iso(-2), updatedAt: iso(-2), description: 'Responded to outbound sequence targeting healthcare operations teams.' },
  { id: 'lead-003', title: 'Elena Voss - Solstice Bank', status: 'Contacted', statusVariant: 'warning', owner: 'Daniel Kim', company: 'Solstice Bank', email: 'elena.voss@solsticebank.com', amount: 76000, tags: ['enterprise'], createdAt: iso(-9), updatedAt: iso(-2), description: 'Introductory call scheduled after RFP submission.' },
  { id: 'lead-004', title: 'Marcus Ford - Cascade Logistics', status: 'Unqualified', statusVariant: 'error', owner: 'Priya Sharma', company: 'Cascade Logistics', email: 'marcus.ford@cascadelogistics.com', amount: 9000, tags: ['smb'], createdAt: iso(-20), updatedAt: iso(-12), description: 'Budget too small for current pricing tiers this year.' },
  { id: 'lead-005', title: 'Nina Castillo - Bramble Media', status: 'Converted', statusVariant: 'success', owner: 'Daniel Kim', company: 'Bramble Media', email: 'nina.castillo@bramblemedia.com', amount: 61200, tags: ['enterprise'], createdAt: iso(-60), updatedAt: iso(-46), description: 'Converted into a multi-year enterprise contract.' },
  { id: 'lead-006', title: 'Owen Park - Northwind Foods', status: 'Qualified', statusVariant: 'info', owner: 'Priya Sharma', company: 'Northwind Foods', email: 'owen.park@northwindfoods.com', amount: 15600, tags: ['inbound'], createdAt: iso(-11), updatedAt: iso(-3), description: 'Champion identified, evaluating alongside two competitors.' },
  { id: 'lead-007', title: 'Sarah Klein - Anchor Robotics', status: 'New', statusVariant: 'default', owner: 'Daniel Kim', company: 'Anchor Robotics', email: 'sarah.klein@anchorrobotics.com', amount: 22000, tags: ['referral'], createdAt: iso(-1), updatedAt: iso(-1), description: 'Referred by an existing customer at a partner event.' },
  { id: 'lead-008', title: 'Victor Adeyemi - Fathom Analytics', status: 'Contacted', statusVariant: 'warning', owner: 'Priya Sharma', company: 'Fathom Analytics', email: 'victor.adeyemi@fathomanalytics.com', amount: 34500, tags: ['outbound'], createdAt: iso(-6), updatedAt: iso(-1), description: 'Discovery call booked for next Tuesday.' },
  { id: 'lead-009', title: 'Hana Suzuki - Lumen Energy', status: 'Qualified', statusVariant: 'info', owner: 'Daniel Kim', company: 'Lumen Energy', email: 'hana.suzuki@lumenenergy.com', amount: 28800, tags: ['inbound'], createdAt: iso(-17), updatedAt: iso(-4), description: 'Requested security questionnaire ahead of procurement review.' },
  { id: 'lead-010', title: 'Diego Rivas - Orbit Telecom', status: 'Unqualified', statusVariant: 'error', owner: 'Priya Sharma', company: 'Orbit Telecom', email: 'diego.rivas@orbittelecom.com', amount: 5400, tags: ['smb'], createdAt: iso(-25), updatedAt: iso(-19), description: 'Went with an in-house solution instead.' },
  { id: 'lead-011', title: 'Claire Dubois - Harbor Insurance', status: 'New', statusVariant: 'default', owner: 'Daniel Kim', company: 'Harbor Insurance', email: 'claire.dubois@harborinsurance.com', amount: 47000, tags: ['inbound'], createdAt: iso(-3), updatedAt: iso(-3), description: 'Filled out the contact sales form after a webinar.' },
  { id: 'lead-012', title: 'Ben Whitfield - Meridian Capital', status: 'Contacted', statusVariant: 'warning', owner: 'Priya Sharma', company: 'Meridian Capital', email: 'ben.whitfield@meridiancapital.com', amount: 39000, tags: ['enterprise'], createdAt: iso(-8), updatedAt: iso(-2), description: 'Sent proposal deck, following up this week.' },
];

// ---------------------------------------------------------------------------
// deals
// ---------------------------------------------------------------------------

const deals: MockRecord[] = [
  { id: 'deal-001', title: 'Nimbus Retail - Enterprise Upgrade', status: 'Negotiation', statusVariant: 'warning', owner: 'Daniel Kim', company: 'Nimbus Retail', amount: 84000, progress: 70, createdAt: iso(-30), updatedAt: iso(-1), description: 'Upgrading from Growth to Enterprise plan with SSO add-on.' },
  { id: 'deal-002', title: 'Vertex Health - New Business', status: 'Proposal', statusVariant: 'info', owner: 'Priya Sharma', company: 'Vertex Health', amount: 46000, progress: 45, createdAt: iso(-18), updatedAt: iso(-2), description: 'Proposal sent covering three department rollouts.' },
  { id: 'deal-003', title: 'Solstice Bank - Renewal', status: 'Won', statusVariant: 'success', owner: 'Daniel Kim', company: 'Solstice Bank', amount: 152000, progress: 100, createdAt: iso(-45), updatedAt: iso(-5), description: 'Two-year renewal with a 12% expansion.' },
  { id: 'deal-004', title: 'Cascade Logistics - Pilot', status: 'Lost', statusVariant: 'error', owner: 'Priya Sharma', company: 'Cascade Logistics', amount: 12000, progress: 100, createdAt: iso(-50), updatedAt: iso(-20), description: 'Lost to a competitor with a lower entry price point.' },
  { id: 'deal-005', title: 'Bramble Media - Expansion', status: 'Prospecting', statusVariant: 'default', owner: 'Daniel Kim', company: 'Bramble Media', amount: 61000, progress: 15, createdAt: iso(-4), updatedAt: iso(-1), description: 'Exploring expansion into two additional business units.' },
  { id: 'deal-006', title: 'Northwind Foods - New Business', status: 'Negotiation', statusVariant: 'warning', owner: 'Priya Sharma', company: 'Northwind Foods', amount: 31000, progress: 65, createdAt: iso(-25), updatedAt: iso(-3), description: 'Finalizing contract terms around data residency.' },
  { id: 'deal-007', title: 'Anchor Robotics - New Business', status: 'Proposal', statusVariant: 'info', owner: 'Daniel Kim', company: 'Anchor Robotics', amount: 22500, progress: 40, createdAt: iso(-14), updatedAt: iso(-2), description: 'Proposal under legal review at the customer.' },
  { id: 'deal-008', title: 'Fathom Analytics - Renewal', status: 'Won', statusVariant: 'success', owner: 'Priya Sharma', company: 'Fathom Analytics', amount: 79200, progress: 100, createdAt: iso(-55), updatedAt: iso(-15), description: 'Auto-renewed with an upsell on the analytics add-on.' },
  { id: 'deal-009', title: 'Lumen Energy - New Business', status: 'Prospecting', statusVariant: 'default', owner: 'Daniel Kim', company: 'Lumen Energy', amount: 28800, progress: 20, createdAt: iso(-6), updatedAt: iso(-1), description: 'Security review kicked off ahead of commercial discussion.' },
  { id: 'deal-010', title: 'Orbit Telecom - New Business', status: 'Lost', statusVariant: 'error', owner: 'Priya Sharma', company: 'Orbit Telecom', amount: 15000, progress: 100, createdAt: iso(-60), updatedAt: iso(-30), description: 'Deal stalled and expired after budget freeze.' },
  { id: 'deal-011', title: 'Harbor Insurance - New Business', status: 'Negotiation', statusVariant: 'warning', owner: 'Daniel Kim', company: 'Harbor Insurance', amount: 47000, progress: 55, createdAt: iso(-16), updatedAt: iso(-2), description: 'Redlining the master services agreement.' },
  { id: 'deal-012', title: 'Meridian Capital - Expansion', status: 'Proposal', statusVariant: 'info', owner: 'Priya Sharma', company: 'Meridian Capital', amount: 39000, progress: 35, createdAt: iso(-10), updatedAt: iso(-2), description: 'Expansion proposal for the wealth management division.' },
];

// ---------------------------------------------------------------------------
// contacts
// ---------------------------------------------------------------------------

const contacts: MockRecord[] = [
  { id: 'con-001', title: 'Rachel Ortiz', status: 'Customer', statusVariant: 'success', owner: 'Daniel Kim', company: 'Nimbus Retail', email: 'rachel.ortiz@nimbusretail.com', category: 'Decision Maker', createdAt: iso(-90), updatedAt: iso(-1), description: 'VP of Operations, primary point of contact for renewals.' },
  { id: 'con-002', title: 'Tom Bakshi', status: 'Lead', statusVariant: 'info', owner: 'Priya Sharma', company: 'Vertex Health', email: 'tom.bakshi@vertexhealth.com', category: 'Champion', createdAt: iso(-2), updatedAt: iso(-2), description: 'IT director evaluating the platform for clinical operations.' },
  { id: 'con-003', title: 'Elena Voss', status: 'Lead', statusVariant: 'info', owner: 'Daniel Kim', company: 'Solstice Bank', email: 'elena.voss@solsticebank.com', category: 'Decision Maker', createdAt: iso(-9), updatedAt: iso(-2), description: 'Head of digital banking, leading the RFP process.' },
  { id: 'con-004', title: 'Marcus Ford', status: 'Inactive', statusVariant: 'default', owner: 'Priya Sharma', company: 'Cascade Logistics', email: 'marcus.ford@cascadelogistics.com', category: 'Influencer', createdAt: iso(-20), updatedAt: iso(-12), description: 'Went quiet after budget was not approved.' },
  { id: 'con-005', title: 'Nina Castillo', status: 'Customer', statusVariant: 'success', owner: 'Daniel Kim', company: 'Bramble Media', email: 'nina.castillo@bramblemedia.com', category: 'Decision Maker', createdAt: iso(-60), updatedAt: iso(-46), description: 'Signed the enterprise contract and manages the account.' },
  { id: 'con-006', title: 'Owen Park', status: 'Lead', statusVariant: 'info', owner: 'Priya Sharma', company: 'Northwind Foods', email: 'owen.park@northwindfoods.com', category: 'Champion', createdAt: iso(-11), updatedAt: iso(-3), description: 'Advocating internally for TechOS over incumbent tools.' },
  { id: 'con-007', title: 'Sarah Klein', status: 'Lead', statusVariant: 'info', owner: 'Daniel Kim', company: 'Anchor Robotics', email: 'sarah.klein@anchorrobotics.com', category: 'Decision Maker', createdAt: iso(-1), updatedAt: iso(-1), description: 'Newly introduced via a customer referral.' },
  { id: 'con-008', title: 'Victor Adeyemi', status: 'Customer', statusVariant: 'success', owner: 'Priya Sharma', company: 'Fathom Analytics', email: 'victor.adeyemi@fathomanalytics.com', category: 'Champion', createdAt: iso(-55), updatedAt: iso(-15), description: 'Long-time champion, frequently requests early access features.' },
  { id: 'con-009', title: 'Hana Suzuki', status: 'Lead', statusVariant: 'info', owner: 'Daniel Kim', company: 'Lumen Energy', email: 'hana.suzuki@lumenenergy.com', category: 'Influencer', createdAt: iso(-17), updatedAt: iso(-4), description: 'Security lead reviewing compliance documentation.' },
  { id: 'con-010', title: 'Diego Rivas', status: 'Inactive', statusVariant: 'default', owner: 'Priya Sharma', company: 'Orbit Telecom', email: 'diego.rivas@orbittelecom.com', category: 'Influencer', createdAt: iso(-25), updatedAt: iso(-19), description: 'Opted for an in-house build instead of TechOS.' },
  { id: 'con-011', title: 'Claire Dubois', status: 'Lead', statusVariant: 'info', owner: 'Daniel Kim', company: 'Harbor Insurance', email: 'claire.dubois@harborinsurance.com', category: 'Decision Maker', createdAt: iso(-3), updatedAt: iso(-3), description: 'Reviewing procurement requirements with legal.' },
  { id: 'con-012', title: 'Ben Whitfield', status: 'Customer', statusVariant: 'success', owner: 'Priya Sharma', company: 'Meridian Capital', email: 'ben.whitfield@meridiancapital.com', category: 'Decision Maker', createdAt: iso(-70), updatedAt: iso(-10), description: 'Existing customer exploring an account expansion.' },
];

// ---------------------------------------------------------------------------
// tickets
// ---------------------------------------------------------------------------

const tickets: MockRecord[] = [
  { id: 'tkt-001', title: 'Cannot export report to CSV', status: 'Open', statusVariant: 'error', owner: 'Noah Rodriguez', priority: 'high', company: 'Nimbus Retail', email: 'rachel.ortiz@nimbusretail.com', createdAt: iso(-1), updatedAt: iso(0), description: 'Customer reports CSV export button does nothing on the reports page.' },
  { id: 'tkt-002', title: 'Question about SSO setup', status: 'In Progress', statusVariant: 'warning', owner: 'Emma Wilson', priority: 'medium', company: 'Vertex Health', email: 'tom.bakshi@vertexhealth.com', createdAt: iso(-2), updatedAt: iso(-1), description: 'Needs guidance configuring Okta as their SAML identity provider.' },
  { id: 'tkt-003', title: 'Billing charged twice this month', status: 'Waiting', statusVariant: 'warning', owner: 'Noah Rodriguez', priority: 'critical', company: 'Solstice Bank', email: 'elena.voss@solsticebank.com', createdAt: iso(-3), updatedAt: iso(-1), description: 'Escalated to finance team for duplicate charge investigation.' },
  { id: 'tkt-004', title: 'Feature request: bulk task assignment', status: 'Open', statusVariant: 'error', owner: 'Emma Wilson', priority: 'low', company: 'Cascade Logistics', email: 'marcus.ford@cascadelogistics.com', createdAt: iso(-5), updatedAt: iso(-4), description: 'Wants to assign multiple tasks to a user in one action.' },
  { id: 'tkt-005', title: 'Slow load time on analytics dashboard', status: 'In Progress', statusVariant: 'warning', owner: 'Noah Rodriguez', priority: 'high', company: 'Bramble Media', email: 'nina.castillo@bramblemedia.com', createdAt: iso(-4), updatedAt: iso(0), description: 'Dashboard with large date ranges takes over 15 seconds to load.' },
  { id: 'tkt-006', title: 'Cannot reset password', status: 'Resolved', statusVariant: 'success', owner: 'Emma Wilson', priority: 'high', company: 'Northwind Foods', email: 'owen.park@northwindfoods.com', createdAt: iso(-10), updatedAt: iso(-8), description: 'Password reset email was landing in spam; resolved with allowlist guidance.' },
  { id: 'tkt-007', title: 'API returns 429 during peak hours', status: 'Open', statusVariant: 'error', owner: 'Noah Rodriguez', priority: 'critical', company: 'Anchor Robotics', email: 'sarah.klein@anchorrobotics.com', createdAt: iso(-1), updatedAt: iso(0), description: 'Rate limits are hit consistently around 9am local time.' },
  { id: 'tkt-008', title: 'Request for additional seats', status: 'Closed', statusVariant: 'default', owner: 'Emma Wilson', priority: 'low', company: 'Fathom Analytics', email: 'victor.adeyemi@fathomanalytics.com', createdAt: iso(-15), updatedAt: iso(-12), description: 'Added 5 additional seats and updated the subscription.' },
  { id: 'tkt-009', title: 'Dark mode text contrast issue', status: 'In Progress', statusVariant: 'warning', owner: 'Noah Rodriguez', priority: 'medium', company: 'Lumen Energy', email: 'hana.suzuki@lumenenergy.com', createdAt: iso(-6), updatedAt: iso(-2), description: 'Some labels are hard to read in dark mode on the settings page.' },
  { id: 'tkt-010', title: 'Integration with Slack not posting', status: 'Waiting', statusVariant: 'warning', owner: 'Emma Wilson', priority: 'high', company: 'Orbit Telecom', email: 'diego.rivas@orbittelecom.com', createdAt: iso(-7), updatedAt: iso(-3), description: 'Waiting on customer to re-authorize the Slack integration.' },
  { id: 'tkt-011', title: 'Export includes archived records', status: 'Open', statusVariant: 'error', owner: 'Noah Rodriguez', priority: 'medium', company: 'Harbor Insurance', email: 'claire.dubois@harborinsurance.com', createdAt: iso(-2), updatedAt: iso(-1), description: 'Archived contacts are unexpectedly included in CSV exports.' },
  { id: 'tkt-012', title: 'Onboarding checklist stuck at 80%', status: 'Resolved', statusVariant: 'success', owner: 'Emma Wilson', priority: 'low', company: 'Meridian Capital', email: 'ben.whitfield@meridiancapital.com', createdAt: iso(-12), updatedAt: iso(-9), description: 'Final onboarding step was not marking complete; fixed with a manual override.' },
  { id: 'tkt-013', title: 'Two-factor codes not arriving', status: 'Open', statusVariant: 'error', owner: 'Noah Rodriguez', priority: 'critical', company: 'Palmetto Airlines', email: 'ops@palmettoairlines.com', createdAt: iso(0), updatedAt: iso(0), description: 'SMS 2FA codes delayed by several minutes for some users.' },
  { id: 'tkt-014', title: 'Duplicate contacts after CSV import', status: 'In Progress', statusVariant: 'warning', owner: 'Emma Wilson', priority: 'medium', company: 'Ironclad Security', email: 'it@ironcladsecurity.com', createdAt: iso(-3), updatedAt: iso(-1), description: 'Import created duplicate contact records for the same email.' },
];

// ---------------------------------------------------------------------------
// campaigns
// ---------------------------------------------------------------------------

const campaigns: MockRecord[] = [
  { id: 'cmp-001', title: 'Q3 LinkedIn ABM Push', status: 'Active', statusVariant: 'info', owner: 'Priya Sharma', amount: 45000, progress: 62, category: 'Paid Social', createdAt: iso(-30), updatedAt: iso(-1), description: 'Account-based marketing campaign targeting 50 enterprise logos.' },
  { id: 'cmp-002', title: 'Summer Webinar Series', status: 'Completed', statusVariant: 'success', owner: 'Daniel Kim', amount: 12000, progress: 100, category: 'Content', createdAt: iso(-70), updatedAt: iso(-20), description: 'Four-part webinar series on scaling operations with TechOS.' },
  { id: 'cmp-003', title: 'Google Search - Competitor Terms', status: 'Active', statusVariant: 'info', owner: 'Priya Sharma', amount: 28000, progress: 48, category: 'SEM', createdAt: iso(-25), updatedAt: iso(-2), description: 'Targeting competitor brand searches with comparison landing pages.' },
  { id: 'cmp-004', title: 'Customer Advocacy Video Series', status: 'Draft', statusVariant: 'default', owner: 'Daniel Kim', amount: 9000, progress: 5, category: 'Content', createdAt: iso(-4), updatedAt: iso(-1), description: 'Video testimonials from three flagship enterprise customers.' },
  { id: 'cmp-005', title: 'Partner Co-Marketing - Fathom', status: 'Active', statusVariant: 'info', owner: 'Priya Sharma', amount: 15000, progress: 70, category: 'Partnerships', createdAt: iso(-18), updatedAt: iso(-2), description: 'Joint webinar and blog series with Fathom Analytics.' },
  { id: 'cmp-006', title: 'Retargeting - Cart Abandoners', status: 'Paused', statusVariant: 'warning', owner: 'Daniel Kim', amount: 8000, progress: 55, category: 'Paid Social', createdAt: iso(-35), updatedAt: iso(-10), description: 'Paused pending creative refresh after fatigue in CTR.' },
  { id: 'cmp-007', title: 'Annual Customer Conference', status: 'Active', statusVariant: 'info', owner: 'Priya Sharma', amount: 120000, progress: 33, category: 'Events', createdAt: iso(-40), updatedAt: iso(-3), description: 'Planning for the flagship annual user conference in October.' },
  { id: 'cmp-008', title: 'SEO Content Refresh', status: 'Completed', statusVariant: 'success', owner: 'Daniel Kim', amount: 6000, progress: 100, category: 'Content', createdAt: iso(-90), updatedAt: iso(-30), description: 'Refreshed top 40 organic landing pages for updated keywords.' },
  { id: 'cmp-009', title: 'Email Nurture - Trial Users', status: 'Active', statusVariant: 'info', owner: 'Priya Sharma', amount: 4000, progress: 80, category: 'Email', createdAt: iso(-50), updatedAt: iso(-4), description: '7-day automated nurture sequence for self-serve trial signups.' },
  { id: 'cmp-010', title: 'Holiday Promo Bundle', status: 'Draft', statusVariant: 'default', owner: 'Daniel Kim', amount: 20000, progress: 10, category: 'Promotions', createdAt: iso(-2), updatedAt: iso(-1), description: 'Discount bundle planning for the end-of-year promotional push.' },
];

// ---------------------------------------------------------------------------
// features
// ---------------------------------------------------------------------------

const features: MockRecord[] = [
  { id: 'ftr-001', title: 'Bulk task assignment', status: 'In Development', statusVariant: 'info', owner: 'Jordan Lee', priority: 'medium', progress: 55, tags: ['tasks'], createdAt: iso(-20), updatedAt: iso(-1), description: 'Assign multiple selected tasks to a teammate in one action.' },
  { id: 'ftr-002', title: 'Custom report builder', status: 'Backlog', statusVariant: 'default', owner: 'Ethan Brooks', priority: 'high', progress: 0, tags: ['reports'], createdAt: iso(-3), updatedAt: iso(-3), description: 'Drag-and-drop builder for custom cross-entity reports.' },
  { id: 'ftr-003', title: 'AI ticket triage suggestions', status: 'In Review', statusVariant: 'warning', owner: 'Aisha Patel', priority: 'high', progress: 88, tags: ['support', 'ai'], createdAt: iso(-25), updatedAt: iso(0), description: 'Suggests category, priority, and assignee for new support tickets.' },
  { id: 'ftr-004', title: 'Dark mode for prototype viewer', status: 'Shipped', statusVariant: 'success', owner: 'Liam Nguyen', priority: 'low', progress: 100, tags: ['design'], createdAt: iso(-30), updatedAt: iso(-8), description: 'Shipped in v2.3.0 to reduce eye strain during late reviews.' },
  { id: 'ftr-005', title: 'Usage-based billing', status: 'In Development', statusVariant: 'info', owner: 'Marcus Webb', priority: 'critical', progress: 30, tags: ['billing'], createdAt: iso(-40), updatedAt: iso(-2), description: 'Metered billing for API calls beyond the plan allowance.' },
  { id: 'ftr-006', title: 'Mobile offline mode', status: 'In Development', statusVariant: 'info', owner: 'Jordan Lee', priority: 'high', progress: 60, tags: ['mobile'], createdAt: iso(-30), updatedAt: iso(-1), description: 'Read and queue writes while offline on the mobile app.' },
  { id: 'ftr-007', title: 'SAML SSO for enterprise', status: 'Backlog', statusVariant: 'default', owner: 'Aisha Patel', priority: 'medium', progress: 12, tags: ['security'], createdAt: iso(-15), updatedAt: iso(-3), description: 'Enterprise-grade single sign-on via SAML 2.0.' },
  { id: 'ftr-008', title: 'Sprint velocity forecasting', status: 'Backlog', statusVariant: 'default', owner: 'Ethan Brooks', priority: 'low', progress: 0, tags: ['analytics'], createdAt: iso(-5), updatedAt: iso(-5), description: 'Predict sprint completion likelihood based on historical velocity.' },
  { id: 'ftr-009', title: 'Real-time collaboration cursors', status: 'In Review', statusVariant: 'warning', owner: 'Liam Nguyen', priority: 'medium', progress: 92, tags: ['collaboration'], createdAt: iso(-22), updatedAt: iso(0), description: 'Show teammate cursors live while co-editing documents.' },
  { id: 'ftr-010', title: 'Webhook event replay', status: 'Shipped', statusVariant: 'success', owner: 'Marcus Webb', priority: 'medium', progress: 100, tags: ['api'], createdAt: iso(-45), updatedAt: iso(-14), description: 'Replay failed webhook deliveries from the developer console.' },
  { id: 'ftr-011', title: 'Multi-currency invoicing', status: 'In Development', statusVariant: 'info', owner: 'Marcus Webb', priority: 'high', progress: 25, tags: ['billing'], createdAt: iso(-35), updatedAt: iso(-2), description: 'Generate and send invoices in the customer local currency.' },
  { id: 'ftr-012', title: 'Keyboard shortcut palette', status: 'Shipped', statusVariant: 'success', owner: 'Ethan Brooks', priority: 'low', progress: 100, tags: ['productivity'], createdAt: iso(-50), updatedAt: iso(-20), description: 'Command-K palette for navigating and taking quick actions.' },
];

// ---------------------------------------------------------------------------
// releases
// ---------------------------------------------------------------------------

const releases: MockRecord[] = [
  { id: 'rel-001', title: 'v2.4.0', status: 'In Progress', statusVariant: 'info', owner: 'Marcus Webb', progress: 72, tags: ['minor'], dueDate: iso(7), createdAt: iso(-25), updatedAt: iso(-1), description: 'Usage-based billing, mobile offline mode, and webhook replay.' },
  { id: 'rel-002', title: 'v2.3.2', status: 'Released', statusVariant: 'success', owner: 'Marcus Webb', progress: 100, tags: ['patch'], dueDate: iso(-6), createdAt: iso(-14), updatedAt: iso(-6), description: 'Hotfix for the checkout integration test flakiness.' },
  { id: 'rel-003', title: 'v2.3.0', status: 'Released', statusVariant: 'success', owner: 'Aisha Patel', progress: 100, tags: ['minor'], dueDate: iso(-20), createdAt: iso(-50), updatedAt: iso(-20), description: 'Dark mode support and design system token rollout.' },
  { id: 'rel-004', title: 'v2.5.0-beta', status: 'Planned', statusVariant: 'default', owner: 'Ethan Brooks', progress: 5, tags: ['minor'], dueDate: iso(45), createdAt: iso(-3), updatedAt: iso(-3), description: 'Custom report builder and sprint velocity forecasting.' },
  { id: 'rel-005', title: 'v2.2.5', status: 'Released', statusVariant: 'success', owner: 'Marcus Webb', progress: 100, tags: ['patch'], dueDate: iso(-40), updatedAt: iso(-40), createdAt: iso(-50), description: 'Security patch for webhook signature verification.' },
  { id: 'rel-006', title: 'v2.4.1', status: 'Delayed', statusVariant: 'warning', owner: 'Aisha Patel', progress: 40, tags: ['patch'], dueDate: iso(3), createdAt: iso(-10), updatedAt: iso(-1), description: 'Delayed pending resolution of the Windows CI pipeline stall.' },
  { id: 'rel-007', title: 'Mobile v3.1.0', status: 'In Progress', statusVariant: 'info', owner: 'Jordan Lee', progress: 58, tags: ['mobile'], dueDate: iso(20), createdAt: iso(-30), updatedAt: iso(-1), description: 'Offline sync queue and redesigned navigation shell.' },
  { id: 'rel-008', title: 'v2.1.0', status: 'Released', statusVariant: 'success', owner: 'Marcus Webb', progress: 100, tags: ['minor'], dueDate: iso(-70), createdAt: iso(-100), updatedAt: iso(-70), description: 'Initial launch of the public REST API.' },
  { id: 'rel-009', title: 'Mobile v3.0.0', status: 'Released', statusVariant: 'success', owner: 'Jordan Lee', progress: 100, tags: ['mobile', 'major'], dueDate: iso(-90), createdAt: iso(-130), updatedAt: iso(-90), description: 'Full rewrite of the mobile app on the new native shell.' },
  { id: 'rel-010', title: 'v2.6.0-planning', status: 'Planned', statusVariant: 'default', owner: 'Ethan Brooks', progress: 0, tags: ['major'], dueDate: iso(90), createdAt: iso(-1), updatedAt: iso(-1), description: 'Early scoping for real-time collaboration features.' },
];

// ---------------------------------------------------------------------------
// documents
// ---------------------------------------------------------------------------

const documents: MockRecord[] = [
  { id: 'doc-001', title: 'API Authentication Guide', status: 'Published', statusVariant: 'success', owner: 'Marcus Webb', category: 'Engineering', tags: ['api', 'docs'], createdAt: iso(-60), updatedAt: iso(-5), description: 'How to authenticate requests using API keys and OAuth.' },
  { id: 'doc-002', title: 'Q3 Board Deck', status: 'Draft', statusVariant: 'default', owner: 'Alexandra Chen', category: 'Executive', tags: ['board'], createdAt: iso(-4), updatedAt: iso(-1), description: 'Quarterly business review deck for the upcoming board meeting.' },
  { id: 'doc-003', title: 'Onboarding Playbook - Enterprise', status: 'Published', statusVariant: 'success', owner: 'Noah Rodriguez', category: 'Support', tags: ['onboarding'], createdAt: iso(-40), updatedAt: iso(-10), description: 'Step-by-step playbook for onboarding new enterprise accounts.' },
  { id: 'doc-004', title: 'Design System Contribution Guide', status: 'Under Review', statusVariant: 'warning', owner: 'Liam Nguyen', category: 'Design', tags: ['design-system'], createdAt: iso(-9), updatedAt: iso(-1), description: 'Guidelines for proposing new components and tokens.' },
  { id: 'doc-005', title: 'Incident Response Runbook', status: 'Published', statusVariant: 'success', owner: 'Aisha Patel', category: 'Engineering', tags: ['ops'], createdAt: iso(-70), updatedAt: iso(-15), description: 'Escalation paths and comms templates for production incidents.' },
  { id: 'doc-006', title: 'Sales Battlecard - Competitor X', status: 'Published', statusVariant: 'success', owner: 'Daniel Kim', category: 'Sales', tags: ['sales'], createdAt: iso(-30), updatedAt: iso(-6), description: 'Positioning and objection handling against Competitor X.' },
  { id: 'doc-007', title: 'Data Retention Policy', status: 'Archived', statusVariant: 'default', owner: 'Priya Sharma', category: 'Legal', tags: ['compliance'], createdAt: iso(-200), updatedAt: iso(-90), description: 'Superseded by the updated 2026 data governance policy.' },
  { id: 'doc-008', title: 'User Research: Onboarding Study', status: 'Published', statusVariant: 'success', owner: 'Grace Kim', category: 'Design', tags: ['research'], createdAt: iso(-25), updatedAt: iso(-8), description: 'Findings from 12 moderated sessions on the onboarding flow.' },
  { id: 'doc-009', title: 'Release Checklist Template', status: 'Published', statusVariant: 'success', owner: 'Marcus Webb', category: 'Engineering', tags: ['process'], createdAt: iso(-80), updatedAt: iso(-20), description: 'Standard checklist used before every production release.' },
  { id: 'doc-010', title: 'Support Macro Library', status: 'Under Review', statusVariant: 'warning', owner: 'Emma Wilson', category: 'Support', tags: ['macros'], createdAt: iso(-6), updatedAt: iso(-1), description: 'Collection of canned responses pending tone-of-voice review.' },
  { id: 'doc-011', title: 'Financial Close Checklist', status: 'Published', statusVariant: 'success', owner: 'Daniel Kim', category: 'Finance', tags: ['finance'], createdAt: iso(-50), updatedAt: iso(-12), description: 'Monthly close process from journal entries to reporting.' },
  { id: 'doc-012', title: 'Brand Voice & Tone Guide', status: 'Draft', statusVariant: 'default', owner: 'Liam Nguyen', category: 'Marketing', tags: ['brand'], createdAt: iso(-2), updatedAt: iso(-1), description: 'Draft guidelines for consistent messaging across channels.' },
];

// ---------------------------------------------------------------------------
// meetings
// ---------------------------------------------------------------------------

const meetings: MockRecord[] = [
  { id: 'mtg-001', title: 'Weekly Exec Sync', status: 'Scheduled', statusVariant: 'info', owner: 'Alexandra Chen', location: 'Boardroom A', dueDate: iso(1, 10), createdAt: iso(-60), updatedAt: iso(-1), description: 'Weekly leadership sync covering company-wide priorities.' },
  { id: 'mtg-002', title: 'Sprint 24 Planning', status: 'Scheduled', statusVariant: 'info', owner: 'Jordan Lee', location: 'Zoom', dueDate: iso(2, 14), createdAt: iso(-5), updatedAt: iso(-1), description: 'Plan scope and capacity for the upcoming two-week sprint.' },
  { id: 'mtg-003', title: 'Nimbus Retail QBR', status: 'Scheduled', statusVariant: 'info', owner: 'Daniel Kim', location: 'Zoom', dueDate: iso(4, 11), createdAt: iso(-10), updatedAt: iso(-1), description: 'Quarterly business review with Nimbus Retail stakeholders.' },
  { id: 'mtg-004', title: 'Design Critique', status: 'Completed', statusVariant: 'success', owner: 'Liam Nguyen', location: 'Design Studio', dueDate: iso(-2, 13), createdAt: iso(-15), updatedAt: iso(-2), description: 'Weekly review of in-progress onboarding flow designs.' },
  { id: 'mtg-005', title: 'Incident Postmortem: Payments Outage', status: 'Completed', statusVariant: 'success', owner: 'Aisha Patel', location: 'Zoom', dueDate: iso(-5, 15), createdAt: iso(-8), updatedAt: iso(-5), description: 'Root cause review and follow-up actions for the payments outage.' },
  { id: 'mtg-006', title: 'Support Team Standup', status: 'Scheduled', statusVariant: 'info', owner: 'Noah Rodriguez', location: 'Zoom', dueDate: iso(0, 9), createdAt: iso(-30), updatedAt: iso(-1), description: 'Daily standup reviewing queue health and urgent tickets.' },
  { id: 'mtg-007', title: 'Board Meeting - Q3 Review', status: 'Scheduled', statusVariant: 'info', owner: 'Alexandra Chen', location: 'Boardroom A', dueDate: iso(12, 9), createdAt: iso(-20), updatedAt: iso(-2), description: 'Quarterly board meeting covering financials and strategy.' },
  { id: 'mtg-008', title: 'Candidate Debrief: Backend Engineer', status: 'Completed', statusVariant: 'success', owner: 'Marcus Webb', location: 'Zoom', dueDate: iso(-3, 16), createdAt: iso(-6), updatedAt: iso(-3), description: 'Panel debrief after the final round interview loop.' },
  { id: 'mtg-009', title: 'Customer Advisory Board', status: 'Cancelled', statusVariant: 'error', owner: 'Priya Sharma', location: 'Zoom', dueDate: iso(6, 10), createdAt: iso(-25), updatedAt: iso(-4), description: 'Rescheduled at the request of two key customer attendees.' },
  { id: 'mtg-010', title: 'Architecture Review: Billing Engine V2', status: 'Scheduled', statusVariant: 'info', owner: 'Marcus Webb', location: 'Zoom', dueDate: iso(3, 13), createdAt: iso(-4), updatedAt: iso(-1), description: 'Review proposed schema and service boundaries for billing V2.' },
];

// ---------------------------------------------------------------------------
// goals
// ---------------------------------------------------------------------------

const goals: MockRecord[] = [
  { id: 'gol-001', title: 'Grow ARR to $18M', status: 'On Track', statusVariant: 'success', owner: 'Alexandra Chen', progress: 68, dueDate: iso(150), createdAt: iso(-30), updatedAt: iso(-2), description: 'Company-wide revenue target for fiscal year 2026.' },
  { id: 'gol-002', title: 'Reduce infra cost per customer by 15%', status: 'At Risk', statusVariant: 'warning', owner: 'Marcus Webb', progress: 34, dueDate: iso(90), createdAt: iso(-40), updatedAt: iso(-3), description: 'Optimize compute and storage usage across shared services.' },
  { id: 'gol-003', title: 'Ship mobile offline mode', status: 'On Track', statusVariant: 'success', owner: 'Jordan Lee', progress: 60, dueDate: iso(20), createdAt: iso(-30), updatedAt: iso(-1), description: 'Key retention driver for field-based mobile users.' },
  { id: 'gol-004', title: 'Achieve SOC 2 Type II certification', status: 'On Track', statusVariant: 'success', owner: 'Aisha Patel', progress: 75, dueDate: iso(60), createdAt: iso(-90), updatedAt: iso(-5), description: 'Complete audit evidence collection and remediate findings.' },
  { id: 'gol-005', title: 'Improve NPS to 55', status: 'At Risk', statusVariant: 'warning', owner: 'Noah Rodriguez', progress: 40, dueDate: iso(75), createdAt: iso(-45), updatedAt: iso(-6), description: 'Driven by faster response times and proactive check-ins.' },
  { id: 'gol-006', title: 'Launch redesigned onboarding', status: 'Achieved', statusVariant: 'success', owner: 'Grace Kim', progress: 100, dueDate: iso(-10), createdAt: iso(-80), updatedAt: iso(-10), description: 'New guided onboarding wizard shipped ahead of schedule.' },
  { id: 'gol-007', title: 'Hire 12 engineers by year end', status: 'On Track', statusVariant: 'success', owner: 'Marcus Webb', progress: 58, dueDate: iso(120), createdAt: iso(-60), updatedAt: iso(-4), description: 'Scale the engineering org to support the 2027 roadmap.' },
  { id: 'gol-008', title: 'Cut support first-response time to 1h', status: 'Not Started', statusVariant: 'default', owner: 'Noah Rodriguez', progress: 0, dueDate: iso(100), createdAt: iso(-2), updatedAt: iso(-2), description: 'Planned rollout of AI-assisted triage to hit the new SLA.' },
  { id: 'gol-009', title: 'Expand design system adoption to 90%', status: 'On Track', statusVariant: 'success', owner: 'Liam Nguyen', progress: 71, dueDate: iso(45), createdAt: iso(-70), updatedAt: iso(-3), description: 'Migrate remaining legacy screens onto Design System 2.0.' },
  { id: 'gol-010', title: 'Reduce customer churn to under 4%', status: 'At Risk', statusVariant: 'warning', owner: 'Priya Sharma', progress: 45, dueDate: iso(80), createdAt: iso(-50), updatedAt: iso(-5), description: 'Focus on at-risk accounts identified by the health score model.' },
];

// ---------------------------------------------------------------------------
// employees
// ---------------------------------------------------------------------------

const employees: MockRecord[] = [
  { id: 'emp-001', title: 'Alexandra Chen', status: 'Active', statusVariant: 'success', owner: 'Board of Directors', department: 'Executive', email: 'alexandra.chen@techos.io', createdAt: '2019-02-11T09:00:00.000Z', updatedAt: iso(-30), description: 'Chief Executive Officer, joined 2019.' },
  { id: 'emp-002', title: 'Marcus Webb', status: 'Active', statusVariant: 'success', owner: 'Alexandra Chen', department: 'Engineering', email: 'marcus.webb@techos.io', createdAt: '2019-06-03T09:00:00.000Z', updatedAt: iso(-25), description: 'Chief Technology Officer, joined 2019.' },
  { id: 'emp-003', title: 'Priya Sharma', status: 'Active', statusVariant: 'success', owner: 'Alexandra Chen', department: 'Finance', email: 'priya.sharma@techos.io', createdAt: '2020-01-20T09:00:00.000Z', updatedAt: iso(-20), description: 'VP of Finance, joined 2020.' },
  { id: 'emp-004', title: 'Daniel Kim', status: 'Active', statusVariant: 'success', owner: 'Priya Sharma', department: 'Finance', email: 'daniel.kim@techos.io', createdAt: '2021-08-16T09:00:00.000Z', updatedAt: iso(-18), description: 'Senior Financial Analyst.' },
  { id: 'emp-005', title: 'Jordan Lee', status: 'Active', statusVariant: 'success', owner: 'Marcus Webb', department: 'Engineering', email: 'jordan.lee@techos.io', createdAt: '2020-03-09T09:00:00.000Z', updatedAt: iso(-14), description: 'Staff Software Engineer, mobile platform lead.' },
  { id: 'emp-006', title: 'Sofia Martinez', status: 'On Leave', statusVariant: 'warning', owner: 'Marcus Webb', department: 'Engineering', email: 'sofia.martinez@techos.io', createdAt: '2021-11-01T09:00:00.000Z', updatedAt: iso(-3), description: 'Backend Engineer, currently on parental leave.' },
  { id: 'emp-007', title: 'Ethan Brooks', status: 'Active', statusVariant: 'success', owner: 'Marcus Webb', department: 'Engineering', email: 'ethan.brooks@techos.io', createdAt: '2022-04-18T09:00:00.000Z', updatedAt: iso(-9), description: 'Frontend Engineer working on the analytics pipeline.' },
  { id: 'emp-008', title: 'Aisha Patel', status: 'Active', statusVariant: 'success', owner: 'Marcus Webb', department: 'Engineering', email: 'aisha.patel@techos.io', createdAt: '2023-01-09T09:00:00.000Z', updatedAt: iso(-6), description: 'DevOps Engineer focused on CI/CD and security.' },
  { id: 'emp-009', title: 'Liam Nguyen', status: 'Active', statusVariant: 'success', owner: 'Alexandra Chen', department: 'Design', email: 'liam.nguyen@techos.io', createdAt: '2020-09-14T09:00:00.000Z', updatedAt: iso(-11), description: 'Lead Product Designer, owns the design system.' },
  { id: 'emp-010', title: 'Grace Kim', status: 'Active', statusVariant: 'success', owner: 'Liam Nguyen', department: 'Design', email: 'grace.kim@techos.io', createdAt: '2022-07-25T09:00:00.000Z', updatedAt: iso(-7), description: 'UX Researcher running the onboarding study.' },
  { id: 'emp-011', title: 'Noah Rodriguez', status: 'Active', statusVariant: 'success', owner: 'Alexandra Chen', department: 'Customer Support', email: 'noah.rodriguez@techos.io', createdAt: '2021-05-03T09:00:00.000Z', updatedAt: iso(-5), description: 'Customer Support Lead managing the escalation queue.' },
  { id: 'emp-012', title: 'Emma Wilson', status: 'Terminated', statusVariant: 'error', owner: 'Noah Rodriguez', department: 'Customer Support', email: 'emma.wilson@techos.io', createdAt: '2022-10-30T09:00:00.000Z', updatedAt: iso(-45), description: 'Support Specialist, offboarded end of last quarter.' },
];

// ---------------------------------------------------------------------------
// candidates
// ---------------------------------------------------------------------------

const candidates: MockRecord[] = [
  { id: 'cnd-001', title: 'Wesley Chan', status: 'Interview', statusVariant: 'info', owner: 'Marcus Webb', email: 'wesley.chan@example.com', company: 'Senior Backend Engineer', createdAt: iso(-14), updatedAt: iso(-1), description: 'Strong distributed systems background, on-site loop scheduled.' },
  { id: 'cnd-002', title: 'Mia Fontaine', status: 'Offer', statusVariant: 'warning', owner: 'Marcus Webb', email: 'mia.fontaine@example.com', company: 'Staff Frontend Engineer', createdAt: iso(-30), updatedAt: iso(-1), description: 'Offer extended, awaiting response by end of week.' },
  { id: 'cnd-003', title: 'Rohan Mehta', status: 'Screening', statusVariant: 'default', owner: 'Aisha Patel', email: 'rohan.mehta@example.com', company: 'DevOps Engineer', createdAt: iso(-5), updatedAt: iso(-2), description: 'Recruiter screen completed, moving to technical phone screen.' },
  { id: 'cnd-004', title: 'Chloe Bennett', status: 'Hired', statusVariant: 'success', owner: 'Liam Nguyen', email: 'chloe.bennett@example.com', company: 'Product Designer', createdAt: iso(-45), updatedAt: iso(-20), description: 'Accepted offer, starting date confirmed for next month.' },
  { id: 'cnd-005', title: 'Marcus Alden', status: 'Rejected', statusVariant: 'error', owner: 'Noah Rodriguez', email: 'marcus.alden@example.com', company: 'Support Specialist', createdAt: iso(-20), updatedAt: iso(-10), description: 'Did not meet bar for customer communication assessment.' },
  { id: 'cnd-006', title: 'Yuki Tanaka', status: 'Applied', statusVariant: 'default', owner: 'Marcus Webb', email: 'yuki.tanaka@example.com', company: 'Site Reliability Engineer', createdAt: iso(-1), updatedAt: iso(-1), description: 'Application submitted through the careers page.' },
  { id: 'cnd-007', title: 'Isabella Cruz', status: 'Interview', statusVariant: 'info', owner: 'Priya Sharma', email: 'isabella.cruz@example.com', company: 'Financial Analyst', createdAt: iso(-9), updatedAt: iso(-1), description: 'Final round with the finance leadership team scheduled.' },
  { id: 'cnd-008', title: 'Samuel Osei', status: 'Screening', statusVariant: 'default', owner: 'Alexandra Chen', email: 'samuel.osei@example.com', company: 'Head of Sales', createdAt: iso(-6), updatedAt: iso(-2), description: 'Reviewing references before advancing to the exec panel.' },
  { id: 'cnd-009', title: 'Freya Larsen', status: 'Hired', statusVariant: 'success', owner: 'Marcus Webb', email: 'freya.larsen@example.com', company: 'Backend Engineer', createdAt: iso(-60), updatedAt: iso(-35), description: 'Onboarded last month, ramping on the billing team.' },
  { id: 'cnd-010', title: 'Theo Marchetti', status: 'Rejected', statusVariant: 'error', owner: 'Liam Nguyen', email: 'theo.marchetti@example.com', company: 'UX Designer', createdAt: iso(-25), updatedAt: iso(-15), description: 'Portfolio did not demonstrate enough systems-level thinking.' },
];

// ---------------------------------------------------------------------------
// leaveRequests
// ---------------------------------------------------------------------------

const leaveRequests: MockRecord[] = [
  { id: 'lve-001', title: 'Sofia Martinez - Parental Leave', status: 'Approved', statusVariant: 'success', owner: 'Marcus Webb', category: 'Parental Leave', dueDate: iso(-10), createdAt: iso(-40), updatedAt: iso(-10), description: '12-week parental leave, returning in October.' },
  { id: 'lve-002', title: 'Ethan Brooks - Vacation', status: 'Pending', statusVariant: 'warning', owner: 'Marcus Webb', category: 'Vacation', dueDate: iso(15), createdAt: iso(-2), updatedAt: iso(-2), description: 'Requesting one week off for a family trip.' },
  { id: 'lve-003', title: 'Grace Kim - Sick Leave', status: 'Approved', statusVariant: 'success', owner: 'Liam Nguyen', category: 'Sick Leave', dueDate: iso(-2), createdAt: iso(-3), updatedAt: iso(-2), description: 'Two days of sick leave, doctor note on file.' },
  { id: 'lve-004', title: 'Daniel Kim - Vacation', status: 'Rejected', statusVariant: 'error', owner: 'Priya Sharma', category: 'Vacation', dueDate: iso(5), createdAt: iso(-8), updatedAt: iso(-4), description: 'Rejected due to overlap with the quarterly close period.' },
  { id: 'lve-005', title: 'Noah Rodriguez - Personal Day', status: 'Approved', statusVariant: 'success', owner: 'Alexandra Chen', category: 'Personal', dueDate: iso(-1), createdAt: iso(-4), updatedAt: iso(-1), description: 'Single personal day, coverage arranged with Emma Wilson.' },
  { id: 'lve-006', title: 'Aisha Patel - Vacation', status: 'Pending', statusVariant: 'warning', owner: 'Marcus Webb', category: 'Vacation', dueDate: iso(30), createdAt: iso(-1), updatedAt: iso(-1), description: 'Two weeks planned for an international trip.' },
  { id: 'lve-007', title: 'Liam Nguyen - Conference Travel', status: 'Approved', statusVariant: 'success', owner: 'Alexandra Chen', category: 'Work Travel', dueDate: iso(18), createdAt: iso(-6), updatedAt: iso(-2), description: 'Attending a design leadership conference in Chicago.' },
  { id: 'lve-008', title: 'Jordan Lee - Sick Leave', status: 'Approved', statusVariant: 'success', owner: 'Marcus Webb', category: 'Sick Leave', dueDate: iso(-6), createdAt: iso(-7), updatedAt: iso(-6), description: 'One day sick leave, recovered and back on Sprint 24.' },
  { id: 'lve-009', title: 'Emma Wilson - Personal Day', status: 'Pending', statusVariant: 'warning', owner: 'Noah Rodriguez', category: 'Personal', dueDate: iso(9), createdAt: iso(-1), updatedAt: iso(-1), description: 'Requesting a personal day for a family event.' },
  { id: 'lve-010', title: 'Priya Sharma - Vacation', status: 'Approved', statusVariant: 'success', owner: 'Alexandra Chen', category: 'Vacation', dueDate: iso(40), createdAt: iso(-5), updatedAt: iso(-2), description: 'One week off planned ahead of the fiscal year-end close.' },
];

// ---------------------------------------------------------------------------
// codeReviews
// ---------------------------------------------------------------------------

const codeReviews: MockRecord[] = [
  { id: 'crv-001', title: 'feat: offline sync queue for mobile', status: 'Open', statusVariant: 'info', owner: 'Jordan Lee', tags: ['techos-mobile'], createdAt: iso(-2), updatedAt: iso(0), description: 'Adds a write-ahead queue and conflict resolution strategy.' },
  { id: 'crv-002', title: 'fix: rate limiter token bucket edge case', status: 'Approved', statusVariant: 'success', owner: 'Ethan Brooks', tags: ['techos-api'], createdAt: iso(-3), updatedAt: iso(-1), description: 'Fixes a race condition when refilling tokens under load.' },
  { id: 'crv-003', title: 'chore: migrate settings page to RSC', status: 'Merged', statusVariant: 'success', owner: 'Aisha Patel', tags: ['techos-web'], createdAt: iso(-8), updatedAt: iso(-6), description: 'Converts the account settings page to a server component.' },
  { id: 'crv-004', title: 'feat: webhook HMAC signature verification', status: 'Changes Requested', statusVariant: 'warning', owner: 'Marcus Webb', tags: ['techos-api'], createdAt: iso(-5), updatedAt: iso(-1), description: 'Reviewer requested constant-time comparison for signatures.' },
  { id: 'crv-005', title: 'refactor: sprint board drag-and-drop', status: 'Open', statusVariant: 'info', owner: 'Sofia Martinez', tags: ['techos-web'], createdAt: iso(-4), updatedAt: iso(0), description: 'Swaps react-dnd for a lighter, accessible drag library.' },
  { id: 'crv-006', title: 'fix: invoice PDF pagination overflow', status: 'Approved', statusVariant: 'success', owner: 'Daniel Kim', tags: ['techos-billing'], createdAt: iso(-6), updatedAt: iso(-2), description: 'Correctly paginates line items beyond the first page.' },
  { id: 'crv-007', title: 'feat: usage-based billing meter', status: 'Open', statusVariant: 'info', owner: 'Marcus Webb', tags: ['techos-billing'], createdAt: iso(-9), updatedAt: iso(-1), description: 'Introduces a metering service for API call overages.' },
  { id: 'crv-008', title: 'test: stabilize checkout e2e suite', status: 'Merged', statusVariant: 'success', owner: 'Sofia Martinez', tags: ['techos-web'], createdAt: iso(-10), updatedAt: iso(-7), description: 'Adds explicit waits and retries to reduce test flakiness.' },
  { id: 'crv-009', title: 'chore: bump CI runners to Windows Server 2025', status: 'Changes Requested', statusVariant: 'warning', owner: 'Aisha Patel', tags: ['infra'], createdAt: iso(-3), updatedAt: iso(0), description: 'Blocked pending a fix for the packaging step timeout.' },
  { id: 'crv-010', title: 'feat: keyboard shortcut command palette', status: 'Merged', statusVariant: 'success', owner: 'Ethan Brooks', tags: ['techos-web'], createdAt: iso(-20), updatedAt: iso(-14), description: 'Adds a Command-K palette for quick navigation.' },
  { id: 'crv-011', title: 'fix: duplicate mention notification emails', status: 'Open', statusVariant: 'info', owner: 'Aisha Patel', tags: ['techos-notifications'], createdAt: iso(-2), updatedAt: iso(0), description: 'Deduplicates outbound emails when a user is mentioned twice.' },
  { id: 'crv-012', title: 'perf: reduce dashboard chart re-renders', status: 'Approved', statusVariant: 'success', owner: 'Ethan Brooks', tags: ['techos-web'], createdAt: iso(-4), updatedAt: iso(-1), description: 'Memoizes chart config to prevent flicker on window resize.' },
];

// ---------------------------------------------------------------------------
// commits
// ---------------------------------------------------------------------------

const commits: MockRecord[] = [
  { id: 'cmt-001', title: 'fix(mobile): resolve sync queue race condition', status: 'main', statusVariant: 'default', owner: 'Jordan Lee', tags: ['techos-mobile'], createdAt: iso(0, 8, 12), updatedAt: iso(0, 8, 12), description: 'a1b2c3d - Guards against duplicate writes during reconnect.' },
  { id: 'cmt-002', title: 'feat(api): add token bucket rate limiter', status: 'feature/rate-limiter', statusVariant: 'info', owner: 'Ethan Brooks', tags: ['techos-api'], createdAt: iso(-1, 16, 40), updatedAt: iso(-1, 16, 40), description: 'e4f5a6b - Implements per-key rate limiting middleware.' },
  { id: 'cmt-003', title: 'chore(web): migrate settings to server components', status: 'main', statusVariant: 'default', owner: 'Aisha Patel', tags: ['techos-web'], createdAt: iso(-6, 11, 5), updatedAt: iso(-6, 11, 5), description: 'c7d8e9f - Removes client-only data fetching from settings.' },
  { id: 'cmt-004', title: 'fix(billing): correct PDF line item pagination', status: 'main', statusVariant: 'default', owner: 'Daniel Kim', tags: ['techos-billing'], createdAt: iso(-2, 9, 22), updatedAt: iso(-2, 9, 22), description: 'a0b1c2d - Splits invoices with more than 20 items correctly.' },
  { id: 'cmt-005', title: 'feat(billing): scaffold usage metering service', status: 'feature/usage-billing', statusVariant: 'info', owner: 'Marcus Webb', tags: ['techos-billing'], createdAt: iso(-1, 14, 10), updatedAt: iso(-1, 14, 10), description: 'f2e3d4c - Adds initial metering event ingestion pipeline.' },
  { id: 'cmt-006', title: 'test(web): stabilize checkout e2e flow', status: 'main', statusVariant: 'default', owner: 'Sofia Martinez', tags: ['techos-web'], createdAt: iso(-7, 13, 30), updatedAt: iso(-7, 13, 30), description: 'b3c4d5e - Adds retries around async cart totals calculation.' },
  { id: 'cmt-007', title: 'fix(notifications): dedupe mention emails', status: 'fix/dupe-mentions', statusVariant: 'warning', owner: 'Aisha Patel', tags: ['techos-notifications'], createdAt: iso(0, 10, 5), updatedAt: iso(0, 10, 5), description: 'd6e7f8a - Adds idempotency key to the email dispatch queue.' },
  { id: 'cmt-008', title: 'perf(web): memoize dashboard chart configs', status: 'main', statusVariant: 'default', owner: 'Ethan Brooks', tags: ['techos-web'], createdAt: iso(-1, 17, 45), updatedAt: iso(-1, 17, 45), description: 'c9d0e1f - Prevents unnecessary chart re-renders on resize.' },
  { id: 'cmt-009', title: 'chore(ci): pin Windows runner image version', status: 'fix/ci-windows-hang', statusVariant: 'warning', owner: 'Aisha Patel', tags: ['infra'], createdAt: iso(0, 9, 0), updatedAt: iso(0, 9, 0), description: 'e2f3a4b - Attempts to resolve the packaging step timeout.' },
  { id: 'cmt-010', title: 'feat(web): add command palette shortcuts', status: 'main', statusVariant: 'default', owner: 'Ethan Brooks', tags: ['techos-web'], createdAt: iso(-14, 12, 15), updatedAt: iso(-14, 12, 15), description: 'a5b6c7d - Registers global keybindings for common actions.' },
  { id: 'cmt-011', title: 'fix(mobile): correct navigation shell insets', status: 'main', statusVariant: 'default', owner: 'Jordan Lee', tags: ['techos-mobile'], createdAt: iso(-3, 15, 5), updatedAt: iso(-3, 15, 5), description: 'f8a9b0c - Fixes safe-area padding on notched devices.' },
  { id: 'cmt-012', title: 'refactor(web): extract sprint board drag hooks', status: 'refactor/sprint-dnd', statusVariant: 'info', owner: 'Sofia Martinez', tags: ['techos-web'], createdAt: iso(0, 11, 20), updatedAt: iso(0, 11, 20), description: 'b1c2d3e - Prepares the board for the new drag library.' },
  { id: 'cmt-013', title: 'docs(api): document webhook signature header', status: 'main', statusVariant: 'default', owner: 'Marcus Webb', tags: ['techos-api'], createdAt: iso(-5, 10, 40), updatedAt: iso(-5, 10, 40), description: 'd4e5f6a - Adds examples for verifying the X-TechOS-Signature header.' },
  { id: 'cmt-014', title: 'fix(design-system): correct focus ring contrast', status: 'main', statusVariant: 'default', owner: 'Liam Nguyen', tags: ['design-system'], createdAt: iso(-9, 9, 50), updatedAt: iso(-9, 9, 50), description: 'c0d1e2f - Raises focus ring contrast ratio to meet WCAG AA.' },
];

// ---------------------------------------------------------------------------
// notifications (entity variant used by generic entity views)
// ---------------------------------------------------------------------------

const notificationEntities: MockRecord[] = [
  { id: 'ntf-001', title: 'New comment on "Billing Engine V2"', status: 'Unread', statusVariant: 'info', owner: 'System', category: 'mention', createdAt: iso(0, 8, 20), updatedAt: iso(0, 8, 20), description: 'Marcus Webb mentioned you in a comment.' },
  { id: 'ntf-002', title: 'Invoice INV-2026-0143 sent', status: 'Read', statusVariant: 'default', owner: 'System', category: 'billing', createdAt: iso(-3), updatedAt: iso(-3), description: 'Invoice was successfully sent to Vertex Health.' },
  { id: 'ntf-003', title: 'Sprint 24 ends in 2 days', status: 'Unread', statusVariant: 'warning', owner: 'System', category: 'reminder', createdAt: iso(0, 7, 0), updatedAt: iso(0, 7, 0), description: 'Wrap up remaining tasks before sprint close.' },
  { id: 'ntf-004', title: 'Code review requested', status: 'Unread', statusVariant: 'info', owner: 'System', category: 'code-review', createdAt: iso(-1), updatedAt: iso(-1), description: 'Sofia Martinez requested your review on a pull request.' },
  { id: 'ntf-005', title: 'Deal "Solstice Bank - Renewal" won', status: 'Read', statusVariant: 'success', owner: 'System', category: 'crm', createdAt: iso(-5), updatedAt: iso(-5), description: 'Congratulations! The deal closed at $152,000.' },
  { id: 'ntf-006', title: 'Leave request pending approval', status: 'Unread', statusVariant: 'warning', owner: 'System', category: 'hr', createdAt: iso(-2), updatedAt: iso(-2), description: 'Ethan Brooks requested vacation leave for review.' },
  { id: 'ntf-007', title: 'Production deploy succeeded', status: 'Read', statusVariant: 'success', owner: 'System', category: 'deployment', createdAt: iso(-1), updatedAt: iso(-1), description: 'v2.3.2 deployed successfully to production.' },
  { id: 'ntf-008', title: 'Ticket escalated: Billing charged twice', status: 'Unread', statusVariant: 'error', owner: 'System', category: 'support', createdAt: iso(-1), updatedAt: iso(-1), description: 'A critical ticket from Solstice Bank needs attention.' },
];

// ---------------------------------------------------------------------------
// reports
// ---------------------------------------------------------------------------

const reports: MockRecord[] = [
  { id: 'rpt-001', title: 'Q3 Revenue Summary', status: 'Final', statusVariant: 'success', owner: 'Priya Sharma', category: 'Finance', createdAt: iso(-10), updatedAt: iso(-2), description: 'Quarterly revenue breakdown by segment and region.' },
  { id: 'rpt-002', title: 'Engineering Velocity Trends', status: 'Draft', statusVariant: 'default', owner: 'Marcus Webb', category: 'Engineering', createdAt: iso(-3), updatedAt: iso(-1), description: 'Sprint velocity and cycle time trends over the last 6 sprints.' },
  { id: 'rpt-003', title: 'Customer Health Scorecard', status: 'Scheduled', statusVariant: 'info', owner: 'Noah Rodriguez', category: 'Support', createdAt: iso(-1), updatedAt: iso(-1), description: 'Automated monthly report on at-risk account signals.' },
  { id: 'rpt-004', title: 'Marketing Campaign ROI', status: 'Final', statusVariant: 'success', owner: 'Daniel Kim', category: 'Marketing', createdAt: iso(-15), updatedAt: iso(-5), description: 'ROI comparison across all active Q3 campaigns.' },
  { id: 'rpt-005', title: 'Hiring Pipeline Report', status: 'Draft', statusVariant: 'default', owner: 'Alexandra Chen', category: 'HR', createdAt: iso(-4), updatedAt: iso(-1), description: 'Candidate funnel conversion rates by role and department.' },
  { id: 'rpt-006', title: 'Code Quality Trends', status: 'Final', statusVariant: 'success', owner: 'Marcus Webb', category: 'Engineering', createdAt: iso(-20), updatedAt: iso(-8), description: 'Test coverage, review turnaround, and defect escape rate.' },
  { id: 'rpt-007', title: 'Expense Approval Summary', status: 'Final', statusVariant: 'success', owner: 'Priya Sharma', category: 'Finance', createdAt: iso(-12), updatedAt: iso(-4), description: 'Monthly rollup of approved, pending, and rejected expenses.' },
  { id: 'rpt-008', title: 'Sales Pipeline Forecast', status: 'Scheduled', statusVariant: 'info', owner: 'Daniel Kim', category: 'Sales', createdAt: iso(-2), updatedAt: iso(-1), description: 'Weighted pipeline forecast for the current quarter.' },
  { id: 'rpt-009', title: 'Customer Satisfaction (CSAT) Report', status: 'Final', statusVariant: 'success', owner: 'Noah Rodriguez', category: 'Support', createdAt: iso(-18), updatedAt: iso(-7), description: 'CSAT scores segmented by ticket category and agent.' },
  { id: 'rpt-010', title: 'Product Usage & Adoption', status: 'Draft', statusVariant: 'default', owner: 'Ethan Brooks', category: 'Product', createdAt: iso(-5), updatedAt: iso(-1), description: 'Feature adoption rates across the last three releases.' },
];

// ---------------------------------------------------------------------------
// subscriptions
// ---------------------------------------------------------------------------

const subscriptions: MockRecord[] = [
  { id: 'sub-001', title: 'Nimbus Retail - Enterprise', status: 'Active', statusVariant: 'success', owner: 'Priya Sharma', amount: 6600, company: 'Nimbus Retail', category: 'Enterprise', createdAt: iso(-400), updatedAt: iso(-4), description: 'Monthly enterprise subscription, auto-renews annually.' },
  { id: 'sub-002', title: 'Vertex Health - Growth', status: 'Trialing', statusVariant: 'info', owner: 'Priya Sharma', amount: 1800, company: 'Vertex Health', category: 'Growth', createdAt: iso(-10), updatedAt: iso(-2), description: '14-day trial of the Growth plan, converts automatically.' },
  { id: 'sub-003', title: 'Solstice Bank - Enterprise', status: 'Active', statusVariant: 'success', owner: 'Daniel Kim', amount: 12600, company: 'Solstice Bank', category: 'Enterprise', createdAt: iso(-450), updatedAt: iso(-5), description: 'Two-year enterprise contract with quarterly billing.' },
  { id: 'sub-004', title: 'Cascade Logistics - Starter', status: 'Canceled', statusVariant: 'error', owner: 'Priya Sharma', amount: 900, company: 'Cascade Logistics', category: 'Starter', createdAt: iso(-200), updatedAt: iso(-20), description: 'Canceled after evaluating a competitor at renewal.' },
  { id: 'sub-005', title: 'Bramble Media - Enterprise', status: 'Active', statusVariant: 'success', owner: 'Daniel Kim', amount: 5100, company: 'Bramble Media', category: 'Enterprise', createdAt: iso(-500), updatedAt: iso(-15), description: 'Multi-year enterprise contract, billed annually.' },
  { id: 'sub-006', title: 'Northwind Foods - Growth', status: 'Past Due', statusVariant: 'error', owner: 'Priya Sharma', amount: 2200, company: 'Northwind Foods', category: 'Growth', createdAt: iso(-300), updatedAt: iso(-6), description: 'Payment method declined, retry scheduled in 3 days.' },
  { id: 'sub-007', title: 'Anchor Robotics - Starter', status: 'Active', statusVariant: 'success', owner: 'Daniel Kim', amount: 750, company: 'Anchor Robotics', category: 'Starter', createdAt: iso(-90), updatedAt: iso(-18), description: 'Standard monthly starter plan subscription.' },
  { id: 'sub-008', title: 'Fathom Analytics - Enterprise', status: 'Active', statusVariant: 'success', owner: 'Priya Sharma', amount: 6600, company: 'Fathom Analytics', category: 'Enterprise', createdAt: iso(-380), updatedAt: iso(-15), description: 'Includes the analytics add-on and priority support SLA.' },
  { id: 'sub-009', title: 'Lumen Energy - Growth', status: 'Active', statusVariant: 'success', owner: 'Daniel Kim', amount: 1900, company: 'Lumen Energy', category: 'Growth', createdAt: iso(-220), updatedAt: iso(-20), description: 'Standard growth plan, renews on the 1st of each month.' },
  { id: 'sub-010', title: 'Orbit Telecom - Starter', status: 'Trialing', statusVariant: 'info', owner: 'Priya Sharma', amount: 750, company: 'Orbit Telecom', category: 'Starter', createdAt: iso(-6), updatedAt: iso(-3), description: 'In the final week of a 30-day extended trial.' },
];

// ---------------------------------------------------------------------------
// quotations
// ---------------------------------------------------------------------------

const quotations: MockRecord[] = [
  { id: 'quo-001', title: 'QUO-2026-0091', status: 'Sent', statusVariant: 'info', owner: 'Daniel Kim', amount: 84000, company: 'Nimbus Retail', createdAt: iso(-6), updatedAt: iso(-1), description: 'Enterprise upgrade quote including SSO add-on.' },
  { id: 'quo-002', title: 'QUO-2026-0092', status: 'Accepted', statusVariant: 'success', owner: 'Priya Sharma', amount: 46000, company: 'Vertex Health', createdAt: iso(-20), updatedAt: iso(-14), description: 'Accepted quote for the three-department rollout.' },
  { id: 'quo-003', title: 'QUO-2026-0093', status: 'Draft', statusVariant: 'default', owner: 'Daniel Kim', amount: 152000, company: 'Solstice Bank', createdAt: iso(-2), updatedAt: iso(-1), description: 'Renewal quote pending final pricing approval.' },
  { id: 'quo-004', title: 'QUO-2026-0094', status: 'Expired', statusVariant: 'error', owner: 'Priya Sharma', amount: 12000, company: 'Cascade Logistics', createdAt: iso(-60), updatedAt: iso(-30), description: 'Quote expired without a signed order form.' },
  { id: 'quo-005', title: 'QUO-2026-0095', status: 'Rejected', statusVariant: 'error', owner: 'Daniel Kim', amount: 61000, company: 'Bramble Media', createdAt: iso(-25), updatedAt: iso(-18), description: 'Rejected pending revised expansion scope.' },
  { id: 'quo-006', title: 'QUO-2026-0096', status: 'Sent', statusVariant: 'info', owner: 'Priya Sharma', amount: 31000, company: 'Northwind Foods', createdAt: iso(-8), updatedAt: iso(-2), description: 'Awaiting sign-off on data residency addendum.' },
  { id: 'quo-007', title: 'QUO-2026-0097', status: 'Accepted', statusVariant: 'success', owner: 'Daniel Kim', amount: 22500, company: 'Anchor Robotics', createdAt: iso(-16), updatedAt: iso(-9), description: 'Signed and converted into an active subscription.' },
  { id: 'quo-008', title: 'QUO-2026-0098', status: 'Draft', statusVariant: 'default', owner: 'Priya Sharma', amount: 79200, company: 'Fathom Analytics', createdAt: iso(-1), updatedAt: iso(-1), description: 'Renewal quote with the analytics add-on included.' },
  { id: 'quo-009', title: 'QUO-2026-0099', status: 'Sent', statusVariant: 'info', owner: 'Daniel Kim', amount: 28800, company: 'Lumen Energy', createdAt: iso(-5), updatedAt: iso(-2), description: 'New business quote awaiting security review completion.' },
  { id: 'quo-010', title: 'QUO-2026-0100', status: 'Accepted', statusVariant: 'success', owner: 'Priya Sharma', amount: 47000, company: 'Harbor Insurance', createdAt: iso(-14), updatedAt: iso(-6), description: 'Signed master services agreement received.' },
];

// ---------------------------------------------------------------------------
// opportunities
// ---------------------------------------------------------------------------

const opportunities: MockRecord[] = [
  { id: 'opp-001', title: 'Nimbus Retail - Multi-region Expansion', status: 'Proposal', statusVariant: 'info', owner: 'Daniel Kim', amount: 96000, company: 'Nimbus Retail', progress: 45, createdAt: iso(-12), updatedAt: iso(-2), description: 'Exploring rollout to EU and APAC business units.' },
  { id: 'opp-002', title: 'Vertex Health - Analytics Add-on', status: 'Qualifying', statusVariant: 'default', owner: 'Priya Sharma', amount: 24000, company: 'Vertex Health', progress: 20, createdAt: iso(-4), updatedAt: iso(-1), description: 'Assessing fit for the advanced analytics module.' },
  { id: 'opp-003', title: 'Solstice Bank - Additional Seats', status: 'Negotiation', statusVariant: 'warning', owner: 'Daniel Kim', amount: 38000, company: 'Solstice Bank', progress: 65, createdAt: iso(-18), updatedAt: iso(-3), description: 'Expanding from 200 to 350 seats across two divisions.' },
  { id: 'opp-004', title: 'Bramble Media - API Tier Upgrade', status: 'Won', statusVariant: 'success', owner: 'Priya Sharma', amount: 18000, company: 'Bramble Media', progress: 100, createdAt: iso(-40), updatedAt: iso(-10), description: 'Upgraded to the high-throughput API tier.' },
  { id: 'opp-005', title: 'Northwind Foods - Second Region', status: 'Lost', statusVariant: 'error', owner: 'Daniel Kim', amount: 15000, company: 'Northwind Foods', progress: 100, createdAt: iso(-55), updatedAt: iso(-25), description: 'Lost to budget reallocation for FY26.' },
  { id: 'opp-006', title: 'Anchor Robotics - Premium Support', status: 'Proposal', statusVariant: 'info', owner: 'Priya Sharma', amount: 9000, company: 'Anchor Robotics', progress: 50, createdAt: iso(-10), updatedAt: iso(-2), description: 'Evaluating the premium 24/7 support tier.' },
  { id: 'opp-007', title: 'Fathom Analytics - Data Warehouse Sync', status: 'Negotiation', statusVariant: 'warning', owner: 'Daniel Kim', amount: 27000, company: 'Fathom Analytics', progress: 70, createdAt: iso(-22), updatedAt: iso(-4), description: 'Finalizing pricing for the bi-directional data sync add-on.' },
  { id: 'opp-008', title: 'Lumen Energy - Enterprise Upgrade', status: 'Qualifying', statusVariant: 'default', owner: 'Priya Sharma', amount: 32000, company: 'Lumen Energy', progress: 15, createdAt: iso(-3), updatedAt: iso(-1), description: 'Early conversations about moving up from Growth tier.' },
  { id: 'opp-009', title: 'Harbor Insurance - Compliance Package', status: 'Won', statusVariant: 'success', owner: 'Daniel Kim', amount: 21000, company: 'Harbor Insurance', progress: 100, createdAt: iso(-35), updatedAt: iso(-12), description: 'Added the compliance reporting package to their plan.' },
  { id: 'opp-010', title: 'Meridian Capital - Wealth Division Rollout', status: 'Proposal', statusVariant: 'info', owner: 'Priya Sharma', amount: 41000, company: 'Meridian Capital', progress: 38, createdAt: iso(-9), updatedAt: iso(-2), description: 'Extending the platform to the wealth management division.' },
];

// ---------------------------------------------------------------------------
// customers
// ---------------------------------------------------------------------------

const customers: MockRecord[] = [
  { id: 'cus-001', title: 'Nimbus Retail', status: 'Active', statusVariant: 'success', owner: 'Daniel Kim', amount: 79200, email: 'ap@nimbusretail.com', category: 'Enterprise', createdAt: iso(-400), updatedAt: iso(-1), description: 'Retail chain using TechOS across 40 store operations teams.' },
  { id: 'cus-002', title: 'Vertex Health', status: 'Trial', statusVariant: 'info', owner: 'Priya Sharma', amount: 21600, email: 'billing@vertexhealth.com', category: 'Growth', createdAt: iso(-10), updatedAt: iso(-2), description: 'Healthcare network trialing the Growth plan for clinical ops.' },
  { id: 'cus-003', title: 'Solstice Bank', status: 'Active', statusVariant: 'success', owner: 'Daniel Kim', amount: 151200, email: 'accounts@solsticebank.com', category: 'Enterprise', createdAt: iso(-450), updatedAt: iso(-5), description: 'Regional bank running digital banking operations on TechOS.' },
  { id: 'cus-004', title: 'Cascade Logistics', status: 'Churned', statusVariant: 'error', owner: 'Priya Sharma', amount: 0, email: 'finance@cascadelogistics.com', category: 'Starter', createdAt: iso(-200), updatedAt: iso(-20), description: 'Churned after evaluating a lower-cost competitor.' },
  { id: 'cus-005', title: 'Bramble Media', status: 'Active', statusVariant: 'success', owner: 'Daniel Kim', amount: 61200, email: 'ap@bramblemedia.com', category: 'Enterprise', createdAt: iso(-500), updatedAt: iso(-15), description: 'Media company using TechOS for cross-team project tracking.' },
  { id: 'cus-006', title: 'Northwind Foods', status: 'Active', statusVariant: 'success', owner: 'Priya Sharma', amount: 26400, email: 'ap@northwindfoods.com', category: 'Growth', createdAt: iso(-300), updatedAt: iso(-6), description: 'Food distributor tracking supplier contracts and invoicing.' },
  { id: 'cus-007', title: 'Anchor Robotics', status: 'Active', statusVariant: 'success', owner: 'Daniel Kim', amount: 9000, email: 'ap@anchorrobotics.com', category: 'Starter', createdAt: iso(-90), updatedAt: iso(-18), description: 'Robotics startup using TechOS for engineering sprint planning.' },
  { id: 'cus-008', title: 'Fathom Analytics', status: 'Active', statusVariant: 'success', owner: 'Priya Sharma', amount: 79200, email: 'billing@fathomanalytics.com', category: 'Enterprise', createdAt: iso(-380), updatedAt: iso(-15), description: 'Data analytics firm integrating deeply via the public API.' },
  { id: 'cus-009', title: 'Lumen Energy', status: 'Active', statusVariant: 'success', owner: 'Daniel Kim', amount: 22800, email: 'ap@lumenenergy.com', category: 'Growth', createdAt: iso(-220), updatedAt: iso(-20), description: 'Renewable energy company managing field project workflows.' },
  { id: 'cus-010', title: 'Orbit Telecom', status: 'Trial', statusVariant: 'info', owner: 'Priya Sharma', amount: 9000, email: 'ap@orbittelecom.com', category: 'Starter', createdAt: iso(-6), updatedAt: iso(-3), description: 'Telecom provider evaluating TechOS for support ticketing.' },
  { id: 'cus-011', title: 'Harbor Insurance', status: 'Active', statusVariant: 'success', owner: 'Daniel Kim', amount: 47000, email: 'accounts@harborinsurance.com', category: 'Enterprise', createdAt: iso(-100), updatedAt: iso(-6), description: 'Insurance carrier using TechOS for claims project coordination.' },
  { id: 'cus-012', title: 'Meridian Capital', status: 'Active', statusVariant: 'success', owner: 'Priya Sharma', amount: 39600, email: 'ap@meridiancapital.com', category: 'Enterprise', createdAt: iso(-280), updatedAt: iso(-10), description: 'Investment firm using TechOS across the wealth division.' },
];

// ---------------------------------------------------------------------------
// knowledgeBase
// ---------------------------------------------------------------------------

const knowledgeBase: MockRecord[] = [
  { id: 'kb-001', title: 'How to reset your password', status: 'Published', statusVariant: 'success', owner: 'Emma Wilson', category: 'Account', tags: ['auth'], createdAt: iso(-100), updatedAt: iso(-20), description: 'Step-by-step guide for resetting a forgotten password.' },
  { id: 'kb-002', title: 'Setting up SSO with Okta', status: 'Published', statusVariant: 'success', owner: 'Noah Rodriguez', category: 'Security', tags: ['sso'], createdAt: iso(-60), updatedAt: iso(-10), description: 'Configure SAML SSO for your organization using Okta.' },
  { id: 'kb-003', title: 'Exporting reports to CSV', status: 'Draft', statusVariant: 'default', owner: 'Emma Wilson', category: 'Reports', tags: ['export'], createdAt: iso(-2), updatedAt: iso(-1), description: 'Draft article covering the new CSV export options.' },
  { id: 'kb-004', title: 'Understanding usage-based billing', status: 'Published', statusVariant: 'success', owner: 'Noah Rodriguez', category: 'Billing', tags: ['billing'], createdAt: iso(-30), updatedAt: iso(-5), description: 'How overage charges are calculated and billed.' },
  { id: 'kb-005', title: 'Managing team permissions', status: 'Published', statusVariant: 'success', owner: 'Emma Wilson', category: 'Account', tags: ['permissions'], createdAt: iso(-80), updatedAt: iso(-25), description: 'Assign and manage role-based permissions for your team.' },
  { id: 'kb-006', title: 'Integrating with Slack', status: 'Published', statusVariant: 'success', owner: 'Noah Rodriguez', category: 'Integrations', tags: ['slack'], createdAt: iso(-50), updatedAt: iso(-12), description: 'Connect TechOS notifications to your Slack workspace.' },
  { id: 'kb-007', title: 'Troubleshooting API rate limits', status: 'Archived', statusVariant: 'default', owner: 'Emma Wilson', category: 'API', tags: ['api'], createdAt: iso(-150), updatedAt: iso(-90), description: 'Superseded by the updated rate limiting documentation.' },
  { id: 'kb-008', title: 'Bulk importing contacts', status: 'Published', statusVariant: 'success', owner: 'Noah Rodriguez', category: 'CRM', tags: ['import'], createdAt: iso(-40), updatedAt: iso(-8), description: 'Format and upload a CSV to bulk import contacts.' },
  { id: 'kb-009', title: 'Customizing your dashboard', status: 'Draft', statusVariant: 'default', owner: 'Emma Wilson', category: 'Dashboard', tags: ['customization'], createdAt: iso(-3), updatedAt: iso(-1), description: 'In-progress article on rearranging dashboard widgets.' },
  { id: 'kb-010', title: 'Enabling two-factor authentication', status: 'Published', statusVariant: 'success', owner: 'Noah Rodriguez', category: 'Security', tags: ['2fa'], createdAt: iso(-70), updatedAt: iso(-15), description: 'Secure your account with SMS or authenticator app 2FA.' },
  { id: 'kb-011', title: 'Configuring webhook endpoints', status: 'Published', statusVariant: 'success', owner: 'Emma Wilson', category: 'API', tags: ['webhooks'], createdAt: iso(-45), updatedAt: iso(-9), description: 'Register and verify webhook endpoints for real-time events.' },
  { id: 'kb-012', title: 'Canceling or downgrading your plan', status: 'Published', statusVariant: 'success', owner: 'Noah Rodriguez', category: 'Billing', tags: ['billing'], createdAt: iso(-65), updatedAt: iso(-18), description: 'How to cancel a subscription or move to a lower tier.' },
];

// ---------------------------------------------------------------------------
// prototypes
// ---------------------------------------------------------------------------

const prototypes: MockRecord[] = [
  { id: 'pro-001', title: 'Onboarding Wizard v3', status: 'Ready for Review', statusVariant: 'warning', owner: 'Liam Nguyen', progress: 85, tags: ['onboarding'], createdAt: iso(-14), updatedAt: iso(-1), description: 'Guided, role-aware onboarding flow with progress checklist.' },
  { id: 'pro-002', title: 'Mobile Navigation Shell', status: 'Approved', statusVariant: 'success', owner: 'Jordan Lee', progress: 100, tags: ['mobile'], createdAt: iso(-30), updatedAt: iso(-8), description: 'Approved tab-bar and drawer navigation concept for mobile v3.' },
  { id: 'pro-003', title: 'Custom Report Builder Concept', status: 'In Progress', statusVariant: 'info', owner: 'Grace Kim', progress: 40, tags: ['reports'], createdAt: iso(-6), updatedAt: iso(-1), description: 'Exploring a drag-and-drop canvas for building custom reports.' },
  { id: 'pro-004', title: 'AI Ticket Triage UI', status: 'In Progress', statusVariant: 'info', owner: 'Liam Nguyen', progress: 55, tags: ['support', 'ai'], createdAt: iso(-10), updatedAt: iso(-2), description: 'Surface AI suggestions inline in the ticket detail view.' },
  { id: 'pro-005', title: 'Dark Mode Design Tokens', status: 'Approved', statusVariant: 'success', owner: 'Liam Nguyen', progress: 100, tags: ['design-system'], createdAt: iso(-45), updatedAt: iso(-20), description: 'Approved dark palette shipped as part of Design System 2.0.' },
  { id: 'pro-006', title: 'Sprint Board Redesign', status: 'Concept', statusVariant: 'default', owner: 'Grace Kim', progress: 15, tags: ['tasks'], createdAt: iso(-3), updatedAt: iso(-1), description: 'Early exploration of a swimlane-based sprint board layout.' },
  { id: 'pro-007', title: 'Billing Usage Meter Widget', status: 'Ready for Review', statusVariant: 'warning', owner: 'Liam Nguyen', progress: 78, tags: ['billing'], createdAt: iso(-12), updatedAt: iso(-1), description: 'Visualizes real-time API usage against plan allowance.' },
  { id: 'pro-008', title: 'Empty States Illustration Set', status: 'Approved', statusVariant: 'success', owner: 'Grace Kim', progress: 100, tags: ['design-system'], createdAt: iso(-25), updatedAt: iso(-9), description: 'Full set of empty-state illustrations for core modules.' },
  { id: 'pro-009', title: 'Command Palette Interactions', status: 'Approved', statusVariant: 'success', owner: 'Liam Nguyen', progress: 100, tags: ['productivity'], createdAt: iso(-40), updatedAt: iso(-22), description: 'Motion and interaction spec for the Command-K palette.' },
  { id: 'pro-010', title: 'Multi-currency Invoice Layout', status: 'In Progress', statusVariant: 'info', owner: 'Grace Kim', progress: 35, tags: ['billing'], createdAt: iso(-8), updatedAt: iso(-2), description: 'Invoice PDF layout supporting multiple currencies and locales.' },
];

// ---------------------------------------------------------------------------
// research
// ---------------------------------------------------------------------------

const research: MockRecord[] = [
  { id: 'res-001', title: 'Onboarding Friction Study', status: 'Completed', statusVariant: 'success', owner: 'Grace Kim', tags: ['onboarding'], createdAt: iso(-40), updatedAt: iso(-25), description: '12 moderated sessions identifying drop-off points in setup.' },
  { id: 'res-002', title: 'Enterprise Admin Needs Assessment', status: 'In Progress', statusVariant: 'info', owner: 'Grace Kim', tags: ['enterprise'], createdAt: iso(-10), updatedAt: iso(-2), description: 'Interviewing IT admins at 8 enterprise accounts.' },
  { id: 'res-003', title: 'Mobile Offline Usage Diary Study', status: 'Planned', statusVariant: 'default', owner: 'Liam Nguyen', tags: ['mobile'], createdAt: iso(-2), updatedAt: iso(-2), description: 'Two-week diary study with field workers on connectivity gaps.' },
  { id: 'res-004', title: 'Support Console Usability Test', status: 'Completed', statusVariant: 'success', owner: 'Grace Kim', tags: ['support'], createdAt: iso(-55), updatedAt: iso(-35), description: 'Task-based usability test with 6 support agents.' },
  { id: 'res-005', title: 'Pricing Page Comprehension Study', status: 'Completed', statusVariant: 'success', owner: 'Liam Nguyen', tags: ['marketing'], createdAt: iso(-70), updatedAt: iso(-50), description: 'Tested whether prospects understand plan tier differences.' },
  { id: 'res-006', title: 'Design System Adoption Survey', status: 'In Progress', statusVariant: 'info', owner: 'Grace Kim', tags: ['design-system'], createdAt: iso(-8), updatedAt: iso(-1), description: 'Survey of internal teams on design system pain points.' },
  { id: 'res-007', title: 'Accessibility Audit - Core App', status: 'Completed', statusVariant: 'success', owner: 'Liam Nguyen', tags: ['accessibility'], createdAt: iso(-90), updatedAt: iso(-60), description: 'WCAG 2.2 AA audit across the top 20 most-used screens.' },
  { id: 'res-008', title: 'Report Builder Concept Testing', status: 'Planned', statusVariant: 'default', owner: 'Grace Kim', tags: ['reports'], createdAt: iso(-1), updatedAt: iso(-1), description: 'Upcoming concept test for the custom report builder.' },
];

// ---------------------------------------------------------------------------
// deployments
// ---------------------------------------------------------------------------

const deployments: MockRecord[] = [
  { id: 'dep-001', title: 'techos-web v2.3.2', status: 'Success', statusVariant: 'success', owner: 'Aisha Patel', category: 'production', tags: ['production'], createdAt: iso(-6, 14, 0), updatedAt: iso(-6, 14, 12), description: 'Hotfix release deployed with zero downtime.' },
  { id: 'dep-002', title: 'techos-api v2.4.0-rc1', status: 'In Progress', statusVariant: 'info', owner: 'Aisha Patel', category: 'staging', tags: ['staging'], createdAt: iso(0, 9, 0), updatedAt: iso(0, 9, 5), description: 'Release candidate rolling out to the staging environment.' },
  { id: 'dep-003', title: 'techos-mobile v3.0.4', status: 'Success', statusVariant: 'success', owner: 'Jordan Lee', category: 'production', tags: ['production'], createdAt: iso(-14, 10, 0), updatedAt: iso(-14, 10, 20), description: 'Minor bug fix release for the mobile app.' },
  { id: 'dep-004', title: 'techos-billing v1.9.2', status: 'Failed', statusVariant: 'error', owner: 'Marcus Webb', category: 'production', tags: ['production'], createdAt: iso(-2, 16, 0), updatedAt: iso(-2, 16, 8), description: 'Failed health check post-deploy, automatically rolled back.' },
  { id: 'dep-005', title: 'techos-billing v1.9.1', status: 'Rolled Back', statusVariant: 'warning', owner: 'Marcus Webb', category: 'production', tags: ['production'], createdAt: iso(-2, 16, 10), updatedAt: iso(-2, 16, 15), description: 'Automatic rollback triggered after failed health checks.' },
  { id: 'dep-006', title: 'techos-notifications v1.4.0', status: 'Success', statusVariant: 'success', owner: 'Aisha Patel', category: 'production', tags: ['production'], createdAt: iso(-9, 11, 0), updatedAt: iso(-9, 11, 10), description: 'Adds deduplication for mention notification emails.' },
  { id: 'dep-007', title: 'techos-web v2.4.0-beta', status: 'In Progress', statusVariant: 'info', owner: 'Aisha Patel', category: 'staging', tags: ['staging'], createdAt: iso(-1, 13, 0), updatedAt: iso(-1, 13, 30), description: 'Beta deploy for internal dogfooding ahead of GA.' },
  { id: 'dep-008', title: 'techos-api v2.3.1', status: 'Success', statusVariant: 'success', owner: 'Marcus Webb', category: 'production', tags: ['production'], createdAt: iso(-20, 9, 0), updatedAt: iso(-20, 9, 15), description: 'Adds webhook signature verification enforcement.' },
  { id: 'dep-009', title: 'techos-analytics v0.8.0', status: 'Success', statusVariant: 'success', owner: 'Ethan Brooks', category: 'production', tags: ['production'], createdAt: iso(-11, 15, 0), updatedAt: iso(-11, 15, 25), description: 'Initial rollout of the real-time analytics pipeline service.' },
  { id: 'dep-010', title: 'techos-mobile v3.1.0-rc1', status: 'In Progress', statusVariant: 'info', owner: 'Jordan Lee', category: 'staging', tags: ['staging'], createdAt: iso(0, 8, 0), updatedAt: iso(0, 8, 10), description: 'Release candidate for offline sync queue testing.' },
  { id: 'dep-011', title: 'techos-web v2.3.0', status: 'Success', statusVariant: 'success', owner: 'Aisha Patel', category: 'production', tags: ['production'], createdAt: iso(-20, 10, 0), updatedAt: iso(-20, 10, 30), description: 'Design System 2.0 tokens rolled out to production.' },
  { id: 'dep-012', title: 'techos-ci-runners image-2025.11', status: 'Failed', statusVariant: 'error', owner: 'Aisha Patel', category: 'infra', tags: ['ci'], createdAt: iso(0, 7, 0), updatedAt: iso(0, 7, 45), description: 'Windows runner image update failed validation checks.' },
];

// ---------------------------------------------------------------------------
// architecture
// ---------------------------------------------------------------------------

const architecture: MockRecord[] = [
  { id: 'arc-001', title: 'ADR-014: Adopt event-driven billing pipeline', status: 'Accepted', statusVariant: 'success', owner: 'Marcus Webb', tags: ['billing'], createdAt: iso(-40), updatedAt: iso(-20), description: 'Move billing events onto a durable message queue for reliability.' },
  { id: 'arc-002', title: 'ADR-015: Consolidate API gateways', status: 'Proposed', statusVariant: 'info', owner: 'Marcus Webb', tags: ['api'], createdAt: iso(-15), updatedAt: iso(-2), description: 'Proposal to replace five internal gateways with one managed gateway.' },
  { id: 'arc-003', title: 'ADR-013: Multi-region data residency', status: 'Accepted', statusVariant: 'success', owner: 'Aisha Patel', tags: ['data'], createdAt: iso(-60), updatedAt: iso(-30), description: 'Store EU customer data in region to satisfy compliance requirements.' },
  { id: 'arc-004', title: 'ADR-009: Move settings to server components', status: 'Superseded', statusVariant: 'default', owner: 'Aisha Patel', tags: ['frontend'], createdAt: iso(-120), updatedAt: iso(-8), description: 'Superseded by the broader RSC migration plan (ADR-016).' },
  { id: 'arc-005', title: 'ADR-016: Full RSC migration roadmap', status: 'Proposed', statusVariant: 'info', owner: 'Marcus Webb', tags: ['frontend'], createdAt: iso(-8), updatedAt: iso(-1), description: 'Phased roadmap to migrate remaining pages to server components.' },
  { id: 'arc-006', title: 'ADR-012: Webhook delivery retry strategy', status: 'Accepted', statusVariant: 'success', owner: 'Ethan Brooks', tags: ['api'], createdAt: iso(-70), updatedAt: iso(-40), description: 'Exponential backoff with dead-letter queue for failed deliveries.' },
  { id: 'arc-007', title: 'ADR-006: Microservice boundary for payments', status: 'Deprecated', statusVariant: 'default', owner: 'Marcus Webb', tags: ['payments'], createdAt: iso(-200), updatedAt: iso(-90), description: 'Deprecated after the payments service was re-scoped in ADR-017.' },
  { id: 'arc-008', title: 'ADR-017: Payments service re-scope', status: 'Accepted', statusVariant: 'success', owner: 'Marcus Webb', tags: ['payments'], createdAt: iso(-90), updatedAt: iso(-60), description: 'Narrower payments service boundary with clearer ownership.' },
  { id: 'arc-009', title: 'ADR-018: Real-time analytics streaming layer', status: 'Proposed', statusVariant: 'info', owner: 'Ethan Brooks', tags: ['data'], createdAt: iso(-5), updatedAt: iso(-1), description: 'Kafka-based streaming layer for real-time usage analytics.' },
  { id: 'arc-010', title: 'ADR-011: SSO identity provider abstraction', status: 'Accepted', statusVariant: 'success', owner: 'Aisha Patel', tags: ['security'], createdAt: iso(-50), updatedAt: iso(-25), description: 'Abstract SAML/OIDC providers behind a common identity interface.' },
];

// ---------------------------------------------------------------------------
// announcements
// ---------------------------------------------------------------------------

const announcements: MockRecord[] = [
  { id: 'ann-001', title: 'TechOS v2.3.2 hotfix released', status: 'Published', statusVariant: 'success', owner: 'Marcus Webb', category: 'Product', createdAt: iso(-6), updatedAt: iso(-6), description: 'Resolves the checkout integration test flakiness reported last week.' },
  { id: 'ann-002', title: 'Welcome our new VP of Finance', status: 'Published', statusVariant: 'success', owner: 'Alexandra Chen', category: 'Company', createdAt: iso(-400), updatedAt: iso(-400), description: 'Please join us in welcoming Priya Sharma to the leadership team.' },
  { id: 'ann-003', title: 'Q3 all-hands scheduled for next Friday', status: 'Scheduled', statusVariant: 'info', owner: 'Alexandra Chen', category: 'Company', createdAt: iso(-3), updatedAt: iso(-1), dueDate: iso(4), description: 'Company-wide update on Q3 results and Q4 priorities.' },
  { id: 'ann-004', title: 'New design system components available', status: 'Published', statusVariant: 'success', owner: 'Liam Nguyen', category: 'Product', createdAt: iso(-10), updatedAt: iso(-10), description: 'Design System 2.0 tokens and 12 new components are live.' },
  { id: 'ann-005', title: 'Planned maintenance window this weekend', status: 'Scheduled', statusVariant: 'warning', owner: 'Aisha Patel', category: 'Engineering', createdAt: iso(-2), updatedAt: iso(-1), dueDate: iso(2), description: 'Brief maintenance window for database upgrades, minimal downtime expected.' },
  { id: 'ann-006', title: 'Updated PTO policy effective next quarter', status: 'Draft', statusVariant: 'default', owner: 'Alexandra Chen', category: 'HR', createdAt: iso(-1), updatedAt: iso(-1), description: 'Draft communication pending final legal review.' },
  { id: 'ann-007', title: 'Customer Advisory Board rescheduled', status: 'Published', statusVariant: 'success', owner: 'Priya Sharma', category: 'Sales', createdAt: iso(-4), updatedAt: iso(-4), description: 'New date to be confirmed with attendees by end of week.' },
  { id: 'ann-008', title: 'Security training due by end of month', status: 'Published', statusVariant: 'warning', owner: 'Aisha Patel', category: 'Engineering', createdAt: iso(-15), updatedAt: iso(-15), dueDate: iso(15), description: 'Annual security awareness training assignment for all employees.' },
];

// ---------------------------------------------------------------------------
// processes
// ---------------------------------------------------------------------------

const processes: MockRecord[] = [
  { id: 'prc-001', title: 'Incident Response Process', status: 'Active', statusVariant: 'success', owner: 'Aisha Patel', category: 'Engineering', progress: 100, createdAt: iso(-200), updatedAt: iso(-15), description: 'Defined escalation levels and communication cadence for incidents.' },
  { id: 'prc-002', title: 'Customer Onboarding Process', status: 'Under Review', statusVariant: 'warning', owner: 'Noah Rodriguez', category: 'Support', progress: 70, createdAt: iso(-30), updatedAt: iso(-4), description: 'Revising handoff steps between sales and customer success.' },
  { id: 'prc-003', title: 'Monthly Financial Close', status: 'Active', statusVariant: 'success', owner: 'Priya Sharma', category: 'Finance', progress: 100, createdAt: iso(-300), updatedAt: iso(-12), description: 'Standardized 5-day close process across all entities.' },
  { id: 'prc-004', title: 'Code Review Standards', status: 'Active', statusVariant: 'success', owner: 'Marcus Webb', category: 'Engineering', progress: 100, createdAt: iso(-250), updatedAt: iso(-20), description: 'Required reviewers, SLA, and merge criteria for pull requests.' },
  { id: 'prc-005', title: 'Hiring & Interview Loop', status: 'Under Review', statusVariant: 'warning', owner: 'Alexandra Chen', category: 'HR', progress: 55, createdAt: iso(-40), updatedAt: iso(-6), description: 'Standardizing interview scorecards across engineering roles.' },
  { id: 'prc-006', title: 'Release Management Process', status: 'Active', statusVariant: 'success', owner: 'Marcus Webb', category: 'Engineering', progress: 100, createdAt: iso(-180), updatedAt: iso(-14), description: 'Bi-weekly release train with staged rollout and canary checks.' },
  { id: 'prc-007', title: 'Expense Approval Workflow', status: 'Active', statusVariant: 'success', owner: 'Priya Sharma', category: 'Finance', progress: 100, createdAt: iso(-220), updatedAt: iso(-9), description: 'Two-tier approval based on expense amount thresholds.' },
  { id: 'prc-008', title: 'Vendor Security Review', status: 'Deprecated', statusVariant: 'default', owner: 'Aisha Patel', category: 'Engineering', progress: 100, createdAt: iso(-300), updatedAt: iso(-100), description: 'Replaced by the automated vendor risk scoring workflow.' },
  { id: 'prc-009', title: 'Support Ticket Escalation Path', status: 'Active', statusVariant: 'success', owner: 'Noah Rodriguez', category: 'Support', progress: 100, createdAt: iso(-150), updatedAt: iso(-10), description: 'Defines tiered escalation from L1 support to engineering on-call.' },
  { id: 'prc-010', title: 'Design Handoff Checklist', status: 'Under Review', statusVariant: 'warning', owner: 'Liam Nguyen', category: 'Design', progress: 60, createdAt: iso(-20), updatedAt: iso(-3), description: 'Updating handoff checklist to include accessibility annotations.' },
];

// ---------------------------------------------------------------------------
// Public map + helpers
// ---------------------------------------------------------------------------

export const mockEntities: Record<string, MockRecord[]> = {
  projects,
  tasks,
  bugs,
  sprints,
  invoices,
  expenses,
  payments,
  budgets,
  leads,
  deals,
  contacts,
  tickets,
  campaigns,
  features,
  releases,
  documents,
  meetings,
  goals,
  employees,
  candidates,
  leaveRequests,
  codeReviews,
  commits,
  notifications: notificationEntities,
  reports,
  subscriptions,
  quotations,
  opportunities,
  customers,
  knowledgeBase,
  prototypes,
  research,
  deployments,
  architecture,
  announcements,
  processes,
};

export const entityKeys = Object.keys(mockEntities);

export function getEntityList(key: string): MockRecord[] {
  return mockEntities[key] ?? [];
}

export function getEntityById(key: string, id: string): MockRecord | undefined {
  return getEntityList(key).find((record) => record.id === id);
}

export { OWNERS, COMPANIES };
