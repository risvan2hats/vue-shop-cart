<script setup>
import { reactive } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';

const props = defineProps({
    products: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
        default: null,
    },
});

const emit = defineEmits(['retry']);

const productStore = useProductStore();
const cartStore = useCartStore();
const selectedVariants = reactive({});

const getAvailableVariants = (product) => (
    (product.variants || []).filter((variant) => variant.is_active !== false)
);

const getVariantAttributes = (product) => [
    ...new Set(getAvailableVariants(product).flatMap(
        (variant) => Object.keys(variant.attributes || {}),
    )),
];

const getSelectedAttributes = (product) => {
    if (!selectedVariants[product.id]) {
        selectedVariants[product.id] = {
            ...(getAvailableVariants(product)[0]?.attributes || {}),
        };
    }

    return selectedVariants[product.id];
};

const getSelectedVariant = (product) => {
    const attributes = getSelectedAttributes(product);
    return getAvailableVariants(product).find((variant) =>
        Object.entries(attributes).every(([key, value]) => variant.attributes?.[key] === value)
        && Object.keys(attributes).length === Object.keys(variant.attributes || {}).length
    );
};

/**
 * Get current selling price
 */
const getCurrentPrice = (product) => {
    const variant = getSelectedVariant(product);
    return Number(
        variant?.selling_price ??
        variant?.price ??
        product.current_price ?? product.selling_price ?? product.price ?? 0
    );
};

/**
 * Check product discount
 */
const hasDiscount = (product) => {
    return getCurrentPrice(product) < Number(product.price || 0);
};

/**
 * Add product to cart
 */
const addToCart = async (product) => {
    try {
        await cartStore.addToCart(product, 1, getSelectedVariant(product) || null);
    } catch (error) {
        console.error('Add to cart failed:', error);
    }
};

/**
 * Check whether product is already in cart
 */
const isInCart = (product) => {
    const variantId = getSelectedVariant(product)?.id;
    return cartStore.items.some((item) => item.product_id === product.id
        && (item.variant_id ?? item.variant?.id) === variantId);
};
</script>

<template>
    <!-- Loading -->
    <div v-if="loading" class="loading-state">
        Loading products...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="emit('retry')">Try again</button>
    </div>

    <!-- Empty -->
    <div v-else-if="!products.length" class="empty-state">
        No products available.
    </div>

    <!-- Product listing -->
    <div v-else class="grid">
        <article v-for="product in products" :key="product.id" class="product-card">
            <RouterLink :to="{
                name: 'product-details',
                params: { id: product.id }
            }">
                <div class="product-image">
                    <img :src="product.image_url || product.image" :alt="product.title" loading="lazy">
                </div>

                <div class="product-info">
                    <h3>{{ product.title }}</h3>

                    <p>{{ product.category?.name || 'General' }}</p>

                    <span class="price">
                        {{ productStore.formatPrice(getCurrentPrice(product)) }}

                        <span v-if="hasDiscount(product)" class="old-price">
                            {{ productStore.formatPrice(product.price) }}
                        </span>
                    </span>
                </div>
            </RouterLink>

            <div v-if="getAvailableVariants(product).length" class="product-variants">
                <label v-for="attribute in getVariantAttributes(product)" :key="attribute">
                    {{ attribute }}
                    <select v-model="getSelectedAttributes(product)[attribute]">
                        <option
                            v-for="value in [...new Set(getAvailableVariants(product).map(variant => variant.attributes?.[attribute]).filter(value => value != null))]"
                            :key="value"
                            :value="value"
                        >
                            {{ value }}
                        </option>
                    </select>
                </label>
            </div>

            <div class="product-actions">
                <button type="button" :disabled="isInCart(product) ||
                    (getAvailableVariants(product).length ? !getSelectedVariant(product) || getSelectedVariant(product).stock < 1 : product.stock < 1) ||
                    cartStore.addingProductId === product.id
                    " @click="addToCart(product)">
                    {{
                        cartStore.addingProductId === product.id
                            ? 'Adding...'
                            : isInCart(product)
                                ? 'Already in Cart'
                                : product.stock < 1 ? 'Out of stock' : 'Add to Cart' }} </button>
            </div>
        </article>
    </div>
</template>
