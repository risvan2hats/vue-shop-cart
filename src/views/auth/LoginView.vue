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
          {{ $t('welcome_back') }}
        </div>
        <h1>{{ $t('sign_in') }}</h1>
        <p class="muted">
          {{ $t('sign_in_subtitle') }}
        </p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <label for="email">{{ $t('email_address') }}</label>
          <input
            id="email"
            v-model="credentials.email"
            type="email"
            :placeholder="$t('enter_email')"
            autocomplete="email"
            required
          >
        </div>

        <div class="field">
          <label for="password">{{ $t('password') }}</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            :placeholder="$t('enter_password')"
            autocomplete="current-password"
            required
          >
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? $t('signing_in') : $t('sign_in') }}
        </button>
      </form>
    </div>
  </main>
</template>