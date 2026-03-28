import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { i18n } from './i18n'

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

app.use(i18n).mount('#app')
