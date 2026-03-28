<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollAnimation } from '../composables/useScrollAnimation'

const sectionRef = ref<HTMLElement | null>(null)
useScrollAnimation(sectionRef)

const { t, tm } = useI18n()

const imgMap = [
  '/img/ScreenShot_2026-03-27_222336_861.png',
  '/img/ScreenShot_2026-03-27_222401_959.png',
  '/img/ScreenShot_2026-03-27_222345_305.png',
  '/img/ScreenShot_2026-03-27_222445_131.png',
  '/img/ScreenShot_2026-03-27_213954_784.png',
]

const tabLabels = computed(() => tm('screenshots.tabs') as string[])

const activeIndex = ref(0)
const imageOpacity = ref(1)
const currentSrc = ref(imgMap[0])

function switchTab(index: number): void {
  if (index === activeIndex.value) return
  activeIndex.value = index
  imageOpacity.value = 0
  setTimeout(() => {
    currentSrc.value = imgMap[index]
  }, 200)
}

function onImageLoad(): void {
  imageOpacity.value = 1
}
</script>

<template>
  <section ref="sectionRef" class="screenshots-section" id="screenshots">
    <div class="screenshots-header animate-on-scroll">
      <div class="section-label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        {{ t('screenshots.label') }}
      </div>
      <h2 class="section-title">{{ t('screenshots.title') }}</h2>
      <p class="section-desc">{{ t('screenshots.desc') }}</p>
    </div>

    <div class="screenshot-tabs">
      <button
        v-for="(label, i) in tabLabels"
        :key="i"
        :class="['screenshot-tab', { active: i === activeIndex }]"
        @click="switchTab(i)"
      >
        {{ label }}
      </button>
    </div>

    <div class="screenshot-display animate-on-scroll">
      <div class="screenshot-frame">
        <div class="screenshot-frame-bar">
          <div class="screenshot-frame-dot"></div>
          <div class="screenshot-frame-dot"></div>
          <div class="screenshot-frame-dot"></div>
        </div>
        <img
          :src="currentSrc"
          :style="{ opacity: imageOpacity, transition: 'opacity 0.4s ease' }"
          alt="DevFleet"
          @load="onImageLoad"
        />
      </div>
      <div class="screenshot-glow"></div>
    </div>
  </section>
</template>

<style scoped>
.screenshots-section {
  padding: 120px 0;
  overflow: hidden;
}
.screenshots-header {
  text-align: center;
  padding: 0 24px;
  margin-bottom: 64px;
}
.screenshots-header .section-desc {
  margin: 0 auto;
}
.screenshot-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 48px;
  padding: 0 24px;
  flex-wrap: wrap;
}
.screenshot-tab {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #71717a;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.25s;
  cursor: pointer;
}
.screenshot-tab:hover {
  color: #d4d4d8;
  border-color: rgba(255, 255, 255, 0.15);
}
.screenshot-tab.active {
  background: rgba(134, 59, 255, 0.15);
  border-color: rgba(134, 59, 255, 0.3);
  color: #fff;
}
.screenshot-display {
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
}
.screenshot-frame {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.4),
    0 0 48px rgba(134, 59, 255, 0.08);
}
.screenshot-frame img {
  width: 100%;
  display: block;
}
.screenshot-frame-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(24, 24, 27, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.screenshot-frame-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.screenshot-frame-dot:nth-child(1) {
  background: #ef4444;
}
.screenshot-frame-dot:nth-child(2) {
  background: #eab308;
}
.screenshot-frame-dot:nth-child(3) {
  background: #22c55e;
}
.screenshot-glow {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 120px;
  background: radial-gradient(ellipse, rgba(134, 59, 255, 0.15), transparent);
  filter: blur(50px);
  pointer-events: none;
}

@media (max-width: 600px) {
  .screenshots-section {
    padding: 80px 0;
  }
}
</style>
