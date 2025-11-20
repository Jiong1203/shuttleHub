<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppButton from './AppButton.vue'
</script>

<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <RouterLink to="/" class="logo">
        🏸 ShuttleHub
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/" class="nav-link">首頁</RouterLink>
        <RouterLink to="/events" class="nav-link">活動列表</RouterLink>
        <RouterLink to="/events/create" class="nav-link">開團</RouterLink>
      </div>

      <div class="user-actions">
        <AppButton variant="text" size="sm">登入</AppButton>
        <AppButton variant="primary" size="sm">註冊</AppButton>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  color: var(--color-text-muted);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
}

.user-actions {
  display: flex;
  gap: var(--spacing-sm);
}

@media (max-width: 768px) {
  .nav-links {
    display: none; /* Mobile menu todo */
  }
}
</style>
