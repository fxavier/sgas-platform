import { useState } from 'react';

interface UseFormApiProps<T> {
  endpoint: string;
}

export function useFormApi<T>({ endpoint }: UseFormApiProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: T) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(
        'API request data:',
        JSON.stringify(
          data,
          (key, value) => {
            if (value instanceof Date) {
              return `Date(${value.toISOString()})`;
            }
            return value;
          },
          2
        )
      );

      const response = await fetch(`/api/forms/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API validation error details:', errorData);
        throw new Error(
          errorData.error || `Failed to create record (${response.status})`
        );
      }

      return await response.json();
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: string, data: T) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/forms/${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(
          errorData.error || `Failed to update record (${response.status})`
        );
      }

      return await response.json();
    } catch (err) {
      console.error('Form update error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/forms/${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(
          errorData.error || `Failed to delete record (${response.status})`
        );
      }

      return await response.json();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const get = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/forms/${endpoint}/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(
          errorData.error || `Failed to fetch record (${response.status})`
        );
      }

      return await response.json();
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    create,
    update,
    remove,
    get,
    isLoading,
    error,
  };
}
