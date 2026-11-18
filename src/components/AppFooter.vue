<script setup lang="ts">
const SITE_TITLE = import.meta.env.VITE_SITE_TITLE
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <span>© {{ year }} {{ SITE_TITLE }} Store. All rights reserved.</span>
      <span>Help · Shipping · Returns · Privacy</span>
    </div>
  </footer>
</template>