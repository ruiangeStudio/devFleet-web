import { createApp, watchEffect } from 'vue'
import './style.css'
import App from './App.vue'
import { i18n, syncDocumentLocale, type Locale } from './i18n'

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
  syncDocumentLocale(i18n.global.locale.value as Locale)
})

app.use(i18n).mount('#app')
