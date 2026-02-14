/**
 * useApi Hook
 * Provides a wrapper for making API calls with loading and error states
 */

import { useState, useCallback } from 'react';
import apiClient from '../api/client';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET request
  const get = useCallback(async (url, config = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get(url, config);
      return { data: response.data, status: response.status, error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error(`GET ${url} failed:`, err);
      return {
        data: null,
        status: err.response?.status || 500,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // POST request
  const post = useCallback(async (url, data = {}, config = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.post(url, data, config);
      return { data: response.data, status: response.status, error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error(`POST ${url} failed:`, err);
      return {
        data: null,
        status: err.response?.status || 500,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // PUT request
  const put = useCallback(async (url, data = {}, config = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.put(url, data, config);
      return { data: response.data, status: response.status, error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error(`PUT ${url} failed:`, err);
      return {
        data: null,
        status: err.response?.status || 500,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // PATCH request
  const patch = useCallback(async (url, data = {}, config = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.patch(url, data, config);
      return { data: response.data, status: response.status, error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error(`PATCH ${url} failed:`, err);
      return {
        data: null,
        status: err.response?.status || 500,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // DELETE request
  const del = useCallback(async (url, config = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.delete(url, config);
      return { data: response.data, status: response.status, error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error(`DELETE ${url} failed:`, err);
      return {
        data: null,
        status: err.response?.status || 500,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError,
  };
};

export default useApi;
