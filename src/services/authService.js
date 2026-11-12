import api from './api';

/**
 * Authentication service for handling user login and authentication-related API calls.
 */
const authService = {
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        return response.data.data;
    },
};

export default authService;