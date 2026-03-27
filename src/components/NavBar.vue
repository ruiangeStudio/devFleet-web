<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useNavScroll } from '../composables/useNavScroll'

const navRef = useTemplateRef<HTMLElement>('navRef')
useNavScroll(navRef)
</script>

<template>
  <nav ref="navRef" class="nav">
    <a href="#" class="nav-brand">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" fill="none" viewBox="0 0 48 46">
        <path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/>
      </svg>
      DevFleet
    </a>
    <div class="nav-links">
      <a href="#features">功能特性</a>
      <a href="#screenshots">界面预览</a>
      <a href="#download">下载</a>
      <a href="https://github.com/nieSugar/devFleet" target="_blank">GitHub</a>
    </div>
    <a href="#download" class="nav-cta">立即下载</a>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px; height: 64px;
  background: rgba(9, 9, 11, 0.7);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(134, 59, 255, 0.08);
  transition: background 0.3s;
}
.nav-brand {
  display: flex; align-items: center; gap: 10px;
  font-size: 18px; font-weight: 700; letter-spacing: -0.02em;
}
.nav-brand svg { width: 28px; height: 28px; }
.nav-links { display: flex; gap: 32px; }
.nav-links a {
  font-size: 14px; color: #a1a1aa;
  transition: color 0.2s;
}
.nav-links a:hover { color: #fff; }
.nav-cta {
  padding: 8px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;
  background: rgba(134, 59, 255, 0.15);
  border: 1px solid rgba(134, 59, 255, 0.3);
  color: #c4b5fd;
  transition: all 0.25s;
  cursor: pointer;
}
.nav-cta:hover {
  background: rgba(134, 59, 255, 0.3);
  color: #fff;
}

@media (max-width: 900px) {
  .nav { padding: 0 24px; }
  .nav-links { display: none; }
}
</style>
