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
  password: '',
})

const error = ref('')
const loading = ref(false)

function handleSubmit() {
  error.value = ''
  loading.value = true

  // Basic validation
  if (!form.value.email || !form.value.password) {
    error.value = '請填寫所有欄位'
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

  const result = authStore.login(form.value.email, form.value.password)

  loading.value = false

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error || '登入失敗'
  }
}
</script>

<template>
  <div class="container">
    <div class="login-container">
      <AppCard class="login-card">
        <div class="login-header">
          <h1>登入 ShuttleHub</h1>
          <p>歡迎回來！請登入您的帳號</p>
        </div>

        <form @submit.prevent="handleSubmit" class="login-form">
          <AppInput
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            required
          />

          <AppInput
            v-model="form.password"
            type="password"
            label="密碼"
            placeholder="請輸入密碼"
            required
          />

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <AppButton type="submit" variant="primary" class="submit-btn" :disabled="loading">
            {{ loading ? '登入中...' : '登入' }}
          </AppButton>

          <div class="divider">
            <span>或</span>
          </div>

          <p class="register-link">
            還沒有帳號？
            <router-link to="/register" class="link">立即註冊</router-link>
          </p>
        </form>

        <div class="test-accounts">
          <p class="test-title">測試帳號：</p>
          <div class="test-account-list">
            <div class="test-account">
              <strong>管理員：</strong> admin@shuttlehub.com / admin123
            </div>
            <div class="test-account">
              <strong>團長：</strong> organizer@test.com / password123
            </div>
            <div class="test-account">
              <strong>會員：</strong> member@test.com / password123
            </div>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 480px;
  margin: 3rem auto;
  padding: 0 var(--spacing-md);
}

.login-card {
  padding: var(--spacing-2xl);
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.login-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header p {
  color: var(--color-text-muted);
}

.login-form {
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

.register-link {
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

.test-accounts {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.test-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-sm);
}

.test-account-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.test-account {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-family: 'Courier New', monospace;
  background-color: var(--color-bg-body);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.test-account strong {
  color: var(--color-text-main);
}
</style>
