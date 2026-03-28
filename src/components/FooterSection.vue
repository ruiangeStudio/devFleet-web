<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <span>{{ t('footer.copyright') }}</span>
      <div class="footer-links">
        <a href="https://github.com/nieSugar/devFleet" target="_blank">GitHub</a>
        <a href="https://github.com/nieSugar/devFleet/issues" target="_blank">{{ t('footer.feedback') }}</a>
        <a href="https://github.com/nieSugar/devFleet/releases" target="_blank">{{ t('footer.changelog') }}</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 40px 24px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; color: #52525b;
}
.footer-links { display: flex; gap: 24px; }
.footer-links a { transition: color 0.2s; }
.footer-links a:hover { color: #a1a1aa; }

@media (max-width: 600px) {
  .footer-inner { flex-direction: column; gap: 16px; }
}
</style>
