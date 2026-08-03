import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const response = await api.get('/analytics/overview');
      return response.data;
    },
  });
}

export function useProjectAnalytics(projectId?: string) {
  return useQuery({
    queryKey: ['analytics', 'projects', projectId],
    queryFn: async () => {
      const response = await api.get('/analytics/projects', {
        params: { project_id: projectId },
      });
      return response.data;
    },
  });
}

export function useTeamProductivity(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['analytics', 'team-productivity', startDate, endDate],
    queryFn: async () => {
      const response = await api.get('/analytics/team-productivity', {
        params: { start_date: startDate, end_date: endDate },
      });
      return response.data;
    },
  });
}

export function useSprintAnalytics(sprintId?: string) {
  return useQuery({
    queryKey: ['analytics', 'sprints', sprintId],
    queryFn: async () => {
      const response = await api.get('/analytics/sprints', {
        params: { sprint_id: sprintId },
      });
      return response.data;
    },
  });
}

export function useBugAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'bugs'],
    queryFn: async () => {
      const response = await api.get('/analytics/bugs');
      return response.data;
    },
  });
}

export function useTimeTracking(userId?: string, projectId?: string) {
  return useQuery({
    queryKey: ['analytics', 'time-tracking', userId, projectId],
    queryFn: async () => {
      const response = await api.get('/analytics/time-tracking', {
        params: { user_id: userId, project_id: projectId },
      });
      return response.data;
    },
  });
}

export function useKPIs(filters?: any) {
  return useQuery({
    queryKey: ['analytics', 'kpis', filters],
    queryFn: async () => {
      const response = await api.get('/analytics/kpis', { params: filters });
      return response.data;
    },
  });
}

export function useCreateKPI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/analytics/kpis', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'kpis'] });
    },
  });
}

export function useUpdateKPI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/analytics/kpis/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'kpis'] });
    },
  });
}
