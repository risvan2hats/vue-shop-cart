<script setup lang="ts">
import { computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery, type LocationQueryValue } from 'vue-router';

import '@/styles/pages/products.css';

import { useProductStore } from '@/stores/productStore';
import { useCategoryStore } from '@/stores/categoryStore';

import ProductListing from '@/components/ProductListing.vue';

const route = useRoute();
const router = useRouter();

const productStore = useProductStore();
const categoryStore = useCategoryStore();

const queryString = (value?: LocationQueryValue | LocationQueryValue[]) => {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
};

const filters = reactive({
  search: '',
  category: queryString(route.query.category),
  subCategory: queryString(route.query.sub_category),
  minPrice: '',
  maxPrice: '',
  inStock: false,
  sort: queryString(route.query.sort) || 'featured',
});

const availableSubCategories = computed(() => {
  const category = categoryStore.categories.find((item) => item.slug === filters.category);
  return category ? categoryStore.subCategoriesForCategory(category.id) : [];
});

const pagination = computed(() => {
  const meta = productStore.meta;
  if (!meta?.last_page || meta.last_page <= 1) return null;

  return {
    currentPage: meta.current_page || 1,
    lastPage: meta.last_page,
  };
});

/**
 * Fetch products using selected filters
 */
const fetchProducts = (page = 1) => {
  productStore.fetchProducts({
    page,
    per_page: 9,
    search: filters.search || undefined,
    category: filters.category || undefined,
    sub_category: filters.subCategory || undefined,
    min_price: filters.minPrice || undefined,
    max_price: filters.maxPrice || undefined,
    in_stock: filters.inStock ? 1 : undefined,
    sort: filters.sort,
  });
};

/**
 * Apply filters
 */
const applyFilters = () => {
  router.push({
    name: 'products',
    query: {
      search: filters.search || undefined,
      category: filters.category || undefined,
      sub_category: filters.subCategory || undefined,
      min_price: filters.minPrice || undefined,
      max_price: filters.maxPrice || undefined,
      in_stock: filters.inStock ? '1' : undefined,
      sort: filters.sort === 'featured' ? undefined : filters.sort,
    },
  });
};

const onCategoryChange = () => {
  filters.subCategory = '';
  applyFilters();
};

/**
 * Change pagination page
 */
/**
 * Change pagination page
 */
const changePage = (page: number) => {
  const lastPage = productStore.meta?.last_page || 1;

  if (page < 1 || page > lastPage) {
    return;
  }

  const query: LocationQuery = { ...route.query };

  if (page === 1) {
    delete query.page;
  } else {
    query.page = String(page);
  }

  router.push({
    name: 'products',
    query,
  });
};

/**
 * Update filters and products when URL changes
 */
watch(
  () => route.fullPath,
  () => {
    // Get filter values from URL
    const query = route.query;

    // Update selected filters
    filters.search = queryString(query.search);
    filters.category = queryString(query.category);
    filters.subCategory = queryString(query.sub_category);
    filters.minPrice = queryString(query.min_price);
    filters.maxPrice = queryString(query.max_price);
    filters.inStock = query.in_stock === '1';
    filters.sort = queryString(query.sort) || 'featured';

    // Fetch products for the current page
    const page = Number(queryString(query.page)) || 1;
    fetchProducts(page);
  },
  { immediate: true },
);

onMounted(() => {
  if (!categoryStore.categories.length) {
    categoryStore.fetchCategories();
  }

  if (!categoryStore.subCategories.length) {
    categoryStore.fetchSubCategories();
  }
});
</script>

<template>
  <main class="container">
    <div class="page-title">
      <div class="breadcrumb">
        <RouterLink to="/">{{ $t('home') }}</RouterLink> / {{ $t('shop') }}
      </div>

      <div class="eyebrow">
        {{ $t('the_collection') }}
      </div>
      <h1>{{ $t('all_products') }}</h1>
      <p class="muted">
        {{ $t('find_next_favourite') }}
      </p>
    </div>

    <div class="catalog-layout">
      <aside class="filters">
        <h3>{{ $t('filters') }}</h3>

        <div class="filter-group">
          <strong>{{ $t('category') }}</strong>

          <select
            v-model="filters.category"
            class="form-control"
            @change="onCategoryChange"
          >
            <option value="">
              {{ $t('all_categories') }}
            </option>

            <option
              v-for="category in categoryStore.categories"
              :key="category.id"
              :value="category.slug"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div
          v-if="filters.category"
          class="filter-group"
        >
          <strong>{{ $t('subcategory') }}</strong>

          <select
            v-model="filters.subCategory"
            class="form-control"
            :disabled="categoryStore.subCategoriesLoading || !availableSubCategories.length"
            @change="applyFilters"
          >
            <option value="">
              {{ categoryStore.subCategoriesLoading ? $t('loading_subcategories') : $t('all_subcategories') }}
            </option>

            <option
              v-for="subCategory in availableSubCategories"
              :key="subCategory.id"
              :value="subCategory.slug"
            >
              {{ subCategory.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <strong>{{ $t('price_range') }}</strong>

          <div class="field">
            <label for="min-price">{{ $t('minimum') }}</label>
            <input
              id="min-price"
              v-model="filters.minPrice"
              type="number"
              min="0"
              placeholder="0"
              @change="applyFilters"
              @keyup="applyFilters"
            >
          </div>

          <div class="field">
            <label for="max-price">{{ $t('maximum') }}</label>
            <input
              id="max-price"
              v-model="filters.maxPrice"
              type="number"
              min="0"
              placeholder="500"
              @change="applyFilters"
              @keyup="applyFilters"
            >
          </div>
        </div>

        <div class="filter-group">
          <strong>{{ $t('availability') }}</strong>

          <label>
            <input
              v-model="filters.inStock"
              type="checkbox"
              @change="applyFilters"
            >
            {{ $t('in_stock_only') }}
          </label>
        </div>
      </aside>

      <section>
        <form
          class="toolbar"
          @submit.prevent="applyFilters"
        >
          <input
            v-model="filters.search"
            type="search"
            :placeholder="$t('search_products')"
            :aria-label="$t('search_products')"
          >

          <select
            v-model="filters.sort"
            :aria-label="$t('sort_products')"
            @change="applyFilters"
          >
            <option value="featured">
              {{ $t('featured') }}
            </option>
            <option value="price-asc">
              {{ $t('price_low_high') }}
            </option>
            <option value="price-desc">
              {{ $t('price_high_low') }}
            </option>
            <option value="discount">
              {{ $t('discount') }}
            </option>
          </select>
        </form>

        <div class="section-head">
          <span class="muted">
            {{ $t('showing_products', { count: productStore.products.length, total: productStore.meta?.total || 0 }) }}
          </span>

          <span class="muted">
            {{ $t('page_of', { current: productStore.meta?.current_page || 1, last: productStore.meta?.last_page || 1 }) }}
          </span>
        </div>

        <ProductListing
          :products="productStore.products"
          :loading="productStore.loading"
        />

        <div
          v-if="!productStore.loading && pagination"
          class="actions pagination-actions"
        >
          <button
            class="button secondary"
            :disabled="pagination.currentPage === 1"
            @click="changePage(pagination.currentPage - 1)"
          >
            {{ $t('previous') }}
          </button>

          <button
            class="button"
            disabled
          >
            {{ pagination.currentPage }}
          </button>

          <button
            class="button secondary"
            :disabled="pagination.currentPage === pagination.lastPage"
            @click="changePage(pagination.currentPage + 1)"
          >
            {{ $t('next') }}
          </button>
        </div>
      </section>
    </div>
  </main>
</template>
