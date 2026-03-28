<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNavScroll } from '../composables/useNavScroll'
import { useLocale } from '../composables/useLocale'
import type { Locale } from '../i18n'

const navRef = useTemplateRef<HTMLElement>('navRef')
useNavScroll(navRef)

const { t } = useI18n()
const { currentLocale, setLocale } = useLocale()

const LOCALE_OPTIONS: { value: Locale; label: string; name: string }[] = [
  { value: 'zh', label: '中文', name: '中文' },
  { value: 'en', label: 'English', name: 'EN' },
  { value: 'ja', label: '日本語', name: 'JA' },
  { value: 'ko', label: '한국어', name: 'KO' },
  { value: 'de', label: 'Deutsch', name: 'DE' },
]

const dropdownOpen = ref(false)

function selectLocale(lang: Locale) {
  setLocale(lang)
  dropdownOpen.value = false
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function closeDropdown() {
  dropdownOpen.value = false
}
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
      <a href="#features">{{ t('nav.features') }}</a>
      <a href="#screenshots">{{ t('nav.screenshots') }}</a>
      <a href="#download">{{ t('nav.download') }}</a>
      <a href="https://github.com/nieSugar/devFleet" target="_blank">{{ t('nav.github') }}</a>
    </div>
    <div class="nav-right">
      <!-- 语言下拉菜单 -->
      <div class="lang-dropdown" v-click-outside="closeDropdown">
        <button class="lang-trigger" @click="toggleDropdown" :class="{ open: dropdownOpen }">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span>{{ LOCALE_OPTIONS.find(o => o.value === currentLocale)?.name }}</span>
          <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <Transition name="dropdown">
          <div v-if="dropdownOpen" class="lang-menu">
            <button
              v-for="opt in LOCALE_OPTIONS"
              :key="opt.value"
              class="lang-option"
              :class="{ active: opt.value === currentLocale }"
              @click="selectLocale(opt.value)"
            >
              <span class="lang-option-name">{{ opt.name }}</span>
              <span class="lang-option-label">{{ opt.label }}</span>
              <svg v-if="opt.value === currentLocale" class="lang-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
          </div>
        </Transition>
      </div>

      <a href="#download" class="nav-cta">{{ t('nav.cta') }}</a>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  height: 64px;
  background: rgba(9, 9, 11, 0.3);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(134, 59, 255, 0.1);
  transition: background 0.3s;
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.nav-links {
  display: flex;
  gap: 32px;
}
.nav-links a {
  font-size: 14px;
  color: #a1a1aa;
  transition: color 0.2s;
}
.nav-links a:hover {
  color: #fff;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ===== 下拉菜单 ===== */
.lang-dropdown {
  position: relative;
}
.lang-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a1a1aa;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1;
  user-select: none;
}
.lang-trigger:hover,
.lang-trigger.open {
  border-color: rgba(134, 59, 255, 0.4);
  color: #c4b5fd;
  background: rgba(134, 59, 255, 0.08);
}
.lang-trigger span {
  font-size: 12px;
  letter-spacing: 0.04em;
  min-width: 18px;
  text-align: center;
}
.chevron {
  opacity: 0.6;
  transition: transform 0.2s ease;
}
.lang-trigger.open .chevron {
  transform: rotate(180deg);
}

.lang-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 140px;
  background: rgba(18, 18, 22, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(134, 59, 255, 0.08);
  z-index: 200;
}
.lang-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 7px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}
.lang-option:hover {
  background: rgba(255, 255, 255, 0.06);
}
.lang-option.active {
  background: rgba(134, 59, 255, 0.12);
}
.lang-option-name {
  font-size: 12px;
  font-weight: 600;
  color: #d4d4d8;
  letter-spacing: 0.04em;
  min-width: 22px;
}
.lang-option-label {
  font-size: 13px;
  color: #71717a;
  flex: 1;
}
.lang-option.active .lang-option-name,
.lang-option.active .lang-option-label {
  color: #c4b5fd;
}
.lang-check {
  color: #a855f7;
  flex-shrink: 0;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

.nav-cta {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background: rgba(134, 59, 255, 0.15);
  border: 1px solid rgba(134, 59, 255, 0.3);
  color: #c4b5fd;
  transition: all 0.2s;
}
.nav-cta:hover {
  background: rgba(134, 59, 255, 0.3);
  color: #fff;
}

@media (max-width: 768px) {
  .nav {
    padding: 0 24px;
  }
  .nav-links {
    display: none;
  }
}
</style>
