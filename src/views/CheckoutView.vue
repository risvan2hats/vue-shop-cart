<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useProduct } from '@/composables/useProduct';
import { showToast } from '@/composables/showToast';
import type { CartItem } from '@/types/cartTypes';
import '../styles/pages/checkout.css';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const { formatPrice } = useProduct();

const user = authStore.user;
const nameParts = (user?.name || '').trim().split(/\s+/);

const form = reactive({
  email: user?.email || '',
  phone: user?.phone || '',
  firstName: nameParts[0] || '',
  lastName: nameParts.slice(1).join(' '),
  address: user?.address || '',
  address2: '',
  city: '',
  region: '',
  postalCode: '',
  country: '',
  shipping: 'standard',
  paymentMethod: 'cod',
});

const submitting = ref(false);

const subtotal = computed(() => cartStore.totalAmount);

const shippingCost = computed(() => {
  return form.shipping === 'express' ? 12 : 5;
});

const tax = computed(() => subtotal.value * cartStore.taxRate);

const total = computed(() => {
  return subtotal.value + tax.value + shippingCost.value;
});

/**
 * Get current price of a cart item
 */
const getItemPrice = (item: CartItem) => {
  return Number(
    item?.variant?.selling_price ??
    item?.variant?.price ??
    item?.product?.selling_price ??
    item?.product?.price ??
    0
  );
};

onMounted(() => {
  cartStore.checkoutComplete = false;
});

const placeOrder = async () => {
  if (!cartStore.items.length) {
    showToast('Your cart is empty.', 'error');
    return;
  }

  submitting.value = true;

  try {
    await cartStore.clearCart();
    await router.push({ name: 'order-confirmation' });
  } catch {
    showToast('Unable to place order. Please try again.', 'error');
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <main class="container">
    <div class="page-title">
      <div class="breadcrumb">
        <RouterLink to="/">{{ $t('home') }}</RouterLink> /
        <RouterLink to="/cart">{{ $t('cart') }}</RouterLink> /
        {{ $t('checkout') }}
      </div>

      <div class="eyebrow">
        {{ $t('secure_checkout') }}
      </div>
      <h1>{{ $t('complete_your_order') }}</h1>
      <p class="muted">
        {{ $t('checkout_subtitle') }}
      </p>
    </div>

    <div
      v-if="!cartStore.items.length"
      class="empty-state"
    >
      <h2>{{ $t('your_cart_is_empty') }}</h2>
      <p class="muted">
        {{ $t('checkout_empty_subtitle') }}
      </p>

      <RouterLink
        to="/products"
        class="button"
      >
        {{ $t('continue_shopping') }}
      </RouterLink>
    </div>

    <form
      v-else
      class="checkout-grid"
      @submit.prevent="placeOrder"
    >
      <div>
        <!-- Contact information -->
        <section class="form-card">
          <h2>{{ $t('contact_information') }}</h2>

          <div class="form-grid">
            <div class="field">
              <label for="email">{{ $t('email_address_required') }}</label>
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                autocomplete="email"
                required
                placeholder="you@example.com"
              >
            </div>

            <div class="field">
              <label for="phone">{{ $t('phone_number_required') }}</label>
              <input
                id="phone"
                v-model.trim="form.phone"
                type="tel"
                autocomplete="tel"
                required
                placeholder="Phone number"
              >
            </div>
          </div>
        </section>

        <!-- Shipping address -->
        <section class="form-card">
          <h2>{{ $t('shipping_address') }}</h2>

          <div class="form-grid">
            <div class="field">
              <label for="firstName">{{ $t('first_name_required') }}</label>
              <input
                id="firstName"
                v-model.trim="form.firstName"
                autocomplete="given-name"
                required
              >
            </div>

            <div class="field">
              <label for="lastName">{{ $t('last_name_required') }}</label>
              <input
                id="lastName"
                v-model.trim="form.lastName"
                autocomplete="family-name"
                required
              >
            </div>
          </div>

          <div class="field">
            <label for="address">{{ $t('street_address_required') }}</label>
            <input
              id="address"
              v-model.trim="form.address"
              autocomplete="street-address"
              required
            >
          </div>

          <div class="field">
            <label for="address2">{{ $t('apartment_suite') }}</label>
            <input
              id="address2"
              v-model.trim="form.address2"
              autocomplete="address-line2"
            >
          </div>

          <div class="form-grid">
            <div class="field">
              <label for="city">{{ $t('city_required') }}</label>
              <input
                id="city"
                v-model.trim="form.city"
                autocomplete="address-level2"
                required
              >
            </div>

            <div class="field">
              <label for="region">{{ $t('state_province_required') }}</label>
              <input
                id="region"
                v-model.trim="form.region"
                autocomplete="address-level1"
                required
              >
            </div>

            <div class="field">
              <label for="postalCode">{{ $t('postal_code_required') }}</label>
              <input
                id="postalCode"
                v-model.trim="form.postalCode"
                autocomplete="postal-code"
                required
              >
            </div>

            <div class="field">
              <label for="country">{{ $t('country_required') }}</label>
              <select
                id="country"
                v-model="form.country"
                autocomplete="country-name"
                required
              >
                <option value="">
                  {{ $t('select_country') }}
                </option>
                <option value="India">
                  India
                </option>
                <option value="United States">
                  United States
                </option>
                <option value="United Kingdom">
                  United Kingdom
                </option>
                <option value="Canada">
                  Canada
                </option>
              </select>
            </div>
          </div>
        </section>

        <!-- Shipping method -->
        <section class="form-card">
          <h2>{{ $t('shipping_method') }}</h2>

          <label class="radio-card">
            <input
              v-model="form.shipping"
              type="radio"
              value="standard"
            >

            <span>
              <strong>{{ $t('standard_delivery') }}</strong>
              <br>
              <span class="muted">
                {{ $t('standard_delivery_desc', { price: formatPrice(5) }) }}
              </span>
            </span>
          </label>

          <label class="radio-card">
            <input
              v-model="form.shipping"
              type="radio"
              value="express"
            >

            <span>
              <strong>{{ $t('express_delivery') }}</strong>
              <br>
              <span class="muted">
                {{ $t('express_delivery_desc', { price: formatPrice(12) }) }}
              </span>
            </span>
          </label>
        </section>

        <!-- Payment method -->
        <section class="form-card">
          <h2>{{ $t('payment_method') }}</h2>

          <label class="radio-card">
            <input
              v-model="form.paymentMethod"
              type="radio"
              value="cod"
            >

            <span>
              <strong>{{ $t('cash_on_delivery') }}</strong>
              <br>
              <span class="muted">
                {{ $t('cod_description') }}
              </span>
            </span>
          </label>

          <p class="muted">
            {{ $t('payment_gateway_note') }}
          </p>
        </section>
      </div>

      <!-- Order summary -->
      <aside class="summary">
        <h2>{{ $t('order_summary') }}</h2>

        <div
          v-for="item in cartStore.items"
          :key="item.id || `${item.product_id}-${item.variant_id}`"
          class="summary-line"
        >
          <span>
            {{ item.product?.title || 'Product' }} × {{ item.quantity }}
          </span>

          <strong>
            {{ formatPrice(getItemPrice(item) * item.quantity) }}
          </strong>
        </div>

        <div class="summary-line">
          <span>{{ $t('subtotal') }}</span>
          <strong>{{ formatPrice(subtotal) }}</strong>
        </div>

        <div class="summary-line">
          <span>{{ $t('tax') }}</span>
          <strong>{{ formatPrice(tax) }}</strong>
        </div>

        <div class="summary-line">
          <span>{{ $t('shipping') }}</span>
          <strong>{{ formatPrice(shippingCost) }}</strong>
        </div>

        <div class="summary-line">
          <span>{{ $t('discount') }}</span>
          <strong>{{ formatPrice(0) }}</strong>
        </div>

        <div class="summary-line summary-total">
          <span>{{ $t('total') }}</span>
          <span>{{ formatPrice(total) }}</span>
        </div>

        <button
          type="submit"
          class="checkout-place-order"
          :disabled="submitting || !cartStore.items.length"
        >
          {{
            submitting
              ? $t('processing')
              : $t('place_order_with_total', { total: formatPrice(total) })
          }}
        </button>

        <p class="muted checkout-disclaimer">
          {{ $t('checkout_terms_disclaimer') }}
        </p>

        <RouterLink
          to="/cart"
          class="muted"
        >
          {{ $t('return_to_cart') }}
        </RouterLink>
      </aside>
    </form>
  </main>
</template>
