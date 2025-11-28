<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'text'
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
  transition: all var(--transition-normal);
  border: 1px solid transparent;
  gap: var(--spacing-sm);
  position: relative;
  overflow: hidden;
}

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.app-button:not(:disabled):active {
  transform: translateY(1px);
}

/* Variants */
.variant-primary {
  background-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}
.variant-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  box-shadow: var(--shadow-green);
  transform: translateY(-1px);
}

.variant-secondary {
  background-color: var(--color-secondary);
  color: white;
  box-shadow: var(--shadow-sm);
}
.variant-secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-hover);
  box-shadow: var(--shadow-purple);
  transform: translateY(-1px);
}

.variant-outline {
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}
.variant-outline:hover:not(:disabled) {
  border-color: var(--color-primary-hover);
  color: white;
  background-color: var(--color-primary);
  box-shadow: var(--shadow-green);
  transform: translateY(-1px);
}

.variant-danger {
  background-color: var(--color-danger);
  color: white;
  box-shadow: var(--shadow-sm);
}
.variant-danger:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.variant-text {
  background-color: transparent;
  color: var(--color-text-muted);
}
.variant-text:hover:not(:disabled) {
  color: var(--color-text-main);
  background-color: var(--color-bg-body);
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
