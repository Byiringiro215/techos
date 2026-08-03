'use client';

import { Building2, Handshake, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Progress } from '@/components/UI/Progress';
import { Tabs, TabList, Tab, TabPanel } from '@/components/UI/Tabs';
import {
  DetailHeader,
  DetailLoading,
  DetailNotFound,
  useDetailRecord,
  type DetailViewProps,
} from './DetailShell';
import { ActivityFeed, CommentThread, MetaGrid, PeopleList, RelatedList } from './shared';

const DEAL_STAGES = ['Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];

/** HubSpot/Salesforce-style CRM records (deals, leads, contacts, opportunities). */
export function CrmDetail(props: DetailViewProps) {
  const { entityKey, detailId, title, breadcrumbs, basePath } = props;
  const { data, extras, isLoading } = useDetailRecord(entityKey, detailId);

  if (isLoading) return <DetailLoading />;
  if (!data || !extras) return <DetailNotFound entityKey={entityKey} detailId={detailId} />;

  const isDeal = entityKey === 'deals' || entityKey === 'opportunities';
  const isContact = entityKey === 'contacts' || entityKey === 'customers';
  const Icon = isDeal ? Handshake : isContact ? UserCircle : Building2;
  const kindLabel =
    entityKey === 'leads'
      ? 'Lead'
      : entityKey === 'deals'
        ? 'Deal'
        : entityKey === 'opportunities'
          ? 'Opportunity'
          : entityKey === 'customers'
            ? 'Customer'
            : 'Contact';

  return (
    <div className="space-y-6">
      <DetailHeader
        title={data.title || data.name || title}
        subtitle={`${kindLabel}${data.company ? ` · ${data.company}` : ''}`}
        breadcrumbs={breadcrumbs}
        basePath={basePath}
        badges={<Badge variant={data.statusVariant}>{data.status}</Badge>}
        actions={
          <Button size="sm" onClick={() => toast.success('Meeting scheduled (mock)')}>
            Log activity
          </Button>
        }
      />

      {isDeal && (
        <Card className="!p-3">
          <div className="flex flex-wrap gap-1.5 items-center">
            <Icon className="h-4 w-4 text-brand mr-1" />
            {DEAL_STAGES.map((stage) => (
              <span
                key={stage}
                className={
                  stage.toLowerCase() === data.status.toLowerCase()
                    ? 'px-2.5 py-1 rounded-lg text-xs font-medium bg-brand text-white'
                    : 'px-2.5 py-1 rounded-lg text-xs font-medium border border-border text-ink-muted'
                }
              >
                {stage}
              </span>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <Card className="space-y-4">
            <p className="text-sm text-ink-secondary leading-relaxed">{data.description}</p>
            {typeof data.amount === 'number' && (
              <div>
                <p className="text-xs text-ink-muted uppercase tracking-wider">Deal value</p>
                <p className="text-3xl font-semibold tabular-nums text-ink mt-1">
                  {formatCurrency(data.amount)}
                </p>
              </div>
            )}
            {typeof data.progress === 'number' && (
              <div>
                <p className="text-sm text-ink-muted mb-2">Win probability</p>
                <Progress value={data.progress} label={`${data.progress}%`} />
              </div>
            )}
            <MetaGrid
              items={[
                { label: 'Owner', value: data.owner },
                { label: 'Company', value: data.company || '—' },
                { label: 'Email', value: data.email || '—' },
                { label: 'Close / next step', value: data.dueDate ? formatDate(data.dueDate) : '—' },
                { label: 'Created', value: formatDate(data.createdAt) },
                { label: 'Updated', value: formatDate(data.updatedAt) },
              ]}
            />
          </Card>

          <Tabs defaultValue="timeline">
            <TabList>
              <Tab value="timeline">Timeline</Tab>
              <Tab value="notes">Notes</Tab>
              <Tab value="related">Related</Tab>
            </TabList>
            <TabPanel value="timeline" className="pt-4">
              <ActivityFeed items={extras.activities} />
            </TabPanel>
            <TabPanel value="notes" className="pt-4">
              <CommentThread seed={extras.comments} />
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
            <PeopleList title="Account team" names={extras.assignees} />
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => toast.success('Email composer opened (mock)')}
            >
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => toast.success('Call logged (mock)')}
            >
              Log call
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
