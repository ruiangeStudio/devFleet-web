import { onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollAnimation(containerRef: Ref<HTMLElement | null>): void {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const container = containerRef.value
    if (container) {
      const targets = container.querySelectorAll('.animate-on-scroll')
      targets.forEach((el) => observer!.observe(el))
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
