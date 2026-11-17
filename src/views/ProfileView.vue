<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import '@/styles/pages/profile.css';

const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchProfile();
});
</script>

<template>
  <main class="container section">
    <div class="page-title">
      <div class="eyebrow">
        Your account
      </div>
      <h1>Profile</h1>
      <p class="muted">
        Your personal information.
      </p>
    </div>

    <div
      v-if="authStore.profileLoading"
      class="loading-state"
      role="status"
      aria-busy="true"
    >
      Loading profile...
    </div>

    <section
      v-else-if="authStore.user"
      class="profile-card"
    >
      <dl>
        <div>
          <dt>Name</dt>
          <dd>{{ authStore.user.name }}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{{ authStore.user.email }}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{{ authStore.user.phone || 'Not provided' }}</dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>{{ authStore.user.address || 'Not provided' }}</dd>
        </div>
      </dl>
    </section>
  </main>
</template>
