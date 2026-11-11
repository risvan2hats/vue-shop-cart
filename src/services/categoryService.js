import api from './api';

const categoryService = {

    /**
     * Fetch categories
     */
    async getCategories(params = {}) {
        const response = await api.get('/categories', {
            params,
        });

        return response.data;
    },

};

export default categoryService;