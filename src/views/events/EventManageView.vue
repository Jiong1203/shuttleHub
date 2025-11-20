<script setup lang="ts">
import { computed } from 'vue'
import { useEventStore } from '@/stores/eventStore'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useEventStore()

// Filter events where the current user is the organizer
const myEvents = computed(() => 
  store.events.filter(e => e.organizerId === store.currentUser.id)
)

function deleteEvent(id: string) {
  if (confirm('確定要刪除此活動嗎？')) {
    store.deleteEvent(id)
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>管理我的活動</h1>
      <AppButton @click="router.push('/events/create')">開新團</AppButton>
    </div>

    <div v-if="myEvents.length === 0" class="empty-state">
      <p>目前沒有舉辦中的活動</p>
    </div>

    <div class="event-list">
      <AppCard v-for="event in myEvents" :key="event.id" class="event-item">
        <div class="event-info">
          <h3>{{ event.title }}</h3>
          <div class="meta">
            <span>{{ event.date }} {{ event.time }}</span>
            <span>{{ event.location }}</span>
          </div>
        </div>
        <div class="actions">
          <AppButton variant="outline" size="sm" @click="router.push(`/events/${event.id}/participants`)">
            管理報名
          </AppButton>
          <AppButton variant="outline" size="sm" @click="router.push(`/events/${event.id}`)">
            查看
          </AppButton>
          <AppButton variant="danger" size="sm" @click="deleteEvent(event.id)">
            刪除
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

.event-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-info h3 {
  margin-bottom: var(--spacing-xs);
}

.meta {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  display: flex;
  gap: var(--spacing-md);
}

.actions {
  display: flex;
  gap: var(--spacing-sm);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-muted);
}
</style>
