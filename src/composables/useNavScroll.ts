import { onMounted, onUnmounted, type Ref } from 'vue'

export function useNavScroll(navRef: Ref<HTMLElement | null>): void {
  function handleScroll(): void {
    if (!navRef.value) return
    if (window.scrollY > 20) {
      navRef.value.style.background = 'rgba(9, 9, 11, 0.85)'
      navRef.value.style.borderBottomColor = 'rgba(134, 59, 255, 0.15)'
    } else {
      navRef.value.style.background = 'rgba(9, 9, 11, 0.3)'
      navRef.value.style.borderBottomColor = 'rgba(134, 59, 255, 0.1)'
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
}
