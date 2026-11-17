import api from './api'

export interface User {
  id?: number
  name?: string
  email?: string
  phone?: string | null
  address?: string | null
}

export interface AuthSession {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface ApiEnvelope<T> {
  data: T
  message?: string
}

/**
 * Authentication service for handling user login and authentication-related API calls.
 */
const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post<ApiEnvelope<AuthSession>>('/auth/login', credentials)
    return response.data.data
  },

  async getProfile() {
    const response = await api.get<ApiEnvelope<User>>('/user')
    return response.data.data
  },
}

export default authService
