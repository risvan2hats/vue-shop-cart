<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { useProduct } from '@/composables/useProduct';
import type { CartItem } from '@/types/cartTypes';

import '../styles/pages/cart.css';

const cartStore = useCartStore();
const { formatPrice } = useProduct();

const subtotal = computed(() => cartStore.totalAmount);
const tax = computed(() => subtotal.value * cartStore.taxRate);
const shipping = computed(() => (subtotal.value > 0 ? cartStore.shipping : 0));
const total = computed(() => subtotal.value + tax.value + shipping.value);

/**
 * Get current price of a cart item
 */
const getCurrentPrice = (item: CartItem) => {
    return Number(
        item?.variant?.selling_price ?? item?.variant?.price ??
        item?.product?.selling_price ?? item?.product?.price ?? 0
    );
};

const itemStock = (item: CartItem) => Number(item.variant?.stock ?? item.product?.stock ?? 0);

/**
 * Increase or decrease item quantity
 */
const changeQuantity = (item: CartItem, amount: number) => {
    updateQuantity(item, Number(item.quantity) + amount);
};

/**
 * Update item quantity
 */
const updateQuantity = async (item: CartItem, quantity: number | string) => {
    const newQuantity = Number(quantity);
    const stock = Number(item.variant?.stock ?? item.product?.stock ?? 999);

    if (!Number.isInteger(newQuantity) || newQuantity < 1 || newQuantity > stock) {
        return;
    }

    await cartStore.updateItemQuantity(item.id, newQuantity);
};

const onQuantityChange = (item: CartItem, event: Event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
        updateQuantity(item, target.value);
    }
};

/**
 * Remove item from cart
 */
const removeItem = async (cartItemId: number | string) => {
    await cartStore.removeItem(cartItemId);
};
</script>

<template>
  <main class="container">
    <div class="page-title">
      <div class="breadcrumb">
        <RouterLink to="/">{{ $t('home') }}</RouterLink> / {{ $t('cart') }}
      </div>

      <div class="eyebrow">
        {{ $t('almost_yours') }}
      </div>
      <h1>{{ $t('your_cart') }}</h1>
      <p class="muted">
        {{ $t('review_items_before_checkout') }}
      </p>
    </div>

    <div
      v-if="!cartStore.items.length"
      class="empty-state"
    >
      <h2>{{ $t('your_cart_is_empty') }}</h2>
      <p class="muted">
        {{ $t('cart_empty_subtitle') }}
      </p>

      <RouterLink
        to="/products"
        class="button"
      >
        {{ $t('start_shopping') }}
      </RouterLink>
    </div>

    <div
      v-else
      class="cart-layout"
    >
      <section>
        <article
          v-for="item in cartStore.items"
          :key="item.id"
          class="cart-item"
        >
          <div class="cart-thumb">
            <RouterLink
              :to="{ name: 'product-details', params: { id: item.product_id } }"
              :aria-label="`View ${item.product?.title || 'product'} details`"
            >
              <img
                :src="item.product?.image_url || item.product?.image || ''"
                :alt="item.product?.title || 'Product'"
              >
            </RouterLink>
          </div>

          <div>
            <h3>
              <RouterLink :to="{ name: 'product-details', params: { id: item.product_id } }">{{
                item.product?.title || 'Product' }}</RouterLink>
            </h3>

            <p class="muted">
              {{ item.product?.category?.name || $t('general') }}
            </p>

            <p
              v-if="Object.keys(item.variant?.attributes || {}).length"
              class="muted"
            >
              <span
                v-for="(value, attribute) in (item.variant?.attributes || {})"
                :key="attribute"
              >
                {{ attribute }}: {{ value }}&nbsp;
              </span>
            </p>

            <p class="price">
              {{ formatPrice(getCurrentPrice(item)) }}
            </p>

            <label class="muted">{{ $t('quantity') }}</label>

            <div class="quantity-control">
              <button
                type="button"
                :disabled="item.quantity <= 1 || cartStore.updatingItemId === item.id"
                @click="changeQuantity(item, -1)"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                :max="itemStock(item)"
                :value="item.quantity"
                :disabled="cartStore.updatingItemId === item.id"
                @change="onQuantityChange(item, $event)"
              >
              <button
                type="button"
                :disabled="item.quantity >= itemStock(item) || cartStore.updatingItemId === item.id"
                @click="changeQuantity(item, 1)"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <strong>{{ formatPrice(getCurrentPrice(item) * item.quantity) }}</strong>
            <p>
              <button
                type="button"
                class="remove-link"
                :disabled="cartStore.removingItemId === item.id"
                @click="removeItem(item.id)"
              >
                {{ cartStore.removingItemId === item.id ? $t('removing') : $t('remove') }}
              </button>
            </p>
          </div>
        </article>

        <div class="actions">
          <RouterLink
            to="/products"
            class="button secondary"
          >{{ $t('continue_shopping') }}</RouterLink>
        </div>
      </section>

      <aside class="summary">
        <h2>{{ $t('order_summary') }}</h2>

        <div class="summary-line">
          <span>{{ $t('subtotal') }}</span>
          <strong>{{ formatPrice(subtotal) }}</strong>
        </div>

        <div class="summary-line">
          <span>{{ $t('estimated_tax') }}</span>
          <strong>{{ formatPrice(tax) }}</strong>
        </div>

        <div class="summary-line">
          <span>{{ $t('shipping') }}</span>
          <strong>{{ formatPrice(shipping) }}</strong>
        </div>

        <div class="summary-line">
          <span>{{ $t('discount') }}</span>
          <strong>{{ formatPrice(0) }}</strong>
        </div>

        <div class="summary-line summary-total">
          <span>{{ $t('total') }}</span>
          <span>{{ formatPrice(total) }}</span>
        </div>

        <RouterLink
          to="/checkout"
          class="button checkout-submit"
        >
          {{ $t('proceed_to_checkout') }}
        </RouterLink>

        <p class="muted cart-disclaimer">
          {{ $t('cart_disclaimer') }}
        </p>
      </aside>
    </div>
  </main>
</template>
