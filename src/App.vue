
<script setup>
import { watch } from 'vue';

import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

const authStore = useAuthStore();
const cartStore = useCartStore();

/**
 * Watch for authentication changes and fetch cart if authenticated
 */
watch(
    () => authStore.isAuthenticated,
    (isAuthenticated) => {
        if (isAuthenticated) {
            cartStore.fetchCart();
        }
    },
    { immediate: true }
);
</script>

<template>

    <Header />

    <RouterView />

    <Footer />

</template>