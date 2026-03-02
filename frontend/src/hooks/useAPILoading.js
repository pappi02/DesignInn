/**
 * useAPILoading Hook
 * Custom React hook to track API loading states
 * 
 * Usage:
 * const { isLoading } = useAPILoading()
 * return <>{isLoading && <LoadingSpinner />}</>
 */

import { useState, useEffect, useCallback } from 'react';
import { loadingState } from '../api/client';

/**
 * Hook to monitor global API loading state
 * @returns {Object} Loading state object
 */
export function useAPILoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    // Initial state
    setIsLoading(loadingState.isLoading);
    setRequestCount(loadingState.activeRequests);

    // Create handler for loading state changes
    const handleLoadingChange = (newLoadingState) => {
      setIsLoading(newLoadingState);
      setRequestCount(loadingState.activeRequests);
    };

    // Subscribe to loading state changes
    loadingState.addListener(handleLoadingChange);

    // Cleanup
    return () => {
      loadingState.removeListener(handleLoadingChange);
    };
  }, []);

  return {
    isLoading,
    requestCount,
  };
}

/**
 * Hook for loading state within a specific operation
 * Useful for button loading states, etc.
 * 
 * Usage:
 * const { isLoading: isSaving, execute } = useAPIOperationLoading()
 * const handleSave = () => execute(async () => await api.save(data))
 */
export function useAPIOperationLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for multiple dependent API calls with loading states
 * 
 * Usage:
 * const { data, isLoading, error } = useAPIData(
 *   () => API.products.list(),
 *   []
 * )
 */
export function useAPIData(apiCall, dependencies = [], options = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(options.lazy !== true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (options.lazy === true && !options.trigger) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result.data || result);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result.data || result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

export default useAPILoading;
