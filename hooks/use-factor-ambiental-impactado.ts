import { useQuery } from '@tanstack/react-query';
import { FactorAmbientalImpactado } from '@/lib/types/forms';

export function useFactorAmbientalImpactado() {
  return useQuery<FactorAmbientalImpactado[]>({
    queryKey: ['factor-ambiental'],
    queryFn: async () => {
      const response = await fetch('/api/forms/factor-ambiental');
      if (!response.ok)
        throw new Error('Failed to fetch environmental factors');
      return response.json();
    },
  });
}
