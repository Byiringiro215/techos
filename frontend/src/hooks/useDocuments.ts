import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Document, Folder, DocumentVersion } from '@/types/document';
import toast from 'react-hot-toast';

// Documents
export function useDocuments(folderId?: string) {
  return useQuery({
    queryKey: ['documents', folderId],
    queryFn: async () => {
      const url = folderId ? `/documents?folder_id=${folderId}` : '/documents';
      const response = await api.get(url);
      return response.data.data as Document[];
    },
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: async () => {
      const response = await api.get(`/documents/${id}`);
      return response.data.data as Document;
    },
    enabled: !!id,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/documents/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete document');
    },
  });
}

// Folders
export function useFolders() {
  return useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const response = await api.get('/documents/folders');
      return response.data.data as Folder[];
    },
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; parent_folder_id?: string }) => {
      const response = await api.post('/documents/folders', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast.success('Folder created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create folder');
    },
  });
}

// Versions
export function useDocumentVersions(documentId: string) {
  return useQuery({
    queryKey: ['documents', documentId, 'versions'],
    queryFn: async () => {
      const response = await api.get(`/documents/${documentId}/versions`);
      return response.data.data as DocumentVersion[];
    },
    enabled: !!documentId,
  });
}
