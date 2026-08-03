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
          <h1 className="text-3xl font-bold text-white">Recruitment</h1>
          <p className="text-gray-400 mt-2">Open positions, candidates and hiring pipeline</p>
        </div>
        <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Job Posting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <Briefcase className="h-8 w-8 text-white mb-3" />
          <p className="text-sm text-gray-400">Open Positions</p>
          <p className="text-3xl font-bold text-white mt-1">
            {jobPostings.filter(j => j.status === 'open').length}
          </p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <Users className="h-8 w-8 text-white mb-3" />
          <p className="text-sm text-gray-400">Total Applicants</p>
          <p className="text-3xl font-bold text-white mt-1">89</p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <Clock className="h-8 w-8 text-yellow-400 mb-3" />
          <p className="text-sm text-gray-400">In Interviews</p>
          <p className="text-3xl font-bold text-white mt-1">12</p>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <UserPlus className="h-8 w-8 text-green-400 mb-3" />
          <p className="text-sm text-gray-400">Hires This Month</p>
          <p className="text-3xl font-bold text-white mt-1">3</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
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
                  className="block p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-gray-700 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{job.title}</h3>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Briefcase className="h-3 w-3" /> {job.department}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {job.location}
                        </span>
                        <span className="text-xs text-gray-400">{job.type}</span>
                        <span className="text-xs text-gray-500">Posted {job.posted}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(job.status)}
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Users className="h-3 w-3" /> {job.applicants} applicants
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="h-5 w-5" /> Recent Candidates
            </h2>
            <Link href="/ceo/hr/recruitment/candidates" className="text-sm text-gray-400 hover:text-white">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {candidates.map(c => (
              <div key={c.id} className="p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-black text-xs font-semibold">
                    {c.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate">{c.position}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{c.applied}</p>
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
