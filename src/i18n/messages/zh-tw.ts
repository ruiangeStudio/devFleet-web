export default {
  nav: {
    features: '功能特性',
    screenshots: '界面預覽',
    download: '下載',
    github: 'GitHub',
    cta: '立即下載',
  },
  hero: {
    badge: '開源免費 · 跨平臺桌面應用',
    title: `前端項目管理
從未如此高效`,
    desc: 'DevFleet 集項目管理、Node 版本切換、腳本啟動、編輯器集成於一體，為前端開發者打造的一站式桌面工作臺。',
    download: '免費下載',
    platforms: {
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
    },
  },
  features: {
    label: '功能特性',
    title: '為前端開發者量身打造',
    desc: '從項目管理到 Node 版本切換，從腳本啟動到編輯器集成，DevFleet 覆蓋你的日常開發工作流。',
    items: [
      {
        icon: '📦',
        title: '項目管理',
        description: '選擇包含 package.json 的文件夾即可添加項目，自動識別 npm scripts 與包管理器（npm / yarn / pnpm / bun），支持按名稱或路徑快速搜索。',
      },
      {
        icon: '🎯',
        title: 'Node 版本管理',
        description: '支持 nvmd、nvs、nvm、nvm-windows，為每個項目指定獨立的 Node 版本，一鍵安裝 / 切換 / 卸載，自動生成配置文件。',
      },
      {
        icon: '🚀',
        title: '腳本快速啟動',
        description: '外部終端運行或應用內託管模式，跨平臺支持 Windows PowerShell、macOS Terminal 和 Linux，根據包管理器自動生成運行命令。',
      },
      {
        icon: '💻',
        title: '編輯器集成',
        description: '一鍵在 VSCode / Cursor / WebStorm 中打開項目，自動檢測系統已安裝的編輯器，支持設置默認編輯器偏好。',
      },
      {
        icon: '🎨',
        title: '界面與體驗',
        description: '自定義無邊框標題欄與原生窗口控制，淺色 / 深色主題自由切換，鍵盤快捷鍵操作，錯誤邊界保護防止組件崩潰。',
      },
      {
        icon: '⚡',
        title: '自動更新',
        description: '應用內檢查新版本，下載與安裝一鍵完成，基於 Tauri Updater 插件實現簽名驗證，確保安全可靠。',
      },
    ],
  },
  screenshots: {
    label: '界面預覽',
    title: '優雅而強大的桌面體驗',
    desc: '精心設計的界面，淺色與深色主題隨心切換，讓開發工作賞心悅目。',
    tabs: [
      '項目管理',
      'Node 版本',
      '版本詳情',
      '自動更新',
      '淺色模式',
    ],
  },
  cta: {
    label: '立即下載',
    title: '準備好提升你的開發體驗了嗎？',
    desc: 'DevFleet 完全免費且開源，支持 Windows、macOS 和 Linux。',
    windows: 'Windows 下載',
    macos: 'macOS 下載',
    linux: 'Linux 下載',
  },
  footer: {
    copyright: '© 2026 DevFleet. All rights reserved.',
    feedback: '反饋',
    changelog: '更新日誌',
  },
}
