<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import '../styles/pages/cart.css';

const cartStore = useCartStore();

const taxRate = 0.08;
const shipping = 5;

const subtotal = computed(() => cartStore.totalAmount);

const tax = computed(() => subtotal.value * taxRate);

const total = computed(() => subtotal.value + tax.value + (subtotal.value > 0 ? shipping : 0));

const getCurrentPrice = (item) => {
    return Number(
        item?.variant?.selling_price ??
        item?.variant?.price ??
        item.product.current_price ?? item.product.selling_price ?? item.product.price ?? 0
    );
};

const getVariantAttributes = (item) => item.variant?.attributes || {};

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(price || 0));
};

const updateQuantity = async (item, quantity) => {
    const newQuantity = Number(quantity);

    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
        return;
    }

    const stock = item.variant?.stock ?? item.product.stock;
    if (newQuantity > stock) {
        return;
    }

    try {
        await cartStore.updateItemQuantity(item.id, newQuantity);
    } catch (error) {
        console.error('Update cart quantity failed:', error);
    }
};

const increaseQuantity = (item) => {
    if (item.quantity < (item.variant?.stock ?? item.product.stock)) {
        updateQuantity(item, Number(item.quantity) + 1);
    }
};

const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
        updateQuantity(item, Number(item.quantity) - 1);
    }
};

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
                <p v-if="cartStore.error" class="error-state" role="alert">
                    {{ cartStore.error }}
                </p>

                <article v-for="item in cartStore.items" :key="item.id" class="cart-item">
                    <div class="cart-thumb">
                        <RouterLink
                            :to="{ name: 'product-details', params: { id: item.product_id } }"
                            :aria-label="`View ${item.product.title} details`"
                        >
                            <img :src="item.product.image_url || item.product.image" :alt="item.product.title">
                        </RouterLink>
                    </div>

                    <div>
                        <h3>
                            <RouterLink :to="{ name: 'product-details', params: { id: item.product_id } }">
                                {{ item.product.title }}
                            </RouterLink>
                        </h3>

                        <p class="muted">
                            {{ item.product.category?.name || 'General' }}
                        </p>

                        <p v-if="Object.keys(getVariantAttributes(item)).length" class="muted">
                            <span
                                v-for="(value, attribute) in getVariantAttributes(item)"
                                :key="attribute"
                            >
                                {{ attribute }}: {{ value }}&nbsp;
                            </span>
                        </p>

                        <p class="price">
                            {{ formatPrice(getCurrentPrice(item)) }}
                        </p>

                        <label class="muted">Quantity</label>

                        <div class="quantity-control">
                            <button type="button" :disabled="item.quantity <= 1 || cartStore.updatingItemId === item.id" @click="decreaseQuantity(item)">
                                −
                            </button>

                            <input type="number" min="1" :max="item.variant?.stock ?? item.product.stock" :value="item.quantity"
                                :disabled="cartStore.updatingItemId === item.id"
                                @change="updateQuantity(item, $event.target.value)">

                            <button type="button" :disabled="item.quantity >= (item.variant?.stock ?? item.product.stock) || cartStore.updatingItemId === item.id"
                                @click="increaseQuantity(item)">
                                +
                            </button>
                        </div>
                    </div>

                    <div>
                        <strong>
                            {{ formatPrice(getCurrentPrice(item) * item.quantity) }}
                        </strong>

                        <p>
                            <button type="button" class="remove-link" @click="removeItem(item.id)">
                                Remove
                            </button>
                        </p>
                    </div>
                </article>

                <div class="actions">
                    <RouterLink to="/products" class="button secondary">
                        Continue shopping
                    </RouterLink>
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

                <p class="muted cart-disclaimer">
                    Shipping and tax are estimates. Final amounts are confirmed
                    at checkout.
                </p>
            </aside>
        </div>
    </main>
</template>
