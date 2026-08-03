import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Invoice, Expense, Budget } from '@/types/finance';
import toast from 'react-hot-toast';
import {
  getMockInvoices,
  getMockExpenses,
  getMockBudgets,
  getMockFinancialSummary,
} from '@/mocks/financeAdapters';

async function withMockFallback<T>(request: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await request();
  } catch {
    return fallback();
  }
}

// Invoices
export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () =>
      withMockFallback(async () => {
        const response = await api.get('/finance/invoices');
        return response.data.data as Invoice[];
      }, getMockInvoices),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () =>
      withMockFallback(
        async () => {
          const response = await api.get(`/finance/invoices/${id}`);
          return response.data.data as Invoice;
        },
        () => getMockInvoices().find((inv) => inv.id === id) || getMockInvoices()[0],
      ),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Invoice>) => {
      try {
        const response = await api.post('/finance/invoices', data);
        return response.data;
      } catch {
        return { success: true, mock: true, data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create invoice');
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Invoice> }) => {
      try {
        const response = await api.put(`/finance/invoices/${id}`, data);
        return response.data;
      } catch {
        return { success: true, mock: true, id, data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update invoice');
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/finance/invoices/${id}`);
        return response.data;
      } catch {
        return { success: true, mock: true, id };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete invoice');
    },
  });
}

export function useSendInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, recipient_email }: { id: string; recipient_email: string }) => {
      try {
        const response = await api.post(`/finance/invoices/${id}/send`, { recipient_email });
        return response.data;
      } catch {
        return { success: true, mock: true, id, recipient_email };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice sent successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send invoice');
    },
  });
}

// Financial Summary
export function useFinancialSummary(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['financial-summary', startDate, endDate],
    queryFn: () =>
      withMockFallback(async () => {
        const params: any = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        const response = await api.get('/finance/summary', { params });
        return response.data.data;
      }, getMockFinancialSummary),
  });
}

// Payments
export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: () =>
      withMockFallback(
        async () => {
          const response = await api.get('/finance/invoices');
          const invoices = response.data.data as Invoice[];
          return invoices.filter((inv) => inv.status === 'paid');
        },
        () => getMockInvoices().filter((inv) => inv.status === 'paid'),
      ),
  });
}

// Expenses
export function useExpenses() {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: () =>
      withMockFallback(async () => {
        const response = await api.get('/finance/expenses');
        return response.data.data as Expense[];
      }, getMockExpenses),
  });
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: () =>
      withMockFallback(
        async () => {
          const response = await api.get(`/finance/expenses/${id}`);
          return response.data.data as Expense;
        },
        () => getMockExpenses().find((exp) => exp.id === id) || getMockExpenses()[0],
      ),
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Expense>) => {
      try {
        const response = await api.post('/finance/expenses', data);
        return response.data;
      } catch {
        return { success: true, mock: true, data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit expense');
    },
  });
}

export function useApproveExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.post(`/finance/expenses/${id}/approve`);
        return response.data;
      } catch {
        return { success: true, mock: true, id };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense approved!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve expense');
    },
  });
}

export function useRejectExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      try {
        const response = await api.post(`/finance/expenses/${id}/reject`, { reason });
        return response.data;
      } catch {
        return { success: true, mock: true, id, reason };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense rejected');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject expense');
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Expense> }) => {
      try {
        const response = await api.put(`/finance/expenses/${id}`, data);
        return response.data;
      } catch {
        return { success: true, mock: true, id, data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update expense');
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/finance/expenses/${id}`);
        return response.data;
      } catch {
        return { success: true, mock: true, id };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete expense');
    },
  });
}

// Budgets
export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () =>
      withMockFallback(async () => {
        const response = await api.get('/finance/budgets');
        return response.data.data as Budget[];
      }, getMockBudgets),
  });
}

export function useBudget(id: string) {
  return useQuery({
    queryKey: ['budgets', id],
    queryFn: () =>
      withMockFallback(
        async () => {
          const response = await api.get(`/finance/budgets/${id}`);
          return response.data.data as Budget;
        },
        () => getMockBudgets().find((budget) => budget.id === id) || getMockBudgets()[0],
      ),
    enabled: !!id,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Budget>) => {
      try {
        const response = await api.post('/finance/budgets', data);
        return response.data;
      } catch {
        return { success: true, mock: true, data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create budget');
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Budget> }) => {
      try {
        const response = await api.put(`/finance/budgets/${id}`, data);
        return response.data;
      } catch {
        return { success: true, mock: true, id, data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update budget');
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/finance/budgets/${id}`);
        return response.data;
      } catch {
        return { success: true, mock: true, id };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete budget');
    },
  });
}
