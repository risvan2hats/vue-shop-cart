import api from './api';

/**
 * Cart service for managing cart operations
 */
const cartService = {
    /**
     * Fetch the current cart
     */
    async getCart() {
        const response = await api.get('/cart');
        return response.data;
    },

    /**
     * Add an item to the cart
     * @param {number} productId - The ID of the product to add
     * @param {number} quantity - The quantity of the product to add
     * @param {number} variantId - The ID of the product variant (optional)
     */
    async addItem(productId, quantity = 1, variantId) {
        const response = await api.post('/cart/items', {
            product_id: productId,
            ...(variantId != null ? { variant_id: variantId } : {}),
            quantity,
        });

        return response.data;
    },

    /**
     * Update the quantity of an item in the cart
     * @param {number} cartItemId - The ID of the cart item to update
     * @param {number} quantity - The new quantity for the cart item
     */
    async updateItem(cartItemId, quantity) {
        const response = await api.patch(`/cart/items/${cartItemId}`, { quantity });
        return response.data;
    },

    /**
     * Remove an item from the cart
     * @param {number} cartItemId - The ID of the cart item to remove
     */
    async removeItem(cartItemId) {
        const response = await api.delete(`/cart/items/${cartItemId}`);
        return response.data;
    },

    /**
     * Clear the entire cart
     */
    async clearCart() {
        const response = await api.delete('/cart');
        return response.data;
    },
};

export default cartService;
