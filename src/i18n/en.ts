export default {
  nav: {
    features: 'Features',
    screenshots: 'Screenshots',
    download: 'Download',
    github: 'GitHub',
    cta: 'Download Now',
  },
  hero: {
    badge: 'Open Source · Cross-Platform Desktop App',
    title: 'Frontend Project Management\nLike Never Before',
    desc: 'DevFleet combines project management, Node version switching, script launching, and editor integration — an all-in-one desktop workstation built for frontend developers.',
    download: 'Free Download',
    platforms: {
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
    },
  },
  features: {
    label: 'Features',
    title: 'Built for Frontend Developers',
    desc: 'From project management to Node version switching, from script launching to editor integration — DevFleet covers your entire daily development workflow.',
    items: [
      {
        icon: '📦',
        title: 'Project Management',
        description: 'Add projects by selecting folders with package.json. Auto-detects npm scripts and package managers (npm / yarn / pnpm / bun). Supports quick search by name or path.',
      },
      {
        icon: '🎯',
        title: 'Node Version Management',
        description: 'Supports nvmd, nvs, nvm, and nvm-windows. Assign independent Node versions per project. One-click install, switch, or uninstall with auto-generated config files.',
      },
      {
        icon: '🚀',
        title: 'Script Launcher',
        description: 'Run scripts in an external terminal or in-app managed mode. Cross-platform support for Windows PowerShell, macOS Terminal, and Linux. Commands auto-generated based on package manager.',
      },
      {
        icon: '💻',
        title: 'Editor Integration',
        description: 'Open projects in VSCode, Cursor, or WebStorm with one click. Auto-detects installed editors and supports setting a default editor preference.',
      },
      {
        icon: '🎨',
        title: 'UI & Experience',
        description: 'Custom frameless title bar with native window controls. Free toggle between light and dark themes. Keyboard shortcuts. Error boundary protection to prevent component crashes.',
      },
      {
        icon: '⚡',
        title: 'Auto Updates',
        description: 'Check for new versions in-app. Download and install with one click. Built on Tauri Updater with signature verification for safe and reliable updates.',
      },
    ],
  },
  screenshots: {
    label: 'Screenshots',
    title: 'Elegant & Powerful Desktop Experience',
    desc: 'Thoughtfully designed UI with seamless light/dark theme switching — making development a pleasure.',
    tabs: ['Projects', 'Node Versions', 'Version Detail', 'Auto Update', 'Light Mode'],
  },
  cta: {
    label: 'Download',
    title: 'Ready to Level Up Your Dev Experience?',
    desc: 'DevFleet is completely free and open source. Available for Windows, macOS, and Linux.',
    windows: 'Download for Windows',
    macos: 'Download for macOS',
    linux: 'Download for Linux',
  },
  footer: {
    copyright: '© 2026 DevFleet. All rights reserved.',
    feedback: 'Feedback',
    changelog: 'Changelog',
  },
}
