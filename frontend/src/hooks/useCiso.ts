import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export interface CisoAuditProject {
  id: string;
  name: string;
  description?: string | null;
  status: 'needed' | 'in_progress' | 'completed' | string;
  task_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CisoTask {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  project_audit_id: string;
  audit_name?: string | null;
  finished: boolean;
}

export interface CisoReport {
  id: string;
  title: string;
  type: string;
  created_at: string;
  data?: { summary?: string };
}

export function useCisoAuditProjects(status?: 'needed' | 'in_progress' | 'completed') {
  return useQuery({
    queryKey: ['ciso', 'audits', status || 'all'],
    queryFn: async () => {
      const response = await api.get('/ciso/audits', { params: status ? { status } : undefined });
      return response.data.data as CisoAuditProject[];
    },
  });
}

export function useCreateProjectAudit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; description?: string; status?: string }) => {
      const response = await api.post('/ciso/audits', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ciso', 'audits'] });
      toast.success('Project audit created');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to create audit'),
  });
}

export function useUpdateProjectAudit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string; status?: string };
    }) => {
      const response = await api.put(`/ciso/audits/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ciso', 'audits'] });
      toast.success('Project audit updated');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to update audit'),
  });
}

export function useDeleteProjectAudit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/ciso/audits/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ciso', 'audits'] });
      queryClient.invalidateQueries({ queryKey: ['ciso', 'audit-tasks'] });
      toast.success('Project audit deleted');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to delete audit'),
  });
}

export function useCisoTasks(status?: 'finished' | 'not_finished', projectAuditId?: string) {
  return useQuery({
    queryKey: ['ciso', 'audit-tasks', status || 'all', projectAuditId || 'all'],
    queryFn: async () => {
      const response = await api.get('/ciso/audit-tasks', {
        params: {
          ...(status ? { status } : {}),
          ...(projectAuditId ? { project_audit_id: projectAuditId } : {}),
        },
      });
      return response.data.data as CisoTask[];
    },
  });
}

export function useCreateAuditTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      project_audit_id: string;
      title: string;
      description?: string;
      priority?: string;
    }) => {
      const response = await api.post('/ciso/audit-tasks', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ciso', 'audit-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['ciso', 'audits'] });
      toast.success('Audit task created');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to create task'),
  });
}

export function useUpdateAuditTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { project_audit_id?: string; title?: string; description?: string; priority?: string; status?: string };
    }) => {
      const response = await api.put(`/ciso/audit-tasks/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ciso', 'audit-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['ciso', 'audits'] });
      toast.success('Audit task updated');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to update task'),
  });
}

export function useDeleteAuditTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/ciso/audit-tasks/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ciso', 'audit-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['ciso', 'audits'] });
      toast.success('Audit task deleted');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to delete task'),
  });
}

export function useUpdateCisoTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, finished }: { id: string; finished: boolean }) => {
      const response = await api.patch(`/ciso/audit-tasks/${id}/status`, { finished });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ciso', 'audit-tasks'] });
      toast.success('Task status updated');
    },
    onError: () => toast.error('Failed to update task status'),
  });
}

export function useCisoReports() {
  return useQuery({
    queryKey: ['ciso', 'reports'],
    queryFn: async () => {
      const response = await api.get('/ciso/reports');
      return response.data.data as CisoReport[];
    },
  });
}

export function useCreateCisoReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, summary }: { title: string; summary?: string }) => {
      const response = await api.post('/ciso/reports', { title, summary, type: 'security' });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ciso', 'reports'] });
      toast.success('Security report created');
    },
    onError: () => toast.error('Failed to create report'),
  });
}
