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

    <section
      v-if="authStore.user || authStore.profileLoading"
      class="profile-card"
      :aria-busy="authStore.profileLoading"
      :role="authStore.profileLoading ? 'status' : undefined"
    >
      <dl>
        <div>
          <dt>Name</dt>
          <dd>
            <span
              v-if="authStore.profileLoading"
              class="skeleton profile-skeleton-value"
              style="width: 180px;"
              aria-label="Loading name"
            />
            <template v-else>
              {{ authStore.user?.name }}
            </template>
          </dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <span
              v-if="authStore.profileLoading"
              class="skeleton profile-skeleton-value"
              style="width: 240px;"
              aria-label="Loading email"
            />
            <template v-else>
              {{ authStore.user?.email }}
            </template>
          </dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>
            <span
              v-if="authStore.profileLoading"
              class="skeleton profile-skeleton-value"
              style="width: 140px;"
              aria-label="Loading phone"
            />
            <template v-else>
              {{ authStore.user?.phone || 'Not provided' }}
            </template>
          </dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>
            <span
              v-if="authStore.profileLoading"
              class="skeleton profile-skeleton-value"
              style="width: 280px;"
              aria-label="Loading address"
            />
            <template v-else>
              {{ authStore.user?.address || 'Not provided' }}
            </template>
          </dd>
        </div>
      </dl>
    </section>
  </main>
</template>
