<script setup>
import { onMounted } from 'vue';
import Header from '@/components/Header.vue';
import Footer from './components/Footer.vue';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

const authStore = useAuthStore();
const cartStore = useCartStore();

onMounted(() => {
    if (authStore.isAuthenticated) {
        cartStore.fetchCart();
    }
});
</script>

<template>
    <Header />

    <RouterView />

    <Footer />
</template>