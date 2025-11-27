<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const showApplicationForm = ref(false)
const applicationReason = ref('')
const applicationError = ref('')
const applicationSuccess = ref(false)

const user = computed(() => authStore.currentUser)

const roleText = computed(() => {
  switch (user.value?.role) {
    case 'admin':
      return '系統管理員'
    case 'organizer':
      return '團長'
    case 'member':
      return '一般會員'
    default:
      return '未知'
  }
})

const roleBadgeClass = computed(() => {
  switch (user.value?.role) {
    case 'admin':
      return 'role-admin'
    case 'organizer':
      return 'role-organizer'
    case 'member':
      return 'role-member'
    default:
      return ''
  }
})

const canApplyForOrganizer = computed(() => {
  return user.value?.role === 'member' && !user.value?.organizerApplication
})

const hasApplication = computed(() => {
  return !!user.value?.organizerApplication
})

const applicationStatus = computed(() => {
  return user.value?.organizerApplication?.status
})

function handleApply() {
  applicationError.value = ''
  applicationSuccess.value = false

  if (!applicationReason.value.trim()) {
    applicationError.value = '請填寫申請原因'
    return
  }

  const result = authStore.applyForOrganizer(applicationReason.value)

  if (result.success) {
    applicationSuccess.value = true
    showApplicationForm.value = false
    applicationReason.value = ''
  } else {
    applicationError.value = result.error || '申請失敗'
  }
}

function handleLogout() {
  if (confirm('確定要登出嗎？')) {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<template>
  <div class="container">
    <div class="profile-container">
      <h1 class="page-title">個人資料</h1>

      <AppCard class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            {{ user?.name[0] }}
          </div>
          <div class="user-info">
            <h2>{{ user?.name }}</h2>
            <p class="email">{{ user?.email }}</p>
            <span :class="['role-badge', roleBadgeClass]">{{ roleText }}</span>
          </div>
        </div>

        <div class="profile-details">
          <div class="detail-item">
            <span class="label">會員 ID</span>
            <span class="value">{{ user?.id }}</span>
          </div>
          <div class="detail-item">
            <span class="label">註冊時間</span>
            <span class="value">{{ new Date(user?.createdAt || '').toLocaleDateString() }}</span>
          </div>
          <div class="detail-item">
            <span class="label">角色權限</span>
            <div class="permission-tags">
              <span v-if="user?.role === 'member'" class="permission-tag tag-register">報名</span>
              <template v-else-if="user?.role === 'organizer'">
                <span class="permission-tag tag-create">開團</span>
                <span class="permission-tag tag-register">報名</span>
              </template>
              <span v-else-if="user?.role === 'admin'" class="permission-tag tag-admin">管理員</span>
            </div>
          </div>
        </div>
      </AppCard>

      <!-- Organizer Application Section -->
      <AppCard v-if="canApplyForOrganizer || hasApplication" class="application-card">
        <h3>團長申請</h3>

        <!-- Can Apply -->
        <div v-if="canApplyForOrganizer">
          <p class="application-description">
            申請成為團長後，您將可以使用開團功能，創建羽球活動並管理報名。
          </p>

          <div v-if="!showApplicationForm">
            <AppButton variant="secondary" @click="showApplicationForm = true">
              申請成為團長
            </AppButton>
          </div>

          <div v-else class="application-form">
            <div class="form-group">
              <label>申請原因</label>
              <textarea
                v-model="applicationReason"
                rows="4"
                class="textarea-input"
                placeholder="請說明您想成為團長的原因..."
              ></textarea>
            </div>

            <div v-if="applicationError" class="error-message">
              {{ applicationError }}
            </div>

            <div class="form-actions">
              <AppButton variant="text" @click="showApplicationForm = false">取消</AppButton>
              <AppButton variant="secondary" @click="handleApply">提交申請</AppButton>
            </div>
          </div>
        </div>

        <!-- Has Application -->
        <div v-else-if="hasApplication">
          <div v-if="applicationStatus === 'pending'" class="status-box status-pending">
            <div class="status-icon">⏳</div>
            <div class="status-content">
              <h4>申請審核中</h4>
              <p>您的團長申請正在審核中，請耐心等待管理員處理。</p>
              <p class="status-time">
                申請時間：{{ new Date(user?.organizerApplication?.appliedAt || '').toLocaleString() }}
              </p>
            </div>
          </div>

          <div v-else-if="applicationStatus === 'approved'" class="status-box status-approved">
            <div class="status-icon">✅</div>
            <div class="status-content">
              <h4>申請已核准</h4>
              <p>恭喜！您已成為團長，現在可以開始創建活動了。</p>
            </div>
          </div>

          <div v-else-if="applicationStatus === 'rejected'" class="status-box status-rejected">
            <div class="status-icon">❌</div>
            <div class="status-content">
              <h4>申請未通過</h4>
              <p>很抱歉，您的團長申請未獲核准。</p>
            </div>
          </div>
        </div>

        <div v-if="applicationSuccess" class="success-message">
          ✓ 申請已提交！請等待管理員審核。
        </div>
      </AppCard>

      <!-- Admin Link -->
      <AppCard v-if="user?.role === 'admin'" class="admin-card">
        <h3>管理員功能</h3>
        <p>您可以審核團長申請和管理系統設定。</p>
        <AppButton variant="primary" @click="router.push('/admin/applications')">
          審核團長申請
        </AppButton>
      </AppCard>

      <!-- Actions -->
      <div class="actions">
        <AppButton variant="danger" @click="handleLogout">登出</AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xl);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-card {
  margin-bottom: var(--spacing-lg);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}

.avatar {
  width: 80px;
  height: 80px;
  background: var(--gradient-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  box-shadow: var(--shadow-colored);
}

.user-info h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.email {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-sm);
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
}

.role-admin {
  background-color: var(--color-danger);
  color: white;
}

.role-organizer {
  background: var(--gradient-secondary);
  color: white;
}

.role-member {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
}

.detail-item .label {
  color: var(--color-text-muted);
  font-weight: 500;
}

.detail-item .value {
  color: var(--color-text-main);
  font-weight: 600;
}

.permission-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.permission-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.tag-create {
  background: var(--gradient-primary);
  color: white;
}

.tag-register {
  background: var(--gradient-secondary);
  color: white;
}

.tag-admin {
  background-color: var(--color-danger);
  color: white;
}

.application-card,
.admin-card {
  margin-bottom: var(--spacing-lg);
}

.application-card h3,
.admin-card h3 {
  margin-bottom: var(--spacing-md);
  color: var(--color-secondary);
}

.application-description {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.application-form {
  margin-top: var(--spacing-md);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-main);
}

.textarea-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-surface);
  color: var(--color-text-main);
  font-family: inherit;
  resize: vertical;
  transition: border-color var(--transition-fast);
}

.textarea-input:focus {
  border-color: var(--color-secondary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

.status-box {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-md);
}

.status-icon {
  font-size: 2rem;
}

.status-content h4 {
  margin-bottom: var(--spacing-xs);
  font-size: 1.125rem;
}

.status-content p {
  color: var(--color-text-muted);
  line-height: 1.6;
}

.status-time {
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
}

.status-pending {
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid var(--color-warning);
}

.status-approved {
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--color-success);
}

.status-rejected {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-danger);
}

.error-message {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  margin-bottom: var(--spacing-md);
}

.success-message {
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--color-success);
  color: var(--color-success);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  margin-top: var(--spacing-md);
}

.admin-card p {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}
</style>
