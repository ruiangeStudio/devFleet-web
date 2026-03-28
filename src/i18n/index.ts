import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'
import ja from './ja'
import ko from './ko'
import de from './de'

const savedLocale = localStorage.getItem('devfleet-locale') || 'zh'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'zh',
  messages: {
    zh,
    en,
    ja,
    ko,
    de,
  },
})

export type Locale = 'zh' | 'en' | 'ja' | 'ko' | 'de'
