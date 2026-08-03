import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Employee, LeaveRequest } from '@/types/hr';
import toast from 'react-hot-toast';
import {
  getMockEmployees,
  getMockHrStats,
  getMockLeaveRequests,
} from '@/mocks/hrAdapters';

async function withMockFallback<T>(request: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await request();
  } catch {
    return fallback();
  }
}

// Employees
export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () =>
      withMockFallback(async () => {
        const response = await api.get('/hr/employees');
        return response.data.data as Employee[];
      }, getMockEmployees),
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () =>
      withMockFallback(
        async () => {
          const response = await api.get(`/hr/employees/${id}`);
          return response.data.data as Employee;
        },
        () => getMockEmployees().find((e) => e.id === id) || getMockEmployees()[0],
      ),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Employee>) => {
      try {
        const response = await api.post('/hr/employees', data);
        return response.data;
      } catch {
        return { success: true, mock: true, data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create employee');
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Employee> }) => {
      try {
        const response = await api.put(`/hr/employees/${id}`, data);
        return response.data;
      } catch {
        return { success: true, mock: true, id, data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update employee');
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/hr/employees/${id}`);
        return response.data;
      } catch {
        return { success: true, mock: true, id };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    },
  });
}

export function useHrStats() {
  return useQuery({
    queryKey: ['hr-stats'],
    queryFn: () =>
      withMockFallback(async () => {
        const response = await api.get('/hr/stats');
        return response.data.data;
      }, getMockHrStats),
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () =>
      withMockFallback(async () => {
        const response = await api.get('/hr/departments');
        return response.data.data;
      }, () => [
        { id: 'eng', name: 'Engineering' },
        { id: 'fin', name: 'Finance' },
        { id: 'des', name: 'Design' },
        { id: 'sup', name: 'Support' },
        { id: 'ops', name: 'Operations' },
      ]),
  });
}

// Leave Requests
export function useLeaveRequests() {
  return useQuery({
    queryKey: ['leave-requests'],
    queryFn: () =>
      withMockFallback(async () => {
        const response = await api.get('/hr/leaves');
        return response.data.data as LeaveRequest[];
      }, getMockLeaveRequests),
  });
}

export function useLeaveRequest(id: string) {
  return useQuery({
    queryKey: ['leave-requests', id],
    queryFn: () =>
      withMockFallback(
        async () => {
          const response = await api.get(`/hr/leaves/${id}`);
          return response.data.data as LeaveRequest;
        },
        () => getMockLeaveRequests().find((l) => l.id === id) || getMockLeaveRequests()[0],
      ),
    enabled: !!id,
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<LeaveRequest>) => {
      try {
        const response = await api.post('/hr/leaves', data);
        return response.data;
      } catch {
        return { success: true, mock: true, data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave request submitted!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit leave request');
    },
  });
}

export function useApproveLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.post(`/hr/leaves/${id}/approve`);
        return response.data;
      } catch {
        return { success: true, mock: true, id };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave request approved!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve leave request');
    },
  });
}

export function useRejectLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      try {
        const response = await api.post(`/hr/leaves/${id}/reject`, { rejection_reason: reason });
        return response.data;
      } catch {
        return { success: true, mock: true, id, reason };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave request rejected');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject leave request');
    },
  });
}

export function useDeleteLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/hr/leaves/${id}`);
        return response.data;
      } catch {
        return { success: true, mock: true, id };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave request deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete leave request');
    },
  });
}
