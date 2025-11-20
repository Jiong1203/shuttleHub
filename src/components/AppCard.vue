<template>
  <div class="app-card">
    <slot />
  </div>
</template>

<style scoped>
.app-card {
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal);
}

.app-card:hover {
  box-shadow: var(--shadow-md);
}
</style>
