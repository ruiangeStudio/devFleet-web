/**
 * i18n 语言元数据的单一配置源。
 *
 * 这里的每一项同时驱动：
 * 1. 前台语言切换菜单
 * 2. vue-i18n 的消息注册
 * 3. 翻译脚本默认的 --all 目标语言
 * 4. 浏览器语言与本地存储语言的归一化匹配
 *
 * 字段约定：
 * - code: 项目内部 locale 标识，同时也是 messages/<code>.ts 文件名
 * - label/name: 前台菜单展示文案
 * - deeplSource/deeplTarget: 翻译脚本使用的 DeepL 语言代码
 * - manual: true 表示该语言手动维护，不参与默认机翻覆盖
 * - translationStrategy: 可选，本地文本转换策略，适合同语种变体转换
 * - browserAliases: 用于把浏览器返回的脚本/区域标签映射到当前 locale
 */
export default [
  {
    code: 'zh',
    label: '中文',
    name: '中文',
    deeplSource: 'ZH',
    deeplTarget: 'ZH-HANS',
    isDefault: true,
    isSource: true,
    manual: true,
    dir: 'ltr',
    browserAliases: ['zh-cn', 'zh-sg', 'zh-hans'],
  },
  {
    code: 'zh-tw',
    label: '繁體中文',
    name: '繁',
    deeplTarget: 'ZH-HANT',
    isDefault: false,
    isSource: false,
    manual: false,
    translationStrategy: 'opencc-cn-to-tw',
    dir: 'ltr',
    browserAliases: ['zh-hant', 'zh-hk', 'zh-mo'],
  },
  {
    code: 'en',
    label: 'English',
    name: 'EN',
    deeplTarget: 'EN-US',
    isDefault: false,
    isSource: false,
    manual: false,
    dir: 'ltr',
  },
  {
    code: 'ja',
    label: '日本語',
    name: 'JA',
    deeplTarget: 'JA',
    isDefault: false,
    isSource: false,
    manual: false,
    dir: 'ltr',
  },
  {
    code: 'ko',
    label: '한국어',
    name: 'KO',
    deeplTarget: 'KO',
    isDefault: false,
    isSource: false,
    manual: false,
    dir: 'ltr',
  },
  {
    code: 'de',
    label: 'Deutsch',
    name: 'DE',
    deeplTarget: 'DE',
    isDefault: false,
    isSource: false,
    manual: false,
    dir: 'ltr',
  },
  {
    code: 'ru',
    label: 'Русский',
    name: 'RU',
    deeplTarget: 'RU',
    isDefault: false,
    isSource: false,
    manual: false,
    dir: 'ltr',
  },
  {
    code: 'fr',
    label: 'Français',
    name: 'FR',
    deeplTarget: 'FR',
    isDefault: false,
    isSource: false,
    manual: false,
    dir: 'ltr',
  },
  {
    code: 'es',
    label: 'Español',
    name: 'ES',
    deeplTarget: 'ES',
    isDefault: false,
    isSource: false,
    manual: false,
    dir: 'ltr',
  },
  {
    code: 'ar',
    label: 'العربية',
    name: 'AR',
    deeplTarget: 'AR',
    isDefault: false,
    isSource: false,
    manual: false,
    dir: 'rtl',
  },
] as const
