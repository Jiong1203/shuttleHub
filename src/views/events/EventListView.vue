<script setup lang="ts">
import { computed } from 'vue'
import { useEventStore, type Event } from '@/stores/eventStore'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useEventStore()

const events = computed(() => store.events)

function goToDetail(id: string) {
  router.push(`/events/${id}`)
}

function getDuration(event: Event) {
  if (!event.startTime || !event.endTime) return 0

  // Parse hours and minutes
  const [startHour = 0, startMin = 0] = event.startTime.split(':').map(Number)
  const [endHour = 0, endMin = 0] = event.endTime.split(':').map(Number)

  // Calculate total minutes
  const startTotalMin = startHour * 60 + startMin
  const endTotalMin = endHour * 60 + endMin

  // Return hours (with decimals)
  return (endTotalMin - startTotalMin) / 60
}
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>近期活動</h1>
      <AppButton @click="router.push('/events/create')">開新團</AppButton>
    </div>

    <div class="event-grid">
      <AppCard v-for="event in events" :key="event.id" class="event-card">
        <div class="event-content">
          <div class="event-header">
            <span class="badge">{{ event.level }}</span>
            <span class="price">${{ event.price }} / {{ getDuration(event) }}hr</span>
          </div>
          <h3>{{ event.title }}</h3>
          <div class="info-row">
            <span>📅 {{ event.date }}</span>
            <span>⏰ {{ event.startTime }} - {{ event.endTime }}</span>
          </div>
          <div class="info-row">
            <span>📍 {{ event.location }}</span>
          </div>
          <div class="participants">
            <span>👥 {{ event.maxParticipants }} 人滿團</span>
          </div>
          <AppButton variant="outline" class="action-btn" @click="goToDetail(event.id)">
            查看詳情
          </AppButton>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.event-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.badge {
  background: var(--gradient-secondary);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  color: white;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.price {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1.125rem;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.info-row {
  display: flex;
  gap: var(--spacing-md);
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.participants {
  margin-top: var(--spacing-xs);
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.action-btn {
  margin-top: var(--spacing-md);
  width: 100%;
}

.event-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}
</style>
