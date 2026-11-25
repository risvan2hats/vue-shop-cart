<script setup lang="ts">
const SITE_TITLE = import.meta.env.VITE_SITE_TITLE
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <span>© {{ year }} {{ SITE_TITLE }} Store. {{ $t('all_rights_reserved') }}</span>
      <span>{{ $t('help') }} · {{ $t('shipping') }} · {{ $t('returns') }} · {{ $t('privacy') }}</span>
    </div>
  </footer>
</template>