import { defineStore } from 'pinia';
import cartService from '@/services/cartService';
import checkoutService from '@/services/checkoutService';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        addingProductId: null,
        updatingItemId: null,
        error: null,
        order: null,
    }),

    getters: {
        totalItems: (state) => state.items.length,

        totalAmount: (state) => {
            return state.items.reduce((total, item) => {
                const price = Number(
                    item.variant?.selling_price ??
                    item.variant?.price ??
                    item.product.current_price ??
                    item.product.selling_price ??
                    item.product.price ??
                    0
                );

                return total + price * item.quantity;
            }, 0);
        },
    },

    actions: {
        async fetchCart() {
            try {
                const response = await cartService.getCart();
                const data = response.data?.data ?? response.data;
                this.items = Array.isArray(data) ? data : data?.items || [];
            } catch (error) {
                console.error('Fetch cart failed:', error);
            }
        },
        async addToCart(product, quantity = 1, variant = null) {
            this.addingProductId = product.id;
            this.error = null;

            try {
                const response = await cartService.addItem(
                    product.id,
                    quantity,
                    variant?.id,
                );

                const existingItem = this.items.find(
                    (item) => item.product_id === product.id
                        && (item.variant_id ?? item.variant?.id) === variant?.id
                );

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    this.items.push({
                        id: response.id || `${product.id}-${variant?.id || 'default'}`,
                        product_id: product.id,
                        quantity,
                        product,
                        variant_id: variant?.id,
                        variant,
                    });
                }

                return response;
            } catch (error) {
                this.error = error.response?.data?.message
                    || 'Unable to add product to cart. Please try again.';

                throw error;
            } finally {
                this.addingProductId = null;
            }
        },
        async removeItem(cartItemId) {
            this.error = null;

            try {
                await cartService.removeItem(cartItemId);
                this.items = this.items.filter((item) => item.id !== cartItemId);
            } catch (error) {
                this.error = error.response?.data?.message
                    || 'Unable to remove item from cart. Please try again.';

                throw error;
            }
        },
        async updateItemQuantity(cartItemId, quantity) {
            const item = this.items.find((cartItem) => cartItem.id === cartItemId);
            if (!item || !Number.isInteger(quantity) || quantity < 1) {
                return;
            }

            this.error = null;
            this.updatingItemId = cartItemId;

            try {
                await cartService.updateItem(cartItemId, quantity);
                item.quantity = quantity;
            } catch (error) {
                this.error = error.response?.data?.message
                    || 'Unable to update item quantity. Please try again.';

                throw error;
            } finally {
                this.updatingItemId = null;
            }
        },
        async placeOrder(details) {
            if (!this.items.length) {
                throw new Error('Your cart is empty.');
            }

            this.error = null;
            try {
                const order = await checkoutService.placeOrder(this.items, details);
                this.order = order;
                this.items = [];
                return order;
            } catch (error) {
                this.error = error.message || 'Unable to place your order. Please try again.';
                throw error;
            }
        },
    },
});
