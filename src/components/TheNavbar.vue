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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 3px solid transparent;
  border-image: var(--gradient-primary) 1;
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: transform var(--transition-normal);
}

.logo:hover {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  color: var(--color-text-muted);
  font-weight: 500;
  transition: all var(--transition-fast);
  position: relative;
  padding-bottom: 4px;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  transition: width var(--transition-normal);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
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
