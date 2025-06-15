import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import { useLoading } from './useLoading';
import { useNotification } from './useNotification';

interface UseDataFetchingOptions<T> {
  endpoint: string;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export const useDataFetching = <T>({
  endpoint,
  onSuccess,
  onError,
}: UseDataFetchingOptions<T>) => {
  const api = useApi();
  const { isLoading, withLoading } = useLoading();
  const { error: showError } = useNotification();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const fetchData = useCallback(
    async (params?: Record<string, any>) => {
      try {
        const queryString = params
          ? '?' + new URLSearchParams(params).toString()
          : '';
        const { data, error } = await withLoading(
          api.get<T>(`${endpoint}${queryString}`)
        );

        if (error) {
          setError(error);
          showError(error);
          onError?.(error);
          return;
        }

        setData(data);
        setError(null);
        onSuccess?.(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        showError(errorMessage);
        onError?.(errorMessage);
      }
    },
    [api, endpoint, onError, onSuccess, showError, withLoading]
  );

  const createData = useCallback(
    async (body: any) => {
      try {
        const { data, error } = await withLoading(api.post<T>(endpoint, body));

        if (error) {
          setError(error);
          showError(error);
          onError?.(error);
          return;
        }

        setData(data);
        setError(null);
        onSuccess?.(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        showError(errorMessage);
        onError?.(errorMessage);
      }
    },
    [api, endpoint, onError, onSuccess, showError, withLoading]
  );

  const updateData = useCallback(
    async (id: string, body: any) => {
      try {
        const { data, error } = await withLoading(
          api.patch<T>(`${endpoint}/${id}`, body)
        );

        if (error) {
          setError(error);
          showError(error);
          onError?.(error);
          return;
        }

        setData(data);
        setError(null);
        onSuccess?.(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        showError(errorMessage);
        onError?.(errorMessage);
      }
    },
    [api, endpoint, onError, onSuccess, showError, withLoading]
  );

  const deleteData = useCallback(
    async (id: string) => {
      try {
        const { error } = await withLoading(api.del(`${endpoint}/${id}`));

        if (error) {
          setError(error);
          showError(error);
          onError?.(error);
          return;
        }

        setData(null);
        setError(null);
        onSuccess?.(null as T);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        showError(errorMessage);
        onError?.(errorMessage);
      }
    },
    [api, endpoint, onError, onSuccess, showError, withLoading]
  );

  return {
    data,
    error,
    isLoading,
    fetchData,
    createData,
    updateData,
    deleteData,
  };
}; 