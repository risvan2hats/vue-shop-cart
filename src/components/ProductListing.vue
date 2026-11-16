
<script setup>
import { reactive, watch } from 'vue';

import { useCartStore } from '@/stores/cartStore';
import { useProduct } from '@/composables/useProduct';

const props = defineProps({
    products: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const cartStore = useCartStore();
const {
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
} = useProduct();

const selectedVariants = reactive({});

/**
 * Get selected attributes for a product.
 */
const getSelectedAttributes = (product) => {
    return selectedVariants[product.id] || {};
};

/**
 * Get selected product variant.
 */
const getProductVariant = (product) => {
    return getSelectedVariant(
        product,
        getSelectedAttributes(product)
    );
};

/**
 * Get current product price.
 */
const getProductPrice = (product) => {
    return getCurrentPrice(product, getProductVariant(product));
};

/**
 * Get original product price.
 */
const getProductOriginalPrice = (product) => {
    return getOriginalPrice(product, getProductVariant(product));
};

/**
 * Check whether product has a discount.
 */
const hasProductDiscount = (product) => {
    return hasDiscount(product, getProductVariant(product));
};

/**
 * Check product stock.
 */
const isOutOfStock = (product) => {
    return getProductStock(product, getProductVariant(product)) < 1;
};

/**
 * Check whether product is already in cart.
 */
const isInCart = (product) => {
    const variantId = getProductVariant(product)?.id;

    return cartStore.items.some((item) =>
        item.product_id === product.id &&
        (item.variant_id ?? item.variant?.id) === variantId
    );
};

/**
 * Check whether product is being added.
 */
const isAddingToCart = (product) => {
    return cartStore.addingProductId === product.id;
};

/**
 * Get add-to-cart button label.
 */
const getButtonLabel = (product) => {
    if (isAddingToCart(product)) return 'Adding...';
    if (isInCart(product)) return 'Already in Cart';

    if (
        getActiveVariants(product).length &&
        !getProductVariant(product)
    ) {
        return 'Select options';
    }

    if (isOutOfStock(product)) return 'Out of stock';

    return 'Add to Cart';
};

/**
 * Check whether product can be added to cart.
 */
const canAddToCart = (product) => {
    const hasVariants = getActiveVariants(product).length > 0;

    return !isInCart(product)
        && !isOutOfStock(product)
        && !isAddingToCart(product)
        && (!hasVariants || !!getProductVariant(product));
};

/**
 * Add product to cart.
 */
const addToCart = async (product) => {
    if (!canAddToCart(product)) {
        return;
    }

    await cartStore.addToCart(
        product,
        1,
        getProductVariant(product)
    );
};

/**
 * Initialize the first available variant for each product.
 */
watch(
    () => props.products,
    (products) => {
        products.forEach((product) => {
            if (
                !selectedVariants[product.id] ||
                !Object.keys(selectedVariants[product.id]).length
            ) {
                selectedVariants[product.id] = {
                    ...(getActiveVariants(product)[0]?.attributes || {}),
                };
            }
        });
    },
    { immediate: true }
);
</script>

<template>
    <!-- Loading -->
    <div v-if="loading" class="grid" role="status" aria-label="Loading products" aria-busy="true">
        <article v-for="item in 4" :key="item" class="product-card skeleton-card" aria-hidden="true">
            <div class="product-image skeleton"></div>
            <div class="product-info">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-subtitle"></div>
            </div>
        </article>
    </div>

    <!-- Empty -->
    <div v-else-if="!products.length" class="empty-state">
        No products available.
    </div>

    <!-- Product listing -->
    <div v-else class="grid">
        <article
            v-for="product in products"
            :key="product.id"
            class="product-card"
        >
            <RouterLink
                :to="{
                    name: 'product-details',
                    params: { id: product.id }
                }"
            >
                <div class="product-image">
                    <img
                        v-if="getProductImage(product)"
                        :src="getProductImage(product)"
                        :alt="product.title"
                        loading="lazy"
                    >
                </div>

                <div class="product-info">
                    <h3>{{ product.title }}</h3>

                    <p>{{ product.category?.name || 'General' }}</p>

                    <span class="price">
                        {{ formatPrice(getProductPrice(product)) }}

                        <span
                            v-if="hasProductDiscount(product)"
                            class="old-price"
                        >
                            {{ formatPrice(getProductOriginalPrice(product)) }}
                        </span>
                    </span>
                </div>
            </RouterLink>

            <!-- Product variants -->
            <div
                v-if="getActiveVariants(product).length"
                class="product-variants"
            >
                <label
                    v-for="attribute in getVariantAttributes(product)"
                    :key="attribute"
                >
                    {{ attribute }}

                    <select
                        v-model="selectedVariants[product.id][attribute]"
                    >
                        <option
                            v-for="value in getVariantOptions(product, attribute)"
                            :key="value"
                            :value="value"
                        >
                            {{ value }}
                        </option>
                    </select>
                </label>
            </div>

            <!-- Product actions -->
            <div class="product-actions">
                <button
                    type="button"
                    :disabled="!canAddToCart(product)"
                    @click="addToCart(product)"
                >
                    {{ getButtonLabel(product) }}
                </button>
            </div>
        </article>
    </div>
</template>
