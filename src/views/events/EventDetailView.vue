<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventStore } from '@/stores/eventStore'
import { useAuthStore } from '@/stores/authStore'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'

const route = useRoute()
const router = useRouter()
const store = useEventStore()
const authStore = useAuthStore()

const eventId = route.params.id as string
const event = computed(() => store.getEventById(eventId))
const registrations = computed(() => store.getRegistrationsByEventId(eventId))
const myRegistration = computed(() => registrations.value.find(r => r.userId === authStore.currentUser?.id))
const isRegistered = computed(() => !!myRegistration.value)

const approvedRegistrations = computed(() => {
  return registrations.value
    .filter(r => r.status === 'approved' || r.status === 'pending')
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
})

// Form state
const showForm = ref(false)
const form = ref({
  name: authStore.currentUser?.name || '',
  count: 1
})

// Watch for registration changes to update form defaults if editing
watch(myRegistration, (newReg) => {
  if (newReg) {
    form.value.name = newReg.name
    form.value.count = newReg.count
  }
}, { immediate: true })

// Set default name from auth store
watch(() => authStore.currentUser, (user) => {
  if (user && !myRegistration.value) {
    form.value.name = user.name
  }
}, { immediate: true })

const duration = computed(() => {
  const ev = event.value
  if (!ev || !ev.startTime || !ev.endTime) return 0

  // Parse hours and minutes
  const [startHour = 0, startMin = 0] = ev.startTime.split(':').map(Number)
  const [endHour = 0, endMin = 0] = ev.endTime.split(':').map(Number)

  // Calculate total minutes
  const startTotalMin = startHour * 60 + startMin
  const endTotalMin = endHour * 60 + endMin

  // Return hours (with decimals)
  return (endTotalMin - startTotalMin) / 60
})

const currentParticipants = computed(() => {
  return registrations.value
    .filter(r => r.status === 'approved' || r.status === 'pending')
    .reduce((sum, r) => sum + Number(r.count), 0)
})

const isFull = computed(() => {
  if (!event.value) return false
  return currentParticipants.value >= event.value.maxParticipants
})

function handleRegister() {
  if (!event.value) return
  store.registerForEvent(eventId, form.value.name, Number(form.value.count))
  showForm.value = false
}

function handleUpdate() {
  if (!myRegistration.value) return
  store.updateRegistration(myRegistration.value.id, {
    name: form.value.name,
    count: Number(form.value.count)
  })
  showForm.value = false
}

function handleCancel() {
  if (!myRegistration.value) return
  if (confirm('確定要取消報名嗎？')) {
    store.cancelRegistration(myRegistration.value.id)
    showForm.value = false
  }
}
</script>

<template>
  <div class="container" v-if="event">
    <div class="detail-layout">
      <div class="main-info">
        <AppCard>
          <div class="header">
            <span class="badge">{{ event.level }}</span>
            <h1>{{ event.title }}</h1>
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <span class="label">日期</span>
              <span class="value">{{ event.date }}</span>
            </div>
            <div class="meta-item">
              <span class="label">時間</span>
              <span class="value">{{ event.startTime }} - {{ event.endTime }} ({{ duration }}小時)</span>
            </div>
            <div class="meta-item">
              <span class="label">地點</span>
              <span class="value">{{ event.location }}</span>
            </div>
            <div class="meta-item">
              <span class="label">費用</span>
              <span class="value">${{ event.price }} / {{ duration }}小時</span>
            </div>
          </div>

          <div class="description">
            <h3>活動詳情</h3>
            <p>{{ event.description }}</p>
          </div>

          <div v-if="approvedRegistrations.length > 0" class="participants-section">
            <h3>已報名名單 ({{ approvedRegistrations.length }})</h3>
            <div class="participant-list">
              <div v-for="(reg, index) in approvedRegistrations" :key="reg.id" class="participant-item">
                <span class="participant-number">{{ index + 1 }}.</span>
                <span class="participant-name">{{ reg.name }}</span>
                <span class="participant-count">({{ reg.count }}人)</span>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <div class="sidebar">
        <AppCard>
          <h3>報名狀態</h3>
          <div class="status-info">
            <div class="progress">
              <span class="count">{{ currentParticipants }}</span>
              <span class="total">/ {{ event.maxParticipants }}</span>
            </div>
            <p class="status-text">目前人數</p>
          </div>

          <!-- Not Registered -->
          <div v-if="!isRegistered">
            <!-- Not logged in -->
            <div v-if="!authStore.isAuthenticated" class="login-prompt">
              <p>請先登入才能報名活動</p>
              <AppButton
                variant="primary"
                class="full-width"
                @click="router.push({ name: 'login', query: { redirect: $route.fullPath } })"
              >
                前往登入
              </AppButton>
            </div>

            <!-- Logged in but not registered -->
            <div v-else>
              <div v-if="!showForm">
                <AppButton
                  variant="primary"
                  class="full-width"
                  @click="showForm = true"
                >
                  {{ isFull ? '加入候補' : '立即報名' }}
                </AppButton>
              </div>
              <form v-else @submit.prevent="handleRegister" class="reg-form">
                <AppInput v-model="form.name" label="報名名稱" required />
                <AppInput v-model="form.count" type="number" label="報名人數" min="1" required />
                <div class="form-actions">
                  <AppButton variant="text" size="sm" @click="showForm = false">取消</AppButton>
                  <AppButton type="submit" variant="primary" size="sm">確認</AppButton>
                </div>
              </form>
            </div>
          </div>

          <!-- Registered -->
          <div v-else class="registered-info">
            <div class="status-badge" :class="myRegistration?.status">
              {{ myRegistration?.status === 'waitlist' ? '候補中' : '已報名' }}
            </div>
            <div class="reg-details">
              <p><strong>名稱：</strong>{{ myRegistration?.name }}</p>
              <p><strong>人數：</strong>{{ myRegistration?.count }} 位</p>
            </div>

            <div v-if="!showForm" class="reg-actions">
              <AppButton variant="outline" size="sm" class="full-width" @click="showForm = true">修改報名</AppButton>
              <AppButton variant="danger" size="sm" class="full-width" @click="handleCancel">取消報名</AppButton>
            </div>
            <form v-else @submit.prevent="handleUpdate" class="reg-form">
              <AppInput v-model="form.name" label="報名名稱" required />
              <AppInput v-model="form.count" type="number" label="報名人數" min="1" required />
              <div class="form-actions">
                <AppButton variant="text" size="sm" @click="showForm = false">取消</AppButton>
                <AppButton type="submit" variant="primary" size="sm">儲存</AppButton>
              </div>
            </form>
          </div>

        </AppCard>
      </div>
    </div>
  </div>
  <div v-else class="container not-found">
    <h2>找不到活動</h2>
    <AppButton @click="router.push('/events')">返回列表</AppButton>
  </div>
</template>

<style scoped>
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-lg);
}

@media (max-width: 768px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
}

.header {
  margin-bottom: var(--spacing-lg);
}

.badge {
  display: inline-block;
  background: var(--gradient-secondary);
  color: white;
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-purple);
}

h1 {
  font-size: 2rem;
  line-height: 1.2;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.value {
  font-weight: 600;
  font-size: 1.125rem;
}

.description h3 {
  margin-bottom: var(--spacing-sm);
}

.description p {
  color: var(--color-text-muted);
  white-space: pre-line;
}

.status-info {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.progress {
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.total {
  font-size: 1.5rem;
  color: var(--color-text-muted);
}

.full-width {
  width: 100%;
}

.reg-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.registered-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.status-badge {
  text-align: center;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  font-weight: 600;
}

.status-badge.approved {
  background-color: var(--color-success);
  color: white;
  box-shadow: var(--shadow-green);
}

.status-badge.waitlist {
  background-color: var(--color-secondary);
  color: white;
  box-shadow: var(--shadow-purple);
}

.reg-details {
  background-color: var(--color-bg-body);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

.reg-details p {
  margin-bottom: 4px;
}

.reg-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.login-prompt {
  text-align: center;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-accent);
}

.login-prompt p {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
  font-size: 0.9375rem;
}

.not-found {
  text-align: center;
  padding-top: var(--spacing-xl);
}

.participants-section {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.participants-section h3 {
  margin-bottom: var(--spacing-md);
}

.participant-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.participant-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--color-bg-body);
  border-radius: var(--radius-md);
}

.participant-number {
  color: var(--color-text-muted);
  font-weight: 600;
  min-width: 30px;
}

.participant-name {
  flex: 1;
  font-weight: 500;
}

.participant-count {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

</style>
