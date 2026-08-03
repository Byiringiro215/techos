'use client';

import { ReactNode, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getEntityById, mockEntities, type MockRecord } from '@/mocks';
import { entitySingular, getDetailExtras } from '@/mocks/detailExtras';
import { useMockQuery } from '@/hooks/useMockQuery';
import { Button } from '@/components/UI/Button';
import { EmptyState } from '@/components/UI/EmptyState';
import { PageHeader } from '@/components/UI/PageHeader';
import { Skeleton, SkeletonCard } from '@/components/UI/Skeleton';

export interface DetailViewProps {
  title: string;
  entityKey: string;
  detailId: string;
  breadcrumbs: { label: string; href?: string }[];
  basePath: string;
}

export interface LoadedDetail {
  record: MockRecord;
  extras: ReturnType<typeof getDetailExtras>;
}

export function useDetailRecord(entityKey: string, detailId: string) {
  const query = useMockQuery(() => {
    return (
      getEntityById(entityKey, detailId) ||
      (mockEntities[entityKey] || [])[0] ||
      null
    );
  }, [entityKey, detailId]);

  const extras = useMemo(
    () => (query.data ? getDetailExtras(entityKey, query.data) : null),
    [entityKey, query.data],
  );

  return { ...query, extras };
}

export function DetailLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SkeletonCard className="xl:col-span-2 h-80" />
        <SkeletonCard className="h-80" />
      </div>
    </div>
  );
}

export function DetailNotFound({ entityKey, detailId }: { entityKey: string; detailId: string }) {
  return (
    <EmptyState
      title="Record not found"
      description={`No ${entitySingular(entityKey).toLowerCase()} matches “${detailId}”.`}
      action={{ label: 'Back to list', onClick: () => history.back() }}
    />
  );
}

export function DetailHeader({
  title,
  subtitle,
  breadcrumbs,
  basePath,
  badges,
  actions,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs: { label: string; href?: string }[];
  basePath: string;
  badges?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <PageHeader
      title={title}
      description={subtitle}
      breadcrumbs={breadcrumbs}
      actions={
        <>
          <Link href={basePath}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          {badges}
          {actions}
        </>
      }
    />
  );
}
