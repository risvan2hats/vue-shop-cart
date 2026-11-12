import api from './api';

const productService = {

    /**
     * Fetch paginated products
     */
    async getProducts(params = {}) {
        const response = await api.get('/products', {
            params,
        });

        return response.data;
    },

    /**
     * Fetch a single product by ID
     */
    async getProduct(id) {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

};

export default productService;