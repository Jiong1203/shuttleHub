<script setup lang="ts">
defineProps<{
  label?: string
  modelValue: string | number
  type?: string
  placeholder?: string
  error?: string
  required?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>

<template>
  <div class="app-input-group">
    <label v-if="label" class="label">
      {{ label }} <span v-if="required" class="required">*</span>
    </label>
    <input
      :value="modelValue"
      :type="type || 'text'"
      :placeholder="placeholder"
      class="input"
      :class="{ 'has-error': error }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
.app-input-group {
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

.input {
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-surface);
  color: var(--color-text-main);
  transition: border-color var(--transition-fast);
}

.input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.input.has-error {
  border-color: var(--color-danger);
}

.error-message {
  font-size: 0.75rem;
  color: var(--color-danger);
}
</style>
