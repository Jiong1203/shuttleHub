<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue'
</script>

<template>
  <div class="app-layout">
    <TheNavbar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
}
</style>
