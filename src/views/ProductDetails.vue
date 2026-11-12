
<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import '@/styles/pages/product-detail.css';

import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import ProductListing from '@/components/ProductListing.vue';

import {
    getActiveVariants,
    getVariantAttributes,
    getVariantOptions,
    getSelectedVariant,
    getCurrentPrice,
    getOriginalPrice,
    hasDiscount,
    getProductStock,
    getProductImage,
    formatPrice,
} from '@/utils/product';

const route         = useRoute();
const productStore  = useProductStore();
const cartStore     = useCartStore();

const quantity              = ref(1);
const selectedAttributes    = ref({});

const product = computed(() => productStore.selectedProduct);

/**
 * Get active product variants.
 */
const activeVariants = computed(() => {
    return getActiveVariants(product.value);
});

/**
 * Get available variant attributes.
 */
const variantAttributes = computed(() => {
    return getVariantAttributes(product.value);
});

/**
 * Get selected product variant.
 */
const selectedVariant = computed(() => {
    return getSelectedVariant(product.value, selectedAttributes.value);
});

/**
 * Get current product price.
 */
const currentPrice = computed(() => {
    return getCurrentPrice(product.value, selectedVariant.value);
});

/**
 * Get original product price.
 */
const originalPrice = computed(() => {
    return getOriginalPrice(product.value, selectedVariant.value);
});

/**
 * Check product discount.
 */
const discounted = computed(() => {
    return hasDiscount(product.value, selectedVariant.value);
});

/**
 * Get available product stock.
 */
const currentStock = computed(() => {
    return getProductStock(product.value, selectedVariant.value);
});

/**
 * Check whether product is being added to cart.
 */
const isAddingToCart = computed(() => {
    return cartStore.addingProductId === product.value?.id;
});

/**
 * Check whether product can be added to cart.
 */
const canAddToCart = computed(() => {
    return currentStock.value > 0
        && quantity.value >= 1
        && quantity.value <= currentStock.value
        && (!activeVariants.value.length || !!selectedVariant.value)
        && !isAddingToCart.value;
});

/**
 * Get related products from already loaded products.
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
 * Load product details.
 */
const loadProduct = (id) => {
    quantity.value = 1;
    selectedAttributes.value = {};

    productStore.fetchProduct(id);
};

/**
 * Set default variant attributes when product changes.
 */
watch(product, () => {
    selectedAttributes.value = {
        ...(activeVariants.value[0]?.attributes || {}),
    };

    quantity.value = 1;
});

/**
 * Keep quantity within available stock.
 */
watch(currentStock, (stock) => {
    if (quantity.value > stock) {
        quantity.value = stock > 0 ? stock : 1;
    }
});

/**
 * Add product to cart.
 */
const addToCart = async () => {
    if (!canAddToCart.value) {
        return;
    }

    try {
        await cartStore.addToCart(
            product.value,
            quantity.value,
            selectedVariant.value
        );
    } catch (error) {
        console.error('Add to cart failed:', error);
    }
};

/**
 * Load product when the route ID changes.
 */
watch(
    () => route.params.id,
    (id) => {
        loadProduct(id);
    },
    { immediate: true }
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
        <div
            v-else-if="productStore.productNotFound || !product"
            class="empty-state"
        >
            <h2>Product not found</h2>

            <p>
                Sorry, we couldn't find the product you're looking for.
                It may have been removed or is no longer available.
            </p>

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
                            v-if="getProductImage(product)"
                            :src="getProductImage(product)"
                            :alt="product.title"
                        >
                    </div>
                </section>

                <section>
                    <span v-if="discounted" class="tag">SALE</span>

                    <div class="eyebrow" style="margin-top: 18px">
                        {{ product.category?.name || '' }}
                    </div>

                    <h1>{{ product.title }}</h1>

                    <p class="muted">{{ product.description }}</p>

                    <div class="detail-price">
                        {{ formatPrice(currentPrice) }}

                        <span v-if="discounted" class="old-price">
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

                    <!-- Product variants -->
                    <div
                        v-for="attribute in variantAttributes"
                        :key="attribute"
                        class="field"
                    >
                        <label :for="`variant-${attribute}`">
                            {{ attribute }}
                        </label>

                        <select
                            :id="`variant-${attribute}`"
                            v-model="selectedAttributes[attribute]"
                        >
                            <option
                                v-for="value in getVariantOptions(product, attribute)"
                                :key="value"
                                :value="value"
                            >
                                {{ value }}
                            </option>
                        </select>
                    </div>

                    <!-- Quantity -->
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

                    <!-- Product actions -->
                    <div class="actions">
                        <button
                            type="button"
                            :disabled="!canAddToCart"
                            @click="addToCart"
                        >
                            {{ isAddingToCart ? 'Adding...' : 'Add to cart' }}
                        </button>

                        <RouterLink class="button secondary" to="/cart">
                            View cart
                        </RouterLink>
                    </div>

                    <!-- Product details -->
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
                            {{ currentStock > 0 ? 'In stock' : 'Out of stock' }}
                        </p>
                    </div>
                </section>
            </div>

            <!-- Related products -->
            <section v-if="relatedProducts.length" class="section">
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