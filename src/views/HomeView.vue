<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'

const router = useRouter()
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-content">
        <h1 class="hero-title">
          羽球揪團，<span class="highlight">輕鬆搞定</span>
        </h1>
        <p class="hero-subtitle">
          ShuttleHub 是最便利的羽球活動平台。無論是想找人切磋，還是舉辦比賽，這裡都能滿足你的需求。
        </p>
        <div class="hero-actions">
          <AppButton size="lg" @click="router.push('/events')">尋找活動</AppButton>
          <AppButton size="lg" variant="outline" @click="router.push('/events/create')">我要開團</AppButton>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">為什麼選擇 ShuttleHub？</h2>
        <div class="feature-grid">
          <AppCard class="feature-card">
            <div class="icon">🚀</div>
            <h3>快速開團</h3>
            <p>簡單幾步設定，立即發布您的羽球活動，讓球友輕鬆報名。</p>
          </AppCard>
          <AppCard class="feature-card">
            <div class="icon">📝</div>
            <h3>報名管理</h3>
            <p>主辦者可輕鬆審核報名，即時掌握參與人數與名單。</p>
          </AppCard>
          <AppCard class="feature-card">
            <div class="icon">🤝</div>
            <h3>尋找球友</h3>
            <p>依程度分級尋找適合的活動，認識更多志同道合的球友。</p>
          </AppCard>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <h2>準備好揮灑汗水了嗎？</h2>
        <p>立即加入 ShuttleHub，開始你的羽球之旅！</p>
        <AppButton size="lg" variant="primary" @click="router.push('/events')">立即開始</AppButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* Hero Section */
.hero {
  padding: 4rem 0;
  text-align: center;
  background: linear-gradient(to bottom, var(--color-bg-surface), var(--color-bg-body));
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  line-height: 1.2;
}

.highlight {
  color: var(--color-primary);
  position: relative;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto var(--spacing-lg);
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

/* Features Section */
.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: var(--spacing-xl);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.feature-card {
  text-align: center;
  padding: var(--spacing-xl);
  height: 100%;
}

.icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.feature-card h3 {
  margin-bottom: var(--spacing-sm);
  font-size: 1.25rem;
}

.feature-card p {
  color: var(--color-text-muted);
}

/* CTA Section */
.cta {
  text-align: center;
  padding: 4rem 0;
  background-color: var(--color-bg-surface);
  border-top: 1px solid var(--color-border);
}

.cta h2 {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.cta p {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
}
</style>
