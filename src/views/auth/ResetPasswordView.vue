<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/AppInput.vue'
import AppCard from '@/components/AppCard.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  newPassword: '',
  confirmPassword: '',
})

const token = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

onMounted(() => {
  // 從 URL 查詢參數獲取 token
  const tokenParam = route.query.token as string
  if (!tokenParam) {
    error.value = '無效的重設連結，缺少 Token'
    return
  }
  token.value = tokenParam
})

function handleSubmit() {
  error.value = ''
  loading.value = true

  // Basic validation
  if (!form.value.newPassword || !form.value.confirmPassword) {
    error.value = '請填寫所有欄位'
    loading.value = false
    return
  }

  // Password length validation
  if (form.value.newPassword.length < 6) {
    error.value = '密碼長度至少需要 6 個字元'
    loading.value = false
    return
  }

  // Password match validation
  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = '密碼與確認密碼不一致'
    loading.value = false
    return
  }

  if (!token.value) {
    error.value = '無效的重設連結'
    loading.value = false
    return
  }

  authStore
    .resetPassword(token.value, form.value.newPassword)
    .then((result) => {
      loading.value = false

      if (result.success) {
        success.value = true
        // 3 秒後自動跳轉到登入頁面
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        error.value = result.error || '重設密碼失敗'
      }
    })
    .catch(() => {
      loading.value = false
      error.value = '重設密碼失敗，請稍後再試'
    })
}
</script>

<template>
  <div class="container">
    <div class="reset-password-container">
      <AppCard class="reset-password-card">
        <div v-if="!success" class="reset-password-header">
          <h1>重設密碼</h1>
          <p>請輸入您的新密碼</p>
        </div>

        <form v-if="!success && token" @submit.prevent="handleSubmit" class="reset-password-form">
          <AppInput
            v-model="form.newPassword"
            type="password"
            label="新密碼"
            placeholder="至少 6 個字元"
            required
          />

          <AppInput
            v-model="form.confirmPassword"
            type="password"
            label="確認密碼"
            placeholder="請再次輸入新密碼"
            required
          />

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <AppButton type="submit" variant="primary" class="submit-btn" :disabled="loading">
            {{ loading ? '重設中...' : '重設密碼' }}
          </AppButton>

          <div class="divider">
            <span>或</span>
          </div>

          <p class="login-link">
            記起密碼了？
            <router-link to="/login" class="link">返回登入</router-link>
          </p>
        </form>

        <div v-if="!token && !success" class="error-state">
          <div class="error-icon">✕</div>
          <h2>無效的重設連結</h2>
          <p>此重設連結無效或已過期，請重新申請重設密碼。</p>
          <AppButton variant="primary" class="submit-btn" @click="router.push('/forgot-password')">
            重新申請
          </AppButton>
        </div>

        <div v-else-if="success" class="success-message">
          <div class="success-icon">✓</div>
          <h2>密碼重設成功</h2>
          <p>您的密碼已成功重設，請使用新密碼登入。</p>
          <p class="hint">將在 3 秒後自動跳轉到登入頁面...</p>
          <AppButton variant="primary" class="submit-btn" @click="router.push('/login')">
            立即登入
          </AppButton>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<style scoped>
.reset-password-container {
  max-width: 480px;
  margin: 3rem auto;
  padding: 0 var(--spacing-md);
}

.reset-password-card {
  padding: var(--spacing-2xl);
}

.reset-password-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.reset-password-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.reset-password-header p {
  color: var(--color-text-muted);
}

.reset-password-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.error-message {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.error-state {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.error-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-md);
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  font-weight: bold;
}

.error-state h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-main);
}

.error-state p {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

.success-message {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-md);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  font-weight: bold;
}

.success-message h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-main);
}

.success-message p {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-sm);
  line-height: 1.6;
}

.success-message .hint {
  font-size: 0.875rem;
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  color: var(--color-text-muted);
}

.submit-btn {
  width: 100%;
  margin-top: var(--spacing-sm);
}

.divider {
  position: relative;
  text-align: center;
  margin: var(--spacing-md) 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--color-border);
}

.divider span {
  position: relative;
  background-color: var(--color-bg-surface);
  padding: 0 var(--spacing-md);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.login-link {
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.link {
  color: var(--color-primary);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.link:hover {
  color: var(--color-primary-hover);
}
</style>

