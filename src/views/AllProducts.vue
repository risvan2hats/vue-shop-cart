<script setup>
import { onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import '@/styles/pages/products.css';

import { useProductStore } from '@/stores/productStore';
import { useCategoryStore } from '@/stores/categoryStore';

import ProductListing from '@/components/ProductListing.vue';

const route = useRoute();
const router = useRouter();

const productStore = useProductStore();
const categoryStore = useCategoryStore();

const filters = reactive({
    search: '',
    category: route.query.category || '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sort: route.query.sort || 'featured',
});

/**
 * Fetch products using selected filters
 */
const fetchProducts = (page = 1) => {
    productStore.fetchProducts({
        page,
        per_page: 12,
        search: filters.search || undefined,
        category: filters.category || undefined,
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
            min_price: filters.minPrice || undefined,
            max_price: filters.maxPrice || undefined,
            in_stock: filters.inStock ? '1' : undefined,
            sort: filters.sort === 'featured' ? undefined : filters.sort,
        },
    });
};

/**
 * Change pagination page
 */
const changePage = (page) => {
    if (page < 1 || page > (productStore.meta?.last_page || 1)) {
        return;
    }

    router.push({
        name: 'products',
        query: { ...route.query, page: page === 1 ? undefined : String(page) },
    });
};

watch(
    () => route.fullPath,
    () => {
        filters.search = String(route.query.search || '');
        filters.category = String(route.query.category || '');
        filters.minPrice = String(route.query.min_price || '');
        filters.maxPrice = String(route.query.max_price || '');
        filters.inStock = route.query.in_stock === '1';
        filters.sort = String(route.query.sort || 'featured');

        fetchProducts(Number(route.query.page) || 1);
    },
    { immediate: true },
);

onMounted(() => {
    categoryStore.fetchCategories();
});
</script>

<template>
    <main class="container">
        <div class="page-title">
            <div class="breadcrumb">
                <RouterLink to="/">Home</RouterLink> / Shop
            </div>

            <div class="eyebrow">The collection</div>
            <h1>All products</h1>
            <p class="muted">Find your next everyday favourite.</p>
        </div>

        <div class="catalog-layout">
            <aside class="filters">
                <h3>Filters</h3>

                <div class="filter-group">
                    <strong>Category</strong>

                    <select class="form-control" v-model="filters.category" @change="applyFilters">
                        <option value="">All categories</option>

                        <option v-for="category in categoryStore.categories" :key="category.id" :value="category.slug">
                            {{ category.name }}
                        </option>
                    </select>
                </div>

                <div class="filter-group">
                    <strong>Price range</strong>

                    <div class="field">
                        <label for="min-price">Minimum ($)</label>
                        <input id="min-price" v-model="filters.minPrice" type="number" min="0" placeholder="0"
                            @change="applyFilters" @keyup="applyFilters">
                    </div>

                    <div class="field">
                        <label for="max-price">Maximum ($)</label>
                        <input id="max-price" v-model="filters.maxPrice" type="number" min="0" placeholder="500"
                            @change="applyFilters" @keyup="applyFilters">
                    </div>
                </div>

                <div class="filter-group">
                    <strong>Availability</strong>

                    <label>
                        <input v-model="filters.inStock" type="checkbox" @change="applyFilters">
                        In stock only
                    </label>
                </div>
            </aside>

            <section>
                <form class="toolbar" @submit.prevent="applyFilters">
                    <input v-model="filters.search" type="search" placeholder="Search products..."
                        aria-label="Search products">

                    <select v-model="filters.sort" aria-label="Sort products" @change="applyFilters">
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to high</option>
                        <option value="price-desc">Price: High to low</option>
                        <option value="discount">Discount</option>
                    </select>
                </form>

                <div class="section-head">
                    <span class="muted">
                        Showing {{ productStore.products.length }}
                        of {{ productStore.meta?.total || 0 }} products
                    </span>

                    <span class="muted">
                        Page {{ productStore.meta?.current_page || 1 }}
                        of {{ productStore.meta?.last_page || 1 }}
                    </span>
                </div>

                <ProductListing :products="productStore.products" :loading="productStore.loading"
                    :error="productStore.error" @retry="fetchProducts(productStore.meta?.current_page || 1)" />

                <div v-if="!productStore.loading && !productStore.error && productStore.meta?.last_page > 1"
                    class="actions pagination-actions">
                    <button class="button secondary" :disabled="productStore.meta.current_page === 1"
                        @click="changePage(productStore.meta.current_page - 1)">
                        Previous
                    </button>

                    <button class="button" disabled>
                        {{ productStore.meta.current_page }}
                    </button>

                    <button class="button secondary"
                        :disabled="productStore.meta.current_page === productStore.meta.last_page"
                        @click="changePage(productStore.meta.current_page + 1)">
                        Next
                    </button>
                </div>
            </section>
        </div>
    </main>
</template>
