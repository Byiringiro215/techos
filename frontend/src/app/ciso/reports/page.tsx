'use client';

import { useMemo, useState } from 'react';
import { DataTable, type Column } from '@/components/UI/DataTable';
import { PageHeader } from '@/components/UI/PageHeader';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Card } from '@/components/UI/Card';
import { useCisoReports, useCreateCisoReport, type CisoReport } from '@/hooks/useCiso';

export default function CisoReportsPage() {
  const { data: reports = [], isLoading } = useCisoReports();
  const createReport = useCreateCisoReport();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');

  const columns: Column<CisoReport>[] = useMemo(
    () => [
      { key: 'title', header: 'Report Title', sortable: true },
      {
        key: 'type',
        header: 'Type',
        sortable: true,
        render: (row) => <Badge variant="info">{row.type}</Badge>,
      },
      {
        key: 'created_at',
        header: 'Created',
        sortable: true,
        render: (row) => new Date(row.created_at).toLocaleString(),
      },
      {
        key: 'summary',
        header: 'Summary',
        render: (row) => row.data?.summary || '—',
      },
    ],
    [],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Security Reports"
        description="View and create CISO security and audit reports."
      />

      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-ink">Create Security Report</h3>
        <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
          <Input
            placeholder="Report title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Summary (optional)"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <Button
            disabled={!title.trim() || createReport.isPending}
            loading={createReport.isPending}
            onClick={async () => {
              await createReport.mutateAsync({ title: title.trim(), summary: summary.trim() || undefined });
              setTitle('');
              setSummary('');
            }}
          >
            Create
          </Button>
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={reports}
        isLoading={isLoading}
        searchKeys={['title', 'type']}
        pageSize={10}
        getRowId={(row) => row.id}
        emptyTitle="No security reports yet"
        emptyDescription="Create the first report to establish your security reporting cadence."
      />
    </div>
  );
}
