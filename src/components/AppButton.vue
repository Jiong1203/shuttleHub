<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'outline' | 'danger' | 'text'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()
</script>

<template>
  <button
    :type="type || 'button'"
    :class="[
      'app-button',
      `variant-${variant || 'primary'}`,
      `size-${size || 'md'}`
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
  gap: var(--spacing-sm);
}

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Variants */
.variant-primary {
  background-color: var(--color-primary);
  color: white;
}
.variant-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.variant-outline {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text-main);
}
.variant-outline:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.variant-danger {
  background-color: var(--color-danger);
  color: white;
}
.variant-danger:hover:not(:disabled) {
  opacity: 0.9;
}

.variant-text {
  background-color: transparent;
  color: var(--color-text-muted);
}
.variant-text:hover:not(:disabled) {
  color: var(--color-text-main);
  background-color: var(--color-bg-surface);
}

/* Sizes */
.size-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
.size-md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
.size-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}
</style>
