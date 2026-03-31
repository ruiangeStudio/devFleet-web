import { createApp, watchEffect } from 'vue'
import Clarity from '@microsoft/clarity'
import './style.css'
import App from './App.vue'
import { i18n, syncDocumentLocale, type Locale } from './i18n'

const CLARITY_PROJECT_ID = 'w48mc6ks90'

const app = createApp(App)

// 点击外部关闭指令
app.directive('click-outside', {
  mounted(el, binding) {
    el._clickOutsideHandler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('mousedown', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el._clickOutsideHandler)
  },
})

watchEffect(() => {
  syncDocumentLocale((i18n.global.locale as unknown as { value: Locale }).value)
})

if (typeof window !== 'undefined') {
  Clarity.init(CLARITY_PROJECT_ID)
}

app.use(i18n).mount('#app')
