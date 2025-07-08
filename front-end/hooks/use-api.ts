"use client";

import { useState, useEffect } from "react";
import type { ApiError } from "@/lib/api-client";

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export function useApi<T>(apiCall: () => Promise<T>, dependencies: any[] = []) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();
      setState({
        data: response,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as ApiError,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<T, P = any>() {
  const [state, setState] = useState<
    UseApiState<T> & { isSubmitting: boolean }
  >({
    data: null,
    loading: false,
    error: null,
    isSubmitting: false,
  });

  const mutate = async (apiCall: (params: P) => Promise<T>, params: P) => {
    setState((prev) => ({
      ...prev,
      isSubmitting: true,
      loading: true,
      error: null,
    }));

    try {
      const response = await apiCall(params);
      setState({
        data: response,
        loading: false,
        error: null,
        isSubmitting: false,
      });
      return response;
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as ApiError,
        isSubmitting: false,
      });
      throw error;
    }
  };

  return {
    ...state,
    mutate,
  };
}
