<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEventStore } from '@/stores/eventStore'
import { venues } from '@/data/venues'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/AppInput.vue'
import AppCard from '@/components/AppCard.vue'

const router = useRouter()
const store = useEventStore()

const form = ref({
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  description: '',
  maxParticipants: 4,
  level: 'All Levels' as const,
  price: 0
})

function handleSubmit() {
  // Basic validation
  if (!form.value.title || !form.value.date || !form.value.location || !form.value.startTime || !form.value.endTime) return

  store.createEvent({
    ...form.value,
    maxParticipants: Number(form.value.maxParticipants),
    price: Number(form.value.price)
  })

  router.push('/events')
}
</script>

<template>
  <div class="container">
    <div class="form-container">
      <h1>開新羽球團</h1>
      <AppCard>
        <form @submit.prevent="handleSubmit" class="event-form">
          <AppInput v-model="form.title" label="活動標題" placeholder="例如：週五歡樂羽球" required />

          <div class="row">
            <AppInput v-model="form.date" type="date" label="日期" required />
            <div class="time-range">
              <AppInput v-model="form.startTime" type="time" label="開始時間" required />
              <AppInput v-model="form.endTime" type="time" label="結束時間" required />
            </div>
          </div>

          <div class="form-group">
            <label>地點 <span class="required">*</span></label>
            <select v-model="form.location" class="select-input" required>
              <option value="" disabled>請選擇球館</option>
              <option v-for="venue in venues" :key="venue.name" :value="venue.name">
                {{ venue.name }} ({{ venue.address }})
              </option>
            </select>
          </div>

          <div class="row">
            <div class="form-group">
              <label>程度要求</label>
              <select v-model="form.level" class="select-input">
                <option value="All Levels">不限程度</option>
                <option value="Beginner">新手友善</option>
                <option value="Intermediate">中級程度</option>
                <option value="Advanced">高手過招</option>
              </select>
            </div>
            <AppInput v-model="form.maxParticipants" type="number" label="人數上限" required />
          </div>

          <AppInput v-model="form.price" type="number" label="費用 (每人)" required />

          <div class="form-group">
            <label>活動描述</label>
            <textarea v-model="form.description" rows="4" class="textarea-input" placeholder="補充說明..."></textarea>
          </div>

          <div class="actions">
            <AppButton variant="text" @click="router.back()">取消</AppButton>
            <AppButton type="submit" variant="primary">確認開團</AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.time-range {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-main);
}

.required {
  color: var(--color-danger);
}

.select-input,
.textarea-input {
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-surface);
  color: var(--color-text-main);
  font-family: inherit;
  width: 100%;
}

.select-input:focus,
.textarea-input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}
</style>
