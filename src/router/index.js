import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import AllProducts from '@/views/AllProducts.vue';
import CartView from '@/views/CartView.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/products',
        name: 'products',
        component: AllProducts,
    },
    {
        path: '/cart',
        name: 'cart',
        component: CartView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;