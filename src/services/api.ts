import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

/**
 * Attach authentication token to API requests
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

export function getApiErrorStatus(error: unknown): number | undefined {
  if (!axios.isAxiosError(error)) return undefined
  return error.response?.status
}

export function getApiErrorMessage(error: unknown): string | undefined {
  if (!axios.isAxiosError<{ message?: string }>(error)) return undefined
  const message = error.response?.data?.message
  return typeof message === 'string' ? message : undefined
}

export default api
