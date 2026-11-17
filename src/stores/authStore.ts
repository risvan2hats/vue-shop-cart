import { defineStore } from 'pinia'
import authService, { type LoginCredentials, type User } from '@/services/authService'
import { useCartStore } from '@/stores/cartStore'
import { showToast } from '@/composables/showToast'

function readStoredUser(): User | null {
  const raw = localStorage.getItem('auth_user')
  if (!raw) return null
  return JSON.parse(raw) as User | null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: readStoredUser(),
    token: localStorage.getItem('auth_token'),
    loading: false,
    profileLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },

  actions: {
    /**
     * Log in a user with the provided credentials.
     */
    async login(credentials: LoginCredentials) {
      this.loading = true

      try {
        const response = await authService.login(credentials)
        const user = response.user
        const token = response.token

        this.user = user
        this.token = token

        localStorage.setItem('auth_user', JSON.stringify(user))
        localStorage.setItem('auth_token', token)

        const cartStore = useCartStore()
        await cartStore.mergeGuestCart()

        showToast('Signed in successfully.', 'success')
        return this.user
      } catch {
        showToast('Unable to sign in. Check your details and try again.', 'error')
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      this.profileLoading = true

      try {
        this.user = await authService.getProfile()
        localStorage.setItem('auth_user', JSON.stringify(this.user))
        return this.user
      } catch {
        showToast('Unable to load your profile. Please try again.', 'error')
        return null
      } finally {
        this.profileLoading = false
      }
    },

    /**
     * Log out the current user and clear authentication data.
     */
    logout() {
      this.user = null
      this.token = null

      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')

      const cartStore = useCartStore()
      cartStore.resetCart()
    },
  },
})
