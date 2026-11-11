<script setup>
import { computed, reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import '../styles/pages/checkout.css';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const taxRate = 0.08;

const user = authStore.user || {};
const nameParts = (user.name || '').trim().split(/\s+/);

const form = reactive({
    email: user.email || '',
    phone: user.phone || '',
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' '),
    address: user.address || '',
    address2: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    shipping: 'standard',
    paymentMethod: 'cod',
});

const submitting = ref(false);
const submitError = ref('');

const subtotal = computed(() => cartStore.totalAmount);

const shippingCost = computed(() => {
    return form.shipping === 'express' ? 12 : 5;
});

const tax = computed(() => subtotal.value * taxRate);

const total = computed(() => {
    return subtotal.value + tax.value + shippingCost.value;
});

const getCurrentPrice = (product) => {
    return Number(
        product.current_price ??
        product.selling_price ??
        product.price ??
        0
    );
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(price || 0));
};

const placeOrder = async () => {
    submitError.value = '';

    if (!cartStore.items.length) {
        submitError.value = 'Your cart is empty.';
        return;
    }

    submitting.value = true;

    try {
        const orderData = {
            contact: {
                email: form.email,
                phone: form.phone,
            },
            shipping_address: {
                first_name: form.firstName,
                last_name: form.lastName,
                address: form.address,
                address2: form.address2,
                city: form.city,
                region: form.region,
                postal_code: form.postalCode,
                country: form.country,
            },
            shipping_method: form.shipping,
            payment_method: form.paymentMethod,
        };

        const order = await cartStore.placeOrder(orderData);
        await router.push({ name: 'order-confirmation', query: { id: order.id } });
    } catch (error) {
        submitError.value = error.message
            || error.response?.data?.message
            || 'Unable to place your order. Please try again.';
    } finally {
        submitting.value = false;
    }
};
</script>

<template>
    <main class="container">
        <div class="page-title">
            <div class="breadcrumb">
                <RouterLink to="/">Home</RouterLink> /
                <RouterLink to="/cart">Cart</RouterLink> /
                Checkout
            </div>

            <div class="eyebrow">Secure checkout</div>
            <h1>Complete your order</h1>
            <p class="muted">
                You're just a few details away from your order.
            </p>
        </div>

        <div v-if="!cartStore.items.length" class="empty-state">
            <h2>Your cart is empty</h2>
            <p class="muted">
                Add some products before proceeding to checkout.
            </p>

            <RouterLink to="/products" class="button">
                Continue shopping
            </RouterLink>
        </div>

        <form v-else class="checkout-grid" @submit.prevent="placeOrder">
            <div>
                <!-- Contact information -->
                <section class="form-card">
                    <h2>Contact information</h2>

                    <div class="form-grid">
                        <div class="field">
                            <label for="email">Email address *</label>
                            <input id="email" v-model.trim="form.email" type="email" autocomplete="email" required
                                placeholder="you@example.com">
                        </div>

                        <div class="field">
                            <label for="phone">Phone number *</label>
                            <input id="phone" v-model.trim="form.phone" type="tel" autocomplete="tel" required
                                placeholder="Phone number">
                        </div>
                    </div>
                </section>

                <!-- Shipping address -->
                <section class="form-card">
                    <h2>Shipping address</h2>

                    <div class="form-grid">
                        <div class="field">
                            <label for="firstName">First name *</label>
                            <input id="firstName" v-model.trim="form.firstName" autocomplete="given-name" required>
                        </div>

                        <div class="field">
                            <label for="lastName">Last name *</label>
                            <input id="lastName" v-model.trim="form.lastName" autocomplete="family-name" required>
                        </div>
                    </div>

                    <div class="field">
                        <label for="address">Street address *</label>
                        <input id="address" v-model.trim="form.address" autocomplete="street-address" required>
                    </div>

                    <div class="field">
                        <label for="address2">Apartment, suite, etc.</label>
                        <input id="address2" v-model.trim="form.address2" autocomplete="address-line2">
                    </div>

                    <div class="form-grid">
                        <div class="field">
                            <label for="city">City *</label>
                            <input id="city" v-model.trim="form.city" autocomplete="address-level2" required>
                        </div>

                        <div class="field">
                            <label for="region">State / Province *</label>
                            <input id="region" v-model.trim="form.region" autocomplete="address-level1" required>
                        </div>

                        <div class="field">
                            <label for="postalCode">Postal code *</label>
                            <input id="postalCode" v-model.trim="form.postalCode" autocomplete="postal-code" required>
                        </div>

                        <div class="field">
                            <label for="country">Country *</label>
                            <select id="country" v-model="form.country" autocomplete="country-name" required>
                                <option value="">Select country</option>
                                <option value="India">India</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>
                            </select>
                        </div>
                    </div>
                </section>

                <!-- Shipping method -->
                <section class="form-card">
                    <h2>Shipping method</h2>

                    <label class="radio-card">
                        <input v-model="form.shipping" type="radio" value="standard">

                        <span>
                            <strong>Standard delivery</strong>
                            <br>
                            <span class="muted">
                                3–5 business days · {{ formatPrice(5) }}
                            </span>
                        </span>
                    </label>

                    <label class="radio-card">
                        <input v-model="form.shipping" type="radio" value="express">

                        <span>
                            <strong>Express delivery</strong>
                            <br>
                            <span class="muted">
                                1–2 business days · {{ formatPrice(12) }}
                            </span>
                        </span>
                    </label>
                </section>

                <!-- Payment method -->
                <section class="form-card">
                    <h2>Payment method</h2>

                    <label class="radio-card">
                        <input v-model="form.paymentMethod" type="radio" value="cod">

                        <span>
                            <strong>Cash on Delivery</strong>
                            <br>
                            <span class="muted">
                                Pay when your order arrives.
                            </span>
                        </span>
                    </label>

                    <p class="muted">
                        Online payment can be added later by integrating a
                        payment gateway.
                    </p>
                </section>
            </div>

            <!-- Order summary -->
            <aside class="summary">
                <h2>Order summary</h2>

                <div v-for="item in cartStore.items" :key="item.product_id" class="summary-line">
                    <span>
                        {{ item.product.title }} × {{ item.quantity }}
                    </span>

                    <strong>
                        {{
                            formatPrice(
                                getCurrentPrice(item.product) * item.quantity
                            )
                        }}
                    </strong>
                </div>

                <div class="summary-line">
                    <span>Subtotal</span>
                    <strong>{{ formatPrice(subtotal) }}</strong>
                </div>

                <div class="summary-line">
                    <span>Tax (8%)</span>
                    <strong>{{ formatPrice(tax) }}</strong>
                </div>

                <div class="summary-line">
                    <span>Shipping</span>
                    <strong>{{ formatPrice(shippingCost) }}</strong>
                </div>

                <div class="summary-line">
                    <span>Discount</span>
                    <strong>{{ formatPrice(0) }}</strong>
                </div>

                <div class="summary-line summary-total">
                    <span>Total</span>
                    <span>{{ formatPrice(total) }}</span>
                </div>

                <p v-if="submitError" class="error-state" role="alert">
                    {{ submitError }}
                </p>

                <button type="submit" class="checkout-place-order" :disabled="submitting || !cartStore.items.length">
                    {{
                        submitting
                            ? 'Processing...'
                            : `Place order · ${formatPrice(total)}`
                    }}
                </button>

                <p class="muted checkout-disclaimer">
                    By placing your order, you agree to our terms and
                    privacy policy.
                </p>

                <RouterLink to="/cart" class="muted">
                    Return to cart
                </RouterLink>
            </aside>
        </form>
    </main>
</template>
