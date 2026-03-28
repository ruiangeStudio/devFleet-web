import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Locale } from '../i18n'

const LOCALES: Locale[] = ['zh', 'en', 'ja']

export function useLocale() {
  const { locale } = useI18n()

  const currentLocale = computed(() => locale.value as Locale)

  function toggleLocale() {
    const idx = LOCALES.indexOf(locale.value as Locale)
    const next = LOCALES[(idx + 1) % LOCALES.length]
    locale.value = next
    localStorage.setItem('devfleet-locale', next)
  }

  function setLocale(lang: Locale) {
    locale.value = lang
    localStorage.setItem('devfleet-locale', lang)
  }

  return { currentLocale, toggleLocale, setLocale }
}
