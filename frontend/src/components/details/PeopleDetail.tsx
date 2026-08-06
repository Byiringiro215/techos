'use client';

import { Briefcase, Mail, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Avatar } from '@/components/UI/Avatar';
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
import { ActivityFeed, MetaGrid, RelatedList } from './shared';

/** HRIS-style employee / candidate profile. */
export function PeopleDetail(props: DetailViewProps) {
  const { entityKey, detailId, title, breadcrumbs, basePath } = props;
  const { data, extras, isLoading } = useDetailRecord(entityKey, detailId);
  const isCandidate = entityKey === 'candidates';

  if (isLoading) return <DetailLoading />;
  if (!data || !extras) return <DetailNotFound entityKey={entityKey} detailId={detailId} />;

  const name = data.title || data.name || title;

  return (
    <div className="space-y-6">
      <DetailHeader
        title={name}
        subtitle={isCandidate ? `Candidate · ${data.id}` : `Employee · ${data.id}`}
        breadcrumbs={breadcrumbs}
        basePath={basePath}
        badges={<Badge variant={data.statusVariant}>{data.status}</Badge>}
        actions={
          <Button size="sm" variant="secondary" onClick={() => toast.success('Profile edited (mock)')}>
            Edit profile
          </Button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="space-y-4 text-center xl:text-left">
          <div className="flex flex-col items-center xl:items-start gap-3">
            <Avatar name={name} size="lg" />
            <div>
              <p className="text-lg font-semibold text-ink">{name}</p>
              <p className="text-sm text-ink-muted capitalize">
                {(data.role || data.category || data.position || '—').toString().replace(/_/g, ' ')}
              </p>
            </div>
            <Badge variant={data.statusVariant}>{data.status}</Badge>
          </div>
          <div className="space-y-2 text-sm border-t border-border pt-4 text-left">
            <p className="flex items-center gap-2 text-ink-secondary">
              <Mail className="h-4 w-4" />
              {data.email || data.ownerEmail || `${name.toLowerCase().replace(/\s+/g, '.')}@techos.io`}
            </p>
            <p className="flex items-center gap-2 text-ink-secondary">
              <Briefcase className="h-4 w-4" />
              {data.owner || 'Manager TBD'}
            </p>
            <p className="flex items-center gap-2 text-ink-secondary">
              <Hash className="h-4 w-4" />
              {data.id}
            </p>
          </div>
        </Card>

        <div className="xl:col-span-2 space-y-4">
          <Card className="space-y-4">
            <p className="text-sm text-ink-secondary leading-relaxed">{data.description}</p>
            <MetaGrid
              items={[
                { label: isCandidate ? 'Role applied' : 'Role', value: (data.role || data.category || data.tags?.[0] || '—').toString().replace(/_/g, ' ') },
                { label: 'Position', value: data.position || data.title || '—' },
                { label: 'Location', value: data.location || 'Remote' },
                {
                  label: isCandidate ? 'Applied' : 'Hire date',
                  value: formatDate(data.createdAt),
                },
                {
                  label: isCandidate ? 'Comp expectation' : 'Compensation',
                  value: typeof data.amount === 'number' ? `${formatCurrency(data.amount)}/yr` : '—',
                },
                { label: 'Updated', value: formatDate(data.updatedAt) },
              ]}
            />
          </Card>

          <Tabs defaultValue="activity">
            <TabList>
              <Tab value="activity">Activity</Tab>
              <Tab value="docs">Documents</Tab>
              <Tab value="related">Related</Tab>
            </TabList>
            <TabPanel value="activity" className="pt-4">
              <ActivityFeed items={extras.activities} />
            </TabPanel>
            <TabPanel value="docs" className="pt-4">
              <Card className="space-y-2 text-sm">
                {extras.attachments.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="w-full flex justify-between rounded-lg border border-border px-3 py-2 hover:bg-surface-hover"
                    onClick={() => toast.success(`Opening ${f.name} (mock)`)}
                  >
                    <span className="text-ink">{f.name}</span>
                    <span className="text-ink-muted">{f.size}</span>
                  </button>
                ))}
              </Card>
            </TabPanel>
            <TabPanel value="related" className="pt-4">
              <Card>
                <RelatedList items={extras.related} />
              </Card>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
