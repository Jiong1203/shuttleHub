<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventStore } from '@/stores/eventStore'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'

const route = useRoute()
const router = useRouter()
const store = useEventStore()

const eventId = route.params.id as string
const event = computed(() => store.getEventById(eventId))
const registrations = computed(() => store.getRegistrationsByEventId(eventId))

function updateStatus(registrationId: string, status: 'approved' | 'rejected') {
  const reg = store.registrations.find(r => r.id === registrationId)
  if (reg) {
    reg.status = status
  }
}

// Mock user name lookup (since we don't have a real user store yet)
function getUserName(userId: string) {
  if (userId === store.currentUser.id) return store.currentUser.name
  return `User ${userId}`
}
</script>

<template>
  <div class="container" v-if="event">
    <div class="header">
      <div class="title-group">
        <AppButton variant="text" size="sm" @click="router.back()">← 返回</AppButton>
        <h1>{{ event.title }} - 報名管理</h1>
      </div>
    </div>

    <div class="stats-cards">
      <AppCard class="stat-card">
        <div class="stat-value">{{ registrations.length }}</div>
        <div class="stat-label">總報名</div>
      </AppCard>
      <AppCard class="stat-card">
        <div class="stat-value">{{ registrations.filter(r => r.status === 'approved').length }}</div>
        <div class="stat-label">已核准</div>
      </AppCard>
      <AppCard class="stat-card">
        <div class="stat-value">{{ event.maxParticipants }}</div>
        <div class="stat-label">名額上限</div>
      </AppCard>
    </div>

    <div class="registrations-list">
      <AppCard v-if="registrations.length === 0">
        <p class="empty-text">目前尚無人報名</p>
      </AppCard>

      <AppCard v-else v-for="reg in registrations" :key="reg.id" class="registration-item">
        <div class="user-info">
          <div class="avatar-placeholder">{{ getUserName(reg.userId)[0] }}</div>
          <div>
            <div class="user-name">{{ getUserName(reg.userId) }}</div>
            <div class="reg-time">{{ new Date(reg.timestamp).toLocaleString() }}</div>
          </div>
        </div>

        <div class="status-actions">
          <span :class="['status-badge', reg.status]">
            {{ reg.status === 'approved' ? '已核准' : reg.status === 'rejected' ? '已拒絕' : '待審核' }}
          </span>
          
          <div class="action-buttons" v-if="reg.status === 'pending'">
            <AppButton size="sm" variant="primary" @click="updateStatus(reg.id, 'approved')">核准</AppButton>
            <AppButton size="sm" variant="danger" @click="updateStatus(reg.id, 'rejected')">拒絕</AppButton>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<style scoped>
.header {
  margin-bottom: var(--spacing-lg);
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  text-align: center;
  padding: var(--spacing-md);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.registrations-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.registration-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.user-name {
  font-weight: 500;
}

.reg-time {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.status-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.status-badge {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
}

.status-badge.pending {
  background-color: var(--color-warning);
  color: white;
}

.status-badge.approved {
  background-color: var(--color-success);
  color: white;
}

.status-badge.rejected {
  background-color: var(--color-danger);
  color: white;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.empty-text {
  text-align: center;
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .registration-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .status-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
