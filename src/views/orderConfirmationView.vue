<script setup>
import { useCartStore } from '@/stores/cartStore';
import '../styles/pages/order-confirmation.css';

const cartStore = useCartStore();
</script>

<template>
    <main class="container">
        <section v-if="cartStore.order" class="success">
            <div class="success-icon" aria-hidden="true">✓</div>
            <div class="eyebrow">Order confirmed</div>
            <h1>Thank you for your order!</h1>
            <p class="muted">Your demo order was accepted. No payment was processed.</p>
            <RouterLink class="button" to="/products">Continue shopping</RouterLink>
        </section>

        <section v-else class="empty-state">
            <h1>Order details unavailable</h1>
            <p class="muted">Place an order to view its confirmation.</p>
            <RouterLink class="button" to="/cart">Return to cart</RouterLink>
        </section>
    </main>
</template>
