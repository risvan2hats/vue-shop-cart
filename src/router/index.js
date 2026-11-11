import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores/authStore';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { guestOnly: true },
    },
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
    },
    {
        path: '/products',
        name: 'products',
        component: () => import('@/views/AllProducts.vue'),
    },
    {
        path: '/products/:id',
        name: 'product-details',
        component: () => import('@/views/ProductDetails.vue'),
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/views/CartView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/checkout',
        name: 'checkout',
        component: () => import('@/views/CheckoutView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/order-confirmation',
        name: 'order-confirmation',
        component: () => import('@/views/orderConfirmationView.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return {
            name: 'login',
            query: { redirect: to.fullPath },
        };
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
        return { name: 'home' };
    }
});

export default router;