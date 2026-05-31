import axios, { type AxiosError } from 'axios';
import { API_BASE_URL, API_GENERAL_TOKEN } from '@/shared/config/env';
import { ApiError, isApiErrorBody } from '@/shared/api/apiError';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    ...(API_GENERAL_TOKEN
      ? { Authorization: `Bearer ${API_GENERAL_TOKEN}` }
      : {}),
  },
});

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;
    if (isApiErrorBody(data)) {
      return Promise.reject(new ApiError(status, data.error));
    }
    const message =
      error.message || 'Network request failed. Check your connection.';
    return Promise.reject(new Error(message));
  },
);
