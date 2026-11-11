import api from './api';

const cartService = {
    async getCart() {
        const response = await api.get('/cart');
        return response.data;
    },

    async clearCart() {
        const response = await api.delete('/cart');
        return response.data;
    },

    async addItem(productId, quantity = 1, variantId) {
        const response = await api.post('/cart/items', {
            product_id: productId,
            ...(variantId != null ? { variant_id: variantId } : {}),
            quantity,
        });

        return response.data;
    },

    async updateItem(cartItemId, quantity) {
        const response = await api.patch(`/cart/items/${cartItemId}`, { quantity });
        return response.data;
    },

    async removeItem(cartItemId) {
        const response = await api.delete(`/cart/items/${cartItemId}`);
        return response.data;
    },
};

export default cartService;
