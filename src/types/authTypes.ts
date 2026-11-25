export interface User {
  id?: number
  name?: string
  email?: string
  phone?: string | null
  address?: string | null
  language?: string | null
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
