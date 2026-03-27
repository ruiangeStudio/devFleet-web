<script setup lang="ts">
import { ref } from 'vue'
import { useScrollAnimation } from '../composables/useScrollAnimation'
import type { FeatureItem } from '../types'

const sectionRef = ref<HTMLElement | null>(null)
useScrollAnimation(sectionRef)

const features: FeatureItem[] = [
  {
    icon: '\u{1F4E6}',
    title: '项目管理',
    description: '选择包含 package.json 的文件夹即可添加项目，自动识别 npm scripts 与包管理器（npm / yarn / pnpm / bun），支持按名称或路径快速搜索。'
  },
  {
    icon: '\u{1F3AF}',
    title: 'Node 版本管理',
    description: '支持 nvmd、nvs、nvm、nvm-windows，为每个项目指定独立的 Node 版本，一键安装 / 切换 / 卸载，自动生成配置文件。'
  },
  {
    icon: '\u{1F680}',
    title: '脚本快速启动',
    description: '外部终端运行或应用内托管模式，跨平台支持 Windows PowerShell、macOS Terminal 和 Linux，根据包管理器自动生成运行命令。'
  },
  {
    icon: '\u{1F4BB}',
    title: '编辑器集成',
    description: '一键在 VSCode / Cursor / WebStorm 中打开项目，自动检测系统已安装的编辑器，支持设置默认编辑器偏好。'
  },
  {
    icon: '\u{1F3A8}',
    title: '界面与体验',
    description: '自定义无边框标题栏与原生窗口控制，浅色 / 深色主题自由切换，键盘快捷键操作，错误边界保护防止组件崩溃。'
  },
  {
    icon: '\u26A1',
    title: '自动更新',
    description: '应用内检查新版本，下载与安装一键完成，基于 Tauri Updater 插件实现签名验证，确保安全可靠。'
  }
]
</script>

<template>
  <section ref="sectionRef" class="section" id="features">
    <div class="features-header animate-on-scroll">
      <div class="section-label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>
        功能特性
      </div>
      <h2 class="section-title">为前端开发者量身打造</h2>
      <p class="section-desc">从项目管理到 Node 版本切换，从脚本启动到编辑器集成，DevFleet 覆盖你的日常开发工作流。</p>
    </div>

    <div class="features-grid">
      <div v-for="(feature, index) in features" :key="index" class="feature-card animate-on-scroll">
        <div class="feature-icon">{{ feature.icon }}</div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-header {
  text-align: center;
  margin-bottom: 64px;
}
.features-header .section-desc {
  margin: 0 auto;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.feature-card {
  position: relative;
  padding: 32px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.35s ease;
  overflow: hidden;
}
.feature-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(134, 59, 255, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.35s;
}
.feature-card:hover {
  background: rgba(134, 59, 255, 0.04);
  border-color: rgba(134, 59, 255, 0.15);
}
.feature-card:hover::before {
  opacity: 1;
}
.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  background: rgba(134, 59, 255, 0.1);
  border: 1px solid rgba(134, 59, 255, 0.15);
  color: #fafafa;
  margin-bottom: 16px;
}
.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #fafafa;
}
.feature-card p {
  font-size: 14px;
  color: #a1a1aa;
  line-height: 1.7;
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
