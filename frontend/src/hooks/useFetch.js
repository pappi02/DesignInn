/**
 * useFetch Hook
 * Generic hook for fetching data with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error(`Error fetching ${url}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useFetch;
