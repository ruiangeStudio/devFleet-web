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

// 所有 messages 文件都放在 i18n/messages 下，文件名必须与 locales.ts 里的 code 对齐。
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
const localeAliasMap = new Map<string, Locale>()

// 运行时会优先按完整 locale 匹配，再退回基础语言。
// 这样既能支持常见的 en-US -> en，也能支持 zh-TW / zh-HK -> zh-tw。
for (const locale of localeDefinitions) {
  localeAliasMap.set(locale.code.toLowerCase(), locale.code as Locale)

  if ('browserAliases' in locale) {
    for (const alias of locale.browserAliases) {
      localeAliasMap.set(alias.toLowerCase(), locale.code as Locale)
    }
  }
}

function normalizeLocale(value?: string | null): Locale | null {
  if (!value) return null

  // 先尝试完整匹配，支持 zh-tw / zh-hant 这类带脚本或地区的 locale。
  const normalized = value.trim().toLowerCase()
  const exactMatch = localeAliasMap.get(normalized)
  if (exactMatch) return exactMatch

  // 再退回基础语言，保证 en-US -> en、zh-CN -> zh 这种常见情况也能命中。
  const baseLocale = normalized.split('-')[0]
  return localeSet.has(baseLocale as Locale) ? (baseLocale as Locale) : null
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
