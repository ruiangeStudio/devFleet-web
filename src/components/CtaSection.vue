<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollAnimation } from '../composables/useScrollAnimation'

const sectionRef = ref<HTMLElement | null>(null)
useScrollAnimation(sectionRef)

const { t } = useI18n()
</script>

<template>
  <section ref="sectionRef" class="cta-section" id="download">
    <div class="cta-bg"></div>
    <div class="cta-bg"></div>
    <div class="cta-content animate-on-scroll">
      <div class="section-label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        {{ t('cta.label') }}
      </div>
      <h2 class="section-title">{{ t('cta.title') }}</h2>
      <p class="section-desc">{{ t('cta.desc') }}</p>
      <div class="cta-buttons">
        <a href="https://github.com/nieSugar/devFleet/releases" target="_blank" class="download-btn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>
          {{ t('cta.windows') }}
        </a>
        <a href="https://github.com/nieSugar/devFleet/releases" target="_blank" class="download-btn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          {{ t('cta.macos') }}
        </a>
        <a href="https://github.com/nieSugar/devFleet/releases" target="_blank" class="download-btn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.581 19.049c-.55-.446-.336-1.431-.907-2.031-.573-.6-.329-1.611-.783-2.294-.247-.372-.6-.659-.947-.957-.088-.073-.263-.226-.327-.2.039-.028.266-.057.304-.07.427-.136.838-.342 1.204-.622.527-.402.955-.929 1.247-1.523.342-.694.461-1.488.314-2.244-.147-.756-.566-1.441-1.193-1.942-.397-.318-.843-.548-1.306-.696a4.26 4.26 0 0 0-1.494-.18c-.563.032-1.106.18-1.604.424-.393.19-.763.427-1.099.707-.131.112-.197.17-.331.081-.134-.089-.203-.065-.334.007-.263.142-.523.287-.772.446a6.63 6.63 0 0 0-.963.803 5.74 5.74 0 0 0-.765.993c-.315.527-.52 1.113-.603 1.715a3.85 3.85 0 0 0 .047 1.32c.063.272.148.538.258.794.073.175.182.335.262.508.028.061.073.145.031.205-.038.052-.104.055-.158.074-.316.113-.637.216-.947.347a6.79 6.79 0 0 0-1.589.916c-.421.334-.793.728-1.084 1.185-.26.41-.45.862-.544 1.335-.079.39-.1.794-.049 1.188a3.55 3.55 0 0 0 .585 1.59c.327.462.766.83 1.264 1.078a4.3 4.3 0 0 0 1.563.412c.512.042 1.035-.004 1.532-.139.478-.128.934-.335 1.345-.611.279-.188.535-.406.769-.645.08-.083.15-.108.255-.061.377.172.77.301 1.174.379.502.098 1.017.114 1.524.048a5.16 5.16 0 0 0 1.487-.391c.424-.192.822-.437 1.177-.731.2-.166.384-.352.547-.555.03-.038.055-.085.105-.068.168.055.267.294.39.416.239.239.52.43.828.566.4.178.834.268 1.273.268a2.8 2.8 0 0 0 .733-.099c.34-.1.648-.271.917-.498.265-.225.482-.5.639-.813.144-.285.227-.599.24-.917.012-.316-.049-.63-.183-.915a2.19 2.19 0 0 0-.636-.784z"/></svg>
          {{ t('cta.linux') }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section {
  position: relative;
  padding: 120px 24px;
  text-align: center;
}
.cta-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 100%, rgba(134, 59, 255, 0.15), transparent);
}
.cta-content {
  position: relative;
  z-index: 1;
  max-width: 640px;
  margin: 0 auto;
}
.cta-content .section-title {
  margin-bottom: 16px;
}
.cta-content .section-desc {
  margin: 0 auto 40px;
}
.cta-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}
.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d4d4d8;
  transition: all 0.25s;
}
.download-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(134, 59, 255, 0.3);
  color: #fff;
}
.download-btn svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 600px) {
  .cta-section {
    padding: 80px 16px;
  }
  .cta-buttons {
    flex-direction: column;
  }
}
</style>
