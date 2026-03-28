<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollAnimation } from '../composables/useScrollAnimation'

const sectionRef = ref<HTMLElement | null>(null)
useScrollAnimation(sectionRef)

const { t, tm } = useI18n()

const features = computed(() => tm('features.items') as Array<{ icon: string; title: string; description: string }>)
</script>

<template>
  <section ref="sectionRef" class="section" id="features">
    <div class="features-header animate-on-scroll">
      <div class="section-label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>
        {{ t('features.label') }}
      </div>
      <h2 class="section-title">{{ t('features.title') }}</h2>
      <p class="section-desc">{{ t('features.desc') }}</p>
    </div>

    <div class="features-grid">
      <div v-for="(feature, index) in features" :key="index" class="feature-card animate-on-scroll">
        <div class="feature-icon">{{ feature.icon }}</div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-header {
  text-align: center;
  margin-bottom: 64px;
}
.features-header .section-desc {
  margin: 0 auto;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.feature-card {
  position: relative;
  padding: 32px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.35s ease;
  overflow: hidden;
}
.feature-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(134, 59, 255, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.35s;
}
.feature-card:hover {
  background: rgba(134, 59, 255, 0.04);
  border-color: rgba(134, 59, 255, 0.15);
}
.feature-card:hover::before {
  opacity: 1;
}
.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  background: rgba(134, 59, 255, 0.1);
  border: 1px solid rgba(134, 59, 255, 0.15);
  color: #fafafa;
  margin-bottom: 16px;
}
.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #fafafa;
}
.feature-card p {
  font-size: 14px;
  color: #a1a1aa;
  line-height: 1.7;
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
