<script setup>
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
                    <div class="eyebrow">The everyday edit</div>
                    <h1>Good finds.<br>Better living.</h1>
                    <p>Thoughtfully picked essentials for your everyday routine. Explore the latest drops, trusted
                        favourites, and little upgrades that make a difference.</p>
                    <div class="actions">
                        <RouterLink class="button" to="/products">Shop all products</RouterLink>
                        <RouterLink class="button secondary" :to="{ name: 'products', query: { sort: 'discount' } }">
                            Explore deals</RouterLink>
                    </div>
                </div>
                <div class="hero-art"><img :src="heroCollection"
                        alt="A collection of skincare, fragrance and home products"></div>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="section-head">
                    <div>
                        <div class="eyebrow">Browse by interest</div>
                        <h2>Shop categories</h2>
                    </div>
                    <RouterLink to="/products">View all →</RouterLink>
                </div>
                <div class="category-grid">

                    <!-- Loading -->
                    <div v-if="categoryStore.loading">
                        Loading categories...
                    </div>

                    <!-- Empty -->
                    <div v-else-if="!categoryStore.categories.length" class="empty-state">
                        No categories available.
                    </div>

                    <!-- Categories -->
                    <RouterLink v-else v-for="category in categoryStore.categories.slice(0, 4)" :key="category.id"
                        class="category" :to="{ name: 'products', query: { category: category.slug } }">
                        {{ category.name }}
                    </RouterLink>

                </div>
            </div>
        </section>

        <section class="section featured-section">
            <div class="container">
                <div class="section-head">
                    <div>
                        <div class="eyebrow">Picked for you</div>
                        <h2>Featured products</h2>
                    </div>

                    <RouterLink to="/products">Shop all →</RouterLink>
                </div>

                <ProductListing :products="productStore.products.slice(0, 4)" :loading="productStore.loading" :error="productStore.error"/>
            </div>
        </section>
        <section class="section collection-section">
            <div class="container">
                <div class="banner">
                    <div>
                        <div class="eyebrow banner-eyebrow">A little something extra</div>
                        <h2>Make room for better.</h2>
                        <p>Discover fresh arrivals and limited-time offers.</p>
                    </div>
                    <RouterLink class="button secondary" to="/products">Explore the collection</RouterLink>
                </div>
            </div>
        </section>
    </main>
</template>
