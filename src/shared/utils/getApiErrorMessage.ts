import { AxiosError } from 'axios';

interface ApiErrorRespose {
  message?: string | string[];
  error?: {
    message?: string
  }
}

export function getApiErrorMessage(error: AxiosError): string {
  const data = error.response?.data as ApiErrorRespose | undefined

  if (Array.isArray(data?.message)) {
    return data.message.join(', ');
  }

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message;
  }

  if (typeof data?.error?.message === 'string' && data.error.message.trim()) {
    return data.error.message;
  }

  if (error.code === 'ECONNABORTED') {
    return 'A requisição demorou mais do que o esperado.'
  }

  if (!error.response) {
    return 'Não foi possível conectar com a API.'
  }

  return 'Ocorreu um erro ao processar a requisição.'
}
