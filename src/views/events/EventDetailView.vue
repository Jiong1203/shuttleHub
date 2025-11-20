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
const isRegistered = computed(() => registrations.value.some(r => r.userId === store.currentUser.id))

function handleRegister() {
  store.registerForEvent(eventId)
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
              <span class="value">{{ event.time }}</span>
            </div>
            <div class="meta-item">
              <span class="label">地點</span>
              <span class="value">{{ event.location }}</span>
            </div>
            <div class="meta-item">
              <span class="label">費用</span>
              <span class="value">${{ event.price }} / 人</span>
            </div>
          </div>

          <div class="description">
            <h3>活動詳情</h3>
            <p>{{ event.description }}</p>
          </div>
        </AppCard>
      </div>

      <div class="sidebar">
        <AppCard>
          <h3>報名狀態</h3>
          <div class="status-info">
            <div class="progress">
              <span class="count">{{ registrations.length }}</span>
              <span class="total">/ {{ event.maxParticipants }}</span>
            </div>
            <p class="status-text">已報名人數</p>
          </div>

          <AppButton 
            v-if="!isRegistered" 
            variant="primary" 
            class="full-width"
            @click="handleRegister"
            :disabled="registrations.length >= event.maxParticipants"
          >
            {{ registrations.length >= event.maxParticipants ? '已額滿' : '立即報名' }}
          </AppButton>
          <AppButton v-else variant="outline" class="full-width" disabled>
            已報名
          </AppButton>
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
  background-color: var(--color-primary);
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  margin-bottom: var(--spacing-sm);
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
  color: var(--color-primary);
}

.total {
  font-size: 1.5rem;
  color: var(--color-text-muted);
}

.full-width {
  width: 100%;
}

.not-found {
  text-align: center;
  padding-top: var(--spacing-xl);
}
</style>
