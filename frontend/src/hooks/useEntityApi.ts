import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { getEntityApi } from '@/lib/entityApi';

function unwrapList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
}

function unwrapItem(payload: any): any {
  if (payload?.data?.data) return payload.data.data;
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return payload;
}

export function useEntityList(entityKey: string) {
  const config = getEntityApi(entityKey);
  return useQuery({
    queryKey: ['entity', entityKey],
    queryFn: async () => {
      const response = await api.get(config.listPath);
      return unwrapList(response.data).map((row) => config.toUi(row));
    },
  });
}

export function useEntityItem(entityKey: string, id: string) {
  const config = getEntityApi(entityKey);
  return useQuery({
    queryKey: ['entity', entityKey, id],
    queryFn: async () => {
      const response = await api.get(config.itemPath(id));
      return config.toUi(unwrapItem(response.data));
    },
    enabled: !!id,
  });
}

export function useCreateEntity(entityKey: string) {
  const queryClient = useQueryClient();
  const config = getEntityApi(entityKey);
  return useMutation({
    mutationFn: async (form: Record<string, any>) => {
      const response = await api.post(config.createPath, config.toCreateBody(form));
      return unwrapItem(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity', entityKey] });
      toast.success('Created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create');
    },
  });
}

export function useUpdateEntity(entityKey: string) {
  const queryClient = useQueryClient();
  const config = getEntityApi(entityKey);
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) => {
      const response = await api.put(config.itemPath(id), config.toCreateBody(data));
      return unwrapItem(response.data);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['entity', entityKey] });
      queryClient.invalidateQueries({ queryKey: ['entity', entityKey, vars.id] });
      toast.success('Updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update');
    },
  });
}

export function useDeleteEntity(entityKey: string) {
  const queryClient = useQueryClient();
  const config = getEntityApi(entityKey);
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(config.itemPath(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity', entityKey] });
      toast.success('Deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete');
    },
  });
}

export function useEntityActivity(entityType?: string, entityId?: string, actorId?: string) {
  return useQuery({
    queryKey: ['activity', entityType, entityId, actorId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (entityType) params.set('entity_type', entityType);
      if (entityId) params.set('entity_id', entityId);
      if (actorId) params.set('actor_id', actorId);
      const qs = params.toString();
      const response = await api.get(`/workspace/activity${qs ? `?${qs}` : ''}`);
      return unwrapList(response.data);
    },
  });
}
