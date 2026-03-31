import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  SUPPORTED_LOCALES,
  persistLocale,
  syncDocumentLocale,
  type Locale,
} from '../i18n'

export function useLocale() {
  const { locale } = useI18n()

  const currentLocale = computed(() => locale.value as Locale)

  function toggleLocale() {
    const idx = SUPPORTED_LOCALES.indexOf(locale.value as Locale)
    const next = SUPPORTED_LOCALES[(idx + 1) % SUPPORTED_LOCALES.length]
    locale.value = next
    persistLocale(next)
    syncDocumentLocale(next)
  }

  function setLocale(lang: Locale) {
    locale.value = lang
    persistLocale(lang)
    syncDocumentLocale(lang)
  }

  return { currentLocale, toggleLocale, setLocale }
}
