import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { Notify } from 'quasar';
import { getApiErrorMessage } from 'src/shared/utils/getApiErrorMessage';
import { notify } from 'src/shared/utils/notify.utils';

declare module 'axios' {
  export interface AxiosRequestConfig {
    showErrorNotify?: boolean;
    skipAuthRedirect?: boolean;
  }
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Request interceptor
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const showErrorNotify = error.config?.showErrorNotify !== false;
    const skipAuthRedirect = error.config?.skipAuthRedirect == true;

    if (error.response?.status === 401) {
      // Sessão inválida
      localStorage.removeItem('access_token');

      if (!skipAuthRedirect) {
        notify.warning('Sua sessão expirou. Faça login novamente.')
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      if (showErrorNotify)
        notify.error('Você não tem permissão para acessar este recurso.')

      return Promise.reject(error);
    }

    if (showErrorNotify)
      notify.error(getApiErrorMessage(error));

    return Promise.reject(error);
  }
);

export default http;
