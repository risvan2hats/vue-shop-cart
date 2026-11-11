<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

const authStore = useAuthStore();
const cartStore = useCartStore();

const handleLogout = () => {
    authStore.logout();
};
</script>
<template>
    <div class="topbar">
        <div class="container nav">
            <RouterLink to="/" class="logo">north<span>star.</span></RouterLink>
            <nav class="navlinks">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/products">Shop</RouterLink>
            </nav>
            <div class="navright">
                <RouterLink to="/cart" class="cart-link">
                    Cart ({{ cartStore.totalItems }})
                </RouterLink>
                <template v-if="authStore.isAuthenticated">
                    <span>{{ authStore.user.name }}</span>

                    <button type="button" @click="handleLogout">
                        Logout
                    </button>
                </template>

                <RouterLink v-else to="/login">
                    Login
                </RouterLink>
            </div>
        </div>
    </div>
</template>