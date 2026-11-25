<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useProductStore } from '@/stores/productStore';
import { languages } from '@/config/languages';

import '../styles/pages/header.css';

const authStore = useAuthStore();
const cartStore = useCartStore();
const productStore = useProductStore();
const router = useRouter();
const { locale } = useI18n();

const changeLanguage = (code: string) => {
  locale.value = code;
  productStore.setLocale(code);
  authStore.updateLanguage(code);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<template>
  <div class="topbar">
    <div class="container nav">
      <RouterLink to="/" class="logo">
        north<span>star.</span>
      </RouterLink>

      <nav class="navlinks">
        <RouterLink to="/">
          {{ $t('home') }}
        </RouterLink>
        <RouterLink to="/products">
          {{ $t('shop') }}
        </RouterLink>
      </nav>

      <div class="navright">
        <div class="lang-switch" role="group" aria-label="Language">
          <svg class="lang-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
          </svg>
          <select class="lang-select" :value="locale" aria-label="Language"
            @change="changeLanguage(($event.target as HTMLSelectElement).value)">
            <option v-for="lang in languages" :key="lang.code" :value="lang.code">
              {{ lang.name }}
            </option>
          </select>
        </div>

        <RouterLink to="/cart" class="cart-link">
          {{ $t('cart') }} ({{ cartStore.totalQuantity }})
        </RouterLink>

        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/profile">
            {{ $t('profile') }}
          </RouterLink>
          <button type="button" @click="handleLogout">
            {{ $t('logout') }}
          </button>
        </template>

        <RouterLink v-else to="/login">
          {{ $t('login') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>