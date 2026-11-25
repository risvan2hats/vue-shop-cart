<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import '@/styles/pages/product-detail.css';

import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import ProductListing from '@/components/ProductListing.vue';
import { useProduct } from '@/composables/useProduct';
import type { AttributeMap } from '@/types/productTypes';

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

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const quantity = ref(1);
const selectedAttributes = ref<AttributeMap>({});

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
  const current = product.value;
  if (!current) {
    return [];
  }

  return productStore.products
    .filter((item) =>
      item.id !== current.id &&
      item.category_id === current.category_id
    )
    .slice(0, 4);
});

/**
 * Load product details.
 */
const loadProduct = (id: string | string[]) => {
  const productId = Array.isArray(id) ? id[0] : id;
  if (!productId) return;

  quantity.value = 1;
  selectedAttributes.value = {};

  productStore.fetchProduct(productId);
};

const siteTitle = (import.meta.env.VITE_SITE_TITLE as string | undefined) || '';

/**
 * Set default variant attributes and dynamic document title when product changes.
 */
watch(product, (currentProduct) => {
  if (currentProduct?.title) {
    document.title = `${currentProduct.title} | ${siteTitle}`;
  }

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

  await cartStore.addToCart(
    product.value,
    quantity.value,
    selectedVariant.value
  );
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
    <div
      v-if="productStore.productLoading"
      class="detail-grid"
      role="status"
      :aria-label="$t('loading_product')"
      aria-busy="true"
    >
      <div
        class="gallery-main skeleton"
        aria-hidden="true"
      />
      <div aria-hidden="true">
        <div class="skeleton skeleton-title" />
        <div class="skeleton skeleton-subtitle" />
        <div
          class="skeleton skeleton-title"
          style="width: 35%; margin-top: 24px"
        />
      </div>
    </div>

    <!-- Product not found -->
    <div
      v-else-if="productStore.productNotFound"
      class="empty-state"
    >
      <h2>{{ $t('product_not_found') }}</h2>

      <p>
        {{ $t('product_not_found_desc') }}
      </p>

      <RouterLink
        class="button"
        to="/products"
      >
        {{ $t('back_to_shop') }}
      </RouterLink>
    </div>

    <!-- Product details -->
    <template v-else-if="product">
      <div class="breadcrumb">
        <RouterLink to="/">{{ $t('home') }}</RouterLink> /
        <RouterLink to="/products">{{ $t('shop') }}</RouterLink> /
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
          <span
            v-if="discounted"
            class="tag"
          >{{ $t('sale') }}</span>

          <div
            class="eyebrow"
            style="margin-top: 18px"
          >
            {{ product.category?.name || '' }}
          </div>

          <h1>{{ product.title }}</h1>

          <p class="muted">
            {{ product.description }}
          </p>

          <div class="detail-price">
            {{ formatPrice(currentPrice) }}

            <span
              v-if="discounted"
              class="old-price"
            >
              {{ formatPrice(originalPrice) }}
            </span>
          </div>

          <p class="stock">
            <template v-if="currentStock > 0">
              {{ $t('in_stock_available', { count: currentStock }) }}
            </template>

            <template v-else>
              {{ $t('currently_out_of_stock') }}
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
            <label for="quantity">{{ $t('quantity') }}</label>

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
              {{ isAddingToCart ? $t('adding') : $t('add_to_cart') }}
            </button>

            <RouterLink
              class="button secondary"
              to="/cart"
            >
              {{ $t('view_cart') }}
            </RouterLink>
          </div>
          <!-- Product details -->
          <div style="margin-top: 30px">
            <h3>{{ $t('product_details') }}</h3>

            <p class="muted">
              {{ product.description }}
            </p>

            <p>
              <strong>{{ $t('category_label') }}:</strong>
              {{ product.category?.name || $t('general') }}
              <br>

              <strong>{{ $t('subcategory_label') }}:</strong>
              {{ product.sub_category?.name || $t('not_applicable') }}
              <br>

              <strong>{{ $t('sku_label') }}:</strong>
              {{ product.sku || $t('not_applicable') }}
              <br>

              <strong>{{ $t('availability_label') }}:</strong>
              {{ currentStock > 0 ? $t('in_stock') : $t('out_of_stock') }}
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
            <div class="eyebrow">
              {{ $t('you_may_also_like') }}
            </div>
            <h2>{{ $t('related_products') }}</h2>
          </div>

          <RouterLink
            :to="{
              name: 'products',
              query: { category: product.category?.slug }
            }"
          >
            {{ $t('view_all') }} →
          </RouterLink>
        </div>

        <ProductListing :products="relatedProducts" />
      </section>
    </template>
  </main>
</template>