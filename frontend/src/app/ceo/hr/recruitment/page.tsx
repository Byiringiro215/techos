'use client';

import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { EmptyState } from '@/components/UI/EmptyState';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Briefcase,
  FileText,
  Search,
  MapPin,
  Clock,
  Plus
} from 'lucide-react';

export default function RecruitmentPage() {
  const jobPostings = [
    { id: '1', title: 'Senior Software Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', applicants: 24, status: 'open', posted: '3 days ago' },
    { id: '2', title: 'Product Manager', department: 'Product', location: 'New York', type: 'Full-time', applicants: 18, status: 'open', posted: '1 week ago' },
    { id: '3', title: 'UX Designer', department: 'Design', location: 'Remote', type: 'Full-time', applicants: 32, status: 'interviewing', posted: '2 weeks ago' },
    { id: '4', title: 'Sales Representative', department: 'Sales', location: 'San Francisco', type: 'Full-time', applicants: 15, status: 'open', posted: '5 days ago' },
  ];

  const candidates = [
    { id: '1', name: 'Alex Chen', position: 'Senior Software Engineer', applied: '2 days ago', status: 'interview_scheduled' },
    { id: '2', name: 'Maria Santos', position: 'Product Manager', applied: '5 days ago', status: 'under_review' },
    { id: '3', name: 'James Wilson', position: 'UX Designer', applied: '1 week ago', status: 'offer_sent' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge variant="success">Open</Badge>;
      case 'interviewing': return <Badge variant="warning">Interviewing</Badge>;
      case 'closed': return <Badge variant="default">Closed</Badge>;
      case 'under_review': return <Badge variant="warning">Under Review</Badge>;
      case 'interview_scheduled': return <Badge variant="info">Interview Scheduled</Badge>;
      case 'offer_sent': return <Badge variant="success">Offer Sent</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Recruitment</h1>
          <p className="text-ink-muted mt-2">Open positions, candidates and hiring pipeline</p>
        </div>
        <button className="px-4 py-2 bg-brand text-ink-inverse text-sm font-medium rounded-xl hover:bg-brand-deep transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Job Posting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-surface border border-border">
          <Briefcase className="h-8 w-8 text-ink mb-3" />
          <p className="text-sm text-ink-muted">Open Positions</p>
          <p className="text-3xl font-bold text-ink mt-1">
            {jobPostings.filter(j => j.status === 'open').length}
          </p>
        </Card>
        <Card className="p-6 bg-surface border border-border">
          <Users className="h-8 w-8 text-ink mb-3" />
          <p className="text-sm text-ink-muted">Total Applicants</p>
          <p className="text-3xl font-bold text-ink mt-1">89</p>
        </Card>
        <Card className="p-6 bg-surface border border-border">
          <Clock className="h-8 w-8 text-warning mb-3" />
          <p className="text-sm text-ink-muted">In Interviews</p>
          <p className="text-3xl font-bold text-ink mt-1">12</p>
        </Card>
        <Card className="p-6 bg-surface border border-border">
          <UserPlus className="h-8 w-8 text-success mb-3" />
          <p className="text-sm text-ink-muted">Hires This Month</p>
          <p className="text-3xl font-bold text-ink mt-1">3</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 bg-surface border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-ink flex items-center gap-2">
              <Briefcase className="h-5 w-5" /> Open Positions
            </h2>
          </div>
          {jobPostings.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-12 w-12" />}
              title="No open positions"
              description="Create your first job posting to get started"
            />
          ) : (
            <div className="space-y-4">
              {jobPostings.map(job => (
                <Link
                  key={job.id}
                  href={`/ceo/hr/recruitment/${job.id}`}
                  className="block p-4 bg-bg-muted border border-border rounded-lg hover:border-border-strong transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-ink">{job.title}</h3>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="text-xs text-ink-muted flex items-center gap-1">
                          <Briefcase className="h-3 w-3" /> {job.department}
                        </span>
                        <span className="text-xs text-ink-muted flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {job.location}
                        </span>
                        <span className="text-xs text-ink-muted">{job.type}</span>
                        <span className="text-xs text-ink-muted">Posted {job.posted}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(job.status)}
                      <div className="flex items-center gap-1 text-sm text-ink-muted">
                        <Users className="h-3 w-3" /> {job.applicants} applicants
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-surface border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-ink flex items-center gap-2">
              <FileText className="h-5 w-5" /> Recent Candidates
            </h2>
            <Link href="/ceo/hr/recruitment/candidates" className="text-sm text-ink-muted hover:text-ink">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {candidates.map(c => (
              <div key={c.id} className="p-3 bg-bg-muted border border-border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-brand-mist flex items-center justify-center text-brand text-xs font-semibold">
                    {c.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink text-sm truncate">{c.name}</p>
                    <p className="text-xs text-ink-muted truncate">{c.position}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-ink-muted">{c.applied}</p>
                  {getStatusBadge(c.status)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
