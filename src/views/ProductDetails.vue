
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import '@/styles/pages/product-detail.css';

import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import ProductListing from '@/components/ProductListing.vue';

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const quantity = ref(1);
const selectedAttributes = ref({});

const product = computed(() => productStore.selectedProduct);
const activeVariants = computed(() => (
    (product.value?.variants || []).filter((variant) => variant.is_active !== false)
));
const variantAttributes = computed(() => [
    ...new Set(activeVariants.value.flatMap((variant) => Object.keys(variant.attributes || {}))),
]);
const selectedVariant = computed(() => activeVariants.value.find((variant) =>
    Object.entries(selectedAttributes.value).every(
        ([key, value]) => variant.attributes?.[key] === value
    ) && Object.keys(selectedAttributes.value).length === Object.keys(variant.attributes || {}).length
));
const currentStock = computed(() => activeVariants.value.length
    ? selectedVariant.value?.stock ?? 0
    : product.value?.stock ?? 0);
const originalPrice = computed(() => selectedVariant.value?.price ?? product.value?.price);

/**
 * Get current selling price
 */
const getCurrentPrice = (item) => {
    const variant = item === product.value ? selectedVariant.value : null;
    return Number(
        variant?.selling_price ??
        variant?.price ??
        item.current_price ?? item.selling_price ?? item.price ?? 0
    );
};

/**
 * Check product discount
 */
const hasDiscount = (item) => {
    return getCurrentPrice(item) < Number(originalPrice.value || item.price || 0);
};

/**
 * Format product price
 */
const formatPrice = (price) => {
    return productStore.formatPrice(price);
};

/**
 * Get related products from already loaded products
 */
const relatedProducts = computed(() => {
    if (!product.value) {
        return [];
    }

    return productStore.products
        .filter((item) =>
            item.id !== product.value.id &&
            item.category_id === product.value.category_id
        )
        .slice(0, 4);
});

/**
 * Load product details
 */
const loadProduct = (id) => {
    quantity.value = 1;
    selectedAttributes.value = {};
    productStore.fetchProduct(id);
};

watch(product, (value) => {
    selectedAttributes.value = {
        ...(activeVariants.value[0]?.attributes || {}),
    };
});

const addToCart = async () => {
    try {
        await cartStore.addToCart(product.value, quantity.value, selectedVariant.value || null);
    } catch (error) {
        console.error('Add to cart failed:', error);
    }
};

onMounted(() => {
    loadProduct(route.params.id);
});

/**
 * Reload when the route product ID changes
 */
watch(
    () => route.params.id,
    (id) => {
        loadProduct(id);
    }
);
</script>

<template>
    <main class="container section">

        <!-- Loading -->
        <div v-if="productStore.productLoading" class="loading-state">
            Loading product...
        </div>

        <!-- Error -->
        <div v-else-if="productStore.productError" class="error-state">
            <p>{{ productStore.productError }}</p>

            <button @click="loadProduct(route.params.id)">
                Try again
            </button>
        </div>

        <!-- Product not found -->
        <div v-else-if="!product" class="empty-state">
            <h2>Product not found</h2>
            <p>The product you're looking for is unavailable.</p>

            <RouterLink class="button" to="/products">
                Back to shop
            </RouterLink>
        </div>

        <!-- Product details -->
        <template v-else>
            <div class="breadcrumb">
                <RouterLink to="/">Home</RouterLink> /
                <RouterLink to="/products">Shop</RouterLink> /
                {{ product.title }}
            </div>

            <div class="detail-grid">
                <section>
                    <div class="gallery-main">
                        <img
                            v-if="product.image_url || product.image"
                            :src="product.image_url || product.image"
                            :alt="product.title"
                        >
                    </div>
                </section>

                <section>
                    <span
                        v-if="hasDiscount(product)"
                        class="tag"
                    >
                        SALE
                    </span>

                    <div class="eyebrow" style="margin-top: 18px">
                        {{ product.category?.name || 'Northstar essentials' }}
                    </div>

                    <h1>{{ product.title }}</h1>

                    <p class="muted">
                        {{ product.description }}
                    </p>

                    <div class="detail-price">
                        {{ formatPrice(getCurrentPrice(product)) }}

                        <span
                            v-if="hasDiscount(product)"
                            class="old-price"
                        >
                            {{ formatPrice(originalPrice) }}
                        </span>
                    </div>

                    <p class="stock">
                        <template v-if="currentStock > 0">
                            ✓ In stock · {{ currentStock }} available
                        </template>

                        <template v-else>
                            Currently out of stock
                        </template>
                    </p>

                    <hr style="border: 0; border-top: 1px solid var(--line); margin: 22px 0">

                    <div v-for="attribute in variantAttributes" :key="attribute" class="field">
                        <label :for="`variant-${attribute}`">{{ attribute }}</label>
                        <select :id="`variant-${attribute}`" v-model="selectedAttributes[attribute]">
                            <option
                                v-for="value in [...new Set(activeVariants.map(variant => variant.attributes?.[attribute]).filter(value => value != null))]"
                                :key="value"
                                :value="value"
                            >
                                {{ value }}
                            </option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="quantity">Quantity</label>

                        <input
                            id="quantity"
                            v-model.number="quantity"
                            class="qty"
                            type="number"
                            min="1"
                            :max="currentStock"
                            :disabled="currentStock < 1"
                        >
                    </div>

                    <div class="actions">
                        <button
                            type="button"
                            :disabled="currentStock < 1 || (activeVariants.length > 0 && !selectedVariant) || cartStore.addingProductId === product.id"
                            @click="addToCart"
                        >
                            {{ cartStore.addingProductId === product.id ? 'Adding...' : 'Add to cart' }}
                        </button>

                        <RouterLink
                            class="button secondary"
                            to="/cart"
                        >
                            View cart
                        </RouterLink>
                    </div>

                    <div style="margin-top: 30px">
                        <h3>Product details</h3>

                        <p class="muted">
                            {{ product.description }}
                        </p>

                        <p>
                            <strong>Category:</strong>
                            {{ product.category?.name || 'General' }}
                            <br>

                            <strong>SKU:</strong>
                            {{ product.sku || 'N/A' }}
                            <br>

                            <strong>Availability:</strong>
                            {{ product.stock > 0 ? 'In stock' : 'Out of stock' }}
                        </p>
                    </div>
                </section>
            </div>

            <!-- Related products -->
            <section
                v-if="relatedProducts.length"
                class="section"
            >
                <div class="section-head">
                    <div>
                        <div class="eyebrow">You may also like</div>
                        <h2>Related products</h2>
                    </div>

                    <RouterLink
                        :to="{
                            name: 'products',
                            query: { category: product.category?.slug }
                        }"
                    >
                        View all →
                    </RouterLink>
                </div>

                <ProductListing :products="relatedProducts" />
            </section>
        </template>
    </main>
</template>
