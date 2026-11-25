import api from './api'
import type { ApiEnvelope, AuthSession, LoginCredentials, User } from '@/types/authTypes'

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

  async updateLanguage(language: string) {
    const response = await api.patch<ApiEnvelope<User>>('/user', { language })
    return response.data.data
  },
}

export default authService
