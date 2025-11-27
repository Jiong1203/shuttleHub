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
  gap: var(--spacing-2xl);
}

/* Hero Section */
.hero {
  padding: 5rem 0;
  text-align: center;
  background: linear-gradient(135deg,
    rgba(209, 250, 229, 0.6) 0%,
    rgba(243, 232, 255, 0.6) 50%,
    rgba(221, 214, 254, 0.6) 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background:
    radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 50%);
  animation: heroFloat 20s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes heroFloat {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-10%, -10%) rotate(5deg);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: var(--spacing-md);
  line-height: 1.1;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
}

.highlight {
  background: var(--gradient-secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto var(--spacing-xl);
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

/* Features Section */
.features {
  padding: var(--spacing-2xl) 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: var(--spacing-xl);
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

.feature-card {
  text-align: center;
  padding: var(--spacing-xl);
  height: 100%;
  transition: all var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
  filter: drop-shadow(0 4px 10px rgba(16, 185, 129, 0.3));
}

.feature-card h3 {
  margin-bottom: var(--spacing-sm);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
}

.feature-card p {
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* CTA Section */
.cta {
  text-align: center;
  padding: 5rem 0;
  background: linear-gradient(135deg,
    rgba(16, 185, 129, 0.1) 0%,
    rgba(168, 85, 247, 0.1) 100%);
  border-top: 2px solid transparent;
  border-image: var(--gradient-primary) 1;
  position: relative;
  overflow: hidden;
}

.cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%);
  z-index: 0;
  pointer-events: none;
}

.cta > div {
  position: relative;
  z-index: 1;
}

.cta h2 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
  font-weight: 700;
  background: var(--gradient-secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta p {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xl);
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .section-title,
  .cta h2 {
    font-size: 2rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
