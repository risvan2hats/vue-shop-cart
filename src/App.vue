<script setup lang="ts">
import { watch } from 'vue';

import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { toast } from '@/composables/showToast';

const authStore = useAuthStore();
const cartStore = useCartStore();

/**
 * Watch for authentication changes:
 * - When authenticated: merge any guest cart items and fetch user's cart
 * - When not authenticated: load stored guest cart items
 */
watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await cartStore.mergeGuestCart();
    } else {
      cartStore.loadGuestCart();
    }
  },
  { immediate: true }
);
</script>

<template>
  <AppHeader />

  <RouterView />

  <div
    v-if="toast.message"
    :class="`app-toast app-toast--${toast.type}`"
  >
    {{ toast.message }}
  </div>

  <AppFooter />
</template>