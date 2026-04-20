import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { environment } from '../../../environments/environment';
import { tokenStore } from './token-store';

export interface ApiErrorPayload {
  status: number;
  message: string;
  original?: unknown;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: environment.apiBaseUrl.replace(/\/+$/, ''),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.token;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const status = error.response?.status ?? 0;
    if (status === 401) tokenStore.notifyUnauthorized();

    const payload: ApiErrorPayload = {
      status,
      message:
        error.response?.data?.message ??
        error.response?.data?.error ??
        error.message ??
        'Request failed',
      original: error,
    };
    return Promise.reject(payload);
  },
);
