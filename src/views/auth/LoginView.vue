<script setup lang="ts">
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const credentials = reactive({
  email: '',
  password: '',
});

/**
 * Handle user login
 */
const handleLogin = async () => {
  const user = await authStore.login(credentials);
  const redirect = route.query.redirect;

  if (user) {
    router.push(typeof redirect === 'string' ? redirect : '/');
  }
};
</script>

<template>
  <main class="container section">
    <div class="login-container">
      <div class="page-title">
        <div class="eyebrow">
          Welcome back
        </div>
        <h1>Sign in</h1>
        <p class="muted">
          Sign in to continue shopping.
        </p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <label for="email">Email address</label>
          <input
            id="email"
            v-model="credentials.email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            required
          >
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            required
          >
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  </main>
</template>