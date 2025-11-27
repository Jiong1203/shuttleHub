<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppButton from './AppButton.vue'

const authStore = useAuthStore()
const router = useRouter()
const showUserMenu = ref(false)

function handleLogout() {
  authStore.logout()
  showUserMenu.value = false
  router.push('/login')
}

// Close menu when clicking outside
function closeMenu() {
  showUserMenu.value = false
}
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
        <RouterLink v-if="authStore.isOrganizer" to="/events/create" class="nav-link">開團</RouterLink>
        <RouterLink v-if="authStore.isOrganizer" to="/events/manage" class="nav-link">我的活動</RouterLink>
      </div>

      <div class="user-actions">
        <!-- Not logged in -->
        <template v-if="!authStore.isAuthenticated">
          <AppButton variant="text" size="sm" @click="router.push('/login')">登入</AppButton>
          <AppButton variant="primary" size="sm" @click="router.push('/register')">註冊</AppButton>
        </template>

        <!-- Logged in -->
        <template v-else>
          <div class="user-menu" @click="showUserMenu = !showUserMenu">
            <div class="user-avatar">{{ authStore.currentUser?.name[0] }}</div>
            <span class="user-name">{{ authStore.currentUser?.name }}</span>
            <span class="dropdown-icon">▼</span>

            <div v-if="showUserMenu" class="menu-dropdown" @click.stop>
              <div class="menu-header">
                <div class="menu-user-info">
                  <strong>{{ authStore.currentUser?.name }}</strong>
                  <span class="menu-email">{{ authStore.currentUser?.email }}</span>
                </div>
              </div>

              <div class="menu-divider"></div>

              <RouterLink to="/profile" class="menu-item" @click="closeMenu">
                <span class="menu-icon">👤</span>
                個人資料
              </RouterLink>

              <RouterLink v-if="authStore.isOrganizer" to="/events/manage" class="menu-item" @click="closeMenu">
                <span class="menu-icon">📋</span>
                我的活動
              </RouterLink>

              <RouterLink v-if="authStore.isAdmin" to="/admin/applications" class="menu-item" @click="closeMenu">
                <span class="menu-icon">⚙️</span>
                審核申請
              </RouterLink>

              <div class="menu-divider"></div>

              <button class="menu-item menu-logout" @click="handleLogout">
                <span class="menu-icon">🚪</span>
                登出
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Backdrop for closing menu -->
    <div v-if="showUserMenu" class="menu-backdrop" @click="closeMenu"></div>
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
  align-items: center;
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.user-menu:hover {
  background-color: var(--color-bg-body);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: var(--gradient-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-name {
  font-weight: 500;
  color: var(--color-text-main);
}

.dropdown-icon {
  font-size: 0.625rem;
  color: var(--color-text-muted);
  transition: transform var(--transition-fast);
}

.user-menu:hover .dropdown-icon {
  transform: translateY(2px);
}

.menu-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 1000;
}

.menu-header {
  padding: var(--spacing-md);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
}

.menu-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-user-info strong {
  color: var(--color-text-main);
  font-size: 0.9375rem;
}

.menu-email {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.menu-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: var(--spacing-xs) 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text-main);
  text-decoration: none;
  transition: background-color var(--transition-fast);
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.9375rem;
}

.menu-item:hover {
  background-color: var(--color-bg-body);
}

.menu-icon {
  font-size: 1rem;
}

.menu-logout {
  color: var(--color-danger);
}

.menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}

@media (max-width: 768px) {
  .nav-links {
    display: none; /* Mobile menu todo */
  }

  .user-name {
    display: none;
  }
}
</style>
