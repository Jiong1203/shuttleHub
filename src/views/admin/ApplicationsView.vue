<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'

const router = useRouter()
const authStore = useAuthStore()

// Check if user is admin
if (!authStore.isAdmin) {
  router.push('/')
}

const pendingApplications = computed(() => authStore.pendingApplications)

function handleApprove(userId: string) {
  if (confirm('確定要核准此申請嗎？')) {
    const result = authStore.approveOrganizerApplication(userId)
    if (result.success) {
      alert('已核准申請')
    } else {
      alert(result.error || '操作失敗')
    }
  }
}

function handleReject(userId: string) {
  if (confirm('確定要拒絕此申請嗎？')) {
    const result = authStore.rejectOrganizerApplication(userId)
    if (result.success) {
      alert('已拒絕申請')
    } else {
      alert(result.error || '操作失敗')
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="admin-container">
      <div class="header">
        <div>
          <h1 class="page-title">團長申請審核</h1>
          <p class="subtitle">審核會員的團長申請</p>
        </div>
        <AppButton variant="text" @click="router.back()">← 返回</AppButton>
      </div>

      <div v-if="pendingApplications.length === 0" class="empty-state">
        <AppCard>
          <div class="empty-content">
            <div class="empty-icon">📋</div>
            <h3>目前沒有待審核的申請</h3>
            <p>當有會員申請成為團長時，會顯示在這裡。</p>
          </div>
        </AppCard>
      </div>

      <div v-else class="applications-list">
        <AppCard v-for="user in pendingApplications" :key="user.id" class="application-item">
          <div class="application-header">
            <div class="user-info">
              <div class="avatar">{{ user.name[0] }}</div>
              <div>
                <h3>{{ user.name }}</h3>
                <p class="email">{{ user.email }}</p>
              </div>
            </div>
            <span class="status-badge">待審核</span>
          </div>

          <div class="application-details">
            <div class="detail-row">
              <span class="label">會員 ID</span>
              <span class="value">{{ user.id }}</span>
            </div>
            <div class="detail-row">
              <span class="label">註冊時間</span>
              <span class="value">{{ new Date(user.createdAt).toLocaleDateString() }}</span>
            </div>
            <div class="detail-row">
              <span class="label">申請時間</span>
              <span class="value">{{ new Date(user.organizerApplication?.appliedAt || '').toLocaleString() }}</span>
            </div>
          </div>

          <div v-if="user.organizerApplication?.reason" class="application-reason">
            <h4>申請原因</h4>
            <p>{{ user.organizerApplication.reason }}</p>
          </div>

          <div class="application-actions">
            <AppButton variant="danger" size="sm" @click="handleReject(user.id)">
              拒絕
            </AppButton>
            <AppButton variant="primary" size="sm" @click="handleApprove(user.id)">
              核准
            </AppButton>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--color-text-muted);
}

.empty-state {
  margin-top: var(--spacing-2xl);
}

.empty-content {
  text-align: center;
  padding: var(--spacing-2xl);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
}

.empty-content h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-main);
}

.empty-content p {
  color: var(--color-text-muted);
}

.applications-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.application-item {
  padding: var(--spacing-xl);
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.avatar {
  width: 50px;
  height: 50px;
  background: var(--gradient-secondary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
}

.user-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.email {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.status-badge {
  background-color: var(--color-warning);
  color: black;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
}

.application-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) 0;
}

.detail-row .label {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.detail-row .value {
  color: var(--color-text-main);
  font-weight: 500;
  font-size: 0.875rem;
}

.application-reason {
  background-color: var(--color-bg-body);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
}

.application-reason h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xs);
}

.application-reason p {
  color: var(--color-text-main);
  line-height: 1.6;
  white-space: pre-wrap;
}

.application-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}
</style>
