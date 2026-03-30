/**
 * DeepL 自动翻译脚本
 * 以 en.ts 为源语言，自动翻译并更新其他语言文件
 *
 * 使用方法：
 *   node scripts/translate.mjs --key YOUR_DEEPL_API_KEY --lang ja
 *   node scripts/translate.mjs --key YOUR_DEEPL_API_KEY --lang ja,ko,de
 *   node scripts/translate.mjs --key YOUR_DEEPL_API_KEY --all
 *
 * 也可以设置环境变量替代 --key 参数：
 *   $env:DEEPL_API_KEY="your-key"
 *   node scripts/translate.mjs --lang ja
 */

import * as deepl from 'deepl-node'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const I18N_DIR = join(__dirname, '../src/i18n')

// ===== 语言映射 =====
// key: 我们项目中的 locale 标识符
// value: DeepL API 的目标语言代码
const LANG_MAP = {
  zh: 'ZH',      // 中文（简体）
  ja: 'JA',      // 日语
  ko: 'KO',      // 韩语
  de: 'DE',      // 德语
  fr: 'FR',      // 法语（备用，如果将来加）
  es: 'ES',      // 西班牙语（备用）
}

// 以英文为源语言翻译（质量最好）
const SOURCE_LANG = 'EN'

// ===== 解析命令行参数 =====
const args = process.argv.slice(2)

function getArg(name) {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 ? args[idx + 1] : null
}

const apiKey = getArg('key') || process.env.DEEPL_API_KEY
const targetAll = args.includes('--all')
const langArg = getArg('lang')

if (!apiKey) {
  console.error('❌ 缺少 API Key！请用 --key 参数或 $env:DEEPL_API_KEY 环境变量提供。')
  console.error('   示例：node scripts/translate.mjs --key YOUR_KEY --lang ja')
  process.exit(1)
}

let targetLocales = []
if (targetAll) {
  // 排除 en（源语言）和 zh（手写质量更好，建议不用机翻覆盖中文）
  targetLocales = Object.keys(LANG_MAP).filter(l => l !== 'zh')
} else if (langArg) {
  targetLocales = langArg.split(',').map(l => l.trim())
} else {
  console.error('❌ 请指定目标语言：--lang ja 或 --all')
  process.exit(1)
}

// 验证语言代码
for (const locale of targetLocales) {
  if (!LANG_MAP[locale]) {
    console.error(`❌ 不支持的语言代码：${locale}`)
    console.error(`   支持的语言：${Object.keys(LANG_MAP).join(', ')}`)
    process.exit(1)
  }
}

// ===== 加载源文件 =====
function loadSourceMessages() {
  // 动态 import 不方便处理 .ts，改用读取 en.ts 并提取对象
  // 策略：把 en.ts 内容当做模块执行
  const enPath = join(I18N_DIR, 'en.ts')
  // 读取文件内容，去掉 "export default" 让 eval 能处理
  const raw = readFileSync(enPath, 'utf-8')
  const cleaned = raw.replace(/^export default\s*/, '')
  // 用 Function 构造器安全执行
  return new Function(`return (${cleaned})`)()
}

// ===== 递归翻译对象 =====
async function translateObject(obj, translator, targetLang, path = '') {
  if (typeof obj === 'string') {
    // 跳过不需要翻译的值（纯符号、数字、已是代码的内容）
    if (/^[©\d\s\.\-_\/\\]+$/.test(obj)) return obj
    if (/^(Windows|macOS|Linux|GitHub|npm|yarn|pnpm|bun|nvmd|nvs|nvm|VSCode|Cursor|WebStorm|Tauri)$/.test(obj)) return obj

    try {
      const result = await translator.translateText(obj, SOURCE_LANG, targetLang)
      return result.text
    } catch (err) {
      console.warn(`  ⚠️  翻译失败 [${path}]: ${obj.slice(0, 40)}... — ${err.message}`)
      return obj // 失败时保留原文
    }
  }

  if (Array.isArray(obj)) {
    const results = []
    for (let i = 0; i < obj.length; i++) {
      results.push(await translateObject(obj[i], translator, targetLang, `${path}[${i}]`))
    }
    return results
  }

  if (typeof obj === 'object' && obj !== null) {
    const result = {}
    for (const key of Object.keys(obj)) {
      result[key] = await translateObject(obj[key], translator, targetLang, `${path}.${key}`)
    }
    return result
  }

  return obj
}

// ===== 把翻译结果序列化为 .ts 文件 =====
function serializeToTs(obj, indent = 0) {
  const pad = '  '.repeat(indent)
  const pad1 = '  '.repeat(indent + 1)

  if (typeof obj === 'string') {
    // 处理包含换行的字符串
    const escaped = obj.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
    if (obj.includes('\n')) {
      return `\`${escaped}\``
    }
    return `'${obj.replace(/'/g, "\\'")}'`
  }

  if (Array.isArray(obj)) {
    const items = obj.map(item => `${pad1}${serializeToTs(item, indent + 1)}`).join(',\n')
    return `[\n${items},\n${pad}]`
  }

  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj)
      .map(([k, v]) => `${pad1}${k}: ${serializeToTs(v, indent + 1)}`)
      .join(',\n')
    return `{\n${entries},\n${pad}}`
  }

  return String(obj)
}

// ===== 主流程 =====
async function main() {
  console.log(`\n🌐 DeepL 翻译脚本启动`)
  console.log(`   源语言：English (en.ts)`)
  console.log(`   目标语言：${targetLocales.join(', ')}\n`)

  const translator = new deepl.Translator(apiKey)

  // 验证 API Key 是否有效
  try {
    const usage = await translator.getUsage()
    const used = usage.character?.count ?? 0
    const limit = usage.character?.limit ?? 0
    console.log(`✅ API Key 有效，本月已用字符：${used.toLocaleString()} / ${limit.toLocaleString()}\n`)
  } catch (err) {
    console.error(`❌ API Key 无效或网络错误：${err.message}`)
    process.exit(1)
  }

  const source = loadSourceMessages()

  for (const locale of targetLocales) {
    const deeplLang = LANG_MAP[locale]
    console.log(`📝 正在翻译 → ${locale} (${deeplLang})...`)

    const translated = await translateObject(source, translator, deeplLang)

    // 生成 .ts 文件内容
    const content = `export default ${serializeToTs(translated)}\n`
    const outPath = join(I18N_DIR, `${locale}.ts`)

    writeFileSync(outPath, content, 'utf-8')
    console.log(`   ✅ 已写入 src/i18n/${locale}.ts\n`)
  }

  console.log('🎉 翻译完成！')
  console.log('💡 建议：机翻结果请人工检查一遍，尤其是专业术语和品牌名称。')
}

main().catch(err => {
  console.error('💥 脚本出错：', err)
  process.exit(1)
})
