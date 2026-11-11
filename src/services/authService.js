import api from './api';

const authService = {
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        return response.data.data;
    },
};

export default authService;