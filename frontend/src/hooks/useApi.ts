import { useAuth } from './useAuth';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export const useApi = () => {
  const { token, logout } = useAuth();

  const request = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        logout();
        throw new Error('Unauthorized');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return { data };
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  };

  const get = <T>(endpoint: string) => request<T>(endpoint);
  
  const post = <T>(endpoint: string, body: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });

  const put = <T>(endpoint: string, body: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

  const patch = <T>(endpoint: string, body: any) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });

  const del = <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: 'DELETE',
    });

  return {
    get,
    post,
    put,
    patch,
    del,
  };
}; 