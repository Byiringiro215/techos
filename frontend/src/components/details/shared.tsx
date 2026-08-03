'use client';

import { useState, type ReactNode } from 'react';
import { Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import type { DetailActivity, DetailComment, DetailRelated } from '@/mocks/detailExtras';
import { Avatar } from '@/components/UI/Avatar';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { TextArea } from '@/components/UI/TextArea';

export function ActivityFeed({ items }: { items: DetailActivity[] }) {
  return (
    <Card className="space-y-0 divide-y divide-border">
      {items.map((a) => (
        <div key={a.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          <Avatar name={a.actor} size="sm" />
          <div className="min-w-0">
            <p className="text-sm text-ink">
              <span className="font-medium">{a.actor}</span>{' '}
              <span className="text-ink-secondary">{a.action}</span>
            </p>
            <p className="text-xs text-ink-muted mt-0.5 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {a.time}
            </p>
          </div>
        </div>
      ))}
    </Card>
  );
}

export function CommentThread({
  seed,
}: {
  seed: DetailComment[];
}) {
  const [comment, setComment] = useState('');
  const [local, setLocal] = useState<DetailComment[]>([]);
  const comments = [...local, ...seed];

  const post = () => {
    if (!comment.trim()) {
      toast.error('Write a comment first');
      return;
    }
    setLocal((prev) => [
      { id: `local-${Date.now()}`, author: 'You', body: comment.trim(), time: 'Just now' },
      ...prev,
    ]);
    setComment('');
    toast.success('Comment posted (mock)');
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <TextArea
          label="Add a comment"
          placeholder="Share an update…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={post}>
            <Send className="h-4 w-4 mr-2" />
            Comment
          </Button>
        </div>
      </Card>
      {comments.map((c) => (
        <Card key={c.id} className="!p-4">
          <div className="flex items-start gap-3">
            <Avatar name={c.author} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ink">{c.author}</p>
                <p className="text-xs text-ink-muted">{c.time}</p>
              </div>
              <p className="text-sm text-ink-secondary mt-1 leading-relaxed">{c.body}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function RelatedList({ items }: { items: DetailRelated[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-ink-muted">No related records.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((r) => (
        <li
          key={`${r.kind}-${r.id}`}
          className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5"
        >
          <div className="min-w-0">
            <p className="text-xs text-ink-muted">{r.kind}</p>
            <p className="text-sm font-medium text-ink truncate">{r.title}</p>
          </div>
          <Badge variant="default" size="sm">
            {r.status}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

export function MetaGrid({
  items,
}: {
  items: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-ink-muted">{item.label}</dt>
          <dd className="text-ink mt-1">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PeopleList({ title, names }: { title: string; names: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">{title}</p>
      <ul className="space-y-2">
        {names.map((name) => (
          <li key={name} className="flex items-center gap-2 text-sm text-ink">
            <Avatar name={name} size="sm" />
            <span className="truncate">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
