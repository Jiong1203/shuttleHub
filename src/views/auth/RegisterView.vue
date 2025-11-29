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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const error = ref('')
const loading = ref(false)

function handleSubmit() {
  error.value = ''
  loading.value = true

  // Basic validation
  if (!form.value.name || !form.value.email || !form.value.password || !form.value.confirmPassword) {
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

  // Password length validation
  if (form.value.password.length < 6) {
    error.value = '密碼長度至少需要 6 個字元'
    loading.value = false
    return
  }

  // Password match validation
  if (form.value.password !== form.value.confirmPassword) {
    error.value = '密碼與確認密碼不一致'
    loading.value = false
    return
  }

  authStore.register(form.value.email, form.value.password, form.value.name).then((result) => {
    loading.value = false

    if (result.success) {
      router.push('/')
    } else {
      error.value = result.error || '註冊失敗'
    }
  }).catch(() => {
    loading.value = false
    error.value = '註冊失敗'
  })
}
</script>

<template>
  <div class="container">
    <div class="register-container">
      <AppCard class="register-card">
        <div class="register-header">
          <h1>註冊 ShuttleHub</h1>
          <p>加入我們，開始您的羽球之旅</p>
        </div>

        <form @submit.prevent="handleSubmit" class="register-form">
          <AppInput
            v-model="form.name"
            type="text"
            label="姓名"
            placeholder="請輸入您的姓名"
            required
          />

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
            placeholder="至少 6 個字元"
            required
          />

          <AppInput
            v-model="form.confirmPassword"
            type="password"
            label="確認密碼"
            placeholder="請再次輸入密碼"
            required
          />

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <AppButton type="submit" variant="primary" class="submit-btn" :disabled="loading">
            {{ loading ? '註冊中...' : '註冊' }}
          </AppButton>

          <div class="divider">
            <span>或</span>
          </div>

          <p class="login-link">
            已經有帳號了？
            <router-link to="/login" class="link">立即登入</router-link>
          </p>
        </form>

        <div class="info-box">
          <p class="info-title">📝 註冊說明</p>
          <ul class="info-list">
            <li>註冊後您將成為<strong>一般會員</strong></li>
            <li>一般會員可以<strong>報名活動</strong></li>
            <li>若要開團，請在個人資料頁面<strong>申請成為團長</strong></li>
          </ul>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 480px;
  margin: 3rem auto;
  padding: 0 var(--spacing-md);
}

.register-card {
  padding: var(--spacing-2xl);
}

.register-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.register-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  background: var(--gradient-secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-header p {
  color: var(--color-text-muted);
}

.register-form {
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

.login-link {
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.link {
  color: var(--color-secondary);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.link:hover {
  color: var(--color-secondary-hover);
}

.info-box {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  border: 1px solid var(--color-border-accent);
  border-radius: var(--radius-md);
}

.info-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin-bottom: var(--spacing-sm);
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-list li {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  padding-left: var(--spacing-md);
  position: relative;
}

.info-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
}

.info-list li strong {
  color: var(--color-primary);
}
</style>
