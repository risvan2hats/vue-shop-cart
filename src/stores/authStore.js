import { defineStore } from 'pinia';
import authService from '@/services/authService';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
        token: localStorage.getItem('auth_token') || null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user,
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;

            try {
                const response = await authService.login(credentials);

                this.user = response.user;
                this.token = response.token;

                localStorage.setItem('auth_user', JSON.stringify(response.user));
                localStorage.setItem('auth_token', response.token);

                return response.user;
            } catch (error) {
                this.error = error.response?.data?.message
                    || 'Invalid email or password. Please try again.';

                throw error;
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            this.error = null;

            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_token');
        },
    },
});
