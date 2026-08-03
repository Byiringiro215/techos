import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function useDashboard() {
  const user = useAuthStore((state) => state.user);
  
  return useQuery({
    queryKey: ['dashboard', user?.role],
    queryFn: async () => {
      const role = user?.role?.toLowerCase() || '';
      
      let endpoint = 'executive';
      if (role.includes('developer') || role.includes('engineer')) {
        endpoint = 'developer';
      } else if (role.includes('product') || role.includes('designer')) {
        endpoint = 'product';
      } else if (role.includes('finance') || role.includes('sales')) {
        endpoint = 'finance';
      } else if (role.includes('hr')) {
        endpoint = 'hr';
      }

      const response = await api.get(`/dashboard/${endpoint}`);
      return response.data;
    },
    enabled: !!user,
  });
}
