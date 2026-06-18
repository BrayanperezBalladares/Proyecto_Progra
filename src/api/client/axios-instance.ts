import axios, { type AxiosError } from 'axios'
import type { ApiError } from './api-error'
import { getApiBaseUrl } from '@api/config'
import { supabase } from '@/lib/supabase'

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
})

apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  if (data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; title?: string }>) => {
    const data = error.response?.data
    const message =
      (typeof data === 'string' ? data : null) ??
      data?.message ??
      data?.title ??
      error.message ??
      'No se pudo conectar con el API. Verifica que ProyectoIProgra2 esté en ejecución.'

    const apiError: ApiError = {
      message,
      status: error.response?.status,
      code: error.code,
    }
    return Promise.reject(apiError)
  },
)
