<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label?: string
  modelValue: string
  required?: boolean
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Generate time options with 30-minute intervals
const timeOptions = computed(() => {
  const options: string[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const hourStr = hour.toString().padStart(2, '0')
      const minuteStr = minute.toString().padStart(2, '0')
      options.push(`${hourStr}:${minuteStr}`)
    }
  }
  return options
})
</script>

<template>
  <div class="time-select-group">
    <label v-if="label" class="label">
      {{ label }} <span v-if="required" class="required">*</span>
    </label>
    <select
      :value="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="select-input"
      :class="{ 'has-error': error }"
      :required="required"
    >
      <option value="" disabled>請選擇時間</option>
      <option v-for="time in timeOptions" :key="time" :value="time">
        {{ time }}
      </option>
    </select>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
.time-select-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-main);
}

.required {
  color: var(--color-danger);
}

.select-input {
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-surface);
  color: var(--color-text-main);
  transition: border-color var(--transition-fast);
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
}

.select-input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.select-input.has-error {
  border-color: var(--color-danger);
}

.error-message {
  font-size: 0.75rem;
  color: var(--color-danger);
}
</style>
