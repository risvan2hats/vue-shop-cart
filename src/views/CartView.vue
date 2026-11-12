<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/utils/product';

import '../styles/pages/cart.css';

const cartStore = useCartStore();

const subtotal = computed(() => cartStore.totalAmount);
const tax = computed(() => subtotal.value * cartStore.taxRate);
const total = computed(() => subtotal.value + tax.value + (subtotal.value > 0 ? cartStore.shipping : 0));

/**
 * Get current price of a cart item
 */
const getCurrentPrice = (item) => {
    return Number(
        item?.variant?.selling_price ?? item?.variant?.price ??
        item.product.selling_price ?? item.product.price ?? 0
    );
};

/**
 * Increase or decrease item quantity
 */
const changeQuantity = (item, amount) => {
    updateQuantity(item, Number(item.quantity) + amount);
};

/**
 * Update item quantity
 */
const updateQuantity = async (item, quantity) => {
    const newQuantity = Number(quantity);
    const stock = item.variant?.stock ?? item.product.stock;

    if (!Number.isInteger(newQuantity) || newQuantity < 1 || newQuantity > stock) {
        return;
    }

    try {
        await cartStore.updateItemQuantity(item.id, newQuantity);
    } catch (error) {
        console.error('Update cart quantity failed:', error);
    }
};

/**
 * Remove item from cart
 */
const removeItem = async (cartItemId) => {
    try {
        await cartStore.removeItem(cartItemId);
    } catch (error) {
        console.error('Remove cart item failed:', error);
    }
};
</script>

<template>
    <main class="container">
        <div class="page-title">
            <div class="breadcrumb">
                <RouterLink to="/">Home</RouterLink> / Cart
            </div>

            <div class="eyebrow">Almost yours</div>
            <h1>Your cart</h1>
            <p class="muted">Review your items before checking out.</p>
        </div>

        <div v-if="!cartStore.items.length" class="empty-state">
            <h2>Your cart is empty</h2>
            <p class="muted">Looks like you haven't added anything yet.</p>

            <RouterLink to="/products" class="button">
                Start shopping
            </RouterLink>
        </div>

        <div v-else class="cart-layout">
            <section>
                <article v-for="item in cartStore.items" :key="item.id" class="cart-item">
                    <div class="cart-thumb">
                        <RouterLink :to="{ name: 'product-details', params: { id: item.product_id } }"
                            :aria-label="`View ${item.product.title} details`">
                            <img :src="item.product.image_url || item.product.image" :alt="item.product.title">
                        </RouterLink>
                    </div>

                    <div>
                        <h3>
                            <RouterLink :to="{ name: 'product-details', params: { id: item.product_id } }">{{
                                item.product.title }}</RouterLink>
                        </h3>

                        <p class="muted">{{ item.product.category?.name || 'General' }}</p>

                        <p v-if="Object.keys(item.variant?.attributes || {}).length" class="muted">
                            <span v-for="(value, attribute) in (item.variant?.attributes || {})" :key="attribute">
                                {{ attribute }}: {{ value }}&nbsp;
                            </span>
                        </p>

                        <p class="price">{{ formatPrice(getCurrentPrice(item)) }}</p>

                        <label class="muted">Quantity</label>

                        <div class="quantity-control">
                            <button type="button" :disabled="item.quantity <= 1 || cartStore.updatingItemId === item.id"
                                @click="changeQuantity(item, -1)">−</button>
                            <input type="number" min="1" :max="item.variant?.stock ?? item.product.stock"
                                :value="item.quantity" :disabled="cartStore.updatingItemId === item.id"
                                @change="updateQuantity(item, $event.target.value)">
                            <button type="button"
                                :disabled="item.quantity >= (item.variant?.stock ?? item.product.stock) || cartStore.updatingItemId === item.id"
                                @click="changeQuantity(item, 1)"> +</button>
                        </div>
                    </div>

                    <div>
                        <strong>{{ formatPrice(getCurrentPrice(item) * item.quantity) }}</strong>
                        <p><button type="button" class="remove-link" @click="removeItem(item.id)">Remove</button></p>
                    </div>
                </article>

                <div class="actions">
                    <RouterLink to="/products" class="button secondary">Continue shopping</RouterLink>
                </div>
            </section>

            <aside class="summary">
                <h2>Order summary</h2>

                <div class="summary-line">
                    <span>Subtotal</span>
                    <strong>{{ formatPrice(subtotal) }}</strong>
                </div>

                <div class="summary-line">
                    <span>Estimated tax (8%)</span>
                    <strong>{{ formatPrice(tax) }}</strong>
                </div>

                <div class="summary-line">
                    <span>Shipping</span>
                    <strong>{{ formatPrice(shipping) }}</strong>
                </div>

                <div class="summary-line">
                    <span>Discount</span>
                    <strong>{{ formatPrice(0) }}</strong>
                </div>

                <div class="summary-line summary-total">
                    <span>Total</span>
                    <span>{{ formatPrice(total) }}</span>
                </div>

                <RouterLink to="/checkout" class="button checkout-submit">
                    Proceed to checkout
                </RouterLink>

                <p class="muted cart-disclaimer">Shipping and tax are estimates. Final amounts are confirmed at
                    checkout.</p>
            </aside>
        </div>
    </main>
</template>
