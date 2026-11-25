<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore';
import '../styles/pages/order-confirmation.css';

const cartStore = useCartStore();
</script>

<template>
  <main class="container">
    <section
      v-if="cartStore.checkoutComplete"
      class="success"
    >
      <div
        class="success-icon"
        aria-hidden="true"
      >
        ✓
      </div>
      <div class="eyebrow">
        {{ $t('order_confirmed') }}
      </div>
      <h1>{{ $t('thank_you_for_order') }}</h1>
      <RouterLink
        class="button"
        to="/products"
      >{{ $t('continue_shopping') }}</RouterLink>
    </section>

    <section
      v-else
      class="empty-state"
    >
      <h1>{{ $t('order_details_unavailable') }}</h1>
      <p class="muted">
        {{ $t('order_details_unavailable_desc') }}
      </p>
      <RouterLink
        class="button"
        to="/cart"
      >{{ $t('return_to_cart') }}</RouterLink>
    </section>
  </main>
</template>
