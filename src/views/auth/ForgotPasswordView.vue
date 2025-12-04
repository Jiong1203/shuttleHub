<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/AppInput.vue'
import AppCard from '@/components/AppCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
})

const error = ref('')
const success = ref(false)
const loading = ref(false)

function handleSubmit() {
  error.value = ''
  success.value = false
  loading.value = true

  // Basic validation
  if (!form.value.email) {
    error.value = '請輸入 Email'
    loading.value = false
    return
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    error.value = 'Email 格式不正確'
    loading.value = false
    return
  }

  authStore
    .forgotPassword(form.value.email)
    .then((result) => {
      loading.value = false

      if (result.success) {
        success.value = true
      } else {
        error.value = result.error || '請求失敗'
      }
    })
    .catch(() => {
      loading.value = false
      error.value = '請求失敗，請稍後再試'
    })
}
</script>

<template>
  <div class="container">
    <div class="forgot-password-container">
      <AppCard class="forgot-password-card">
        <div class="forgot-password-header">
          <h1>忘記密碼</h1>
          <p>請輸入您的 Email，我們將發送重設密碼連結給您</p>
        </div>

        <form v-if="!success" @submit.prevent="handleSubmit" class="forgot-password-form">
          <AppInput
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            required
          />

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <AppButton type="submit" variant="primary" class="submit-btn" :disabled="loading">
            {{ loading ? '發送中...' : '發送重設連結' }}
          </AppButton>

          <div class="divider">
            <span>或</span>
          </div>

          <p class="login-link">
            記起密碼了？
            <router-link to="/login" class="link">返回登入</router-link>
          </p>
        </form>

        <div v-else class="success-message">
          <div class="success-icon">✓</div>
          <h2>郵件已發送</h2>
          <p>
            我們已將重設密碼連結發送至 <strong>{{ form.email }}</strong>
          </p>
          <p class="hint">
            請檢查您的收件匣（包括垃圾郵件資料夾）。重設連結將在 1 小時後過期。
          </p>
          <AppButton variant="primary" class="submit-btn" @click="router.push('/login')">
            返回登入
          </AppButton>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<style scoped>
.forgot-password-container {
  max-width: 480px;
  margin: 3rem auto;
  padding: 0 var(--spacing-md);
}

.forgot-password-card {
  padding: var(--spacing-2xl);
}

.forgot-password-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.forgot-password-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.forgot-password-header p {
  color: var(--color-text-muted);
}

.forgot-password-form {
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

.success-message p strong {
  color: var(--color-text-main);
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

