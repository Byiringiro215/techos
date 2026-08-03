'use client';

import { useState } from 'react';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { EmptyState } from '@/components/UI/EmptyState';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/UI/Table';
import { useLeaveRequests, useApproveLeaveRequest, useRejectLeaveRequest } from '@/hooks/useHR';
import Link from 'next/link';
import {
  CalendarClock,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeaveRequestsPage() {
  const { data: leaveRequests, isLoading } = useLeaveRequests();
  const approveLeave = useApproveLeaveRequest();
  const rejectLeave = useRejectLeaveRequest();
  const [statusFilter, setStatusFilter] = useState('all');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredRequests = leaveRequests?.filter(req =>
    statusFilter === 'all' || req.status === statusFilter
  ) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      vacation: 'Vacation',
      sick: 'Sick Leave',
      personal: 'Personal',
      other: 'Other'
    };
    return types[type] || type;
  };

  const handleApprove = async (id: string) => {
    try {
      await approveLeave.mutateAsync(id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      await rejectLeave.mutateAsync({ id, reason: rejectReason });
      setRejectingId(null);
      setRejectReason('');
    } catch (e) {
      console.error(e);
    }
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const pendingCount = leaveRequests?.filter(l => l.status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Leave Requests</h1>
          <p className="text-gray-400 mt-2">Review and manage employee leave requests</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-900/30 border border-yellow-800 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">{pendingCount} pending approval</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Pending</span>
          </div>
          <p className="text-2xl font-bold text-white">{pendingCount}</p>
        </Card>
        <Card className="p-4 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-400">Approved</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {leaveRequests?.filter(l => l.status === 'approved').length || 0}
          </p>
        </Card>
        <Card className="p-4 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-gray-400">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {leaveRequests?.filter(l => l.status === 'rejected').length || 0}
          </p>
        </Card>
        <Card className="p-4 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <CalendarClock className="h-4 w-4 text-white" />
            <span className="text-sm text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{leaveRequests?.length || 0}</p>
        </Card>
      </div>

      <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {filteredRequests.length === 0 ? (
          <EmptyState
            icon={<CalendarClock className="h-12 w-12" />}
            title="No leave requests found"
            description="New leave requests will appear here"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <Link href={`/ceo/hr/leave-requests/${req.id}`} className="flex items-center gap-3 hover:opacity-80">
                      <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-black font-semibold text-xs">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {req.employee?.user?.first_name} {req.employee?.user?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{req.employee?.position}</p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{getTypeLabel(req.type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-gray-300 text-sm">
                      {new Date(req.start_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      to {new Date(req.end_date).toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-white font-medium">{calculateDays(req.start_date, req.end_date)}</p>
                    <p className="text-xs text-gray-500">days</p>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(req.status)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    <p className="text-sm text-gray-400 truncate">{req.reason || '-'}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === 'pending' ? (
                      rejectingId === req.id ? (
                        <div className="flex flex-col gap-2 items-end">
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Rejection reason..."
                            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-300 w-48"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReject(req.id)}
                              className="px-3 py-1 text-xs bg-red-900/50 text-red-400 border border-red-800 rounded-lg hover:bg-red-900/70"
                              disabled={rejectLeave.isPending}
                            >
                              {rejectLeave.isPending ? '...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => { setRejectingId(null); setRejectReason(''); }}
                              className="px-3 py-1 text-xs text-gray-400 border border-gray-700 rounded-lg hover:bg-[#1a1a1a]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="p-2 hover:bg-green-900/30 rounded-lg text-green-400 hover:text-green-300"
                            disabled={approveLeave.isPending}
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setRejectingId(req.id)}
                            className="p-2 hover:bg-red-900/30 rounded-lg text-red-400 hover:text-red-300"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    ) : (
                      <Link
                        href={`/ceo/hr/leave-requests/${req.id}`}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        View Details
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
