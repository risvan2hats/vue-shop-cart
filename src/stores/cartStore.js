import { defineStore } from 'pinia';

import cartService from '@/services/cartService';
import checkoutService from '@/services/checkoutService';

import { useProduct } from '@/composables/useProduct';
import { showToast } from '@/composables/showToast';

const { getCurrentPrice } = useProduct();

const taxRate = Number(import.meta.env.VITE_TAX_RATE ?? 0.08);
const shipping = Number(import.meta.env.VITE_SHIPPING_COST ?? 5);

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        addingProductId: null,
        updatingItemId: null,
        checkoutComplete: false,
        taxRate,
        shipping,
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
            try {
                const response = await cartService.getCart();
                const data = response.data?.data ?? response.data;

                this.items = Array.isArray(data)
                    ? data
                    : data?.items || [];

                return this.items;
            } catch {
                showToast('Unable to load your cart. Please try again.', 'error');
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
                    existingItem.product = product;
                    existingItem.variant = variant;
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

                showToast('Added to cart.', 'success');
                return response;
            } catch {
                showToast('Unable to add product to cart. Please try again.', 'error');
                return false;
            } finally {
                this.addingProductId = null;
            }
        },

        /**
         * Remove an item from the cart.
         */
        async removeItem(cartItemId) {
            try {
                await cartService.removeItem(cartItemId);

                this.items = this.items.filter(
                    (item) => String(item.id) !== String(cartItemId)
                );
                showToast('Removed from cart.', 'success');
                return true;
            } catch {
                showToast('Unable to remove item from cart. Please try again.', 'error');
                return false;
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
                return false;
            }

            this.updatingItemId = cartItemId;

            try {
                await cartService.updateItem(cartItemId, quantity);
                item.quantity = quantity;
                showToast('Cart quantity updated.', 'success');
                return true;
            } catch {
                showToast('Unable to update item quantity. Please try again.', 'error');
                return false;
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

            try {
                await checkoutService.clearCart();
                this.items = [];
                this.checkoutComplete = true;
                showToast('Order placed successfully.', 'success');
                return true;
            } catch {
                showToast('Unable to clear the cart. Please try again.', 'error');
                return false;
            }
        },
    },
});
