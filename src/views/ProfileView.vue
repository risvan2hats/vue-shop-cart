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
        {{ $t('your_account') }}
      </div>
      <h1>{{ $t('profile') }}</h1>
      <p class="muted">
        {{ $t('personal_information') }}
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
          <dt>{{ $t('name') }}</dt>
          <dd>
            <span
              v-if="authStore.profileLoading"
              class="skeleton profile-skeleton-value"
              style="width: 180px;"
              :aria-label="$t('loading_name')"
            />
            <template v-else>
              {{ authStore.user?.name }}
            </template>
          </dd>
        </div>
        <div>
          <dt>{{ $t('email') }}</dt>
          <dd>
            <span
              v-if="authStore.profileLoading"
              class="skeleton profile-skeleton-value"
              style="width: 240px;"
              :aria-label="$t('loading_email')"
            />
            <template v-else>
              {{ authStore.user?.email }}
            </template>
          </dd>
        </div>
        <div>
          <dt>{{ $t('phone') }}</dt>
          <dd>
            <span
              v-if="authStore.profileLoading"
              class="skeleton profile-skeleton-value"
              style="width: 140px;"
              :aria-label="$t('loading_phone')"
            />
            <template v-else>
              {{ authStore.user?.phone || $t('not_provided') }}
            </template>
          </dd>
        </div>
        <div>
          <dt>{{ $t('address') }}</dt>
          <dd>
            <span
              v-if="authStore.profileLoading"
              class="skeleton profile-skeleton-value"
              style="width: 280px;"
              :aria-label="$t('loading_address')"
            />
            <template v-else>
              {{ authStore.user?.address || $t('not_provided') }}
            </template>
          </dd>
        </div>
      </dl>
    </section>
  </main>
</template>
