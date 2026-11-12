import { defineStore } from 'pinia';

import cartService from '@/services/cartService';
import checkoutService from '@/services/checkoutService';

import { getCurrentPrice } from '@/utils/product';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        addingProductId: null,
        updatingItemId: null,
        error: null,
        checkoutComplete: false,
        taxRate: 0.08,
        shipping: 5,
    }),

    getters: {
        totalItems: (state) => {
            return state.items.reduce(
                (total, item) => total + Number(item.quantity || 0),
                0
            );
        },

        totalAmount: (state) => {
            return state.items.reduce((total, item) => {
                const price = getCurrentPrice(item.product, item.variant);

                return total + price * Number(item.quantity || 0);
            }, 0);
        },
    },

    actions: {
        /**
         * Fetch the cart items from the server.
         */
        async fetchCart() {
            this.error = null;

            try {
                const response = await cartService.getCart();
                const data = response.data?.data ?? response.data;

                this.items = Array.isArray(data)
                    ? data
                    : data?.items || [];

                return this.items;
            } catch (error) {
                console.error('Fetch cart failed:', error);
            }
        },

        /**
         * Add a product to the cart.
         */
        async addToCart(product, quantity = 1, variant = null) {
            if (!product?.id || !Number.isInteger(quantity) || quantity < 1) {
                return;
            }

            this.addingProductId = product.id;
            this.error = null;

            try {
                const response = await cartService.addItem(
                    product.id,
                    quantity,
                    variant?.id
                );

                const existingItem = this.items.find((item) => {
                    const sameProduct = String(item.product_id) === String(product.id);
                    const existingVariantId = item.variant_id ?? item.variant?.id;
                    const sameVariant = String(existingVariantId ?? '') === String(variant?.id ?? '');

                    return sameProduct && sameVariant;
                });

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    this.items.push({
                        id: response.id || `${product.id}-${variant?.id || 'default'}`,
                        product_id: product.id,
                        quantity,
                        product,
                        variant_id: variant?.id ?? null,
                        variant,
                    });
                }

                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Unable to add product to cart. Please try again.';

                throw error;
            } finally {
                this.addingProductId = null;
            }
        },

        /**
         * Remove an item from the cart.
         */
        async removeItem(cartItemId) {
            this.error = null;

            try {
                await cartService.removeItem(cartItemId);

                this.items = this.items.filter(
                    (item) => String(item.id) !== String(cartItemId)
                );
            } catch (error) {
                this.error = error.response?.data?.message
                    || 'Unable to remove item from cart. Please try again.';

                throw error;
            }
        },

        /**
         * Update the quantity of a cart item.
         */
        async updateItemQuantity(cartItemId, quantity) {
            const item = this.items.find(
                (cartItem) => String(cartItem.id) === String(cartItemId)
            );

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

        /**
         * Clear the cart after a successful checkout.
         */
        async clearCart() {
            if (!this.items.length) {
                throw new Error('Your cart is empty.');
            }

            this.error = null;
            try {
                await checkoutService.clearCart();
                this.items = [];
                this.checkoutComplete = true;
            } catch (error) {
                this.error = error.message
                    || 'Unable to place your order. Please try again.';

                throw error;
            }
        },
    },
});
