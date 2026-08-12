'use client';

import Link from 'next/link';
import { ShieldCheck, CheckSquare, FileText } from 'lucide-react';
import { Card } from '@/components/UI/Card';
import { PageHeader } from '@/components/UI/PageHeader';
import { useCisoAuditProjects, useCisoReports, useCisoTasks } from '@/hooks/useCiso';

export default function CisoDashboardPage() {
  const { data: finishedTasks = [] } = useCisoTasks('finished');
  const { data: pendingTasks = [] } = useCisoTasks('not_finished');
  const { data: audits = [] } = useCisoAuditProjects();
  const { data: reports = [] } = useCisoReports();

  const inProgressAudits = audits.filter((project) => project.audit_status === 'in_progress').length;
  const neededAudits = audits.filter((project) => project.audit_status === 'needed').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="CISO Portal"
        description="Security operations overview: task completion, audit queue, and reports."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Finished Tasks" value={String(finishedTasks.length)} icon={CheckSquare} />
        <StatCard title="Open Tasks" value={String(pendingTasks.length)} icon={CheckSquare} />
        <StatCard title="Audits Needed" value={String(neededAudits)} icon={ShieldCheck} />
        <StatCard title="Audits In Progress" value={String(inProgressAudits)} icon={ShieldCheck} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <QuickCard
          href="/ciso/tasks"
          title="Task Management"
          description="Track finished and not finished security tasks."
          icon={CheckSquare}
        />
        <QuickCard
          href="/ciso/projects"
          title="Project Audits"
          description="See projects that need an audit or are in progress."
          icon={ShieldCheck}
        />
        <QuickCard
          href="/ciso/reports"
          title="Reports"
          description={`Manage security reports (${reports.length} available).`}
          icon={FileText}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: any }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{title}</p>
        <Icon className="h-4 w-4 text-ink-muted" />
      </div>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </Card>
  );
}

function QuickCard({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <Link href={href}>
      <Card hover>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-ink-secondary" />
          <h3 className="text-base font-semibold text-ink">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-ink-muted">{description}</p>
      </Card>
    </Link>
  );
}
