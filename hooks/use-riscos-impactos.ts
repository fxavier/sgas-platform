import { useQuery } from '@tanstack/react-query';
import { RiscosImpactos } from '@/lib/types/forms';

export function useRiscosImpactos() {
  return useQuery<RiscosImpactos[]>({
    queryKey: ['riscos-impactos'],
    queryFn: async () => {
      const response = await fetch('/api/forms/riscos-impactos');
      if (!response.ok) throw new Error('Failed to fetch risks');
      return response.json();
    },
  });
}
