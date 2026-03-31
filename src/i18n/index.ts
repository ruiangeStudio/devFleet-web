import { createI18n } from 'vue-i18n'
import localeDefinitions from './locales'

export const LOCALE_STORAGE_KEY = 'devfleet-locale'
export type Locale = (typeof localeDefinitions)[number]['code']

export const DEFAULT_LOCALE =
  (localeDefinitions.find(locale => locale.isDefault)?.code as Locale | undefined) ?? 'zh'
export const SOURCE_LOCALE =
  (localeDefinitions.find(locale => locale.isSource)?.code as Locale | undefined) ?? DEFAULT_LOCALE
export const SUPPORTED_LOCALES = localeDefinitions.map(locale => locale.code) as Locale[]
export const LOCALE_OPTIONS = localeDefinitions.map(({ code, label, name }) => ({ code, label, name }))

const localeModules = import.meta.glob('./messages/*.ts', { eager: true, import: 'default' }) as Record<
  string,
  Record<string, unknown>
>
const sourceMessages = localeModules[`./messages/${SOURCE_LOCALE}.ts`]

if (!sourceMessages) {
  throw new Error(`Missing source locale file: messages/${SOURCE_LOCALE}.ts`)
}

const messages = Object.fromEntries(
  localeDefinitions.map(locale => [
    locale.code,
    localeModules[`./messages/${locale.code}.ts`] ?? sourceMessages,
  ]),
) as Record<Locale, any>

const localeSet = new Set<Locale>(SUPPORTED_LOCALES)
const rtlLocaleSet = new Set<Locale>(
  localeDefinitions
    .filter(locale => locale.dir === 'rtl')
    .map(locale => locale.code as Locale),
)

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
  document.documentElement.dir = rtlLocaleSet.has(locale) ? 'rtl' : 'ltr'
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
  messages: messages as any,
})
