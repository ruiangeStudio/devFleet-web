import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'
import ja from './ja'
import ko from './ko'
import de from './de'

export const LOCALE_STORAGE_KEY = 'devfleet-locale'
export const DEFAULT_LOCALE = 'zh'
export const SUPPORTED_LOCALES = ['zh', 'en', 'ja', 'ko', 'de'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

const messages = {
  zh,
  en,
  ja,
  ko,
  de,
}

const localeSet = new Set<Locale>(SUPPORTED_LOCALES)

function normalizeLocale(value?: string | null): Locale | null {
  if (!value) return null

  const normalized = value.toLowerCase().split('-')[0]
  return localeSet.has(normalized as Locale) ? (normalized as Locale) : null
}

export function getStoredLocale(): Locale | null {
  if (typeof localStorage === 'undefined') return null
  return normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY))
}

export function persistLocale(locale: Locale) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

export function syncDocumentLocale(locale: Locale) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = locale
}

export function resolvePreferredLocale(): Locale {
  const storedLocale = getStoredLocale()
  if (storedLocale) return storedLocale

  if (typeof navigator !== 'undefined') {
    for (const lang of navigator.languages) {
      const locale = normalizeLocale(lang)
      if (locale) return locale
    }

    const browserLocale = normalizeLocale(navigator.language)
    if (browserLocale) return browserLocale
  }

  return DEFAULT_LOCALE
}

const initialLocale = resolvePreferredLocale()
syncDocumentLocale(initialLocale)

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: DEFAULT_LOCALE,
  messages,
})
