<script setup lang="ts">
import { onMounted } from 'vue';

import '@/styles/pages/home.css';

import heroCollection from '@/assets/product-collection.jpg';
import ProductListing from '@/components/ProductListing.vue';

import { useProductStore } from '@/stores/productStore';
import { useCategoryStore } from '@/stores/categoryStore';

const categoryStore = useCategoryStore();
const productStore = useProductStore();

onMounted(() => {
  if (!categoryStore.categories.length) {
    categoryStore.fetchCategories();
  }

  if (!productStore.products.length) {
    productStore.fetchProducts({ per_page: 15 });
  }
});
</script>

<template>
  <main>
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <div class="eyebrow">
            {{ $t('the_everyday_edit') }}
          </div>
          <h1>{{ $t('good_finds_better_living') }}</h1>
          <p>
            {{ $t('hero_description') }}
          </p>
          <div class="actions">
            <RouterLink
              class="button"
              to="/products"
            >{{ $t('shop_all_products') }}</RouterLink>
            <RouterLink
              class="button secondary"
              :to="{ name: 'products', query: { sort: 'discount' } }"
            >
              {{ $t('explore_deals') }}</RouterLink>
          </div>
        </div>
        <div class="hero-art">
          <img
            :src="heroCollection"
            alt="A collection of skincare, fragrance and home products"
          >
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="eyebrow">
              {{ $t('browse_by_interest') }}
            </div>
            <h2>{{ $t('shop_categories') }}</h2>
          </div>
          <RouterLink to="/products">{{ $t('view_all') }} →</RouterLink>
        </div>
        <div class="category-grid">
          <!-- Loading -->
          <template v-if="categoryStore.loading">
            <div
              v-for="item in 4"
              :key="item"
              class="category skeleton"
              aria-hidden="true"
            >
              <div class="skeleton skeleton-title" />
            </div>
          </template>

          <!-- Empty -->
          <div
            v-else-if="!categoryStore.categories.length"
            class="empty-state"
          >
            {{ $t('no_categories_available') }}
          </div>

          <!-- Categories -->
          <RouterLink
            v-for="category in categoryStore.categories.slice(0, 4)"
            v-else
            :key="category.id"
            class="category"
            :to="{ name: 'products', query: { category: category.slug } }"
          >
            {{ category.name }}
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section featured-section">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="eyebrow">
              {{ $t('picked_for_you') }}
            </div>
            <h2>{{ $t('featured_products') }}</h2>
          </div>

          <RouterLink to="/products">{{ $t('shop_all') }} →</RouterLink>
        </div>

        <ProductListing
          :products="productStore.products.slice(0, 4)"
          :loading="productStore.loading"
        />
      </div>
    </section>
    <section class="section collection-section">
      <div class="container">
        <div class="banner">
          <div>
            <div class="eyebrow banner-eyebrow">
              {{ $t('a_little_something_extra') }}
            </div>
            <h2>{{ $t('make_room_for_better') }}</h2>
            <p>{{ $t('collection_description') }}</p>
          </div>
          <RouterLink
            class="button secondary"
            to="/products"
          >{{ $t('explore_collection') }}</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
