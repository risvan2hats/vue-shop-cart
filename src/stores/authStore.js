import { defineStore } from 'pinia';
import authService from '@/services/authService';
import { showToast } from '@/composables/showToast';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
        token: localStorage.getItem('auth_token') || null,
        loading: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user,
    },

    actions: {

        /**
         * Log in a user with the provided credentials.
         * @param {Object} credentials - The user's login credentials.
         * @returns {Promise<Object>} - The logged-in user data.
         * @throws {Error} - If login fails, an error is thrown with a message.
         */
        async login(credentials) {
            this.loading = true;

            try {
                const response = await authService.login(credentials);

                this.user = response.user;
                this.token = response.token;

                localStorage.setItem('auth_user', JSON.stringify(this.user));
                localStorage.setItem('auth_token', this.token);

                showToast('Signed in successfully.', 'success');
                return this.user;
            } catch {
                showToast('Unable to sign in. Check your details and try again.', 'error');
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Log out the current user and clear authentication data.
         */
        logout() {
            this.user = null;
            this.token = null;

            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_token');
        },
    },
});
