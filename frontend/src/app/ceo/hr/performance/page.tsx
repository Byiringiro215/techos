'use client';

import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { EmptyState } from '@/components/UI/EmptyState';
import Link from 'next/link';
import { useEmployees } from '@/hooks/useHR';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import {
  TrendingUp,
  Star,
  Users,
  Target,
  Award,
  Clock,
  MoreHorizontal
} from 'lucide-react';

export default function PerformanceReviewsPage() {
  const { data: employees, isLoading } = useEmployees();

  const reviews = [
    { id: '1', employeeName: 'Sarah Johnson', employeeId: '1', position: 'Senior Developer', score: 4.8, status: 'completed', period: 'Q3 2024', date: '2024-09-15' },
    { id: '2', employeeName: 'Michael Chen', employeeId: '2', position: 'Product Manager', score: 4.5, status: 'completed', period: 'Q3 2024', date: '2024-09-12' },
    { id: '3', employeeName: 'Emily Davis', employeeId: '3', position: 'UX Designer', score: 0, status: 'pending', period: 'Q3 2024', date: '2024-09-20' },
    { id: '4', employeeName: 'James Wilson', employeeId: '4', position: 'Sales Lead', score: 4.2, status: 'completed', period: 'Q3 2024', date: '2024-09-10' },
    { id: '5', employeeName: 'Lisa Anderson', employeeId: '5', position: 'Marketing Manager', score: 0, status: 'in_progress', period: 'Q3 2024', date: '2024-09-18' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'in_progress': return <Badge variant="info">In Progress</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const avgScore = reviews.filter(r => r.score > 0).reduce((sum, r) => sum + r.score, 0) / reviews.filter(r => r.score > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Performance Reviews</h1>
          <p className="text-ink-muted mt-2">Employee performance tracking and reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-surface border border-border">
          <Users className="h-8 w-8 text-ink mb-3" />
          <p className="text-sm text-ink-muted">Total Reviews</p>
          <p className="text-3xl font-bold text-ink mt-1">{reviews.length}</p>
        </Card>
        <Card className="p-6 bg-surface border border-border">
          <Award className="h-8 w-8 text-success mb-3" />
          <p className="text-sm text-ink-muted">Completed</p>
          <p className="text-3xl font-bold text-ink mt-1">{reviews.filter(r => r.status === 'completed').length}</p>
        </Card>
        <Card className="p-6 bg-surface border border-border">
          <Clock className="h-8 w-8 text-warning mb-3" />
          <p className="text-sm text-ink-muted">Pending</p>
          <p className="text-3xl font-bold text-ink mt-1">{reviews.filter(r => r.status === 'pending').length}</p>
        </Card>
        <Card className="p-6 bg-surface border border-border">
          <Star className="h-8 w-8 text-ink mb-3" />
          <p className="text-sm text-ink-muted">Avg Score</p>
          <p className="text-3xl font-bold text-ink mt-1">{avgScore.toFixed(1)}</p>
        </Card>
      </div>

      <Card className="p-6 bg-surface border border-border">
        <h2 className="text-lg font-semibold text-ink mb-6 flex items-center gap-2">
          <Target className="h-5 w-5" /> Recent Reviews
        </h2>
        {reviews.length === 0 ? (
          <EmptyState
            icon={<TrendingUp className="h-12 w-12" />}
            title="No reviews yet"
            description="Schedule performance reviews for your team"
          />
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <Link
                key={review.id}
                href={`/ceo/hr/performance/${review.id}`}
                className="flex items-center justify-between p-4 bg-bg-muted border border-border rounded-lg hover:border-border-strong transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-brand-mist flex items-center justify-center text-brand font-semibold text-sm">
                    {review.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{review.employeeName}</p>
                    <p className="text-sm text-ink-muted">{review.position} · {review.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {review.score > 0 ? (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-warning fill-yellow-400" />
                      <span className="text-ink font-semibold">{review.score.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-ink-muted text-sm">No score</span>
                  )}
                  {getStatusBadge(review.status)}
                  <p className="text-xs text-ink-muted">{new Date(review.date).toLocaleDateString()}</p>
                  <MoreHorizontal className="h-4 w-4 text-ink-muted" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
