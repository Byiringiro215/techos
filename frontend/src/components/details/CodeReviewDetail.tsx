'use client';

import { GitPullRequest, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';
import { useUpdateEntity } from '@/hooks/useEntityApi';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Tabs, TabList, Tab, TabPanel } from '@/components/UI/Tabs';
import {
  DetailHeader,
  DetailLoading,
  DetailNotFound,
  useDetailRecord,
  type DetailViewProps,
} from './DetailShell';
import { ActivityFeed, CommentThread, MetaGrid, PeopleList, RelatedList } from './shared';

/** GitHub/GitLab PR review layout. */
export function CodeReviewDetail(props: DetailViewProps) {
  const { entityKey, detailId, title, breadcrumbs, basePath } = props;
  const { data, extras, isLoading } = useDetailRecord(entityKey, detailId);
  const updateReview = useUpdateEntity('codeReviews');

  if (isLoading) return <DetailLoading />;
  if (!data || !extras) return <DetailNotFound entityKey={entityKey} detailId={detailId} />;

  const files = [
    { path: 'src/billing/invoice.ts', additions: 48, deletions: 12 },
    { path: 'src/billing/pdf.ts', additions: 96, deletions: 31 },
    { path: 'tests/invoice.spec.ts', additions: 40, deletions: 0 },
  ];

  return (
    <div className="space-y-6">
      <DetailHeader
        title={data.title || title}
        subtitle={`Pull request · ${data.id}`}
        breadcrumbs={breadcrumbs}
        basePath={basePath}
        badges={<Badge variant={data.statusVariant}>{data.status}</Badge>}
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              loading={updateReview.isPending}
              onClick={() => updateReview.mutate({ id: data.id, data: { ...data, status: 'changes_requested' } })}
            >
              <X className="h-4 w-4 mr-2" />
              Request changes
            </Button>
            <Button
              size="sm"
              loading={updateReview.isPending}
              onClick={() => updateReview.mutate({ id: data.id, data: { ...data, status: 'approved' } })}
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </>
        }
      />

      <Card className="!p-3 flex flex-wrap items-center gap-3 text-sm">
        <GitPullRequest className="h-4 w-4 text-brand" />
        <span className="text-ink font-medium">feature/{data.id}</span>
        <span className="text-ink-muted">→</span>
        <span className="text-ink">main</span>
        {data.tags?.map((t) => (
          <Badge key={t} size="sm">
            {t}
          </Badge>
        ))}
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <Card className="space-y-3">
            <h3 className="text-sm font-medium text-ink">Summary</h3>
            <p className="text-sm text-ink-secondary leading-relaxed">{data.description}</p>
          </Card>

          <Card className="space-y-2">
            <h3 className="text-sm font-medium text-ink mb-2">Files changed</h3>
            {files.map((f) => (
              <button
                key={f.path}
                type="button"
                onClick={() => toast.error('Diff viewing is not available yet.')}
                className="w-full flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-hover"
              >
                <span className="font-mono text-ink truncate">{f.path}</span>
                <span className="tabular-nums">
                  <span className="text-success">+{f.additions}</span>{' '}
                  <span className="text-danger">-{f.deletions}</span>
                </span>
              </button>
            ))}
          </Card>

          <Tabs defaultValue="discussion">
            <TabList>
              <Tab value="discussion">Discussion</Tab>
              <Tab value="checks">Checks</Tab>
              <Tab value="activity">Activity</Tab>
              <Tab value="related">Related</Tab>
            </TabList>
            <TabPanel value="discussion" className="pt-4">
              <CommentThread seed={extras.comments} />
            </TabPanel>
            <TabPanel value="checks" className="pt-4">
              <Card className="space-y-2 text-sm">
                {['CI / Unit tests', 'Typecheck', 'Lint', 'Security scan'].map((check, i) => (
                  <div key={check} className="flex justify-between border-b border-border/60 py-2 last:border-0">
                    <span className="text-ink">{check}</span>
                    <Badge variant={i === 3 ? 'warning' : 'success'} size="sm">
                      {i === 3 ? 'Pending' : 'Passed'}
                    </Badge>
                  </div>
                ))}
              </Card>
            </TabPanel>
            <TabPanel value="activity" className="pt-4">
              <ActivityFeed items={extras.activities} />
            </TabPanel>
            <TabPanel value="related" className="pt-4">
              <Card>
                <RelatedList items={extras.related} />
              </Card>
            </TabPanel>
          </Tabs>
        </div>

        <aside className="space-y-4">
          <Card className="space-y-4">
            <PeopleList title="Author" names={[data.owner]} />
            <PeopleList title="Reviewers" names={extras.assignees.filter((n) => n !== data.owner)} />
            <MetaGrid
              items={[
                { label: 'Opened', value: formatDate(data.createdAt) },
                { label: 'Updated', value: formatDate(data.updatedAt) },
                { label: 'Commits', value: '4' },
                { label: 'Reviewers needed', value: '1' },
              ]}
            />
          </Card>
        </aside>
      </div>
    </div>
  );
}
