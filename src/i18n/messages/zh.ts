export default {
  nav: {
    features: '功能特性',
    screenshots: '界面预览',
    download: '下载',
    github: 'GitHub',
    cta: '立即下载',
  },
  hero: {
    badge: '开源免费 · 跨平台桌面应用',
    title: '前端项目管理\n从未如此高效',
    desc: 'DevFleet 集项目管理、Node 版本切换、脚本启动、编辑器集成于一体，为前端开发者打造的一站式桌面工作台。',
    download: '免费下载',
    platforms: {
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
    },
  },
  features: {
    label: '功能特性',
    title: '为前端开发者量身打造',
    desc: '从项目管理到 Node 版本切换，从脚本启动到编辑器集成，DevFleet 覆盖你的日常开发工作流。',
    items: [
      {
        icon: '📦',
        title: '项目管理',
        description: '选择包含 package.json 的文件夹即可添加项目，自动识别 npm scripts 与包管理器（npm / yarn / pnpm / bun），支持按名称或路径快速搜索。',
      },
      {
        icon: '🎯',
        title: 'Node 版本管理',
        description: '支持 nvmd、nvs、nvm、nvm-windows，为每个项目指定独立的 Node 版本，一键安装 / 切换 / 卸载，自动生成配置文件。',
      },
      {
        icon: '🚀',
        title: '脚本快速启动',
        description: '外部终端运行或应用内托管模式，跨平台支持 Windows PowerShell、macOS Terminal 和 Linux，根据包管理器自动生成运行命令。',
      },
      {
        icon: '💻',
        title: '编辑器集成',
        description: '一键在 VSCode / Cursor / WebStorm 中打开项目，自动检测系统已安装的编辑器，支持设置默认编辑器偏好。',
      },
      {
        icon: '🎨',
        title: '界面与体验',
        description: '自定义无边框标题栏与原生窗口控制，浅色 / 深色主题自由切换，键盘快捷键操作，错误边界保护防止组件崩溃。',
      },
      {
        icon: '⚡',
        title: '自动更新',
        description: '应用内检查新版本，下载与安装一键完成，基于 Tauri Updater 插件实现签名验证，确保安全可靠。',
      },
    ],
  },
  screenshots: {
    label: '界面预览',
    title: '优雅而强大的桌面体验',
    desc: '精心设计的界面，浅色与深色主题随心切换，让开发工作赏心悦目。',
    tabs: ['项目管理', 'Node 版本', '版本详情', '自动更新', '浅色模式'],
  },
  cta: {
    label: '立即下载',
    title: '准备好提升你的开发体验了吗？',
    desc: 'DevFleet 完全免费且开源，支持 Windows、macOS 和 Linux。',
    windows: 'Windows 下载',
    macos: 'macOS 下载',
    linux: 'Linux 下载',
  },
  footer: {
    copyright: '© 2026 DevFleet. All rights reserved.',
    feedback: '反馈',
    changelog: '更新日志',
  },
}
