import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Channel, Message } from '@/types/channel';
import toast from 'react-hot-toast';

export function useChannels() {
  return useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const response = await api.get('/channels');
      return response.data.data as Channel[];
    },
  });
}

export function useChannel(id: string) {
  return useQuery({
    queryKey: ['channels', id],
    queryFn: async () => {
      const response = await api.get(`/channels/${id}`);
      return response.data.data as Channel;
    },
    enabled: !!id,
  });
}

export function useCreateChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Channel>) => {
      const response = await api.post('/channels', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      toast.success('Channel created!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create channel');
    },
  });
}

export function useChannelMessages(channelId: string) {
  return useQuery({
    queryKey: ['channels', channelId, 'messages'],
    queryFn: async () => {
      const response = await api.get(`/channels/${channelId}/messages`);
      return response.data.data as Message[];
    },
    enabled: !!channelId,
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ channelId, content }: { channelId: string; content: string }) => {
      const response = await api.post(`/channels/${channelId}/messages`, { content });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['channels', variables.channelId, 'messages'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send message');
    },
  });
}
